import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { BotUpdate } from '../src/bot/bot.update';

const bot = new Telegraf(process.env.BOT_TOKEN!);
const botUpdate = new BotUpdate();

// Регистрируем обработчики
bot.start(botUpdate.startCommand.bind(botUpdate));
bot.action('start_test', botUpdate.startTest.bind(botUpdate));
bot.action(/^answer_(\d+)$/, botUpdate.handleAnswer.bind(botUpdate));
bot.action(['telegram_link', 'interview_link'], botUpdate.handleLink.bind(botUpdate));

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const update = req.body;
        await bot.handleUpdate(update);
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 