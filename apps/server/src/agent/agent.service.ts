import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AgentService implements OnModuleInit {
  private readonly logger = new Logger(AgentService.name);
  private model!: ChatOpenAI;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('DEEPSEEK_API_KEY');
    if (!apiKey) {
      this.logger.error('DEEPSEEK_API_KEY 未配置');
      throw new Error('DEEPSEEK_API_KEY is required');
    }

    this.model = new ChatOpenAI({
      apiKey,
      modelName: 'deepseek-chat',
      configuration: {
        baseURL: 'https://api.deepseek.com',
      },
      streaming: true,
      temperature: 0.7,
    });
  }

  // 流式生成内容，返回 AsyncGenerator<string>
  // 后续扩展为 ReAct Agent 时，可在此处改用 createAgent + streamEvents
  async *stream(message: string): AsyncGenerator<string> {
    const stream = await this.model.stream([
      { role: 'system', content: '你是一个友好的中文助手，回答要简洁清晰。' },
      { role: 'user', content: message },
    ]);

    for await (const chunk of stream) {
      const content = typeof chunk.content === 'string' ? chunk.content : '';
      if (content) yield content;
    }
  }
}
