<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'
import ChatWindow from '../components/ChatWindow.vue'

const store = useChatStore()
const input = ref('')

async function onSend() {
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    await store.send(text)
}

function onEnter(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSend()
    }
}
</script>

<template>
    <div class="chat-page">
        <ChatWindow :messages="store.messages" />
        <div class="input-area">
            <textarea
                v-model="input"
                rows="2"
                placeholder="input message..."
                @keydown="onEnter"
                :disabled="store.loading"
            />
            <button @click="onSend" :disabled="store.loading">send</button>
        </div>
    </div>
</template>

<style scoped>
.chat-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 720px;
    margin: 0 auto;
}

.input-area {
    display: flex;
    padding: 12px;
    border-top: 1px solid #eee;
}

textarea {
    flex: 1;
    resize: none;
    padding: 8px;
}

button {
    margin-left: 8px;
    padding: 8px 16px;
}
</style>
