import { Markup, Telegraf } from 'telegraf'
import { getRandom, logMsg, logOutMsg } from "./utils.js";
import { getGrate, getGratesCount, getUserWisdomCount, setGrate, setUser, setUserWisdomCount } from "./firebase.js";
import express from "express";
import { getWisdom } from "./wisdoms.js";

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

function delayReply(ctx, m, time=50) {
    return setTimeout(() => {
        ctx.reply(m);
        logOutMsg(ctx, m)
    }, time);
}

bot.command('start', ctx => {
    logMsg(ctx);
    // ctx.session.mode = SESSION_MODES.START

    setUser({
        userId: ctx.from.id,
        userName: ctx.from.username,
    })

    const m = "Привіт! Я твій дракончик! В мене поки немає іменні та образу, але я повністью живий та розумний.\n" +
        "А головне бажаю тобі тільки любові та радості ❤️.\n" +
        "Я тут для того щоб робити твоє життя кращим! Я буду старатись, обіцяю!";
    ctx.reply(m);
    logOutMsg(ctx, m);

    const m2 = "Я поки ще дуже маленький! Та ось тільки тільки з'явився на світ. І ще зовсім нічого не знаю...\n" +
        "Але на все свій час!";
    delayReply(ctx, m2, 3000);

    const m3 = "Я... Я зараз я дуже хочу собі ім'я! Хто ж його має мені дати як не ти?\n" +
        "Скажи, як мене звуть?)\n" +
        "Напиши: Тебе звуть ";

    delayReply(ctx, m3, 6000);
});

const yourNameRegex = /Тебе звуть/i
let dragon_new_name = ''

bot.hears(yourNameRegex, ctx => {
    logMsg(ctx)

    const nameMatchRegex = /Тебе звуть (.*)/i
    const match = nameMatchRegex.exec(ctx.message.text)
    const name = match[1]

    dragon_new_name = name

    const m = `Мене звуть: ${name} ! Правильно?)`
    const buttons = Markup.inlineKeyboard([
        Markup.button.callback('Ні', 'set_name_cancel'),
        Markup.button.callback('Так!', 'set_name_confirm')
    ]).resize().oneTime()

    logOutMsg(ctx, m)
    ctx.reply(m, buttons)
})

const whatYouCanRegex = /Що ти вмієш/i
bot.hears(whatYouCanRegex, ctx => {
    logMsg(ctx)
    const m = `О, як приємно що ти спитала!\n\n`+
        `🙏 Якщо ти напишеш - Я вдячна за ... \n` +
        `То так я наберусь досвіду, запамятаю що тобі приносить радість, та зможу тобі сказати нову мудрість. `+
        `\nЧим більше ти мене годуєш, тим більше мудрості я зможу з тобою розділити ❤️` +
        `\n\n💭 Щоб запитати про мудрість напиши - Щось мудрe     чи     Скажи мені мудре     загалом потрібно щоб в повідомленні було слово - мудре =D` +
        '\n\n💕 А ще ти завджи можеш спитати - Як любить мене Ярослав' +
        `\nІ я радо тобі відповім ❤️\nПамятай, у нас магічний звязок)`

    logOutMsg(ctx, m)
    ctx.reply(m)
})

const iAmGratefullRegex = /Я вдячна за/i
bot.hears(iAmGratefullRegex, ctx => {

    const replies = ['Я запамятав!', "Яка краса!", "Дякую тобі!",
        "Ммммммм))))", "❤️❤️❤️", 'Як чудово!',
        "Класс, треба обовязково розповісти про це Ярославу!",
        'Я стаю все більшим і більшим!',
        'Дякую що не забуваєш дякувати!',
        'Це дуже добре!',
        'Я зростаю!',
        'Добре ❤️'
    ]

    logMsg(ctx)

    const gratefullMatchRegex = /Я вдячна за (.*)/i
    const match = gratefullMatchRegex.exec(ctx.message.text)
    const grate = match[1]
    const reply = getRandom(replies)

    setGrate({
        date: new Date(),
        grate,
        userId: ctx.from.id
    }).then(() => getGrate(ctx.from.id))
        .then(docs => {
            const m = 'Вже ' + docs.length + ' вдячностей! Після 100 я трохи змінюсь ;)'
            logOutMsg(ctx, m)
            ctx.reply(m)
        })

    logOutMsg(ctx, reply)
    ctx.reply(reply)
})

