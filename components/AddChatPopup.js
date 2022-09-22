import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Pressable, FlatList, ToastAndroid} from "react-native";
import {useState} from "react";

// local imports
import {does_user_exist, create_chat} from "./commFunctions";
import {chatIcon, chatIconText} from "./themes";


function UserAddElement(props) {
    // console.log(props.data)
    let pending = props.data.pending
    let isValid = props.data.isValid
    let onRemove = props.onRemove

    // style functions
    function pendingInvalidValidText() {
        let out = {
            fontSize: 14,
            fontWeight: "200",
        }
        if (pending) {
            out.color = "yellow"
        } else if (isValid) {
            out.color = "green"
        } else {
            out.color = "red"
        }
        return out
    }

    function addedUserRemoveButtonBox(add_opacity) {
        let out = {
            flex: 1,
            padding: 5,
            alignItems: "flex-end",
            marginRight: 15,
        }
        if (add_opacity) {
            out.opacity = .5
        }
        return out
    }

    return (
        <View style={userAddStyles.outerBox}>
            <Text style={userAddStyles.usernameText}>
                {props.data.username}
            </Text>
            <View style={userAddStyles.statusBox}>
                <Text style={pendingInvalidValidText()}>
                    {(pending) ? "Pending" : ((isValid) ? "Available" : "Invalid")}
                </Text>
            </View>
            <Pressable
                onPress={onRemove.bind(this, props.data.username)}
                style={({pressed}) => addedUserRemoveButtonBox(pressed)}
            >
                <Text style={userAddStyles.addedUserRemoveButtonText}>
                    Remove
                </Text>
            </Pressable>
        </View>
    )
}


function MembersElement(props) {
    let isCreator = props.isCreator
    let user = props.user

    console.log(isCreator, user.username)
    return (
        <View style={membersStyles.outerBox}>
            {(isCreator) ? (
                <Text style={membersStyles.usernameText}>
                    You
                </Text>
            ) : (
                <>
                    <View style={chatIcon(user.id)}>
                        <Text style={chatIconText(user.id)}>
                            {user.username[0].toUpperCase()}
                        </Text>
                    </View>
                    <Text style={membersStyles.usernameText}>
                        {user.username}
                    </Text>
                </>
            )}
        </View>
    )
}


