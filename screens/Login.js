import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Pressable,
    StatusBar, ScrollView,
} from "react-native";

import dropLogo from "../assets/drop.png";

import {useState, useContext} from "react";

import {loginUser} from "../util/auth";
import PHWater from "./PHWater";

import {AuthContext} from "../store/auth-context";
import FlashMessage from "react-native-flash-message";

export default function Login({navigation}) {
    const [isLogging, setIsLogging] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const authCtx = useContext(AuthContext);

    function pressHandler() {
        navigation.navigate("Register");
    }

    const {
        container,
        Input,
        LoginButton,
        InputLogin,
        StandardText,
        LoginText,
        InputPassword,
        ButtonText,
        RegisterButton,
        RegisterButtonText,
        Drop,
        buttonPress,
    } = styles;

    async function loginHandler() {
        setIsLogging(true);
        const token = await loginUser(email, password);
        if (token) authCtx.authenticate(token);
        setIsLogging(false);
        navigation.navigate("Home");
    }

    function WaterPH() {
        navigation.navigate("PHWater");
    }

    function updateInputValueHandler(inputType, enteredValue) {
        switch (inputType) {
            case "email":
                setEmail(enteredValue);
                break;
            case "password":
                setPassword(enteredValue);
                break;
        }
    }

    return (
        <ScrollView contentContainerStyle={container}>
            <Image
                resizeMode={"cover"}
                style={Drop}
                source={dropLogo}
                width={71}
                height={98}
            />
            <Text style={LoginText}>Login</Text>
            <Text style={[StandardText, {marginBottom: 39}]}>
                Sign in to your account
            </Text>
            <TextInput
                onChangeText={updateInputValueHandler.bind(this, "email")}
                style={[Input, InputLogin, StandardText]}
                placeholder="Email"
            />
            <TextInput
                onChangeText={updateInputValueHandler.bind(this, "password")}
                style={[Input, InputPassword, StandardText]}
                placeholder="Password"
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={loginHandler} style={LoginButton}>
                <Text style={ButtonText}>{"Login"}</Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
            <Text style={[StandardText, {fontSize: 20}]}>
                I forgot my password. Click here to reset.
            </Text>
            <Pressable
                style={({pressed}) => [RegisterButton, pressed ? buttonPress : null]}
                onPress={pressHandler}
            >
                <Text style={RegisterButtonText}>{"Register new account"}</Text>
            </Pressable>
            <FlashMessage position="bottom"/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonPress: {
        opacity: 0.3,
    },
    container: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    Drop: {
        width: 71,
        height: 98,
        marginBottom: 13,
    },
    LoginText: {
        fontSize: 40,
        fontWeight: "700",
        color: "#4399E9",
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
    },
    InputLogin: {
        marginBottom: 12,
    },
    InputPassword: {
        marginBottom: 45,
    },
    LoginButton: {
        backgroundColor: "#4399E9",
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
    },
    ButtonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 24,
    },
    RegisterButton: {
        marginTop: 54,
        marginBottom: 40,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#4399E9",
        backgroundColor: "#FFFFFF",
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
    },
    RegisterButtonText: {
        color: "black",
        fontWeight: "700",
        fontSize: 24,
        margin: 10,
    },
});
