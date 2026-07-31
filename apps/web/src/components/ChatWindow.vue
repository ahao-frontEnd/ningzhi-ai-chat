<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const props = defineProps<{ messages: Message[] }>();
const container = ref<HTMLElement | null>(null);

// 监听消息内容变化，自动滚动到底部
watch(
  () => props.messages.map((m) => m.content).join(''),
  async () => {
    await nextTick();
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight;
    }
  },
);
</script>

<template>
  <div ref="container" class="messages">
    <div v-for="(msg, i) in messages" :key="i" :class="['msg', msg.role]">
      {{ msg.content }}
    </div>
  </div>
</template>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.msg {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: pre-wrap;
}

.msg.user {
  background: #1976d2;
  color: #fff;
  text-align: right;
}

.msg.ai {
  background: #f0f0f0;
  text-align: left;
}
</style>
