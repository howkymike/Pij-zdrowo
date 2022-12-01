import {useContext} from "react";
import {StatusBar} from "expo-status-bar";
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from "@react-navigation/drawer";
import {SafeAreaView, View, Text} from "react-native";


import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Home from "./screens/Home.js";
import UserProfile from "./screens/UserProfile.js";
import PHWater from "./screens/PHWater.js";
import Statistics from "./screens/Statistics";
import AuthContextProvider, {AuthContext} from "./store/auth-context.js";
import URLContextProvider from "./store/url-context.js";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const authCtx = useContext(AuthContext);
    return (
        
        <SafeAreaView style={{flex: 1}} forceInset={{top: "always", horizontal: "never"}}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View>
                <DrawerItem label={() => <Text style={{ color: 'white' }}>Logout</Text>}
                            style={{ backgroundColor: "cornflowerblue"}}
                            onPress={() => alert('Logged out!') }
                />
            </View>
        </SafeAreaView>
    );
}

export default function App() {
    return (
        <>
            <StatusBar/>
            <URLContextProvider>
                <AuthContextProvider>
                    <Navigation/>
                </AuthContextProvider>
            </URLContextProvider>
        </>
    );
}

function AuthStack() {
    return (
        <Drawer.Navigator initialRouteName="Login" drawerPosition="right">
            <Drawer.Screen name="Login" component={Login}/>
            <Drawer.Screen name="Register" component={Register}/>
        </Drawer.Navigator>
    );
}

function AuthenticatedStack() {
    return (
        <Drawer.Navigator initialRouteName="Login" drawerPosition="right" drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={Home}/>
            <Drawer.Screen name="PHWater" component={PHWater}/>
            <Drawer.Screen name="UserProfile" component={UserProfile}/>
            <Drawer.Screen name="Statistics" component={Statistics}/>
            
        </Drawer.Navigator>
    );
}

function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
        <NavigationContainer>
            {!authCtx.isAuthenticated && <AuthStack/>}
            {authCtx.isAuthenticated && <AuthenticatedStack/>}
        </NavigationContainer>
    );
}
