<script setup lang="ts">
import { ref } from 'vue'

import ChatWindow from '../components/ChatWindow.vue'
import { useChatStore } from '../stores/chat'

const store = useChatStore()
const input = ref('')

const examples = [
    '你好，介绍一下你自己',
    '今天东莞天气怎么样？',
    '帮我写一首关于雨夜的诗',
    '最近有什么科技新闻？'
]

async function onSend() {
    const text = input.value.trim()
    if (!text || store.loading) return
    input.value = ''
    await store.send(text)
}

function onExample(text: string) {
    if (store.loading) return
    input.value = text
    onSend()
}

function onEnter(e: KeyboardEvent) {
    if (e.key === 'Enter' && (!e.shiftKey || /Mobi|Android/i.test(navigator.userAgent))) {
        e.preventDefault()
        onSend()
    }
}
</script>

<template>
    <div class="chat-page">
        <header class="header">
            <div class="header-logo">🤖</div>
            <div class="header-title">Ningzhi AI 聊天助手</div>
            <div class="header-status" :class="{ active: !store.loading }"></div>
        </header>

        <main class="main">
            <div v-if="store.messages.length === 0" class="welcome">
                <div class="welcome-icon">✨</div>
                <h1 class="welcome-title">Ningzhi AI 聊天助手</h1>
                <p class="welcome-subtitle">智能问答 · 联网搜索 · 流式响应</p>
                <div class="examples">
                    <button
                        v-for="ex in examples"
                        :key="ex"
                        class="example-card"
                        @click="onExample(ex)"
                        :disabled="store.loading"
                    >
                        {{ ex }}
                    </button>
                </div>
            </div>
            <ChatWindow v-else :messages="store.messages" :loading="store.loading" />
        </main>

        <footer class="input-area">
            <textarea
                v-model="input"
                rows="1"
                placeholder="输入消息，Enter 发送..."
                @keydown="onEnter"
                :disabled="store.loading"
            />
            <button class="send-btn" @click="onSend" :disabled="store.loading || !input.trim()">
                {{ store.loading ? '⏳' : '发送' }}
            </button>
        </footer>
    </div>
</template>

<style scoped>
.chat-page {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 820px;
    margin: 0 auto;
    background: linear-gradient(180deg, #f8f9fb 0%, #eef1f6 100%);
}

.header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-logo {
    font-size: 22px;
}

.header-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.header-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
}
.header-status.active {
    background: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.main {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
}

.welcome-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.welcome-title {
    margin: 0 0 8px;
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.welcome-subtitle {
    margin: 0 0 32px;
    color: #6b7280;
    font-size: 14px;
}

.examples {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 480px;
}

.example-card {
    padding: 12px 14px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}
.example-card:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
    transform: translateY(-1px);
}
.example-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-area {
    display: flex;
    gap: 8px;
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-area textarea {
    flex: 1;
    resize: none;
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    max-height: 120px;
    line-height: 1.4;
}
.input-area textarea:focus {
    border-color: #6366f1;
}

.send-btn {
    padding: 0 18px;
    border: none;
    border-radius: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}
.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .header {
        padding: 10px 12px;
    }
    .header-title {
        font-size: 15px;
    }
    .welcome-title {
        font-size: 22px;
    }
    .welcome-subtitle {
        font-size: 13px;
    }
    .welcome-icon {
        font-size: 40px;
    }
    .examples {
        grid-template-columns: 1fr;
    }
    .input-area textarea {
        font-size: 16px;
    }
}
</style>
