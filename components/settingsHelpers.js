import {Image, Platform, Pressable, StyleSheet, Text, View} from "react-native";


export function SettingsElement(props) {
    function box(add_opacity) {
        let out = {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }

        if (add_opacity && Platform.OS === "ios") {
            out.backgroundColor = "#333"
        }

        return out
    }

    return (
        <Pressable
            android_ripple={{color: "#333"}}
            onPress={props.onPress}
            style={({pressed}) => box(pressed)}
        >
            <Image source={props.icon} style={elementStyles.icon}/>
            <Text style={elementStyles.text}>
                {props.text}
            </Text>
        </Pressable>
    )
}


const elementStyles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
        margin: 20,
    },
    text: {
        flex: 1,
        fontSize: 28,
        color: "#fff",
        fontWeight: "200",
    }
})


export function Separator(props) {
    let width = (props.width) ? props.width : 2

    return (
        <View
            style={{
                width: "100%",
                borderBottomWidth: width,
                borderBottomColor: "#666",
            }}
        />
    )
}
