
export function userString(ctx) {
    return JSON.stringify(ctx.from.id == ctx.chat.id ? ctx.from : {
        from: ctx.from,
        chat: ctx.chat
    });
}

export function logMsg(ctx) {
    const from = userString(ctx);
    const date = new Date().toLocaleDateString();
    if (ctx.message) {
        const text = ctx.message.text
        console.log(date, '| <', text, from)
    } else {
        console.log(date, '| <', ctx, from)
    }
}

export function logOutMsg(ctx, text) {
    const date = new Date().toLocaleDateString();

    console.log(date, ' | >', {
        id: ctx.chat.id
    }, text);
}

export function getRandom(list) {
    return list[Math.floor(Math.random()*list.length)];
}