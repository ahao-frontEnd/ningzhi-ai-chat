import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class ChatService {
  constructor(private readonly agent: AgentService) {}

  async handleChat(message: string, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      for await (const chunk of this.agent.stream(message)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.write('event: end\n\n');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: 'Internal error' })}\n\n`,
      );
    } finally {
      res.end();
    }
  }
}
