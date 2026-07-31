import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { streamChat } from '../api/chat'

interface Message {
    role: 'user' | 'ai'
    content: string
}

export const useChatStore = defineStore('chat', () => {
    const messages = ref<Message[]>([])
    const loading = ref(false)

    async function send(text: string) {
        if (!text.trim() || loading.value) return
        messages.value.push({ role: 'user', content: text })

        // 必须用 reactive 包裹：否则 aiMsg 只是普通对象引用，
        // 直接修改其属性会绕过 Vue 的响应式 proxy，导致界面不更新
        const aiMsg = reactive<Message>({ role: 'ai', content: '' })
        messages.value.push(aiMsg)
        loading.value = true

        try {
            for await (const chunk of streamChat(text)) {
                aiMsg.content += chunk
            }
        } catch {
            aiMsg.content = '[AI 回复失败]'
        } finally {
            loading.value = false
        }
    }

    return { messages, loading, send }
})
