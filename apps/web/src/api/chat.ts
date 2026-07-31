// SSE 流式调用后端 /api/chat，返回 AsyncGenerator<string>
export async function* streamChat(message: string): AsyncGenerator<string> {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!resp.body) throw new Error('No response body');

  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      if (part.startsWith('event: end')) return;
      if (part.startsWith('data: ')) {
        try {
          const { content } = JSON.parse(part.slice(6));
          if (content) yield content;
        } catch {
          // 跳过解析失败的数据
        }
      }
    }
  }
}
