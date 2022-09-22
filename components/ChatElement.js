import {Pressable, StyleSheet, Text, View} from "react-native";
import {colorSchemes, chatIconText, chatIcon} from "./themes";


function ChatElement(props) {
    let messages = props.messages

    if (!messages) {
        messages = []
    }
    let color_id = props.id - 1 % colorSchemes.length
    let firstMessage = messages[messages.length - 1]

    return (
        <Pressable
            onPress={props.onPress.bind(this, props.id)}
            android_ripple={{
                color: "#000",
                borderless: false,
            }}
        >
            <View style={styles.chatElementBox}>
                <View style={styles.chatIconBox}>
                    <View style={chatIcon(color_id)}>
                        <Text style={chatIconText(color_id)}>{props.name[0].toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.chatTitleBox}>
                    <Text style={styles.chatTitleText}>{props.name}</Text>
                    <Text style={styles.chatLastMessage}>{firstMessage}</Text>
                </View>
            </View>
        </Pressable>
    )
}


export default ChatElement


const styles = StyleSheet.create({
    chatElementBox: {
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
        height: 60,
        flexDirection: "row",
    },
    chatTitleText: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 24,
        fontWeight: "400",
    },
    chatIconBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        height: "100%",
    },
    chatTitleBox: {
        flex: 5,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    chatLastMessage: {
        color: "#bbb",
        fontSize: 16,
        marginLeft: 24,
        fontWeight: "300",
    }
})