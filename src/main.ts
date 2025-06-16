import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function bootstrap() {
    if (!app) {
        app = await NestFactory.create(AppModule);
        await app.init();
    }
    return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const app = await bootstrap();

    if (req.method === 'POST' && req.url === '/webhook') {
        // Обработка webhook от Telegram
        const update = req.body;

        // Получаем экземпляр бота из приложения
        const bot = app.get('TELEGRAF_BOT_NAME');

        try {
            await bot.handleUpdate(update);
            res.status(200).json({ ok: true });
        } catch (error) {
            console.error('Error handling update:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'GET' && req.url === '/') {
        res.status(200).json({ message: 'Grammar Check Bot is running!' });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
} 