import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import dropLogo from "../assets/drop.png";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { useState } from "react";

import { createUser } from "../util/auth";

export default function Register() {
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    console.log(location);
    return location;
  }

  const {
    container,
    Input,
    RegisterButton,
    StandardText,
    RegisterText,
    ButtonText,
    Drop,
    PickerStyle,
    PickerItemStyle,
  } = styles;

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [locationPermission, setLocationPermission] = useState(false);
  const [source, setSource] = useState("");

  async function signupHandler() {
    setIsRegistering(true);
    const location = await getLocationHandler();
    const res = await createUser(
      username,
      email,
      password,
      location,
      role,
      source
    );
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
      case "role":
        setRole(enteredValue);
        break;
      case "source":
        setSource(enteredValue);
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
        <Text style={RegisterText}>Zarejestruj się</Text>
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "username")}
          style={[Input, StandardText]}
          placeholder="Nazwa użytkownika"
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "email")}
          style={[Input, StandardText]}
          placeholder="E-mail adres"
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "password")}
          style={[Input, StandardText]}
          placeholder="Hasło"
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "repeatPassword")}
          style={[Input, StandardText]}
          placeholder="Potwierdź hasło"
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={updateInputValueHandler.bind(this, "source")}
          style={[Input, StandardText]}
          placeholder="Źródło danych"
          secureTextEntry={true}
        />
        <Picker
          style={PickerStyle}
          selectedValue={role}
          onValueChange={updateInputValueHandler.bind(this, "role")}
        >
          <Picker.Item
            style={[PickerStyle, PickerItemStyle]}
            label="Klient"
            value="customer"
          />
          <Picker.Item
            style={[PickerStyle, PickerItemStyle]}
            label="Analityk"
            value="analyst"
          />
        </Picker>
        <TouchableOpacity
          disabled={locationPermission}
          style={RegisterButton}
          onPress={signupHandler}
        >
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
  PickerStyle: {
    width: "90%",
    height: 60,
    backgroundColor: "#CEE2FF",
    borderBottomWidth: 3,
    borderBottomColor: "#4399E9",
    marginBottom: 18,
  },
  PickerItemStyle: {
    backgroundColor: "#CEE2FF",
    marginBottom: 3,
    borderBottomWidth: 3,
    borderBottomColor: "#4399E9",
  },
});
