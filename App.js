import { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Home from "./screens/Home.js";
import UserProfile from "./screens/UserProfile.js";
import Logout from "./screens/Logout.js";
import Statistics from "./screens/Statistics";
import AuthContextProvider, { AuthContext } from "./store/auth-context.js";
import URLContextProvider from "./store/url-context.js";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <StatusBar />
      <URLContextProvider>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </URLContextProvider>
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
    <Drawer.Navigator initialRouteName="Login" drawerPosition="right">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profil użytkownika" component={UserProfile} />
      <Drawer.Screen name="Statystyki" component={Statistics} />
      <Drawer.Screen name="Wyloguj" component={Logout} />
    </Drawer.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}
