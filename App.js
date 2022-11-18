import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Home from "./screens/Home.js";
import UserProfile from "./screens/UserProfile.js";
import PHWater from "./screens/PHWater.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="PHWater" component={PHWater} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
