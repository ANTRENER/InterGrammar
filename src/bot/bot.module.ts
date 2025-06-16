import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRoot({
            token: process.env.BOT_TOKEN,
        }),
    ],
    providers: [BotUpdate],
})
export class BotModule { } 