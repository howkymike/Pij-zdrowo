import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  StatusBar,
  ScrollView,
  SafeAreaView 
} from "react-native";  
import qs from "qs";
import { useState } from "react";
import * as React from 'react';
import axios from "axios";
import { loginUser } from "../util/auth";

export default function Login({ navigation }) {
  function pressHandler() {
    navigation.navigate("Register");
  }

  const {
    container,
    LoginText,
    InformationText,
    Bullet,
    ViewText,
    NestedBullet,   
    NestedText,

  } = styles;

  const [SOURCEArray,UpdateSOURCE] = React.useState("");
  const [PHArray, UpdatePH] = React.useState([]);
  const [TDSArray, UpdateTDS] = React.useState([]);
  const [DateArray, UpdateDate] = React.useState([]);
  React.useEffect(() => {

    async function GetData_list (source, token){
      console.log(source, token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `http://3.125.155.58/data/id/`+source,
      };
      try {
        
        const response = await axios(options);
        UpdatePH(PHArray =>[...PHArray,response.data["PH"]])
        UpdateTDS(TDSArray =>[...TDSArray,response.data["TDS"]])
        UpdateDate(DateArray =>[...DateArray,response.data["date"]])
        UpdateSOURCE(SOURCEArray =>[...SOURCEArray,response.data["source"]])
      } catch (err) {
        console.error(err);
      }
    };
    const loginUser = async (email, password) => {
      console.log(email, password);
      const data = {
        email,
        password,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `http://3.125.155.58/login`,
      };
      try {
        const response = await axios(options);
        console.log(response.data);
      } catch (err) {

        console.error(err.response.data);
        
      }
    };
    loginUser("testowy97@test.com","password")
    async function GetStatistics (token){
      console.log(source, token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `http://3.125.155.58/abnormalData`,
      };
      try {
        
        const response = await axios(options);
        console.log(response.data)
      } catch (err) {
        console.error(err);
      }
    };
    //GetStatistics(token)
    for (let src of source_list) {
      //GetData_list(src,token);
  }


  }, []);

  let source_list=["9cd147b5-e9d3-43f5-84f8-d1f1d4f79dbb","a3ffd373-6dd8-48d0-9c2a-43c098cfed8f"]
  let token="eb69f26f-c116-4a9f-9f5d-03eb9564072a"
  let myloop=[]
  for (let i = 0; i < PHArray.length; i++) {
    myloop.push(
      <View>
      <View style={ViewText}  key='b{i}'><Text style={Bullet}>{'\u25CF'}</Text>
      <Text style={InformationText}>{SOURCEArray[i]}</Text>
      </View>
      <View style={ViewText}><Text style={NestedBullet}>{'\u25EF'}</Text>
      <Text style={NestedText}>PH{PHArray[i]} TDS{TDSArray[i]} Date{DateArray[i]}</Text>
      </View>
      </View> 
    );
  }
  
   return (
    <SafeAreaView style={styles.container} >
        <ScrollView>
    <Text style={LoginText}>Panel Analityka</Text>
    {myloop}


    </ScrollView>
      </SafeAreaView  >

        
      );

}

const styles = StyleSheet.create({
  ViewText:{
    flexDirection : "row"
  },
  NestedBullet:{
    fontSize: 20,
    color: "#4399E9",
    marginLeft:"14%",
    marginRight:0,
  },
  NestedText:{
    fontSize: 20,
    marginLeft:"1%",
    marginRight:0,
    maxWidth:"80%",
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
