import {FlatList, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {colorSchemes, chatIconText, chatIcon} from "./themes";
import MessageElement from "./MessageElement";
import {useEffect, useState} from "react";

import {send_message} from "./commFunctions";

let params = null


function ChatScreen({navigation, route}) {
    if (route.params) {
        params = route.params
    }

    let getMessages = params.getMessages
    let chat = params.chat
    let messages = getMessages(chat.id)
    let chatName = params.chatName

    let reversed_messages = messages.reverse()
    let username = params.username
    let sock = params.sock

    let color_id = chat.id - 1 % colorSchemes.length

    const [messageText, setMessageText] = useState("")
    const [updater, setUpdater] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setUpdater(Date.now())
        }, 250);
        return () => clearInterval(interval);
    }, []);

    function messageInputHandler(entered_text) {
        setMessageText(entered_text)
    }

    function onSend() {
        if (messageText) {
            send_message(sock, messageText, chat.id, () => {})
            setMessageText("")
        }
    }

    function keyboardSendButton(add_opacity) {
        let out = {
            width: 50,
            height: 50,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#1F6AA5",
            borderBottomRightRadius: 25,
            borderTopRightRadius: 25,
        }
        if (add_opacity) {
            out.opacity = .5
        }
        if (!messageText) {
            out.borderRadius = 25
        }
        return out
    }

    function keyboardInput() {
        let out = {
            flex: 1,
            height: 50,
            borderWidth: 2,
            borderColor: "#666",
            borderBottomLeftRadius: 25,
            borderTopLeftRadius: 25,
            color: "#fff",
            paddingHorizontal: 16,
            borderRightWidth: 0,
            backgroundColor: "#141823",
        }
        if (!messageText) {
            out.borderRadius = 25
            out.borderRightWidth = 2
            out.marginRight = 10
        }
        return out
    }

    return (
        <View style={styles.defaultBackground}>
            <View style={styles.topBarBox}>
                <View style={styles.topBarIcons}>
                    <Pressable
                        style={styles.topBarIconsBack}
                        android_ripple={{color: "#666", borderless: true}}
                        onPress={navigation.navigate.bind(this, "Home")}
                    >
                        <Image style={styles.topBarIconsBackIcon} source={require("../assets/angle-left.png")}/>
                    </Pressable>
                    <Pressable
                        style={styles.topBarIconsChat}
                        android_ripple={{color: "#666", borderless: true}}
                        onPress={navigation.navigate.bind(this, "ChatSettings", {
                            sock: sock,
                            chat: chat,
                            chatName: chatName,
                            username: username,
                        })}
                    >
                        <View style={chatIcon(color_id)}>
                            <Text style={chatIconText(color_id)}>{chatName[0].toUpperCase()}</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.topBarTitleBox}>
                    <Text style={styles.topBarTitleText}>
                        {chatName}
                    </Text>
                </View>
                <View style={styles.topBarActionIcons}>
                    <View style={styles.topBarActionIconsCall}>

                    </View>
                    <View style={styles.topBarActionIconsOther}>
                        <Image
                            style={styles.topBarActionIconsOtherIcon}
                            source={require("../assets/menu-dots-vertical.png")}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.messagesBox}>
                <FlatList
                    overScrollMode="always"
                    data={reversed_messages} // copy list without reference
                    inverted={true}
                    renderItem={(itemData) => {
                        return <MessageElement
                            isSender={itemData.item.sent_from === username}
                            isGroupChat={chat.user_names.length > 2}
                            lastMessage={reversed_messages[itemData.index + 1]}
                            thisMessage={reversed_messages[itemData.index]}
                            nextMessage={reversed_messages[itemData.index - 1]}
                            id={itemData.item.id}
                        />
                    }}/>
            </View>
            <View style={styles.keyboardBox}>
                <TextInput style={keyboardInput()}
                           placeholder="Enter Message"
                           placeholderTextColor="#666"
                           onChangeText={messageInputHandler}
                           value={messageText}
                />
                <Pressable
                    onPress={onSend}
                    style={({pressed}) => keyboardSendButton(pressed)}
                >
                    <Image source={
                        (messageText) ? require("../assets/paper-plane.png") : require("../assets/apps-add.png")}
                           style={styles.keyboardSendButtonIcon}
                    />
                </Pressable>
            </View>
        </View>
    )
}


export default ChatScreen


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        backgroundColor: "#0f111a",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarBox: {
        height: 80,
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#1f2021",
        // marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    topBarIcons: {
        flex: 1,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#fff",
    },
    topBarIconsBack: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarIconsBackIcon: {
        width: 20,
        height: 20,
    },
    topBarIconsChat: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarTitleBox: {
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarTitleText: {
        color: "#fff",
        fontSize: 32,
        marginLeft: 10,
    },
    topBarActionIcons: {
        flex: 1,
        flexDirection: "row",
        height: "100%",
    },
    topBarActionIconsCall: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarActionIconsOther: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    topBarActionIconsOtherIcon: {
        width: 20,
        height: 20,
    },
    messagesBox: {
        flex: 10,
        width: "100%",
    },
    keyboardBox: {
        flex: 1,
        width: "90%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    keyboardSendButtonIcon: {
        height: 20,
        width: 20,
    }
})