import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// local imports
import ChatSettingsScreen from "./components/ChatSettingsScreen";
import SettingsMenu from "./components/SettingsMenu";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import ChatScreen from "./components/ChatScreen";


const Stack = createNativeStackNavigator()


export default function App() {
    return (
        <>
            <StatusBar barStyle='light-content'/>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="SettingsMenu"
                        component={SettingsMenu}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={ChatScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="ChatSettings"
                        component={ChatSettingsScreen}
                        options={{headerShown: false}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}
