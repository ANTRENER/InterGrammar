import { Context } from 'telegraf';
import { Markup } from 'telegraf';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanations: string[];
}

interface UserState {
    currentQuestion: number;
    score: number;
    answers: number[]; // Массив ответов пользователя
    messageIds: number[]; // ID сообщений с вопросами для удаления кнопок
}

const questions: Question[] = [
    {
        question: 'Чем ты занимаешься (по жизни)?',
        options: [
            'What do you do?',
            'What are you doing?',
            'What you do?'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Отлично! Это правильный вопрос, если ты хочешь узнать, чем человек занимается по профессии.',
            '❌ Ой! Это вопрос о том, что человек делает прямо сейчас, в момент разговора.',
            '❌ Ой! Не хватает вспомогательного глагола do в вопросе.'
        ]
    },
    {
        question: 'Я работаю в IT',
        options: [
            'I\'m work in IT',
            'I\'m working in IT',
            'I work in IT'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Упс! am - лишнее!',
            '❌ Упс! Только если ты работаешь в IT временно.',
            '✅ Правильно! Используется, когда ты говоришь о своей профессии в целом.'
        ]
    },
    {
        question: 'Мы работаем над новым проектом',
        options: [
            'We work on a new project',
            'We\'re working on a new project',
            'We\'ve been working on a new project'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Ой! Так не говорят о текущем процессе',
            '✅ Отлично! Именно это используют, когда говорят о текущей активности.',
            '❌ Ой! Не совсем'
        ]
    },
    {
        question: 'Как давно ты здесь живешь?',
        options: [
            'How long do you live here?',
            'How long are you living here?',
            'How long have you been living here?'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Ой! Так не спрашивают о продолжительности проживания.',
            '❌ Ой! Так не спрашивают о продолжительности проживания.',
            '✅ Супер! Это самый естественный и правильный вариант.'
        ]
    },
    {
        question: 'Мы знаем друг друга 10 лет',
        options: [
            'We have been knowing each other for 10 years',
            'We know each other for 10 years',
            'We\'ve known each other for 10 years'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Ай-ай! Глагол know не используется в длительном времени.',
            '❌ Немного не хватает времени...',
            '✅ Бинго! Это правильно: действие началось в прошлом и продолжается до сих пор.'
        ]
    },
    {
        question: 'Я работал там 2 года.',
        options: [
            'I worked there for 2 years',
            'I was working there for 2 years',
            'I had been working there for 2 years'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Да! Простое прошедшее время — идеальный выбор для законченного действия в прошлом.',
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '❌ Ой! Это не совсем правильное время для этого действия.'
        ]
    },
    {
        question: 'Я всегда это любил',
        options: [
            'I always love that',
            'I always loved that',
            'I\'ve always loved that'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '✅ То, что нужно! Подчеркивает постоянную любовь до настоящего момента.'
        ]
    },
    {
        question: 'Когда ты приехал?',
        options: [
            'When you came?',
            'When did you come?',
            'When have you come?'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Ой! Так не спрашивают о времени приезда.',
            '✅ Отлично! Классический вопрос в Past Simple.',
            '❌ Ой! Это не совсем правильное время для этого действия.'
        ]
    },
    {
        question: 'Эта задача гораздо проще прошлой.',
        options: [
            'This task is much more easy than the last one',
            'This task is much more easier than the last one',
            'This task is much easier than the last one'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Ой! Это не совсем правильное сравнение.',
            '❌ Ой! Это не совсем правильное сравнение.',
            '✅ Молодец! Всё правильно.'
        ]
    },
    {
        question: 'Я жил в России, когда мне предложили релокацию',
        options: [
            'I was living in Russia when they offered me relocation',
            'I lived in Russia when they offered me relocation',
            'I had been living in Russia when they offered me relocation'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Отлично! Past Continuous передает фон, на котором происходит другое действие.',
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '❌ Ой! Это не совсем правильное время для этого действия.'
        ]
    },
    {
        question: 'Пришлите мне, пожалуйста, документы.',
        options: [
            'Send me, please, the documents',
            'Could you send me the documents, please?',
            'Can you send me the documents, please?'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Ой! Это не совсем правильное предложение.',
            '✅ Вежливо и естественно — отлично!',
            '❌ Ой! Это не совсем правильное предложение.'
        ]
    },
    {
        question: 'Я была в Стамбуле.',
        options: [
            'I was in Istanbul',
            'I have been in Istanbul',
            'I have been to Istanbul'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '❌ Ой! Это не совсем правильное время для этого действия.',
            '✅ Прекрасно! Это значит, что ты туда ездила.'
        ]
    },
    {
        question: 'Я была в Стамбуле прошлым летом.',
        options: [
            'I was in Istanbul last summer',
            'I have been in Istanbul last summer',
            'I have been to Istanbul last summer'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Да! Past Simple с указанием времени.',
            '❌ Present Perfect не дружит с last summer',
            '❌ Present Perfect не дружит с last summer.'
        ]
    },
    {
        question: 'Это самый дешевый вариант',
        options: [
            'It\'s the most cheapest option',
            'It\'s the cheapest option',
            'It\'s the most cheap option'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Повтор степени: most и -est вместе не бывают.',
            '✅ Именно так!',
            '❌ Неестественно — с cheap не используют most.'
        ]
    },
    {
        question: 'Я закончил проект!',
        options: [
            'I finished the project',
            'I have finished the project',
            'I had finished the project'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Не совсем, вот было бы указание на время...',
            '✅ Да, супер! показываем результат в настоящем.',
            '❌ вот была бы вторая часть у предложения, а так нет :('
        ]
    },
    {
        question: 'Я лечу в Париж завтра',
        options: [
            'I will fly to Paris tomorrow',
            'I\'m going to fly to Paris tomorrow',
            'I\'m flying to Paris tomorrow'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ Только если прямо сейчас решил сорваться :)',
            '❌ Это пока только намерение...',
            '✅ Отлично!'
        ]
    },
    {
        question: 'Я думаю, мы поедем в отпуск в августе',
        options: [
            'I think we will go on vacation in August',
            'I think we go on vacation in August',
            'I think we are going on vacation in August'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Верно. Это предположение.',
            '❌Не хватает will',
            '❌если не уверен, то лучше с will'
        ]
    },
    {
        question: 'Она тебе позвонит, когда будет дома',
        options: [
            'She will call you when she will be home',
            'She will call you when she will home',
            'She will call you when she is home'
        ],
        correctAnswer: 2,
        explanations: [
            '❌ В придаточных времени will не ставится.',
            '❌ Ошибка и в will, и в отсутствии глагола.',
            '✅ Правильно! Простое настоящее после when.'
        ]
    },
    {
        question: 'Я бы купил это, если бы у меня были деньги',
        options: [
            'I will buy it if I have money',
            'I would buy it if I had money',
            'I would buy it if would have money'
        ],
        correctAnswer: 1,
        explanations: [
            '❌ Это про реальное будущее, а не гипотетическую ситуацию.',
            '✅ Прекрасно! Типичный Second Conditional.',
            '❌ Два would — это слишком!'
        ]
    },
    {
        question: 'Я должен работать из офиса',
        options: [
            'I have to work from the office',
            'I should work from the office',
            'I must work from the office'
        ],
        correctAnswer: 0,
        explanations: [
            '✅ Молодчина!',
            '❌Should - это про рекомендацию.',
            '❌Слишком драматично!'
        ]
    }
];

