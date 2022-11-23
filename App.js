import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Home from "./screens/Home.js";
import UserProfile from "./screens/UserProfile.js";
import PHWater from "./screens/PHWater.js";



const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login" drawerPosition="right">
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="PHWater" component={PHWater} />
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="UserProfile" component={UserProfile} />
        <Drawer.Screen name="Register" component={Register} />
      </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
