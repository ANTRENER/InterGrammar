# Grammar Check Bot

A Telegram bot that helps users test their English grammar knowledge through a series of multiple-choice questions.

## Features

- 20 grammar questions covering A2, B1, and B2 levels
- Immediate feedback on answers
- Score-based recommendations
- Integration with Telegram for course enrollment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your Telegram bot token:
```
BOT_TOKEN=your_telegram_bot_token_here
```

3. Start the development server:
```bash
npm run start:dev
```

## Development

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server

## Project Structure

- `src/bot/bot.update.ts` - Main bot logic and question handling
- `src/bot/bot.module.ts` - Bot module configuration
- `src/app.module.ts` - Main application module
- `src/main.ts` - Application entry point

## Questions

The questions are stored in the `questions` array in `bot.update.ts`. Each question has:
- Question text
- Multiple choice options
- Correct answer index
- Explanation for the answer 