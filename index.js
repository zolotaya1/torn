const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const webshot = require('webshot')
const fs = require('fs');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const Markup = require('telegraf/markup')


const exphbs = require('express-handlebars');
const request = require('request');
const UserService = require('./user-service');
const BotUtils = require('./utils');
const Logger = require('./logger');
const path = require('path');
const bodyParser = require('body-parser');
const MessagesService = require('./messages-service');
const users = require('./message-model');


mongoose.connect('mongodb://top:88993421q@ds022408.mlab.com:22408/top', { useNewUrlParser: true });

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
}).listen(process.env.PORT || 5000);

const stepHandler = new Composer();

const tot = new WizardScene('tot',
    stepHandler,
    (ctx) => {ctx.reply('Введите текст сообщения:');
        return ctx.wizard.next()
    },
    (ctx) => {
        const text = ctx.message.text;
        const markdown = text;


            UserService.getAll(function (err, users) {
                if (err) {
                    Logger.notify('Some error!' + err.message);
                    return;
                }

                users.forEach(function (user) {
                    bot.telegram.sendMessage(user.telegramId, markdown, {
                        parse_mode: 'Markdown',
                        disable_notification: false
                    });
                    console.log(ctx.message)
                });


            });
        ctx.reply('Отправлено!', {
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '➕Добавить в каталог'],
                    ['💳Платные услуги', '🔑Админка']
                ],
                resize_keyboard: true
            },
            disable_notification: false
        });
        return ctx.scene.leave()
    }
);

const tok = new WizardScene('tok',
    stepHandler,
    (ctx) => {
        ctx.reply('Уажите айди:');
        return ctx.wizard.next()
    },
    (ctx) => {ctx.reply('Введите текст сообщения:');
        ctx.session.counter = ctx.message.text;
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Отправлено!', {
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '➕Добавить в каталог'],
                    ['💳Платные услуги', '🔑Админка']
                ],
                resize_keyboard: true
            },
            disable_notification: false
        });
        ctx.telegram.sendMessage(ctx.message.chat.id=`${ctx.session.counter}`, `${ctx.message.text}`)
        return ctx.scene.leave()
    }
    );
