import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Register from "./screens/Register.js";
import Information from "./screens/Information.js";
import Analitics from "./screens/Analitics.js"
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Information" component={Information} />
          <Stack.Screen name="Analitics" component={Analitics} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