export class BotUpdate {
    private userStates: Map<number, UserState> = new Map();

    async startCommand(ctx: Context) {
        try {
            console.log('Start command called for user:', ctx.from?.id);
            await ctx.reply(
                'Проверь себя на 20 грамматических ошибок, типичных для уровней A2, B1 и B2!\n\n' +
                'Что умеет этот бот?\n' +
                'Нажмите кнопку начать, чтобы пройти диагностику своей грамматики и получить рекомендации по ее улучшению!',
                Markup.inlineKeyboard([
                    Markup.button.callback('Начать тест', 'start_test')
                ])
            );
        } catch (error) {
            console.error('Error in startCommand:', error);
            throw error;
        }
    }

    async startTest(ctx: Context) {
        try {
            const userId = ctx.from?.id;
            if (!userId) {
                throw new Error('User ID not found');
            }

            console.log('Starting test for user:', userId);
            this.userStates.set(userId, {
                currentQuestion: 0,
                score: 0,
                answers: [],
                messageIds: []
            });
            await this.sendQuestion(ctx, 0);
        } catch (error) {
            console.error('Error in startTest:', error);
            throw error;
        }
    }

    private async sendQuestion(ctx: Context, questionIndex: number) {
        try {
            if (questionIndex >= questions.length) {
                throw new Error('Question index out of bounds');
            }

            const question = questions[questionIndex];
            const buttons = question.options.map((option, index) =>
                [Markup.button.callback(option, `answer_${questionIndex}_${index}`)]
            );

            // Добавляем кнопку "Назад" если это не первый вопрос
            if (questionIndex > 0) {
                buttons.push([Markup.button.callback('⬅️ Назад', `back_${questionIndex}`)]);
            }

            const message = await ctx.reply(
                `${questionIndex + 1}) ${question.question}`,
                Markup.inlineKeyboard(buttons)
            );

            // Сохраняем ID сообщения для возможного удаления кнопок
            const userId = ctx.from?.id;
            if (userId) {
                const userState = this.userStates.get(userId);
                if (userState) {
                    userState.messageIds[questionIndex] = message.message_id;
                    this.userStates.set(userId, userState);
                }
            }
        } catch (error) {
            console.error('Error in sendQuestion:', error);
            throw error;
        }
    }