const top = new WizardScene('top',

    stepHandler,
    (ctx) => {
        const markdown = `
*Укажите Ваш канал в формате*:
 
"\`@name_channel - краткое описание\`"
`
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            },
        })
        console.log(typeof ctx.message.text);
        return ctx.wizard.next()
    },
    (ctx) => {
    if (ctx.message.text === '🔵Назад') {
        ctx.telegram.sendMessage(ctx.message.chat.id, '...', {
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам'],
                    ['⚒Тех. поддержка']
                ],
                resize_keyboard: true
            },
        })
        return ctx.scene.leave()
    }else {
        const html = `
⚠️<b>Заявка на добавление канала:</b> 

Канал: ${ctx.message.text}
Юзер: ${ctx.from.first_name}
Юзернейм: @${ctx.from.username}
Message id: ${ctx.message.message_id}
Чат айди: ${ctx.message.chat.id}`;
        const html1 = `
<b>➕Ваш канал:</b>
 
"${ctx.message.text}"
 
<b>Канал будет добавлен после проверки и выполнения условий.</b>`
        ctx.telegram.sendMessage(ctx.message.chat.id, html1,{
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам'],
                    ['⚒Тех. поддержка']
                ],
                resize_keyboard: true
            },
        });
        ctx.telegram.sendMessage(ctx.message.chat.id=549073144, html,{
            parse_mode: 'HTML'
        })
        return ctx.scene.leave()
    }
    },
    (ctx) => {

    const text = ctx.message.text;

     const re = /\D+/ig;
     const text1 = text.replace(re, '');

        const html = `
⚠️<b>Заявка на добавление канала:</b> 

Канал: ${ctx.session.counter}
Функция: ${text1}
Чат айди: ${ctx.message.chat.id}`;
        const html1 = `
<b>➕Ваш канал:</b>
 
"${ctx.session.counter}"
 
<b>Канал будет добавлен после проверки и выполнения условий.</b>`
        ctx.telegram.sendMessage(ctx.message.chat.id, html1,{
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам']
                ],
                resize_keyboard: true
            },
        })
        ctx.telegram.sendMessage(ctx.message.chat.id=549073144, html,{
            parse_mode: 'HTML'
        })
        return ctx.scene.leave()

    },

);
const teh = new WizardScene('teh',

    stepHandler,
    (ctx) => {
        const markdown = `
⚒ Если у Вас вдруг возникли проблемы, или может быть есть какие либо предложения, то Мы рады будем Вас выслушать.

Просто напишите Ваш *MESSAGE* и нажмите отправить.
`
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            },
        })
        console.log(typeof ctx.message.text);
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text === '🔵Назад') {
            ctx.telegram.sendMessage(ctx.message.chat.id, '...', {
                reply_markup: {
                    keyboard: [
                        ['📃Каталог каналов', '📈Топ 10'],
                        ['📊Статистика бота', '💻Вебмастерам'],
                        ['⚒Тех. поддержка']
                    ],
                    resize_keyboard: true
                },
            })
            return ctx.scene.leave()
        }else {
            const html = `
<b>К вам на проверку:</b> 
Канал: ${ctx.message.text}
Юзер: ${ctx.from.first_name}
Юзернейм: @${ctx.from.username}
Message id: ${ctx.message.message_id}
Чат айди: ${ctx.message.chat.id}`;
            const html1 = `
🛠<b>Ваше сообщение:</b>
 
"${ctx.message.text}"
 
<b>Сообщение было успешно отправлено ✔️

В скором времени на него ответит модератор.</b>`
            ctx.telegram.sendMessage(ctx.message.chat.id, html1,{
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [
                        ['📃Каталог каналов', '📈Топ 10'],
                        ['📊Статистика бота', '💻Вебмастерам'],
                        ['⚒Тех. поддержка']
                    ],
                    resize_keyboard: true
                },
            });
            ctx.telegram.sendMessage(ctx.message.chat.id=549073144, html,{
                parse_mode: 'HTML'
            })
            return ctx.scene.leave()
        }
    },
    (ctx) => {

        const text = ctx.message.text;

        const re = /\D+/ig;
        const text1 = text.replace(re, '');

        const html = `
<b>К вам на проверку:</b> 
Канал: ${ctx.session.counter}
Функция: ${text1}
Чат айди: ${ctx.message.chat.id}`;
        const html1 = `
<b>➕Ваш канал:</b>
 
"${ctx.session.counter}"
 
<b>Канал будет добавлен после проверки и выполнения условий.</b>`
        ctx.telegram.sendMessage(ctx.message.chat.id, html1,{
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам']
                ],
                resize_keyboard: true
            },
        })
        ctx.telegram.sendMessage(ctx.message.chat.id=549073144, html,{
            parse_mode: 'HTML'
        })
        return ctx.scene.leave()

    },

);
const say999 = new WizardScene('say999',

    stepHandler,
    (ctx) => {
        const markdown = `
*Напишите рекламный текст для рассылки*:
 
`
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            },
        })
        console.log(typeof ctx.message.text);
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text === '🔵Назад') {
            ctx.telegram.sendMessage(ctx.message.chat.id, '...', {
                reply_markup: {
                    keyboard: [
                        ['📃Каталог каналов', '📈Топ 10'],
                        ['📊Статистика бота', '💻Вебмастерам'],
                        ['⚒Тех. поддержка']
                    ],
                    resize_keyboard: true
                },
            })
            return ctx.scene.leave()
        }else {
            const html = `
⚠️<b>Заявка на рассылку:</b> 

Рекламный текст: ${ctx.message.text}
Юзер: ${ctx.from.first_name}
Юзернейм: @${ctx.from.username}
Message id: ${ctx.message.message_id}
Чат айди: ${ctx.message.chat.id}`;
            const markdown = `
💳*Оплата*:

➡️ \`Рассылка по подписчикам бота\`  

➡️ Ваш текст: "*${ctx.message.text}*"

➡️ Стоимость: *999 ₽*       
`
            ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
                parse_mode: 'Markdown',
                reply_markup: {

                    inline_keyboard: [
                        [
                            {
                                text: 'Продолжить ₽',
                                callback_data: '1'
                            }
                        ]
                    ]
                },
            });
            ctx.telegram.sendMessage(ctx.message.chat.id=549073144, html,{
                parse_mode: 'HTML'
            })
            return ctx.scene.leave()
        }
    },
);
const say299 = new WizardScene('say299',

    stepHandler,
    (ctx) => {
        const markdown = `
💳*Оплата*:

➡️ \`В топ 10\`
      
➡️ Стоимость:  *299 ₽*       
`
        ctx.reply(`⬇️`,{
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            }
        })
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
             inline_keyboard: [
                    [
                        {
                            text: 'Продолжить ₽',
                            callback_data: '2'
                        }
                    ]
                ],
            },

        });
        return ctx.scene.leave()
    },
);
const say399 = new WizardScene('say399',

    stepHandler,
    (ctx) => {
        const markdown = `
💳*Оплата*:

➡️ \`На первое место в топ 10\`
      
➡️ Стоимость:  *399 ₽*       
`
        ctx.reply(`⬇️`,{
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            }
        })
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Продолжить ₽',
                            callback_data: '3'
                        }
                    ]
                ],
            },

        });
        return ctx.scene.leave()
    },
);
const say199 = new WizardScene('say199',

    stepHandler,
    (ctx) => {
        const markdown = `
💳*Оплата*:

➡️ \`На первое место в каталоге\`
      
➡️ Стоимость:  *199 ₽*       
`
        ctx.reply(`⬇️`,{
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            }
        })
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Продолжить ₽',
                            callback_data: '4'
                        }
                    ]
                ],
            },

        });
        return ctx.scene.leave()
    },
);
const say99 = new WizardScene('say99',

    stepHandler,
    (ctx) => {
        const markdown = `
💳*Оплата*:

➡️ \`Жирный шрифт\`
      
➡️ Стоимость:  *99 ₽*       
`
        ctx.reply(`⬇️`,{
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            }
        })
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Продолжить ₽',
                            callback_data: '5'
                        }
                    ]
                ],
            },

        });
        return ctx.scene.leave()
    },
);
const say149 = new WizardScene('say149',

    stepHandler,
    (ctx) => {
        const markdown = `
💳*Оплата*:

➡️ \`Метка '🔸' возле канала\`
      
➡️ Стоимость:  *149 ₽*       
`
        ctx.reply(`⬇️`,{
            reply_markup: {
                keyboard: [
                    ['🔵Назад']
                ],
                resize_keyboard: true
            }
        })
        ctx.telegram.sendMessage(ctx.message.chat.id, markdown,{
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Продолжить ₽',
                            callback_data: '6'
                        }
                    ]
                ],
            },

        });
        return ctx.scene.leave()
    },
);




