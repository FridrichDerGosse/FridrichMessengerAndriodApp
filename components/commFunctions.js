import Base64 from 'Base64';


async function send_receive(sock, data, onReceive) {
    let b64data = Base64.btoa(data);

    sock.send(b64data); // send a message

    sock.onmessage = (e) => {
        // a message was received
        let stringMes = e.data
        let out

        // try to load with json only, then with base64 and json
        try {
            out = JSON.parse(stringMes).content

        } catch {
            stringMes = Base64.atob(e.data)
            out = JSON.parse(stringMes).content
        }

        out.done = true
        onReceive(out)
    };

    sock.onerror = (e) => {
        // an error occurred
        console.log(e.message);
        let out = {
            done: true,
            success: false,
            cause: "socketError",
        }
        onReceive(out)
    };
}


export function try_login(sock, username, password, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "login",
                username: username,
                password: password
            }
        }),
        onReceive
    )
}


export function try_register(sock, username, password, email, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "register",
                username: username,
                password: password,
                email: email,
            }
        }),
        onReceive
    )
}


export function create_chat(sock, chatName, user_ids, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "create_chat",
                user_ids: user_ids,
                name: chatName,
            }
        }),
        onReceive
    )
}


export function get_chats(sock, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "get_chats",
            }
        }),
        onReceive
    )
}


export function get_messages(sock, chat_id, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "get_messages",
                chat_id: chat_id,
            }
        }),
        onReceive,
    )
}


export function send_message(sock, content, chat_id, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "send_message",
                content: content,
                chat_id: chat_id,
            }
        }),
        onReceive,
    )
}


export function does_user_exist(sock, username, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "user_lookup",
                username: username,
            }
        }),
        onReceive,
    )
}


export function leave_chat(sock, chat_id, onReceive) {
    send_receive(
        sock,
        JSON.stringify({
            time: 1.1,
            data: {
                type: "leave_chat",
                chat_id: chat_id,
            }
        }),
        onReceive,
    )
}
