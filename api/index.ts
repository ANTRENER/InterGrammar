import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        message: 'Grammar Check Bot is running!',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
} 