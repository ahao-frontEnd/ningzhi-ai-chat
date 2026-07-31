import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AgentModule } from './agent/agent.module'
import { ChatModule } from './chat/chat.module'

// monorepo 下显式指定 .env 查找路径，确保从任意 cwd 启动都能正确加载
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', 'apps/server/.env']
        }),
        AgentModule,
        ChatModule
    ]
})
export class AppModule {}
