import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  StatusBar,
} from "react-native";
import * as React from 'react';
import axios from "axios";
import { AuthContext } from "../store/auth-context.js";
import { UrlContext } from "../store/url-context.js";

export default function Information({ navigation }) {
  const [PH, setPH] = React.useState(0);
  const [TDS, setTDS] = React.useState(0);
  const [ID, setID] = React.useState("");
  const [DATE, setDATE] = React.useState("");
  const [SOURCE, setSOURCE] = React.useState("");
  const urlCtx = React.useContext(UrlContext);
  const authCtx = React.useContext(AuthContext);
  const token = authCtx.token
  React.useEffect(() => {
    async function GetData (source, token){
      console.log(source, token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `${urlCtx.URL}/lastData?count=1`//data/id/`+source,
      };
      try {
        const response = await axios(options);
        setPH(response.data[0]["PH"])
        setTDS(response.data[0]["TDS"])
        setID(response.data[0]["_id"])
        setDATE(response.data[0]["date"])
        setSOURCE(response.data[0]["source"])
      } catch (err) {
        console.error(err);
      }
    };
    /*async function GetData_list (source, token){
      console.log(source, token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `http://3.125.155.58/data/id/`+source,
      };
      try {
        const response = await axios(options);
        console.log(response.data)
        UpdatePH(PHArray =>[...PHArray,response.data["PH"]])
        UpdateTDS(TDSArray =>[...TDSArray,response.data["TDS"]])
        //UpdateDate(response.data["date"])
      } catch (err) {
        console.error(err);
      }
    };
    for (let src of source_list) {
      GetData_list(src,token);
  }*/
      GetData(source,token)

  }, []);
      

  
  const {
    container,
    LoginText,
    InformationText,
    Bullet,
    ViewText,
  } = styles;
  //let source_list=["9cd147b5-e9d3-43f5-84f8-d1f1d4f79dbb","a3ffd373-6dd8-48d0-9c2a-43c098cfed8f"]
   let source="a3ffd373-6dd8-48d0-9c2a-43c098cfed8f"
   
  if(6,5<=PH<=9,5){
    if(TDS<50){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Ph wody w normie. TDS w normie. Woda zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
    else if(TDS<160){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Ph wody w normie. TDS w granicach normy. Woda zdatna do picia. Warto monitorować</Text>
          </View>
           </View>
       
      );
    }
    else{
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Ph wody w normie, ale woda zbyt twarda</Text>
          </View>
           </View>
       
      );
    }
  }
  else if (PH<6,5){
    if(TDS<50){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn kwasowy.TDS w normie. Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
    else if(TDS<160){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn kwasowy. TDS w granicach normy.Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
    else{
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn kwasowy i jest zbyt twarda. Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
  }
  else if (PH>9,5){
    if(TDS<50){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn zasadowy.TDS w normie. Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
    else if(TDS<160){
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn zasadowy. TDS w granicach normy.Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
    else{
      return (
        <View style={container}>
          <Text style={LoginText}>Panel Informacyjny</Text>
          <View style={ViewText}><Text style={Bullet}>{'\u25CF'}</Text>
          <Text style={InformationText}>Woda ma odczyn zasadowy i jest zbyt twarda. Woda nie zdatna do picia</Text>
          </View>
           </View>
       
      );
    }
  }
  
}

const styles = StyleSheet.create({
  ViewText:{
    flexDirection : "row"
  },
  container:{
    elevation: 20,
    shadowColor: '#52006A',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 30,
    width: '90%',
    marginVertical: 10,
    marginLeft:15
  },
  LoginText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#4399E9",
    textAlign: "center",
  },
  InformationText:{
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginRight:0,
    maxWidth:"85%",
    marginLeft:10,
    marginTop:7
  },
  Bullet:{
    fontSize: 30,
    color: "#4399E9",
    width:"6%",
    marginLeft:"4%",
    marginRight:0,

  },

});
