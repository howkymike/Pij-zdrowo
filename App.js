import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function App() {
  const { container, Input, LoginButton, InputLogin, StandardText, LoginText, InputPassword, ButtonText, RegisterButton, RegisterButtonText, Drop } = styles
  return (
    <View style={container}>
      <Image resizeMode={'cover'} style={Drop} source={require("C:\\Users\\username\\Documents\\water app\\Frontend\\assets\\drop.png")} width={71} height={98} />
      <Text style={LoginText}>Login</Text>
      <Text style={[StandardText, { marginBottom: 39 }]}>Sign in to your account</Text>
      <TextInput style={[Input, InputLogin, StandardText]} placeholder='Username' />
      <TextInput style={[Input, InputPassword, StandardText]} placeholder='Password' secureTextEntry={true} />
      <TouchableOpacity style={LoginButton}>
        <Text style={ButtonText}>{'Login'}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
      <Text style={[StandardText, { fontSize: 20 }]}>I forgot my password. Click here to reset.</Text>
      <TouchableOpacity style={RegisterButton}>
        <Text style={RegisterButtonText}>{'Register new account'}</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Drop: {
    width: 71,
    height: 98,
    marginBottom: 13
  },
  LoginText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#4399E9',
  },
  StandardText: {
    fontSize: 24
  },
  EncouragingText: {
    fontSize: 24,
  },
  Input: {
    width: '90%',
    height: 60,
    backgroundColor: '#CEE2FF',
    borderBottomWidth: 3,
    borderBottomColor: '#4399E9',
  },
  InputLogin: {
    marginBottom: 12
  },
  InputPassword: {
    marginBottom: 45
  },
  LoginButton: {
    backgroundColor: '#4399E9',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%'
  },
  ButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
  },
  RegisterButton: {
    marginTop: 74,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#4399E9",
    backgroundColor: '#FFFFFF',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%'
  },
  RegisterButtonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 24,
  }
});
