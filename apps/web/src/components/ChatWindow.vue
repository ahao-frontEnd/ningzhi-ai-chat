<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Message {
    role: 'user' | 'ai'
    content: string
}

const props = defineProps<{
    messages: Message[]
    loading?: boolean
}>()
const container = ref<HTMLElement | null>(null)

watch(
    () => props.messages.map((m) => m.content).join('') + (props.loading ? '1' : '0'),
    async () => {
        await nextTick()
        if (container.value) {
            container.value.scrollTo({
                top: container.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    }
)
</script>

<template>
    <div ref="container" class="messages">
        <div v-for="(msg, i) in messages" :key="i" :class="['msg-row', msg.role]">
            <div v-if="msg.role === 'ai'" class="avatar">AI</div>
            <div class="bubble">{{ msg.content }}</div>
        </div>
        <div v-if="loading && messages[messages.length - 1]?.role === 'user'" class="msg-row ai">
            <div class="avatar">AI</div>
            <div class="bubble thinking">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.msg-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    max-width: 85%;
}

.msg-row.user {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.msg-row.ai {
    align-self: flex-start;
}

.avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
}

.bubble {
    padding: 10px 14px;
    border-radius: 16px;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
    font-size: 15px;
}

.msg-row.user .bubble {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
}

.msg-row.ai .bubble {
    background: #ffffff;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.thinking {
    display: inline-flex;
    gap: 4px;
    padding: 12px 16px;
}
.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9ca3af;
    animation: bounce 1.4s infinite ease-in-out both;
}
.dot:nth-child(1) {
    animation-delay: -0.32s;
}
.dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%,
    80%,
    100% {
        transform: scale(0.6);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .messages {
        padding: 12px;
        gap: 10px;
    }
    .bubble {
        font-size: 14px;
        padding: 9px 12px;
    }
    .avatar {
        width: 28px;
        height: 28px;
        font-size: 11px;
    }
    .msg-row {
        max-width: 88%;
    }
}
</style>
