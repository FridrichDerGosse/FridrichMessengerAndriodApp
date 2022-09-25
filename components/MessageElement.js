import {Pressable, StyleSheet, Text, View} from "react-native";
import {toDateTime} from "./tools";


const groupTimeout = 180  // when the last message was too long ago, show time and sender again (in seconds)


function MessageElement(props) {
    // "re-assign" props because there will be errors otherwise
    let lastMessage = props.lastMessage
    let thisMessage = props.thisMessage
    let nextMessage = props.nextMessage
    let directionStyles = props.isSender ? rightStyles : leftStyles
    let onPress = props.onPress

    let timeSent = toDateTime(thisMessage.time_sent)

    // define message behaviour
    let followsSameName = lastMessage
        && (lastMessage.sent_from === thisMessage.sent_from)
        && (thisMessage.time_sent - lastMessage.time_sent < groupTimeout)

    let followedBySameName = nextMessage
        && (nextMessage.sent_from === thisMessage.sent_from)
        && (nextMessage.time_sent - thisMessage.time_sent < groupTimeout)

    function messageBoxStyle(isPressed) {
        // takes the defined message behaviour and converts it to the actual message style
        let out = {
            marginVertical: 8,
            backgroundColor: isPressed ? "#666" : "#181b28",
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 30,
            maxWidth: "80%",
        }
        if (props.isSender) {
            out.alignItems = "flex-end"
            // check if last message was sent by the same person
            if (followsSameName) {
                out.borderTopRightRadius = 10
                out.marginTop = 2
            }
            if (followedBySameName) {
                out.borderBottomRightRadius = 10
                out.marginBottom = 2
            }
        } else {
            out.alignItems = "flex-start"
            // check if last message was sent by the same person
            if (followsSameName) {
                out.borderTopLeftRadius = 10
                out.marginTop = 2
            }
            if (followedBySameName) {
                out.borderBottomLeftRadius = 10
                out.marginBottom = 2
            }
        }
        return out
    }

    return (
        <View style={directionStyles.box}>
            <Pressable
                style={({pressed}) => messageBoxStyle(pressed)}
                onPress={onPress.bind(this, thisMessage)}
                // style={({pressed}) => messageBoxStyle(pressed)}
            >
                <View>
                    <Text style={defaultStyles.messageText}>
                        {thisMessage.content}
                    </Text>
                    {(!followedBySameName) && <View style={defaultStyles.bottomBox}>
                        <Text style={defaultStyles.timeText}>
                            {timeSent.toLocaleTimeString().slice(0, 5)}
                        </Text>
                        {(!props.isSender && props.isGroupChat) &&
                            <Text style={defaultStyles.nameText}>{thisMessage.sent_from}</Text>
                        }
                    </View>}
                </View>
            </Pressable>
        </View>
    )
}


export default MessageElement


const defaultStyles = StyleSheet.create({
    messageText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "300",
    },
    timeText: {
        color: "#a4a4a4",
        fontSize: 12,
        fontWeight: "200",
    },
    nameText: {
        color: "#a4a4a4",
        fontSize: 12,
        fontWeight: "200",
        marginLeft: 10,
    },
    bottomBox: {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
    },
})


const rightStyles = StyleSheet.create({
    box: {
        width: "100%",
        paddingHorizontal: 20,
        alignItems: "flex-end",
    },
})


const leftStyles = StyleSheet.create({
    box: {
        width: "100%",
        paddingHorizontal: 20,
        alignItems: "flex-start",
    },
})
