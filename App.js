import { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { SafeAreaView, View, Text } from "react-native";

import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Information from "./screens/Information.js";
import Analitics from "./screens/Analitics.js";
import Statistics from "./screens/Statistics";
import AuthContextProvider, { AuthContext } from "./store/auth-context.js";
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const authCtx = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <DrawerItem
          label={() => <Text style={{ color: "white" }}>Wyloguj się</Text>}
          style={{ backgroundColor: "cornflowerblue" }}
          onPress={() => authCtx.logout(props.navigation)}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <>
      <StatusBar />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}

function AuthStack() {
  return (
    <Drawer.Navigator initialRouteName="Login" drawerPosition="right">
      <Drawer.Screen name="Zaloguj się" component={Login} />
      <Drawer.Screen name="Zarejestruj się" component={Register} />
    </Drawer.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Login"
      drawerPosition="right"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Statystyki" component={Statistics} />
      <Drawer.Screen name="Information" component={Information} />
      <Drawer.Screen name="Analitics" component={Analitics} />
    </Drawer.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
      {}
    </NavigationContainer>
  );
}
