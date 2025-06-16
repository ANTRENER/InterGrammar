import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { BotUpdate } from '../src/bot/bot.update';

const bot = new Telegraf(process.env.BOT_TOKEN!);
const botUpdate = new BotUpdate();

// Регистрируем обработчики
bot.start(async (ctx) => {
    try {
        await botUpdate.startCommand(ctx);
    } catch (error) {
        console.error('Error in start command:', error);
        await ctx.reply('Произошла ошибка. Попробуйте еще раз.');
    }
});

bot.action('start_test', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await botUpdate.startTest(ctx);
    } catch (error) {
        console.error('Error in start_test:', error);
        await ctx.answerCbQuery('Произошла ошибка');
    }
});

// Обработка ответов на вопросы
bot.action(/^answer_(\d+)$/, async (ctx) => {
    try {
        await ctx.answerCbQuery();
        // Устанавливаем match для совместимости
        (ctx as any).match = ctx.match;
        await botUpdate.handleAnswer(ctx);
    } catch (error) {
        console.error('Error in handleAnswer:', error);
        await ctx.answerCbQuery('Произошла ошибка');
    }
});

bot.action('telegram_link', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await botUpdate.handleLink(ctx);
    } catch (error) {
        console.error('Error in telegram_link:', error);
        await ctx.answerCbQuery('Произошла ошибка');
    }
});

bot.action('interview_link', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await botUpdate.handleLink(ctx);
    } catch (error) {
        console.error('Error in interview_link:', error);
        await ctx.answerCbQuery('Произошла ошибка');
    }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const update = req.body;

        // Добавляем таймаут для обработки
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 8000);
        });

        await Promise.race([
            bot.handleUpdate(update),
            timeoutPromise
        ]);

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(200).json({ ok: true }); // Всегда возвращаем 200 для Telegram
    }
} 