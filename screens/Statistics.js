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
import { atan, color } from "react-native-reanimated";

export default function Statistics() {
  const [valueLabel, setValueLabel] = useState("");
  const [rawTDSData, setRawTDSData] = useState([]);
  const [rawPHData, setRawPHData] = useState([]);
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
    const token = authCtx.token;
    const source = authCtx.source;
    const options = {
      method: "GET",
      headers: { Auth: token },
      url: `${urlCtx.URL}/data/source/${source}`,
    };
    try {
      const response = await axios(options);

      let TDS = response.data.map((data) => {
        return { TDS: data.TDS, date: new Date(data.date * 1000) };
      });
      console.log(TDS);
      let PH = response.data.map((data) => {
        return { PH: data.PH, date: new Date(data.date * 1000) };
      });
      TDS.sort((a, b) => {
        return a.date - b.date;
      });
      PH.sort((a, b) => {
        return a.date - b.date;
      });
      setRawPHData(PH);
      setRawTDSData(TDS);
    } catch (err) {
      console.error(err);
    }
  }

  const filterTDSYears = () => {
    setValueLabel("lat");
    const maxYear = new Date(
      rawTDSData[rawTDSData.length - 1].date
    ).getFullYear();

    const minYear = new Date(rawTDSData[0].date).getFullYear();
    console.log(minYear);
    const avgData = [];
    if (minYear == maxYear) {
      avgData.push(
        rawTDSData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / rawTDSData.length
      );
    }
    let tempYear = minYear;

    for (let i = 0; i <= maxYear - minYear; i++) {
      console.log(i);
      const tempData = rawTDSData.filter(
        (val) => new Date(val.date).getFullYear() == tempYear
      );
      console.log(tempData);
      const sumOfTheYear =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempData.length;
      console.log(sumOfTheYear);
      avgData.push(sumOfTheYear);
      tempYear += 1;
    }
    const dataCount = avgData.length;
    const labels = [];
    let year = maxYear;
    for (let i = 0; i < 6; i++) {
      labels.push(year);
      year--;
    }
    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    console.log(avgData);
    data = data.concat(avgData);
    setTDSData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterTDSMonths = () => {
    setValueLabel("miesięcy");
    const maxYear = new Date(
      rawTDSData[rawTDSData.length - 1].date
    ).getFullYear();
    const maxMonth =
      new Date(rawTDSData[rawTDSData.length - 1].date).getMonth() + 1;
    const labels = [];
    let month = maxMonth;
    for (let i = 0; i < 6; i++) {
      if (month == 0) month = 12;
      labels.push(month);
      month--;
    }

    const tempTDSData = rawTDSData.filter((val) => {
      return (
        (new Date(val.date).getFullYear() == maxYear ||
          new Date(val.date).getFullYear() == maxYear - 1) &&
        labels.includes(new Date(val.date).getMonth() + 1)
      );
    });
    console.log(tempTDSData);

    const minMonth = new Date(tempTDSData[0].date).getMonth() + 1;
    const avgData = [];
    let loopCount = tempTDSData.length < 6 ? tempTDSData.length : 6;
    if (minMonth == maxMonth) {
      loopCount = 0;
      avgData.push(
        rawTDSData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / rawTDSData.length
      );
    }

    let tempMonth = minMonth;
    for (let i = 0; i < loopCount; i++) {
      const tempData = tempTDSData.filter(
        (val) => new Date(val.date).getMonth() + 1 == tempMonth
      );
      const sumOfTheMonths =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempData.length;
      avgData.push(sumOfTheMonths);
      tempMonth += 1;
    }

    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    console.log(data);
    setTDSData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterTDSHours = () => {
    setValueLabel("godzin");
    const maxDay = new Date(rawTDSData[rawTDSData.length - 1].date).getDate();
    // console.log(new Date(rawTDSData[rawTDSData.length - 1].date).getHours());
    const maxHour =
      new Date(rawTDSData[rawTDSData.length - 1].date).getHours() - 1;
    const labels = [];
    let hour = maxHour;
    for (let i = 0; i < 6; i++) {
      if (hour == 0) hour = 23;
      labels.push(hour);
      hour--;
    }
    console.log(maxHour);
    console.log(labels);

    const tempTDSData = rawTDSData.filter((val) => {
      console.log(
        new Date(val.date).getDate() == maxDay,
        new Date(val.date).getDate() == maxDay - 1,
        labels.includes(new Date(val.date).getHours() - 1)
      );
      return (
        (new Date(val.date).getDate() == maxDay ||
          new Date(val.date).getDate() == maxDay - 1) &&
        labels.includes(new Date(val.date).getHours() - 1)
      );
    });

    console.log(tempTDSData);

    const minHour = new Date(tempTDSData[0].date).getHours() - 1;
    const avgData = [];
    let loopCount = tempTDSData.length < 6 ? tempTDSData.length : 6;
    if (minHour == maxHour) {
      loopCount = 0;
      avgData.push(
        tempTDSData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempTDSData.length
      );
    }
    for (let i = 0; i < loopCount; i++) {
      console.log(i);
      const tempData = tempTDSData.filter(
        (val) => new Date(val.date).getHours() - 1 == tempHour
      );
      console.log(tempData);
      const sumOfTheHours =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempData.length;
      console.log(sumOfTheHours);
      avgData.push(sumOfTheHours);
      tempHour += 1;
    }

    let tempHour = minHour;

    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    setTDSData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterTDSDays = () => {
    setValueLabel("dni");
    const maxMonth =
      new Date(rawTDSData[rawTDSData.length - 1].date).getMonth() + 1;
    const maxDay = new Date(rawTDSData[rawTDSData.length - 1].date).getDate();
    const labels = [];
    let day = maxDay;
    for (let i = 0; i < 6; i++) {
      if (day == 0)
        maxMonth - (1 % 2) == 0 || maxMonth - 1 == 8 || maxMonth - 1 == 7
          ? (day = 31)
          : (day = 30);
      labels.push(day);
      day--;
    }
    console.log(maxDay);
    const tempTDSData = rawTDSData.filter((val) => {
      console.log(
        labels.includes(new Date(val.date).getDate()),
        new Date(val.date).getMonth() + 1 == maxMonth,
        new Date(val.date).getMonth() == maxMonth
      );
      return (
        (new Date(val.date).getMonth() + 1 == maxMonth ||
          new Date(val.date).getMonth() == maxMonth) &&
        labels.includes(new Date(val.date).getDate())
      );
    });

    const minDay = new Date(tempTDSData[0].date).getDate();

    console.log(maxDay, minDay);
    const avgData = [];
    let loopCount = tempTDSData.length < 6 ? tempTDSData.length : 6;
    if (minDay == maxDay) {
      loopCount = 0;
      avgData.push(
        tempTDSData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempTDSData.length
      );
    }
    let tempDay = minDay;

    for (let i = 0; i < loopCount; i++) {
      console.log(i);
      const tempData = tempTDSData.filter(
        (val) => new Date(val.date).getDate() == tempDay
      );
      console.log(tempData);
      const sumOfTheDays =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.TDS);
          return (accumulator += currentValue.TDS);
        }, 0) / tempData.length;
      console.log(sumOfTheDays);
      avgData.push(sumOfTheDays);
      tempDay += 1;
    }
    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    setTDSData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterPHYears = () => {
    setValueLabel("lat");
    const maxYear = new Date(
      rawPHData[rawPHData.length - 1].date
    ).getFullYear();

    const minYear = new Date(rawPHData[0].date).getFullYear();
    console.log(minYear);
    const avgData = [];
    if (minYear == maxYear) {
      avgData.push(
        rawPHData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / rawPHData.length
      );
    }
    console.log(avgData);
    let tempYear = minYear;

    for (let i = 0; i <= maxYear - minYear; i++) {
      console.log(i);
      const tempData = rawPHData.filter(
        (val) => new Date(val.date).getFullYear() == tempYear
      );
      console.log(tempData);
      const sumOfTheYear =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempData.length;
      console.log(sumOfTheYear);
      avgData.push(sumOfTheYear);
      tempYear += 1;
    }
    const dataCount = avgData.length;
    const labels = [];
    let year = maxYear;
    for (let i = 0; i < 6; i++) {
      labels.push(year);
      year--;
    }
    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    console.log(avgData);
    data = data.concat(avgData);
    setPHData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterPHMonths = () => {
    setValueLabel("miesięcy");
    const maxYear = new Date(
      rawPHData[rawPHData.length - 1].date
    ).getFullYear();
    const maxMonth =
      new Date(rawPHData[rawPHData.length - 1].date).getMonth() + 1;
    const labels = [];
    let month = maxMonth;
    for (let i = 0; i < 6; i++) {
      if (month == 0) month = 12;
      labels.push(month);
      month--;
    }

    const tempTDSData = rawPHData.filter((val) => {
      return (
        (new Date(val.date).getFullYear() == maxYear ||
          new Date(val.date).getFullYear() == maxYear - 1) &&
        labels.includes(new Date(val.date).getMonth() + 1)
      );
    });
    console.log(tempTDSData);

    const minMonth = new Date(tempTDSData[0].date).getMonth() + 1;
    const avgData = [];
    let loopCount = tempTDSData.length < 6 ? tempTDSData.length : 6;
    if (minMonth == maxMonth) {
      loopCount = 0;
      avgData.push(
        rawPHData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / rawPHData.length
      );
    }

    let tempMonth = minMonth;
    for (let i = 0; i < loopCount; i++) {
      const tempData = tempTDSData.filter(
        (val) => new Date(val.date).getMonth() + 1 == tempMonth
      );
      const sumOfTheMonths =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempData.length;
      avgData.push(sumOfTheMonths);
      tempMonth += 1;
    }

    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    console.log(data);
    setPHData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterPHHours = () => {
    setValueLabel("godzin");
    const maxDay = new Date(rawPHData[rawPHData.length - 1].date).getDate();
    // console.log(new Date(rawPHData[rawPHData.length - 1].date).getHours());
    const maxHour =
      new Date(rawPHData[rawPHData.length - 1].date).getHours() - 1;
    const labels = [];
    let hour = maxHour;
    for (let i = 0; i < 6; i++) {
      if (hour == 0) hour = 23;
      labels.push(hour);
      hour--;
    }
    console.log(maxHour);
    console.log(labels);

    const tempPHData = rawPHData.filter((val) => {
      console.log(
        new Date(val.date).getDate() == maxDay,
        new Date(val.date).getDate() == maxDay - 1,
        labels.includes(new Date(val.date).getHours() - 1)
      );
      return (
        (new Date(val.date).getDate() == maxDay ||
          new Date(val.date).getDate() == maxDay - 1) &&
        labels.includes(new Date(val.date).getHours() - 1)
      );
    });

    console.log(tempPHData);

    const minHour = new Date(tempPHData[0].date).getHours() - 1;
    const avgData = [];
    let loopCount = tempPHData.length < 6 ? tempPHData.length : 6;
    if (minHour == maxHour) {
      loopCount = 0;
      avgData.push(
        tempPHData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempPHData.length
      );
    }
    for (let i = 0; i < loopCount; i++) {
      console.log(i);
      const tempData = tempPHData.filter(
        (val) => new Date(val.date).getHours() - 1 == tempHour
      );
      console.log(tempData);
      const sumOfTheHours =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempData.length;
      console.log(sumOfTheHours);
      avgData.push(sumOfTheHours);
      tempHour += 1;
    }

    let tempHour = minHour;

    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    setPHData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };

  const filterPHDays = () => {
    setValueLabel("dni");
    const maxMonth =
      new Date(rawPHData[rawPHData.length - 1].date).getMonth() + 1;
    const maxDay = new Date(rawPHData[rawPHData.length - 1].date).getDate();
    const labels = [];
    let day = maxDay;
    for (let i = 0; i < 6; i++) {
      if (day == 0)
        maxMonth - (1 % 2) == 0 || maxMonth - 1 == 8 || maxMonth - 1 == 7
          ? (day = 31)
          : (day = 30);
      labels.push(day);
      day--;
    }
    console.log(maxDay);
    const tempPHData = rawPHData.filter((val) => {
      console.log(
        labels.includes(new Date(val.date).getDate()),
        new Date(val.date).getMonth() + 1 == maxMonth,
        new Date(val.date).getMonth() == maxMonth
      );
      return (
        (new Date(val.date).getMonth() + 1 == maxMonth ||
          new Date(val.date).getMonth() == maxMonth) &&
        labels.includes(new Date(val.date).getDate())
      );
    });

    const minDay = new Date(tempPHData[0].date).getDate();

    console.log(maxDay, minDay);
    const avgData = [];
    let loopCount = tempPHData.length < 6 ? tempPHData.length : 6;
    if (minDay == maxDay) {
      loopCount = 0;
      avgData.push(
        tempPHData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempPHData.length
      );
    }
    let tempDay = minDay;

    for (let i = 0; i < loopCount; i++) {
      console.log(i);
      const tempData = tempPHData.filter(
        (val) => new Date(val.date).getDate() == tempDay
      );
      console.log(tempData);
      const sumOfTheDays =
        tempData.reduce((accumulator, currentValue) => {
          console.log(accumulator, currentValue.PH);
          return (accumulator += currentValue.PH);
        }, 0) / tempData.length;
      console.log(sumOfTheDays);
      avgData.push(sumOfTheDays);
      tempDay += 1;
    }
    const dataCount = avgData.length;

    const howManyFill = dataCount < 6 ? 6 - dataCount : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(avgData);
    setPHData((prevState) => ({
      ...prevState,
      labels: labels.reverse(),
      datasets: [
        {
          data: data,
        },
      ],
    }));
  };
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
          Wykres średnich wartości przewodności wody z 6 ostatnich {valueLabel}
        </Text>

        <LineChart
          data={TDSData}
          // data={{
          //   legend: ["TDS"],
          //   labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
          //   datasets: [
          //     {
          //       data: [1, 2, 3, 4, 5, 6, 7, 8],
          //     },
          //   ],
          // }}
          width={screenWidth}
          height={280}
          yAxisLabel=""
          yAxisSuffix=" ppm"
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterTDSYears}
          >
            <Text style={styles.SecondText}>{"Y"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterTDSMonths}
          >
            <Text style={styles.SecondText}>{"M"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={filterTDSDays}>
            <Text style={styles.SecondText}>{"D"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterTDSHours}
          >
            <Text style={styles.SecondText}>{"H"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.SecondText}>
          Wykres wartości PH wody z 6 ostatnich {valueLabel}
        </Text>
        <LineChart
          // data={{
          //   legend: ["PH"],
          //   labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
          //   datasets: [
          //     {
          //       data: [1, 2, 3, 4, 5, 6, 7, 8],
          //     },
          //   ],
          // }}
          data={PHData}
          yAxisSuffix=" PH"
          width={screenWidth}
          height={280}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={filterPHYears}>
            <Text style={styles.SecondText}>{"Y"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterPHMonths}
          >
            <Text style={styles.SecondText}>{"M"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={filterPHDays}>
            <Text style={styles.SecondText}>{"D"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={filterPHHours}>
            <Text style={styles.SecondText}>{"H"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  filterButton: {
    minWidth: 70,
    marginRight: 20,
    backgroundColor: "#4399E9",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  filterButtons: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 20,
  },
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
