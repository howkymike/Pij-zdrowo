import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

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
  return (
    <>
      <View style={container}>
        <Image
          resizeMode={"cover"}
          style={Drop}
          source={require("C:\\Users\\Bartosz\\Documents\\Studia\\IoT\\Pij-zdrowo\\assets\\drop.png")}
          width={71}
          height={98}
        />
        <Text style={RegisterText}>Register</Text>
        <TextInput style={[Input, StandardText]} placeholder="Username" />
        <TextInput style={[Input, StandardText]} placeholder="E-mail address" />
        <TextInput
          style={[Input, StandardText]}
          placeholder="Password"
          secureTextEntry={true}
        />
        <TextInput
          style={[Input, StandardText]}
          placeholder="Confirm password"
          secureTextEntry={true}
        />
        <TouchableOpacity style={RegisterButton}>
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
