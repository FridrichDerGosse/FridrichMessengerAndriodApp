import {Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";

// local imports
import {SettingsElement, Separator} from "./settingsHelpers";


function SettingsMenu({navigation, route}) {
    let params = route.params

    console.log(params)

    let username = params.username

    return (
        <KeyboardAvoidingView style={styles.defaultBackground}>
            <Pressable style={styles.backBar} onPress={navigation.navigate.bind(this, "Home")}>
                <Image source={require("../assets/angle-left.png")} style={styles.backIcon}/>
                <Text style={styles.settingsText}>
                    Settings
                </Text>
            </Pressable>
            <View style={styles.topBar}>
                <View style={styles.topBarAccountIcon}>
                    <Text style={styles.topBarAccountIconText}>
                        {username[0].toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.topBarAccountText}>
                    {username}
                </Text>
            </View>
            <ScrollView style={styles.settings}>
                <SettingsElement
                    icon={require("../assets/exit.png")}
                    onPress={navigation.navigate.bind(this, "Login", {resetSock: true})}
                    text="Log out"
                />
                <SettingsElement
                    icon={require("../assets/user.png")}
                    onPress={() => {}}
                    text="Account"
                />
                <Separator/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


export default SettingsMenu


const styles = StyleSheet.create({
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
    defaultBackground: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#0f111a",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    topBarAccountIcon: {
        width: 70,
        height: 70,
        margin: 30,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2f477b",
    },
    topBarAccountIconText: {
        fontSize: 46,
        color: "#5b8bef",
        fontWeight: "bold",
    },
    topBarAccountText: {
        color: "#fff",
        fontSize: 42,
    },
    settings: {
        flex: 1,
        width: "100%",
        marginTop: 20,
    },
})