const bot = new Telegraf('660235857:AAHpND3YGg6CnfDXWKcTt6NhT97oZK5B_K8');

const stage = new Stage();

const clientMessage = new RegExp('\/start');

stage.register(top, tok, tot, say999, say299, say399, say199, say99, say149, teh);
bot.use(session());
bot.use(stage.middleware());
bot.hears('➕Добавить', (ctx) => {
    ctx.scene.enter('top');
});
bot.hears('⚒Тех. поддержка', (ctx) => {
    ctx.scene.enter('teh');
});
bot.hears('➕Добавить канал', (ctx) => {
    const markdown = `
➕*Условия*:

Перед тем как добавить канал в каталог, требуется разместить на своем канале рекламную ссылку на наш бот, ссылка должна находиться минимум 24 часа на вашем канале, не обязательно держать ее в *ТОП*е.

*Ссылка на бот*: t.me/catalogthebot
`

    ctx.telegram.sendMessage(ctx.message.chat.id, markdown, {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['➕Добавить'],
                ['🔵Назад']

            ],
            resize_keyboard: true
        }
    })
});
bot.hears('💳 1', (ctx) => {
    ctx.scene.enter('say999');
});
bot.hears('💳 2', (ctx) => {
    ctx.scene.enter('say299');
});
bot.hears('💳 3', (ctx) => {
    ctx.scene.enter('say399');
});
bot.hears('💳 4', (ctx) => {
    ctx.scene.enter('say199');
});
bot.hears('💳 5', (ctx) => {
    ctx.scene.enter('say99');
});
bot.hears('💳 6', (ctx) => {
    ctx.scene.enter('say149');
});
bot.hears('💻Вебмастерам', (ctx) => {

        const markdown = `Выберите интересующую Вас функцию:`

        ctx.telegram.sendMessage(ctx.message.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['➕Добавить канал', '💳Платные услуги'],
                    ['🔵Назад']

                ],
                resize_keyboard: true
            }
        })
});
bot.hears('Ответ на сообщение', (ctx) => {
    const id = ctx.message.chat.id;
    const admin = 549073144;

    if(id === admin) {
        ctx.scene.enter('tok')
    };
});
bot.hears('📃Каталог каналов', (ctx) => {


    ctx.telegram.sendMessage(ctx.message.chat.id, `Выберите интересующий Вас раздел`, {
        reply_markup: {
            keyboard: [
                ['🌐Технологии', '📡Новости и СМИ'],
                ['🎉Юмор и Развлечения', '🌎Путешествия и Эмиграция'],
                ['🕶Мода и Красота', '🎬Фильмы и Сериалы'],
                ['🎧Музыка', '🎮Игры и Приложения'],
                ['📝Лингвистика', '📖Литература'],
                ['💊Медицина', '📷Искусство и Фото'],
                ['📊Политика и Экономика', '🔖Цитаты'],
                ['🎯Здоровье и Спорт', '🔞Для взрослых'],
                ['🔵Назад']
            ],
            resize_keyboard: true
        },
        disable_notification: false
    })
});
bot.hears('🌐Технологии', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle1('Технологии', function (getErr, message,) {

        const one = message.one;
        const text = message.technology;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'technology1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📡Новости и СМИ', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle3('Новости и СМИ', function (getErr, message,) {

        const one = message.one;
        const text = message.news;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'news1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🎉Юмор и Развлечения', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle4('Юмор и Развлечения', function (getErr, message,) {

        const one = message.one;
        const text = message.lol;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'lol1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🌎Путешествия и Эмиграция', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle6('Путешествия и Эмиграция', function (getErr, message,) {

        const one = message.one;
        const text = message.emigrant;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'emigrant1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🕶Мода и Красота', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle25('Мода и Красота', function (getErr, message,) {

        const one = message.one;
        const text = message.fashion;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'fashion1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🎬Фильмы и Сериалы', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle10('Фильмы и Сериалы', function (getErr, message,) {

        const one = message.one;
        const text = message.films;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'films1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🎮Игры и Приложения', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle14('Игры и Приложения', function (getErr, message,) {

        const one = message.one;
        const text = message.games;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'games1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📝Лингвистика', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle16('Лингвистика', function (getErr, message,) {

        const one = message.one;
        const text = message.linguistics;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'linguistics1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📖Литература', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle18('Литература', function (getErr, message,) {

        const one = message.one;
        const text = message.literature;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'literature1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('💊Медицина', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle20('Медицина', function (getErr, message,) {

        const one = message.one;
        const text = message.medic;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'medic1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🔖Цитаты', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle22('Цитаты', function (getErr, message,) {

        const one = message.one;
        const text = message.quote;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'quote1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📷Искусство и Фото', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle24('Искусство и Фото', function (getErr, message,) {

        const one = message.one;
        const text = message.pictures;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'pictures1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🎧Музыка', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle9('Музыка', function (getErr, message,) {

        const one = message.one;
        const text = message.music;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'music1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🎯Здоровье и Спорт', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle29('Здоровье и Спорт', function (getErr, message,) {

        const one = message.one;
        const text = message.sport;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'sport1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('🔞Для взрослых', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle31('Для взрослых', function (getErr, message,) {

        const one = message.one;
        const text = message.xxx;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'xxx1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📊Политика и Экономика', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle27('Политика и Экономика', function (getErr, message,) {

        const one = message.one;
        const text = message.politic;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
${one}        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '➡️',
                            callback_data: 'politic1'
                        }
                    ],
                ]
            }
        })
    });

});
bot.hears('📈Топ 10', (message) => {

    const clientInfo = BotUtils.getClientInfo(message);
    MessagesService.getByTitle33('Топ 10', function (getErr, message,) {

        const text = message.top10;
        const re = /,/gi;
        const rr = text.replace(re, '');

        const html = `
        
${rr}
`;


        bot.telegram.sendMessage(clientInfo.telegramId, html,{
            parse_mode: 'HTML',
        })
    });
});
bot.hears('📊Статистика бота', (ctx) => {

    const html = `Выберите интересующий Вас период:`

    ctx.telegram.sendMessage(ctx.message.chat.id, html, {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [
                ['🕐За 24 часа', '🕗За Месяц'],
                ['🔵Назад']

            ],
            resize_keyboard: true
        }
    })
});
bot.hears('💳Платные услуги', (ctx) => {
    const markdown = `
💳 *Платные услуги*

\`Рассылка по подписчикам бота\` - *999* ₽.

\`В топ 10\` - *299* ₽.

\`На первое место в топ 10\` - *399* ₽.

\`На первое место в каталоге\` - *199* ₽.

\`Жирный шрифт\` - *99* ₽.

\`Метка '🔸' возле канала\` - *149* ₽.

*Функции имеют ограничение по использованию*:

\`В топ 10\` - *Пока не вытеснят другие заказы*.

\`На первое место в топ 10\` - *На 36 часов*.

\`На первое место в каталоге\` - *На 36 часов*.

\`Жирный шрифт\` - *1 месяц*.

\`Метка '🔸' возле канала\` - *1 месяц*.
`

    bot.telegram.sendMessage(ctx.message.chat.id, markdown, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Заказать ₽',
                        callback_data: 'many'
                    }
                ],

            ]
        }
    })
});
bot.hears('🔑Админка', (ctx) => {
    const id = ctx.message.chat.id;
    const admin = 549073144;

    if(id === admin) {
        const markdown = `Выберите интересующую Вас функцию:`

        ctx.telegram.sendMessage(ctx.message.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['Рассылка', 'Ответ на сообщение'],
                    ['🔵Назад']

                ],
                resize_keyboard: true
            }
        })
    }
});
bot.hears('Рассылка', stepHandler, (ctx) => {
    const id = ctx.message.chat.id;
    const admin = 549073144;

    if(id === admin) {
        ctx.scene.enter('tot')
    };
});
bot.hears('🔵Назад', stepHandler, (ctx) => {

    const id = ctx.message.chat.id;
    const admin = 549073144;

    if(id === admin) {
        ctx.telegram.sendMessage(ctx.message.chat.id, `...`, {
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам'],
                    ['🔑Админка']
                ],
                resize_keyboard: true
            },
            disable_notification: false
        })
    }else{
        ctx.telegram.sendMessage(ctx.message.chat.id, `...`, {
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам'],
                    ['⚒Тех. поддержка']
                ],
                resize_keyboard: true
            },
            disable_notification: false
        })
    }
});
bot.hears('🕐За 24 часа', (ctx) => {

    ctx.telegram.sendMessage(ctx.message.chat.id, `Подождите, идет загрузка...`,)

    const optionsSelector = {
        captureSelector: '.chartjs-render-monitor'
    };
    webshot('https://uztelegram.com/channel/Prikolgif?period=day',
        '1112.jpg', optionsSelector, function(err) {
            if (!err) {
                console.log('Сделал скриншот')
                const day = '🕐За 24 часа';
                ctx.replyWithPhoto({ source: fs.readFileSync(__dirname + '/1112.jpg')}, {
                    caption: day,
                })
            }
        })
});
bot.hears('🕗За Месяц', (ctx) => {

    ctx.telegram.sendMessage(ctx.message.chat.id, `Подождите, идет загрузка...`,)

    const optionsSelector = {
        captureSelector: '.chartjs-render-monitor'
    };
    webshot('https://uztelegram.com/channel/Prikolgif?period=month',
        '1111.jpg', optionsSelector, function(err) {
            if (!err) {
                console.log('Сделал скриншот')
                const day = '🕗За Месяц';
                ctx.replyWithPhoto({ source: fs.readFileSync(__dirname + '/1111.jpg')}, {
                    caption: day,
                })
            }
        })
});
bot.hears(clientMessage, (message) => {

    const id = message.chat.id;
    const admin = 549073144;

    if(id === admin){
        const markdown = `
Добро пожаловать *${message.from.first_name}*!
`;

        bot.telegram.sendMessage(message.chat.id, markdown, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [
                    ['📃Каталог каналов', '📈Топ 10'],
                    ['📊Статистика бота', '💻Вебмастерам'],
                    ['🔑Админка']
                ],
                resize_keyboard: true
            },
            disable_notification: false
        })
    }else{
        Logger.notify('Sending message from the default handler ');
        const clientInfo = BotUtils.getClientInfo(message);


        UserService.saveUser(clientInfo, function (saveErr,) {
            if (saveErr) {
                bot.telegram.sendMessage(clientInfo.telegramId, 'Some error! Sorry',);
                return;
            }
            MessagesService.getByTitle('start', function (getErr, message) {

                const text = message.start;
                const re = /,/gi;
                const rr = text.replace(re, '');
                const markdown = `
Добро пожаловать *${clientInfo.firstName}*!
${rr}`;

                bot.telegram.sendMessage(clientInfo.telegramId, markdown, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: [
                            ['📃Каталог каналов', '📈Топ 10'],
                            ['📊Статистика бота', '💻Вебмастерам'],
                            ['⚒Тех. поддержка']
                        ],
                        resize_keyboard: true
                    },
                    disable_notification: false
                })

            });
        });
    }
});
bot.on('callback_query', ctx => {

    const query = ctx.update.callback_query.data;
    const chatId = ctx.update.callback_query.from.id;
    const messageId = ctx.update.callback_query.message.message_id;

    if (query === 'technology1') {

        MessagesService.getByTitle2('technology', function (getErr, message,) {

            const one = message.one;
            const text = message.technology1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'technology'
                            },
                            {
                                text: '➡️',
                                callback_data: 'technology2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'technology') {
        MessagesService.getByTitle2('technology', function (getErr, message,) {

            const one = message.one;
            const text = message.technology;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'technology1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'technology2') {
        MessagesService.getByTitle2('technology', function (getErr, message,) {

            const one = message.one;
            const text = message.technology2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'technology1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'technology3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'technology3') {
        MessagesService.getByTitle2('technology', function (getErr, message,) {

            const one = message.one;
            const text = message.technology3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'technology2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'news1') {

        MessagesService.getByTitle5('news', function (getErr, message,) {

            const one = message.one;
            const text = message.news1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'news'
                            },
                            {
                                text: '➡️',
                                callback_data: 'news2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'news') {
        MessagesService.getByTitle5('news', function (getErr, message,) {

            const one = message.one;
            const text = message.news;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'news1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'news2') {
        MessagesService.getByTitle5('news', function (getErr, message,) {

            const one = message.one;
            const text = message.news2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'news1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'news3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'news3') {
        MessagesService.getByTitle5('news', function (getErr, message,) {

            const one = message.one;
            const text = message.news3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'news2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'lol1') {

        MessagesService.getByTitle8('lol', function (getErr, message,) {

            const one = message.one;
            const text = message.lol1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'lol'
                            },
                            {
                                text: '➡️',
                                callback_data: 'lol2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'lol') {
        MessagesService.getByTitle8('lol', function (getErr, message,) {

            const one = message.one;
            const text = message.lol;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'lol1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'lol2') {
        MessagesService.getByTitle8('lol', function (getErr, message,) {

            const one = message.one;
            const text = message.lol2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'lol1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'lol3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'lol3') {
        MessagesService.getByTitle8('lol', function (getErr, message,) {

            const one = message.one;
            const text = message.lol3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'lol2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'emigrant1') {

        MessagesService.getByTitle7('emigrant', function (getErr, message,) {

            const one = message.one;
            const text = message.emigrant1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'emigrant'
                            },
                            {
                                text: '➡️',
                                callback_data: 'emigrant2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'emigrant') {
        MessagesService.getByTitle7('emigrant', function (getErr, message,) {

            const one = message.one;
            const text = message.emigrant;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'emigrant1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'emigrant2') {
        MessagesService.getByTitle7('emigrant', function (getErr, message,) {

            const one = message.one;
            const text = message.emigrant2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'emigrant1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'emigrant3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'emigrant3') {
        MessagesService.getByTitle7('emigrant', function (getErr, message,) {

            const one = message.one;
            const text = message.emigrant3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'emigrant2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'fashion1') {

        MessagesService.getByTitle11('fashion', function (getErr, message,) {

            const one = message.one;
            const text = message.fashion1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'fashion'
                            },
                            {
                                text: '➡️',
                                callback_data: 'fashion2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'fashion') {
        MessagesService.getByTitle11('fashion', function (getErr, message,) {

            const one = message.one;
            const text = message.fashion;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'fashion1'
                }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'fashion2') {
        MessagesService.getByTitle11('fashion', function (getErr, message,) {

            const one = message.one;
            const text = message.fashion2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'fashion1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'fashion3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'fashion3') {
        MessagesService.getByTitle11('fashion', function (getErr, message,) {

            const one = message.one;
            const text = message.fashion3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'fashion2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'films1') {

        MessagesService.getByTitle12('films', function (getErr, message,) {

            const one = message.one;
            const text = message.films1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'films'
                            },
                            {
                                text: '➡️',
                                callback_data: 'films2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'films') {
        MessagesService.getByTitle12('films', function (getErr, message,) {

            const one = message.one;
            const text = message.films;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'films1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'films2') {
        MessagesService.getByTitle12('films', function (getErr, message,) {

            const one = message.one;
            const text = message.films2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'films1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'films3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'films3') {
        MessagesService.getByTitle12('films', function (getErr, message,) {

            const one = message.one;
            const text = message.films3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'films2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'music1') {

        MessagesService.getByTitle13('music', function (getErr, message,) {

            const one = message.one;
            const text = message.music1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'music'
                            },
                            {
                                text: '➡️',
                                callback_data: 'music2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'music') {
        MessagesService.getByTitle13('music', function (getErr, message,) {

            const one = message.one;
            const text = message.music;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'music1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'music2') {
        MessagesService.getByTitle13('music', function (getErr, message,) {

            const one = message.one;
            const text = message.music2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'music1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'music3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'music3') {
        MessagesService.getByTitle13('music', function (getErr, message,) {

            const one = message.one;
            const text = message.music3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'music2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'games1') {

        MessagesService.getByTitle15('games', function (getErr, message,) {

            const one = message.one;
            const text = message.games1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'games'
                            },
                            {
                                text: '➡️',
                                callback_data: 'games2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'games') {
        MessagesService.getByTitle15('games', function (getErr, message,) {

            const one = message.one;
            const text = message.games;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'games1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'games2') {
        MessagesService.getByTitle15('games', function (getErr, message,) {

            const one = message.one;
            const text = message.games2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'games1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'games3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'games3') {
        MessagesService.getByTitle15('games', function (getErr, message,) {

            const one = message.one;
            const text = message.games3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'games2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'linguistics1') {

        MessagesService.getByTitle17('linguistics', function (getErr, message,) {

            const one = message.one;
            const text = message.linguistics1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'linguistics'
                            },
                            {
                                text: '➡️',
                                callback_data: 'linguistics2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'linguistics') {
        MessagesService.getByTitle17('linguistics', function (getErr, message,) {

            const one = message.one;
            const text = message.linguistics;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'linguistics1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'linguistics2') {
        MessagesService.getByTitle17('linguistics', function (getErr, message,) {

            const one = message.one;
            const text = message.linguistics2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'linguistics1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'linguistics3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'linguistics3') {
        MessagesService.getByTitle17('linguistics', function (getErr, message,) {

            const one = message.one;
            const text = message.linguistics3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'linguistics2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'literature1') {

        MessagesService.getByTitle19('literature', function (getErr, message,) {

            const one = message.one;
            const text = message.literature1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'literature'
                            },
                            {
                                text: '➡️',
                                callback_data: 'literature2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'literature') {
        MessagesService.getByTitle19('literature', function (getErr, message,) {

            const one = message.one;
            const text = message.literature;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'literature1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'literature2') {
        MessagesService.getByTitle19('literature', function (getErr, message,) {

            const one = message.one;
            const text = message.literature2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'literature1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'literature3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'literature3') {
        MessagesService.getByTitle19('literature', function (getErr, message,) {

            const one = message.one;
            const text = message.literature3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'literature2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'medic1') {

        MessagesService.getByTitle21('medic', function (getErr, message,) {

            const one = message.one;
            const text = message.medic1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'medic'
                            },
                            {
                                text: '➡️',
                                callback_data: 'medic2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'medic') {
        MessagesService.getByTitle21('medic', function (getErr, message,) {

            const one = message.one;
            const text = message.medic;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'medic1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'medic2') {
        MessagesService.getByTitle21('medic', function (getErr, message,) {

            const one = message.one;
            const text = message.medic2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'medic1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'medic3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'medic3') {
        MessagesService.getByTitle21('medic', function (getErr, message,) {

            const one = message.one;
            const text = message.medic3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'medic2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'quote1') {

        MessagesService.getByTitle23('quote', function (getErr, message,) {

            const one = message.one;
            const text = message.quote1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'quote'
                            },
                            {
                                text: '➡️',
                                callback_data: 'quote2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'quote') {
        MessagesService.getByTitle23('quote', function (getErr, message,) {

            const one = message.one;
            const text = message.quote;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'quote1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'quote2') {
        MessagesService.getByTitle23('quote', function (getErr, message,) {

            const one = message.one;
            const text = message.quote2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'quote1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'quote3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'quote3') {
        MessagesService.getByTitle23('quote', function (getErr, message,) {

            const one = message.one;
            const text = message.quote3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'quote2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'pictures1') {

        MessagesService.getByTitle26('pictures', function (getErr, message,) {

            const one = message.one;
            const text = message.pictures1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'pictures'
                            },
                            {
                                text: '➡️',
                                callback_data: 'pictures2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'pictures') {
        MessagesService.getByTitle26('pictures', function (getErr, message,) {

            const one = message.one;
            const text = message.pictures;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'pictures1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'pictures2') {
        MessagesService.getByTitle26('pictures', function (getErr, message,) {

            const one = message.one;
            const text = message.pictures2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'pictures1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'pictures3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'pictures3') {
        MessagesService.getByTitle26('pictures', function (getErr, message,) {

            const one = message.one;
            const text = message.pictures3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'pictures2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'politic1') {

        MessagesService.getByTitle28('politic', function (getErr, message,) {

            const one = message.one;
            const text = message.politic1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'politic'
                            },
                            {
                                text: '➡️',
                                callback_data: 'politic2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'politic') {
        MessagesService.getByTitle28('politic', function (getErr, message,) {

            const one = message.one;
            const text = message.politic;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'politic1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'politic2') {
        MessagesService.getByTitle28('politic', function (getErr, message,) {

            const one = message.one;
            const text = message.politic2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'politic1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'politic3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'politic3') {
        MessagesService.getByTitle28('politic', function (getErr, message,) {

            const one = message.one;
            const text = message.politic3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'politic2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'sport1') {

        MessagesService.getByTitle30('sport', function (getErr, message,) {

            const one = message.one;
            const text = message.sport1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'sport'
                            },
                            {
                                text: '➡️',
                                callback_data: 'sport2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'sport') {
        MessagesService.getByTitle30('sport', function (getErr, message,) {

            const one = message.one;
            const text = message.sport;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'sport1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'sport2') {
        MessagesService.getByTitle30('sport', function (getErr, message,) {

            const one = message.one;
            const text = message.sport2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'sport1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'sport3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'sport3') {
        MessagesService.getByTitle30('sport', function (getErr, message,) {

            const one = message.one;
            const text = message.sport3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'sport2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'xxx1') {

        MessagesService.getByTitle32('xxx', function (getErr, message,) {

            const one = message.one;
            const text = message.xxx1;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'xxx'
                            },
                            {
                                text: '➡️',
                                callback_data: 'xxx2'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'xxx') {
        MessagesService.getByTitle32('xxx', function (getErr, message,) {

            const one = message.one;
            const text = message.xxx;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '➡️',
                                callback_data: 'xxx1'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'xxx2') {
        MessagesService.getByTitle32('xxx', function (getErr, message,) {

            const one = message.one;
            const text = message.xxx2;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'xxx1'
                            },
                            {
                                text: '➡️',
                                callback_data: 'xxx3'
                            }
                        ],
                    ]
                }
            })
        })
    }
    else if (query === 'xxx3') {
        MessagesService.getByTitle32('xxx', function (getErr, message,) {

            const one = message.one;
            const text = message.xxx3;
            const re = /,/gi;
            const rr = text.replace(re, '');
            const html = `
${one}           
${rr}
`;

            ctx.editMessageText( html,{
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '⬅️',
                                callback_data: 'xxx2'
                            }
                        ],
                    ]
                }
            })
        })
    }

    else if (query === 'many') {

            const markdown = `
            *💳Выберите интересующую Вас функцию:*
            
*1* ➡️\`Рассылка по подписчикам бота\` - *999* ₽.

*2* ➡️\`В топ 10\` - *299* ₽.

*3* ➡️\`На первое место в топ 10\` - *399* ₽.

*4* ➡️\`На первое место в каталоге\` - *199* ₽.

*5* ➡️\`Жирный шрифт\` - *99* ₽.

*6* ➡️\`Метка '🔸' возле канала\` - *149* ₽.

`;

            ctx.telegram.sendMessage(ctx.chat.id, markdown,{
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['💳 1', '💳 2', '💳 3',],
                        ['💳 4', '💳 5', '💳 6',]
                    ],
                    resize_keyboard: true
                }
            })

    }

    else if (query === '1') {

        const markdown = `
            *💳Выберите способ оплаты:*           
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI1'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex1'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === '2') {

        const markdown = `
            *💳Выберите способ оплаты:*
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI2'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex2'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === '3') {

        const markdown = `
            *💳Выберите способ оплаты:*
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI3'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex3'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === '4') {

        const markdown = `
            *💳Выберите способ оплаты:*
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI4'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex4'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === '5') {

        const markdown = `
            *💳Выберите способ оплаты:*
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI5'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex5'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === '6') {

        const markdown = `
            *💳Выберите способ оплаты:*
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'QIWI.Кошелек',
                            callback_data: 'QIWI6'
                        },
                        {
                            text: 'Яндекс.Деньги',
                            callback_data: 'yandex6'
                        }
                    ],
                ]
            }
        })

    }

    else if (query === 'QIWI1') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *999* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=999'
                        }
                        ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'QIWI2') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *299* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=299'
                        }
                    ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'QIWI3') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *399* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=399'
                        }
                    ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'QIWI4') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *199* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=199'
                        }
                    ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'QIWI5') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *99* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=99'
                        }
                    ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'QIWI6') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".

Так же укажите сумму: *149* ₽.
`;

        ctx.editMessageText(markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {

                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=79872132562&amountInteger=149'
                        }
                    ],
                    [
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }

    else if (query === 'yandex1') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/999'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'yandex2') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/299'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'yandex3') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/399'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'yandex4') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/199'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'yandex5') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/99'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }
    else if (query === 'yandex6') {

        const markdown = `
*💳Оплата*:

Воизбежания проблем в графе "*комментарии к платежу*" укажите Ваш канал в формате "\`@name_channel\`".
`;

        ctx.editMessageText( markdown,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Оплатить ₽',
                            url: 'https://money.yandex.ru/to/410014917439508/149'
                        },
                        {
                            text: 'Оплачено ₽',
                            callback_data: 'say'
                        }
                    ],
                ]
            }
        })

    }

    else{
        const markdown = `
💳*После проверки платежа модератором, активируется выбранная Вами функция*.
        
\`Проверка длиться в течение 2-ух часов.\``
        ctx.editMessageText( markdown ,{
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
        })}

console.log(ctx.update)
});
bot.startPolling();

