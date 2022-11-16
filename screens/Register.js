import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

import dropLogo from '../assets/drop.png';

import { useState } from "react";

import { createUser } from "../util/auth";

export default function Register() {
  const {
    container,
    Input,
    RegisterButton,
    StandardText,
    RegisterText,
    ButtonText,
    Drop,
  } = styles;

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  async function signupHandler() {
    setIsRegistering(true);
    const res = await createUser(username, email, password);
    setIsRegistering(false);
  }

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "username":
        setUsername(enteredValue);
        break;
      case "email":
        setEmail(enteredValue);
        break;
      case "password":
        setPassword(enteredValue);
        break;
      case "repeatPassword":
        setRepeatPassword(enteredValue);
        break;
    }
  }

  return (
    <>
      <View style={container}>
        <Image
          resizeMode={"cover"}
          style={Drop}
          source={dropLogo}
          width={71}
          height={98}
        />
        <Text style={RegisterText}>Register</Text>
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "username")}
          style={[Input, StandardText]}
          placeholder="Username"
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "email")}
          style={[Input, StandardText]}
          placeholder="E-mail address"
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "password")}
          style={[Input, StandardText]}
          placeholder="Password"
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "repeatPassword")}
          style={[Input, StandardText]}
          placeholder="Confirm password"
          secureTextEntry={true}
        />
        <TouchableOpacity style={RegisterButton} onPress={signupHandler}>
          <Text style={ButtonText}>{"Register"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Drop: {
    width: 71,
    height: 98,
    marginBottom: 13,
  },
  RegisterText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#4399E9",
    marginBottom: 33,
  },
  StandardText: {
    fontSize: 24,
  },
  EncouragingText: {
    fontSize: 24,
  },
  Input: {
    width: "90%",
    height: 60,
    backgroundColor: "#CEE2FF",
    borderBottomWidth: 3,
    borderBottomColor: "#4399E9",
    marginBottom: 18,
  },
  RegisterButton: {
    backgroundColor: "#4399E9",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginTop: 22,
  },
  ButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 24,
  },
});