    async handleAnswer(ctx: Context) {
        try {
            const userId = ctx.from?.id;
            if (!userId) {
                throw new Error('User ID not found');
            }

            const userState = this.userStates.get(userId);
            if (!userState) {
                console.log('User state not found for user:', userId);
                await ctx.reply('Пожалуйста, начните тест заново с команды /start');
                return;
            }

            const match = (ctx as any).match;
            if (!match || !match[1] || !match[2]) {
                throw new Error('Match not found in context');
            }

            const questionIndex = parseInt(match[1]);
            const selectedAnswer = parseInt(match[2]);

            // Проверяем, что это текущий вопрос
            if (questionIndex !== userState.currentQuestion) {
                await ctx.answerCbQuery('Этот вопрос уже пройден или недоступен');
                return;
            }

            const currentQuestion = questions[userState.currentQuestion];
            if (!currentQuestion) {
                throw new Error('Current question not found');
            }

            console.log(`User ${userId} answered question ${userState.currentQuestion} with answer ${selectedAnswer}`);

            // Сохраняем ответ
            userState.answers[userState.currentQuestion] = selectedAnswer;

            // Удаляем кнопки с предыдущего вопроса
            try {
                const messageId = userState.messageIds[userState.currentQuestion];
                if (messageId) {
                    await ctx.editMessageReplyMarkup(undefined);
                }
            } catch (editError) {
                console.log('Could not edit message markup:', editError);
            }

            // Показываем explanation для выбранного варианта
            await ctx.reply(currentQuestion.explanations[selectedAnswer]);

            // Update score if correct
            if (selectedAnswer === currentQuestion.correctAnswer) {
                userState.score++;
            }

            // Move to next question or show results
            userState.currentQuestion++;
            if (userState.currentQuestion < questions.length) {
                await this.sendQuestion(ctx, userState.currentQuestion);
            } else {
                await this.showResults(ctx, userState.score);
                // Очищаем состояние после завершения теста
                this.userStates.delete(userId);
            }

            this.userStates.set(userId, userState);
        } catch (error) {
            console.error('Error in handleAnswer:', error);
            throw error;
        }
    }

