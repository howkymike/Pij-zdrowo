import {Dimensions, ScrollView, View} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function PHWater() {
  const screenWidth = Dimensions.get("window").width;
  const data = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        data: [8, 12, 3, 7, 8, 1],
      },
    ],
  };

  const data2 = [
    {
      name: "PH",
      PH: 7,
      color: "#00A62E",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
      <PieChart
        data={data2}
        width={screenWidth}
        height={220}
        accessor={"PH"}
        chartConfig={{
          backgroundColor: "#e26a00",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        backgroundColor={"transparent"}
      />
    </ScrollView>
  );
}