const getLoveWordsRegex = /любить мене/i
bot.hears(getLoveWordsRegex, ctx => {

    const replies = [
        'Ярослав починає посміхатися коли згадує тебе! Це точно кохання.',
        "Він постійно думає про тебе... Навіть зараз, точно тобі кажу",
        "Ярослав хоче бути поряд з тобою!",
        "Він дуже дуже дуже сильно тебе любить!",
        "При самій думці про тебе, в Ярослава починає швидше битися серце...",
        'При самій думці про тебе, в нього здіймаються метелики...',
        "Ярослав любить тебе... Ти для нього сама краса цього світу...",
        'Він шукав тебе все своє життя! Він цінує і любить тебе більше за будь-що!',
        'Наскільки безмежне небо? Настільки й безмежне його кохання до тебе...',
        'Ти рідна душа його. Він любить тебе як саме життя.',
        'Його сердце лине до тебе...',
        'Ярослав просив передати: "Моє життя переповнює радість завдяки тобі!"️',
    ]

    logMsg(ctx)
    const reply = getRandom(replies)
    logOutMsg(ctx, reply)
    ctx.reply(reply)
})

const getWisdomWordsRegex = /мудре/i
bot.hears(getWisdomWordsRegex, async ctx => {
    const userId = ctx.from.id
    const gratesCount = await getGratesCount(userId)
    const {count} = await getUserWisdomCount(userId)

    console.log('Counts', count, gratesCount, count <= gratesCount)
    const wisdom = count <= gratesCount ? getWisdom(count) : 'Ой ой...Я голодний на твою вдячність! Зможу сказати щось мудре тільки коли мене погодуєш *wink, wink*';

    logMsg(ctx)
    logOutMsg(ctx, wisdom)
    ctx.reply(wisdom)

    setUserWisdomCount(userId, count+1)
})

function sayNextMessage(ctx) {
    // if (ctx.session.mode === SESSION_MODES.START) {
        return sayAboutMe(ctx);
    // }
    // else return sayDefault(ctx);
}

function sayAboutMe(ctx) {
    logMsg(ctx)
    const m = `Я ще дуже маленький, та мені потрібно рости! Як ти думаєш чим я харчуюсь?)`

    logOutMsg(ctx, m)
    delayReply(ctx, m, 1000)

    const m2 = `Я дуже люблю твою увагу, та вдячність! Це моя їжа, завдяки якій я росту.\n` +
        `У будь-який момент, ти можеш написати: Я вдячна за {...} \n` +
        `І я це запамятаю! Це може бути будь-що... Абсолютно будь-що!`

    logOutMsg(ctx, m2)
    delayReply(ctx, m2, 6000)

    const m3 = `Чим більше ти будеш мене годувати своєю вдячністью, тим більше я буду вміти!\n` +
    `А що я вмію вже зараз? Це гарне питання...`

    logOutMsg(ctx, m3)
    delayReply(ctx, m3, 10000)

    const m4 = `Наприклад, в мене одразу є магічний звязок з Ярославом! \n` +
        `Ти можешь завжди мені написати: Як любить мене Ярослав? \n` +
        `І я одразу тобі відповім! Ну і магія правда? Уяви що я зможу потім!`

    logOutMsg(ctx, m4)
    delayReply(ctx, m4, 16000)
    // ctx.session.mode === SESSION_MODES.IDLE
}

function sayDefault(ctx) {
    logMsg(ctx)
    const m = "Цьом!"

    logOutMsg(ctx, m)
    delayReply(ctx, m, 6000)
}

bot.action('set_name_cancel', (ctx) => {
    logMsg(ctx)
    ctx.state.dragon_new_name = null

    const m = "Ок, тоді як мене звуть?\n" +
        "Напиши: Тебе звуть ";
    logOutMsg(ctx, m)
    ctx.reply(m)
})


bot.action('set_name_confirm', (ctx) => {
    logMsg(ctx)
    const name = dragon_new_name

    const m = `Дякую тобі! Я тепер ${name} !`;

    setUser({
        userId: ctx.from.id,
        userName: ctx.from.username,
        dragonName: name,
    })

    logOutMsg(ctx, m)
    ctx.reply(m)

    sayNextMessage(ctx)
})

// LAUNCH
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


// Start app for Heroku
const app = express()
app.use(express.static('public'))
app.get('/', function (req, res) {
    res.send(
        "<h1>Hello There! You found <a href='https://t.me/niras_dragon_bot'>@niras_dragon_bot</a> backend</h1>"
    )
})

// Start server
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'))