    async handleBack(ctx: Context) {
        try {
            const userId = ctx.from?.id;
            if (!userId) {
                throw new Error('User ID not found');
            }

            const userState = this.userStates.get(userId);
            if (!userState) {
                await ctx.answerCbQuery('Пожалуйста, начните тест заново');
                return;
            }

            const match = (ctx as any).match;
            if (!match || !match[1]) {
                throw new Error('Match not found in context');
            }

            const currentQuestionIndex = parseInt(match[1]);

            // Проверяем, что можно вернуться назад
            if (currentQuestionIndex <= 0) {
                await ctx.answerCbQuery('Это первый вопрос');
                return;
            }

            // Возвращаемся к предыдущему вопросу
            const previousQuestionIndex = currentQuestionIndex - 1;
            userState.currentQuestion = previousQuestionIndex;

            // Удаляем ответ на предыдущий вопрос если он был
            if (userState.answers[previousQuestionIndex] !== undefined) {
                // Корректируем счет если ответ был правильным
                if (userState.answers[previousQuestionIndex] === questions[previousQuestionIndex].correctAnswer) {
                    userState.score--;
                }
                delete userState.answers[previousQuestionIndex];
            }

            // Удаляем кнопки с текущего сообщения
            try {
                const messageId = userState.messageIds[currentQuestionIndex];
                if (messageId) {
                    await ctx.editMessageReplyMarkup(undefined);
                }
            } catch (editError) {
                console.log('Could not edit message markup:', editError);
            }

            this.userStates.set(userId, userState);

            await ctx.answerCbQuery('Возвращаемся к предыдущему вопросу');
            await this.sendQuestion(ctx, previousQuestionIndex);

        } catch (error) {
            console.error('Error in handleBack:', error);
            await ctx.answerCbQuery('Произошла ошибка');
        }
    }

    private async showResults(ctx: Context, score: number) {
        try {
            let message = '';
            let buttonText = '';
            let buttonCallback = '';

            message = `Твой результат: ${score} правильных ответов из ${questions.length}.\n\n`;

            if (score <= 10) {
                message += 'Ой, к сожалению, это распространенная ситуация даже на средних уровнях, скорее всего эти непонятки тянутся еще со школы😢. Но не волнуйся! Чтобы навсегда искоренить эти ошибки и сделать твою речь ПРАВИЛЬНОЙ и БЕГЛОЙ, я создала курс "Живая грамматика". Курс основан не на правилах и табличках, а на видео с носителями, так что аудирование тоже прокачаем!';
                buttonText = 'Перейти в Telegram';
                buttonCallback = 'telegram_link';
            } else if (score <= 15) {
                message += 'Неплохо! 👏 Ты уже хорошо разбираешься в грамматике, но ошибки все еще проскакивают - это может повлиять на коммуникацию и твой образ как профессионала. Чтобы ты мог довести свои знания до совершенства и говорить ещё увереннее, я создала курс "Живая грамматика". Курс основан не на правилах и табличках, а на видео с носителями, так что аудирование тоже прокачаем!';
                buttonText = 'Перейти в Telegram';
                buttonCallback = 'telegram_link';
            } else {
                message += 'Вау, замечательный результат! 🎉У тебя нет проблем с грамматикой уровня Intermediate, а если ты хочешь двигаться дальше - приходи на уроки в мини-группы высокого уровня! Там тебя ждет много сочной продвинутой лексики и много-много общения!';
                buttonText = 'Записаться на собеседование';
                buttonCallback = 'interview_link';
            }

            await ctx.reply(
                message,
                Markup.inlineKeyboard([
                    Markup.button.callback(buttonText, buttonCallback)
                ])
            );
        } catch (error) {
            console.error('Error in showResults:', error);
            throw error;
        }
    }

    async handleLink(ctx: Context) {
        try {
            await ctx.reply('https://t.me/ChristiEnglish');
        } catch (error) {
            console.error('Error in handleLink:', error);
            throw error;
        }
    }
} 