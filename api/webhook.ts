import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app: any;

async function bootstrap() {
    if (!app) {
        app = await NestFactory.create(AppModule);
        await app.init();
    }
    return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const app = await bootstrap();
        const update = req.body;

        // Получаем экземпляр бота
        const telegrafService = app.get('TelegrafService');

        if (telegrafService && telegrafService.bot) {
            await telegrafService.bot.handleUpdate(update);
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 