export function extractTextMessage(message) {
    if (!message) {
        return
    }

    let out = []
    message.forEach((item) => {
        out.push(item.content)
    })
    return out
}


export function toDateTime(secs) {
    let t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}
