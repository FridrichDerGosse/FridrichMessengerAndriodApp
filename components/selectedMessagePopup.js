import {Pressable, StyleSheet, Text, View} from "react-native";
import * as Clipboard from 'expo-clipboard';
import {useState} from "react";

// local imports
import MessageElement from "./MessageElement";


function OptionsElement(props) {
    let [isPressed, setIsPressed] = useState(false)

    // style functions
    function textStyle() {
        return {
            color: isPressed ? "#666" : "#fff",
            fontSize: 28,
            fontWeight: "300",
        }

    }
    return (
        <Pressable
            onPress={props.onPress}
            style={({pressed}) => {
                setIsPressed(pressed)
                return styles.settingsElement
            }}
        >
            <Text style={textStyle()}>
                {props.setting}
            </Text>
        </Pressable>
    )
}


function Separator() {
    return (<View style={{width: "100%", alignItems: "center"}}>
            <View style={{
                width: "90%",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(79,79,79,0.5)",
            }}/>
        </View>
    )
}


export default function SelectedMessagePopup(props) {
    // "re-assign" props because there will be errors otherwise
    let thisMessage = props.thisMessage
    let goBack = props.onExit

    // logic functions
    function copyToClipboard() {
        Clipboard.setStringAsync('hello world').then(
            goBack()
        )
    }

    function reply() {
        goBack()
    }

    return (
        <View style={styles.defaultBackground}>
            <View style={styles.messagePresenterBox}>
                <MessageElement
                    isGroupChat={props.isGroupChat}
                    isSender={props.isSender}
                    lastMessage={null}
                    thisMessage={thisMessage}
                    nextMessage={null}
                    onPress={() => {}}
                />
            </View>
            <View style={styles.optionsBox}>
                <OptionsElement setting={"Copy text"} onPress={copyToClipboard}/>
                <Separator/>
                <OptionsElement setting={"Reply"} onPress={reply}/>
                <Separator/>
                <OptionsElement setting={"Back"} onPress={goBack}/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        backgroundColor: "rgba(15, 17, 26, .8)",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    messagePresenterBox: {
        backgroundColor: "#0f111a",
        paddingVertical: 20,
        width: "100%",
    },
    optionsBox: {
        margin: 20,
        width: "80%",
        borderRadius: 50,
        backgroundColor: "#181b28",
    },
    settingsElement: {
        width: "100%",
        marginLeft: 40,
        marginVertical: 20,
    }
})
