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
import { AuthContext } from "../store/auth-context.js";
import { UrlContext } from "../store/url-context.js";
export default function Analitics() {
  const urlCtx = React.useContext(UrlContext);
  const authCtx = React.useContext(AuthContext);
  const token = authCtx.token


  const {
    container,
    LoginText,
    InformationText,
    Bullet,
    ViewText,
    NestedBullet,   
    NestedText,
    DoubleNestedText,
    DoubleNestedBullet
  } = styles;

  const [SOURCEArray,UpdateSOURCE] = React.useState("");
  const [PHArray, UpdatePH] = React.useState([]);
  const [TDSArray, UpdateTDS] = React.useState([]);
  const [DateArray, UpdateDate] = React.useState([]);
  const [LocationArray, UpdateLocation] = React.useState([]);
  const [UniqueDevices, SetUnique] = React.useState(0);
  const [AveragePH, SetPH] = React.useState(0);
  const [AverageTDS, SetTDS] = React.useState(0);
  const [BestWater, SetBest] = React.useState("");
  const [WorstWater, SetWorst] = React.useState("");
  React.useEffect(() => {

    async function GetAbnormalData (token){
      console.log(token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `${urlCtx.URL}/abnormalData`,
      };
      try {
        
        const response = await axios(options);
        console.log(response.data)
        for (let i in response.data){
          UpdatePH(PHArray =>[...PHArray,response.data[i]["PH"]])
          UpdateTDS(TDSArray =>[...TDSArray,response.data[i]["TDS"]])
          UpdateDate(DateArray =>[...DateArray,response.data[i]["date"]])
          UpdateLocation(LocationArray =>[...LocationArray,response.data[i]["location"]])

        }
      } catch (err) {
        console.error(err);
      }
    };
    async function GetStatistics (token){
      console.log(token);
      const options = {
        method: "GET",
        headers: { "Auth": token },
        url: `${urlCtx.URL}/data/statistics`,
      };
      try {
        
        const response = await axios(options);
        SetUnique(response.data["unique_sources_count"])
        SetPH(response.data["average_ph"])
        SetTDS(response.data["average_tds"])
        SetBest(response.data["best_ph"]["location"])
        SetWorst(response.data["worst_ph"]["location"])
        for (let i in response.data["abnormal_data"]){
          UpdatePH(PHArray =>[...PHArray,response.data["abnormal_data"][i]["PH"]])
          UpdateTDS(TDSArray =>[...TDSArray,response.data["abnormal_data"][i]["TDS"]])
          UpdateDate(DateArray =>[...DateArray,response.data["abnormal_data"][i]["date"]])
          UpdateLocation(LocationArray =>[...LocationArray,response.data["abnormal_data"][i]["location"]])

        }
      } catch (err) {
        console.error(err);
      }
    };
    //GetAbnormalData(token)
    GetStatistics(token)


  }, []);

  //let source_list=["9cd147b5-e9d3-43f5-84f8-d1f1d4f79dbb","a3ffd373-6dd8-48d0-9c2a-43c098cfed8f"]
  let myloop=[]
  for (let i = 0; i < PHArray.length; i++) {
    myloop.push(
      <View>
      <View style={ViewText}  ><Text style={Bullet}>{'\u25CF'}</Text>
      <Text style={InformationText}>{LocationArray[i]}</Text>
      </View>
      <View style={ViewText} ><Text style={NestedBullet}>{'\u25EF'}</Text>
      <Text style={NestedText} >Ph wody:{PHArray[i]}</Text>
      </View>
      <View style={ViewText} ><Text style={NestedBullet}>{'\u25EF'}</Text>
      <Text style={NestedText} >Ilość związków:{TDSArray[i]}</Text>
      </View>
      </View> 
    );
  }
  
   return (
    <SafeAreaView style={styles.container} >
        <ScrollView>
    <Text style={LoginText}>Panel Analityka</Text>
    <View>
      <View style={ViewText} ><Text style={Bullet}>{'\u25CF'}</Text>
        <Text style={InformationText}>Ogólne informacje</Text>
      </View>
      <View style={ViewText}><Text style={NestedBullet}>{'\u25EF'}</Text>
        <Text style={NestedText}>Ilość urządzeń:{UniqueDevices}</Text>
      </View>
      <View style={ViewText}><Text style={NestedBullet}>{'\u25EF'}</Text>
        <Text style={NestedText}>średnia parametrów wody</Text>
      </View>
      <View style={ViewText}><Text style={DoubleNestedBullet}>{'\u25EF'}</Text>
        <Text style={DoubleNestedText}>PH:{AveragePH}</Text>
      </View>
      <View style={ViewText}><Text style={DoubleNestedBullet}>{'\u25EF'}</Text>
        <Text style={DoubleNestedText}>TDS:{AverageTDS}</Text>
      </View>
      <View style={ViewText}><Text style={NestedBullet}>{'\u25EF'}</Text>
        <Text style={NestedText}>Najlepszy stan wody odczytano w:{BestWater}</Text>
      </View>
      <View style={ViewText}><Text style={NestedBullet}>{'\u25EF'}</Text>
        <Text style={NestedText}>Najgorszy stan wody odczytano w:{WorstWater}</Text>
      </View>
    </View> 
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
    marginLeft:"16%",
    marginRight:0,
  },
  NestedText:{
    fontSize: 20,
    marginLeft:"1%",
    marginRight:0,
    maxWidth:"75%",
  },
  DoubleNestedBullet:{
    fontSize: 20,
    color: "#4399E9",
    marginLeft:"27%",
    marginRight:0,
  },
  DoubleNestedText:{
    fontSize: 20,
    marginLeft:"1%",
    marginRight:0,
    maxWidth:"50%",
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
    marginLeft:"7%",
    marginRight:0,

  },

});
