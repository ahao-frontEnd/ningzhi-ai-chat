const path = require('path');
const express = require('express');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  console.error('请设置 DEEPSEEK_API_KEY 环境变量');
  process.exit(1);
}

const app = express();
const port = 3000;
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: message }],
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('event: end\n\n');
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/chat', (req, res) => {
  console.log(path.join(__dirname, 'client.html'));
  res.sendFile(path.join(__dirname, 'client.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});