function AddChatPopup(props) {
    let closeFunc = props.closeFunc
    let sock = props.sock
    let user = props.user
    console.log(user, !user && props)

    // logic functions
    let [currentScreen, setCurrentScreen] = useState(0)
    let [usernameText, setUsernameText] = useState("")
    let [addedUsers, setAddedUsers] = useState([])
    let [chatName, setChatName] = useState("")


    function handleUsernameEdit(value) {
        setUsernameText(value)
    }

    function handleChatNameEdit(value) {
        setChatName(value)
    }

    function onAddUser() {
        // only add user if there is actual text in the entry
        if (usernameText) {
            console.log("added user")
            addedUsers.push({
                username: usernameText,
                isValid: false,
                pending: true,
            })
            // request user lookup
            does_user_exist(sock, usernameText, OnReceiveUserLookup)

            // reset entry
            setUsernameText("")
        }
        console.log("addUserDone")
    }

    function onRemoveUser(name) {
        let username = name

        // remove user with name {username}
        setAddedUsers(addedUsers.filter((user) => user.username !== username))
    }

    function OnReceiveUserLookup(result) {
        let data = result.data
        console.log("user lookup: ", data)

        if (result.success) {
            for (let i in addedUsers) {
                console.log(data)
                console.log(addedUsers[i])
                if (addedUsers[i].username === data.requested_user) {
                    addedUsers[i].pending = false
                    addedUsers[i].isValid = data.exists
                    addedUsers[i].user = (data.exists) ? data : addedUsers[i]
                    addedUsers[i].id = data.id
                    return
                }
            }
        } else {
            ToastAndroid.show(data.cause, ToastAndroid.SHORT)
        }
    }

    function getIdList(wholeUers) {
        // get a filtered version of added user - only available users + You
        // only users that exist and only usernames
        let out = addedUsers.filter((item) => item.isValid)

        // if logged in user isn't added yet, add
        if (!(out.map(({username}) => username).includes(user.username))) {
            out.push(user)
        }

        // still make it possible to get only the usernames
        if (wholeUers) {
            return out
        }

        // filter IDs
        let ids_out = out.map(({id}) => id)

        console.log("ids: ", ids_out, "users: ", out)

        return ids_out
    }

    function onCreateChat() {
        if (chatName) {
            create_chat(sock, chatName, getIdList(), onReceiveCreateChatResult)
        } else {
            ToastAndroid.show("Please enter a chat name", ToastAndroid.SHORT)
        }
    }

    function onReceiveCreateChatResult(result) {
        if (result.success) {
            closeFunc()
        } else {
            ToastAndroid.show(result.cause, ToastAndroid.SHORT)
            console.log(result.cause, "\n", result.details)
        }
    }

    // style functions
    function addUsersButton(add_opacity) {
        let out = {
            width: 50,
            height: 50,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#1F6AA5",
            borderRadius: 25,
        }
        if (add_opacity) {
            out.opacity = .5
        }
        return out
    }

    function nextButton(add_opacity) {
        let out = {
            width: "80%",
            height: 50,
            borderRadius: 25,
            marginBottom: 25,
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

    function button(add_opacity) {
        let out = nextButton(add_opacity)

        // modify content
        delete out["width"]
        out.flex = 1

        return out
    }

    function leftButton(add_opacity) {
        let out = button(add_opacity)
        out.marginRight = 10
        return out
    }

    function rightButton(add_opacity) {
        let out = button(add_opacity)
        out.marginLeft = 10
        return out
    }

    return (
        <KeyboardAvoidingView style={styles.defaultBackground}>
            {(currentScreen === 0) ? (
                <>
                    <View style={styles.addUserBox}>
                        <Text style={styles.addUsersText}>
                            Add Users To {"Chat"}
                        </Text>
                        <View style={styles.addUsersTextInputButtonHolderBox}>
                            <TextInput
                                value={usernameText}
                                placeholder="Username"
                                placeholderTextColor="#666"
                                style={styles.addUsersTextInput}
                                onChangeText={handleUsernameEdit}
                            />
                            <Pressable
                                onPress={onAddUser}
                                style={({pressed}) => addUsersButton(pressed)}
                            >
                                <Text style={{color: "#fff"}}>
                                    Add
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <FlatList
                        style={styles.addedUsersBox}
                        data={addedUsers}
                        renderItem={(itemData) => {
                            return <UserAddElement
                                data={itemData.item}
                                onRemove={onRemoveUser}
                            />
                        }}
                    />
                    <View style={styles.buttonsBox}>
                        <Pressable
                            onPress={closeFunc}
                            style={({pressed}) => leftButton(pressed)}
                        >
                            <Text style={{color: "#fff"}}>
                                Cancel
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={setCurrentScreen.bind(this, 1)}
                            style={({pressed}) => rightButton(pressed)}
                        >
                            <Text style={styles.nextButtonText}>
                                Next
                            </Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.nameChatIconInputBox}>
                        <View style={styles.nameChatIcon}>
                            <Text style={styles.nameChatIconText}>
                                {chatName && chatName[0].toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.chatNameInputBox}>
                            <Text style={styles.chatNameText}>
                                {chatName && "Chat Name"}
                            </Text>
                            <TextInput
                                value={chatName}
                                onChangeText={handleChatNameEdit}
                                placeholder="Chat Name"
                                placeholderTextColor="#666"
                                style={styles.chatNameTextInput}
                            />
                        </View>
                    </View>
                    <View style={styles.addedUsers}>
                        <Text style={styles.addedUsersText}>
                            Members
                        </Text>
                        <FlatList
                            style={styles.addedUsersBox2}
                            data={getIdList(true)}
                            renderItem={(itemData) => {
                                return <MembersElement
                                    isCreator={itemData.item.username === user.username}
                                    user={itemData.item}
                                />
                            }}
                        />
                    </View>
                    <View style={styles.buttonsBox}>
                        <Pressable
                            onPress={setCurrentScreen.bind(this, 0)}
                            style={({pressed}) => leftButton(pressed)}
                        >
                            <Text style={{color: "#fff"}}>
                                Back
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={onCreateChat}
                            style={({pressed}) => rightButton(pressed)}
                        >
                            <Text style={{color: "#fff"}}>
                                Create
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}

        </KeyboardAvoidingView>
    )
}


export default AddChatPopup


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


const styles = StyleSheet.create({
    defaultBackground: {
        flex: 1,
        backgroundColor: "#0f111a",
        alignItems: "center",
        justifyContent: "center",
    },
    addUserBox: {
        width: "100%",
        alignItems: "center",
    },
    addUsersText: {
        marginTop: 20,
        height: 70,
        color: "#fff",
        fontSize: 24,
    },
    addUsersTextInputButtonHolderBox: {
        flex: 1,
        width: "80%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    addUsersTextInput: {
        flex: 1,
        height: 50,
        borderWidth: 2,
        borderColor: "#666",
        borderRadius: 25,
        color: "#fff",
        paddingHorizontal: 16,
        backgroundColor: "#141823",
        marginRight: 10,
    },
    addedUsersBox: {
        flex: 1,
        margin: 40,
        width: "80%",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#666",
    },
    addedUsersBox2: {
        flex: 1,
        margin: 40,
        marginTop: 0,
        width: "80%",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#666",
    },
    nextButtonBox: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    nextButtonText: {
        color: "#fff",
    },
    nameChatIconInputBox: {
        height: 130,
        alignItems: "flex-start",
        flexDirection: "row",
        // borderBottomWidth: 2,
        justifyContent: "center",
        // borderBottomColor: "#666",
    },
    nameChatIcon: {
        width: 50,
        height: 50,
        marginTop: 40,
        borderRadius: 25,
        alignItems: "center",
        marginHorizontal: 25,
        justifyContent: "center",
        backgroundColor: "#2f477b",
    },
    nameChatIconText: {
        color: "#5b8bef",
        fontWeight: "bold",
        fontSize: 16,
    },
    chatNameTextInput: {
        height: 50,
        color: "#fff",
        borderWidth: 2,
        marginRight: 25,
        borderRadius: 16,
        marginBottom: 15,
        paddingVertical: 8,
        borderColor: "#666",
        paddingHorizontal: 16,
    },
    chatNameText: {
        color: "#666",
        height: 40,
        paddingTop: 15,
        marginLeft: 15,
    },
    chatNameInputBox: {
        flex: 1,
    },
    addedUsers: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    addedUsersText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
    },
    buttonsBox: {
        width: "80%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
})


const userAddStyles = StyleSheet.create({
    outerBox: {
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: "#666",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    usernameText: {
        flex: 1,
        marginLeft: 15,
        marginVertical: 10,
        color: "#fff",
        fontSize: 16,
    },
    statusBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    addedUserRemoveButtonText: {
        color: "#fff",
        fontWeight: "100",
        fontSize: 16,
    },
})