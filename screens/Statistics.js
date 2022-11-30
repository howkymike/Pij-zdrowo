import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useContext, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

import { UrlContext } from "../store/url-context.js";
import { AuthContext } from "../store/auth-context.js";
import { color } from "react-native-reanimated";

export default function Statistics() {
  const [TDSData, setTDSData] = useState({
    legend: ["TDS"],
    labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
  });
  const [PHData, setPHData] = useState({
    legend: ["PH"],
    labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
  });
  const urlCtx = useContext(UrlContext);
  const authCtx = useContext(AuthContext);
  const screenWidth = Dimensions.get("window").width;
  const { RefreshButton, ButtonText } = styles;

  //   const data2 = [
  //     {
  //       name: "PH",
  //       PH: 7,
  //       color: "#00A62E",
  //       legendFontColor: "#7F7F7F",
  //       legendFontSize: 15,
  //     },
  //   ];

  async function getData() {
    console.log(urlCtx.URL);
    const token = authCtx.token;
    const options = {
      method: "GET",
      headers: { Auth: token },
      url: `${urlCtx.URL}/data/source/d84f960586ed44ceb06fc9d350baef07`,
    };
    try {
      const response = await axios(options);
      let TDS = response.data.map((data) => {
        return { TDS: data.TDS, date: new Date(data.date) };
      });
      let PH = response.data.map((data) => {
        return { PH: data.PH, date: new Date(data.date) };
      });
      TDS.sort((a, b) => {
        return b.date - a.date;
      });
      PH.sort((a, b) => {
        return b.date - a.date;
      });
      console.log(PH);
      TDS = TDS.slice(0, 6);
      PH = PH.slice(0, 6);
      console.log(PH);
      let dates = TDS.map((obj) => obj.date.toLocaleDateString());
      TDS = TDS.map((obj) => obj.TDS);
      PH = PH.map((obj) => obj.PH);
      setTDSData((prevState) => ({
        ...prevState,
        labels: dates,
        datasets: [
          {
            data: TDS,
          },
        ],
      }));
      setPHData((prevState) => ({
        ...prevState,
        labels: dates,
        datasets: [
          {
            data: PH,
          },
        ],
      }));
      console.log(TDSData);
    } catch (err) {
      console.error(err.response.data);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.MainText}>Panel statystyk</Text>
        <TouchableOpacity style={RefreshButton} onPress={getData}>
          <Text style={ButtonText}>{"Refresh"}</Text>
        </TouchableOpacity>
        <Text style={styles.SecondText}>
          Wykres wartości przewodności wody z 6 ostatnich dni
        </Text>

        <LineChart
          data={TDSData}
          width={screenWidth}
          height={280}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
        <Text style={styles.SecondText}>
          Wykres wartości PH wody z 6 ostatnich dni
        </Text>
        <LineChart
          data={PHData}
          width={screenWidth}
          height={280}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
      </ScrollView>
    </View>
  );
}

const styles = {
  RefreshButton: {
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
  MainText: {
    fontSize: 24,
    color: "#4399E9",
    fontWeight: "700",
  },
  SecondText: {
    fontSize: 16,
    marginTop: 18,
    marginBottom: 18,
  },
};
