import {KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from "expo-crypto";

import {useState} from "react";
import {try_login, try_register, does_user_exist} from "./commFunctions"


const SERVER_IP = "ws://server.fridrich.xyz:3588"


let sock
try {
    sock = new WebSocket(SERVER_IP)
    console.log("sock success")
} catch {
    console.log("socket error")
}


// try to log in with saved username / password
let haveTried = false
const tryReadLoginData = async () => {
    try {
        const value = await AsyncStorage.getItem('@storage_Key')
        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (e) {
        console.log("error reading data: ", e)
    }
}
let readLoginDataResult = tryReadLoginData()


function LoginScreen({navigation, route}) {
    const [lastUsername, setLastUsername] = useState(null)
    const [lastHashedPassword, setLastHashedPassword] = useState(null)

    const [usernameText, setUsernameText] = useState("")
    const [passwordText, setPasswordText] = useState("")
    const [confirmPasswordText, setConfirmPasswordText] = useState("")
    const [emailText, setEmailText] = useState("")
    const [showRegisterEntries, setShowRegisterEntries] = useState(false)

    if (!haveTried) {
        readLoginDataResult.then((data) => {
            if (data) {
                setLastUsername(data.username)
                setLastHashedPassword(data.password)
            }
        })
        haveTried = true
    }
    if (route.params && route.params.resetSock) {
        try {
            // reset saved login data
            resetSavedLogin().then()

            sock = new WebSocket(SERVER_IP)
            console.log("sock success")
        } catch {
            console.log("socket error")
        }
    }

    if (lastUsername != null && lastHashedPassword != null) {
        try_login(sock, lastUsername, lastHashedPassword, (result) => {
            setConfirmPasswordText("")
            setUsernameText("")
            setPasswordText("")
            setEmailText("")
            onLoginResult(result).then()
        })
    }

    function usernameInputHandler(entered_text) {
        setUsernameText(entered_text)
    }

    function emailInputHandler(entered_text) {
        setEmailText(entered_text)
    }

    function passwordInputHandler(entered_text) {
        setPasswordText(entered_text)
    }

    function confirmPasswordInputHandler(entered_text) {
        setConfirmPasswordText(entered_text)
    }

    async function resetSavedLogin() {
        setLastUsername(null)
        setLastHashedPassword(null)
        await AsyncStorage.setItem('@storage_Key', JSON.stringify({
            username: null,
            password: null,
        }))
    }

    async function onLogin() {
        // hash password before sending
        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            passwordText
        );

        // check if type is login or register
        if (showRegisterEntries) {
            // check if password confirm is correct
            if (passwordText !== confirmPasswordText) {
                return
            }

            // register
            console.log("Register")
            console.log("Username: ", usernameText)
            console.log("HPassword: ", hashedPassword)
            try_register(sock, usernameText, hashedPassword, emailText, onRegisterResult)

        } else {
            // login
            console.log("Login")
            console.log("Username: ", usernameText)
            console.log("HPassword: ", hashedPassword)
            try_login(sock, usernameText, hashedPassword, onLoginResult)
        }
    }

    async function onLoginResult(result) {
        console.log("login result: ", result)
        if (!result.success) {
            // clear previous login data
            await resetSavedLogin()

            // if an expected error occurs, clear the corresponding entry
            switch (result.cause) {
                case "UserDoesntExist":
                    setUsernameText("");
                    break;
                case "UsernameTaken":
                    setUsernameText("");
                    break;
                case "WrongPassword":
                    setPasswordText("");
                    break;
            }

            // show a toast telling the user what went wrong
            ToastAndroid.show(result.cause, ToastAndroid.SHORT)
        } else {
            // write login data to file
            // only write if the used login data wasn't read from file
            let username
            if (!(lastUsername != null && lastHashedPassword != null)) {
                await AsyncStorage.setItem('@storage_Key', JSON.stringify({
                    username: usernameText,
                    password: await Crypto.digestStringAsync(
                        Crypto.CryptoDigestAlgorithm.SHA256,
                        passwordText
                    ),
                }))
                username = usernameText
            } else {
                username = lastUsername
            }

            does_user_exist(sock, username, (result) => {
                if (result.success) {
                    let data = result.data
                    console.log(data)
                    navigation.navigate("Home", {
                        user: data,
                        sock: sock,
                    })
                }
            })
        }
    }

    async function onRegisterResult(result) {
        console.log("register result: ", result)
        if (!result.success) {
            ToastAndroid.show(result.cause, ToastAndroid.SHORT)
        } else {
            // if succeeded, try to log in
            const hashedPassword = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                passwordText
            );

            try_login(sock, usernameText, hashedPassword, onLoginResult)
        }
    }

    function confirmPasswordStyle() {
        let out = {
            borderWidth: 2,
            borderColor: "#666",
            borderRadius: 16,
            color: "#fff",
            marginVertical: 15,
            paddingVertical: 8,
            paddingHorizontal: 16,
            width: "80%",
        }

        if (passwordText) {
            if (passwordText === confirmPasswordText) {
                out.borderColor = "green"
            } else {
                out.borderColor = "red"
            }
        }
        return out
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            enabled={Platform.OS === "ios"}
            style={styles.defaultBackground}
        >
            <View style={styles.login}>
                <View style={styles.loginTitle}>
                    <Text style={styles.loginTitleText}>{(showRegisterEntries) ? "Register" : "Login"}</Text>
                </View>
                <View style={styles.loginForm}>
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#666"
                        style={styles.loginFormTextInput}
                        value={usernameText}
                        onChangeText={usernameInputHandler}
                    />
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        style={styles.loginFormTextInput}
                        value={passwordText}
                        onChangeText={passwordInputHandler}
                    />
                    {showRegisterEntries && <TextInput
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        placeholderTextColor="#666"
                        style={confirmPasswordStyle()}
                        value={confirmPasswordText}
                        onChangeText={confirmPasswordInputHandler}
                    />
                    }
                    {showRegisterEntries && <TextInput
                        placeholder="Email (optional)"
                        placeholderTextColor="#666"
                        style={styles.loginFormTextInput}
                        value={emailText}
                        onChangeText={emailInputHandler}
                    />
                    }
                </View>
                <View style={styles.loginButtonBox}>
                    <Pressable
                        style={({pressed}) => pressed && styles.loginButtonPressed}
                        onPress={() => {
                            console.log("set")
                            setShowRegisterEntries(!showRegisterEntries)
                            console.log(showRegisterEntries)
                        }
                        }
                    >
                        <View style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>{(showRegisterEntries) ? "Login" : "Register"}</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => pressed && styles.loginButtonPressed}
                        onPress={onLogin}
                    >
                        <View style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>{(showRegisterEntries) ? "Confirm" : "Login"}</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}


export default LoginScreen


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        backgroundColor: "#0f111a",
        alignItems: "center",
        justifyContent: "center",
    },
    login: {
        width: "80%",
        backgroundColor: "#181b28",
        borderRadius: 50,
    },
    loginTitle: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#333",
    },
    loginTitleText: {
        color: "#fff",
        fontSize: 32,
        marginVertical: 20,
    },
    loginForm: {
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    loginFormTextInput: {
        borderWidth: 2,
        borderColor: "#666",
        borderRadius: 16,
        color: "#fff",
        marginVertical: 15,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: "80%",
    },
    loginButtonBox: {
        paddingVertical: 20,
        flexDirection: "row",
        borderTopWidth: 2,
        borderTopColor: "#333",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    loginButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1F6AA5",
        borderRadius: 16,
        padding: 10,
        width: 100,
    },
    loginButtonPressed: {
        opacity: .5,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});