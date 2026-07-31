import type { StructuredToolInterface } from '@langchain/core/tools'
import { ChatDeepSeek } from '@langchain/deepseek'
import { TavilySearch } from '@langchain/tavily'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createAgent } from 'langchain'

@Injectable()
export class AgentService implements OnModuleInit {
    private readonly logger = new Logger(AgentService.name)
    private agent!: ReturnType<typeof createAgent>

    // eslint-disable-next-line no-unused-vars
    constructor(private readonly config: ConfigService) {}

    onModuleInit() {
        const apiKey = this.config.get<string>('DEEPSEEK_API_KEY')
        if (!apiKey) {
            this.logger.error('DEEPSEEK_API_KEY 未配置')
            throw new Error('DEEPSEEK_API_KEY is required')
        }

        // 使用 @langchain/deepseek 官方集成包，原生支持 function calling
        const model = new ChatDeepSeek({
            model: 'deepseek-chat',
            apiKey,
            streaming: true,
            temperature: 0
        })

        // 根据是否配置 Tavily Key 决定是否启用联网搜索工具
        const tavilyKey = this.config.get<string>('TAVILY_API_KEY')
        const tools: StructuredToolInterface[] = []

        if (tavilyKey) {
            tools.push(
                new TavilySearch({
                    maxResults: 5,
                    topic: 'general',
                    tavilyApiKey: tavilyKey
                })
            )
            this.logger.log('已启用 Tavily 联网搜索工具')
        } else {
            this.logger.warn('TAVILY_API_KEY 未配置，联网搜索功能不可用')
        }

        // 动态注入当前日期，避免模型凭训练数据猜错日期
        const today = new Date()
        const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const weekStr = weekDays[today.getDay()]

        // createAgent 内部会自动处理工具绑定，不需要手动 bindTools
        this.agent = createAgent({
            model,
            tools,
            systemPrompt:
                `你是一个友好的中文助手。当前真实日期是 ${dateStr}，${weekStr}。\n` +
                '回答问题遵循以下原则：\n' +
                '1. 当用户询问当前日期、星期、时间等，直接使用系统提供的真实日期回答，不要调用工具。\n' +
                '2. 当用户询问实时信息（天气、新闻、股价、最新事件等）时，必须调用 tavily_search 工具获取最新数据，不要凭记忆回答。\n' +
                '3. 不允许编造看起来真实但实际是假的 URL 或数据来源。\n' +
                '4. 拿到工具返回结果后，基于真实数据给出最终回答，并在末尾标注“信息来源：[工具返回的 URL]”。\n' +
                '5. 若问题不涉及实时信息，直接回答，不要调用工具。\n' +
                '6. 不要输出“我来查询”、“请稍等”之类的过渡语，直接调用工具。'
        })
    }

    // 流式生成内容，返回 AsyncGenerator<string>
    // 使用 createAgent + streamEvents，模型可自主决策是否调用工具
    async *stream(message: string): AsyncGenerator<string> {
        const eventStream = this.agent.streamEvents(
            { messages: [{ role: 'user', content: message }] },
            { version: 'v2' }
        )

        let toolCalled = false

        for await (const event of eventStream) {
            // 调试日志：打印所有事件类型，排查模型是否发出 tool_calls
            this.logger.debug(`event=${event.event} name=${event.name}`)

            // 工具开始调用
            if (event.event === 'on_tool_start') {
                toolCalled = true
                this.logger.log(`调用工具: ${event.name}`)
            }

            // 工具返回结果
            if (event.event === 'on_tool_end') {
                this.logger.log(`工具返回: ${JSON.stringify(event.data?.output).slice(0, 200)}...`)
            }

            // 只输出 LLM 模型流式生成的 token
            if (event.event === 'on_chat_model_stream') {
                const chunk = event.data?.chunk
                // 检查模型是否在 chunk 中携带了 tool_calls
                const toolCalls = chunk?.additional_kwargs?.tool_calls || chunk?.tool_call_chunks
                if (toolCalls && toolCalls.length > 0) {
                    this.logger.debug(
                        `模型发起 tool_call: ${JSON.stringify(toolCalls).slice(0, 200)}`
                    )
                }
                const content = typeof chunk?.content === 'string' ? chunk.content : ''
                if (content) yield content
            }
        }

        if (toolCalled) {
            this.logger.log('工具调用完成')
        } else {
            this.logger.warn('未触发工具调用（模型可能直接生成了答案）')
        }
    }
}
