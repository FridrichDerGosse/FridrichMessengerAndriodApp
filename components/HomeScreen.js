import {
    FlatList, Image,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View,
    Modal,
} from "react-native";

// local imports
import {get_chats, get_messages} from "./commFunctions";
import {useEffect, useState} from "react";
import {extractTextMessage} from "./tools"
import ChatElement from "./ChatElement";
import AddChatPopup from "./AddChatPopup";


let sock
let user
let username


function HomeScreen({navigation, route}) {
    let params = route.params

    // only set if there are actually values stored
    if (params) {
        if (params.sock) {
            sock = params.sock
        }
        if (params.user) {
            user = params.user
            username = user.username
        }
    }

    let [messagesPerChat, setMessagesPerChat] = useState({})
    let [chats, setChats] = useState([])
    let [showAddChat, setShowAddChat] = useState(false)


    // look for new messages every 1s
    useEffect(() => {
        const interval = setInterval(() => {
            get_chats(sock, handleChatReceive)
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // logic functions
    function handleChatReceive(data) {
        let new_chats = data.data

        if (!new_chats) {
            return
        }

        setChats(new_chats)

        function handleMessagesReceive(data) {
            let messages = data.data

            // if either the chats or messages variable is empty
            if (!new_chats || !messages) {
                return
            }

            // in case a new chat appeared, create a space for it
            let newMessagesPerChat = messagesPerChat
            new_chats.forEach((chat) => {
                if (!newMessagesPerChat[chat.id]) {
                    newMessagesPerChat[chat.id] = []
                }
            })

            // clear all chats that are being updated and then append messages
            messages.forEach((message) => {
                newMessagesPerChat[message.chat_id] = []
            })
            messages.forEach((message) => {
                if (!(message.id in newMessagesPerChat[message.chat_id].map(({id}) => id))) {
                    newMessagesPerChat[message.chat_id].push(message)
                }
            })
            setMessagesPerChat(newMessagesPerChat)
        }

        new_chats.forEach((chat) => {
            get_messages(sock, chat.id, handleMessagesReceive)
        })
    }

    function getChatById(chat_id) {
        let out = {}
        chats.forEach((item) => {
            if (item.id === chat_id) {
                out = item
            }
        })
        return out
    }

    function getMessages(chat_id) {
        return JSON.parse(JSON.stringify(messagesPerChat[chat_id]))
    }

    function openChat(chat_id) {
        navigation.navigate("Chat", {
            messages: messagesPerChat[chat_id],
            chatName: getChatName(chat_id),
            chat: getChatById(chat_id),
            getMessages: getMessages,
            username: username,
            chat_id: chat_id,
            sock: sock,
        })
    }

    function getChatName(chat_id) {
        let chat = getChatById(chat_id)

        // in case of a fail, retry
        if (!chat) {
            chat = getChatById(chat_id)
        }

        try {
            if (chat.user_names.length <= 2) {
                name = chat.user_names.filter((item) => item !== username)[0]
            } else {
                name = chat.name
            }
            return name
        } catch {
            return "nAn"
        }
    }

    // style functions
    function addChatButton(add_opacity) {
        let out = {
            width: 70,
            height: 70,
            borderRadius: 35,
            marginRight: 20,
            marginBottom: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#1F6AA5",
        }
        if (add_opacity) {
            out.opacity = .5
        }
        return out
    }

    return (
        <>
            <Modal visible={showAddChat} animationType="slide">
                <AddChatPopup
                    sock={sock}
                    user={user}
                    closeFunc={setShowAddChat.bind(this, false)}
                />
            </Modal>

            <KeyboardAvoidingView style={styles.defaultBackground}>
                <View style={styles.homeTopBar}>
                    <View style={styles.homeTopBarAccountIconBox}>
                        <Pressable
                            onPress={navigation.navigate.bind(this, "SettingsMenu", {
                                username: username,
                                sock: sock,
                            })}
                            style={styles.homeTopBarAccountIcon}
                        >
                            <Text style={styles.homeTopBarAccountIconText}>
                                {username && username[0].toUpperCase()}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={styles.homeTopBarAppNameBox}>
                        <Text style={styles.homeTopBarAppNameText}>Fridrich Messenger</Text>
                    </View>
                </View>
                <View style={styles.homeChatsBox}>
                    <FlatList data={chats} renderItem={(itemData) => {
                        return <ChatElement
                            messages={extractTextMessage(messagesPerChat[itemData.item.id])}
                            name={getChatName(itemData.item.id)}
                            id={itemData.item.id}
                            n={itemData.index}
                            onPress={openChat}
                        />
                    }}/>
                    <View style={styles.addChatButtonHolderBox}>
                        <Pressable
                            onPress={() => setShowAddChat(true)}
                            style={({pressed}) => addChatButton(pressed)}
                        >
                            <Image source={require("../assets/user-add.png")} style={styles.addChatButtonIcon}/>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}


export default HomeScreen


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        backgroundColor: "#0f111a",
        alignItems: "center",
        justifyContent: "center",
    },
    homeTopBar: {
        height: 70,
        flexDirection: "row",
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    homeTopBarAccountIconBox: {
        width: "26%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    homeTopBarAccountIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#2f477b",
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    homeTopBarAccountIconText: {
        color: "#5b8bef",
        fontWeight: "bold",
        fontSize: 16,
    },
    homeTopBarAppNameBox: {
        flex: 5,
        alignItems: "flex-start",
        justifyContent: "flex-end",
    },
    homeTopBarAppNameText: {
        color: "#fff",
        marginBottom: 20,
        marginLeft: 0,
        fontWeight: "500",
        fontSize: 20,
    },
    homeChatsBox: {
        flex: 7,
        width: "100%",
        marginTop: 10,
    },
    addChatButtonHolderBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    addChatButtonIcon: {
        height: 35,
        width: 35,
    },
})
