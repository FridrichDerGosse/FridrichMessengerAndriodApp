import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from "react-native";
import {chatIcon, chatIconText, colorSchemes} from "./themes";

// local imports
import {SettingsElement, Separator} from "./settingsHelpers";
import {leave_chat} from "./commFunctions";


function MembersElement(props) {
    let isCreator = props.isCreator
    let user = props.user
    let id = props.id

    console.log(isCreator, user.username)
    return (
        <View style={membersStyles.outerBox}>
            {(isCreator) ? (
                <Text style={membersStyles.usernameText}>
                    You
                </Text>
            ) : (
                <>
                    <View style={chatIcon(id)}>
                        <Text style={chatIconText(id)}>
                            {user[0].toUpperCase()}
                        </Text>
                    </View>
                    <Text style={membersStyles.usernameText}>
                        {user}
                    </Text>
                </>
            )}
        </View>
    )
}


const membersStyles = StyleSheet.create({
    outerBox: {
        padding: 10,
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: "#666",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    usernameText: {
        flex: 1,
        marginLeft: 15,
        marginVertical: 10,
        color: "#fff",
        fontSize: 24,
    },

})


function ChatSettingsScreen({navigation, route}) {
    let thisUser = route.params.username
    let name = route.params.chatName
    let chat = route.params.chat
    let sock = route.params.sock

    // logic functions
    function onLeaveChat() {
        leave_chat(sock, chat.id, onLeaveChatResult)
    }

    async function onLeaveChatResult(result) {
        console.log("leave chat: ", result)
        if (!result.success) {
            ToastAndroid.show(result.cause, ToastAndroid.SHORT)
            return
        }
        navigation.navigate("Home")
    }

    // style functions
    function icon() {
        let colors = colorSchemes[chat.id - 1 % colorSchemes.length]
        return {
            width: 70,
            height: 70,
            margin: 30,
            borderRadius: 35,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background,
        }
    }

    function iconText() {
        let colors = colorSchemes[chat.id - 1 % colorSchemes.length]
        return {
            fontSize: 46,
            color: colors.foreground,
            fontWeight: "bold",
        }
    }

    return (
        <KeyboardAvoidingView style={styles.defaultBackground}>
            <Pressable style={styles.backBar} onPress={navigation.goBack.bind(this)}>
                <Image source={require("../assets/angle-left.png")} style={styles.backIcon}/>
                <Text style={styles.settingsText}>
                    Settings
                </Text>
            </Pressable>
            <View style={styles.topBar}>
                <View style={icon(chat.id)}>
                    <Text style={iconText(chat.id)}>
                        {name[0].toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.topBarAccountText}>
                    {name}
                </Text>
            </View>
            <View style={styles.settings}>
                <SettingsElement
                    icon={require("../assets/exit.png")}
                    onPress={onLeaveChat}
                    text="Leave"
                />
                <Separator/>
            </View>
            <FlatList
                style={styles.addedUsersBox}
                data={chat.user_names}
                renderItem={(itemData) => {
                    return <MembersElement
                        isCreator={itemData.item === thisUser}
                        user={itemData.item}
                        id={chat.user_ids[itemData.index]}
                    />
                }}
            />
        </KeyboardAvoidingView>
    )
}


export default ChatSettingsScreen


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#0f111a",
    },
    backIcon: {
        marginLeft: 20,
        width: 32.34320,
        height: 32.34320,
    },
    settingsText: {
        marginLeft: 30,
        color: "#fff",
        fontSize: 32,
        fontWeight: "200",
    },
    backBar: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    topBarAccountText: {
        color: "#fff",
        fontSize: 42,
    },
    settings: {
        width: "100%",
        marginTop: 20,
    },
    addedUsersBox: {
        flex: 1,
        margin: 40,
        width: "80%",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#666",
    },
})