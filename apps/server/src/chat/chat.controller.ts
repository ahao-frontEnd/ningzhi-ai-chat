import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() dto: ChatDto, @Res() res: Response): Promise<void> {
    if (!dto.message) throw new BadRequestException('Message is required');
    await this.chatService.handleChat(dto.message, res);
  }
}
