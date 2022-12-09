import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

import { AuthContext } from "../store/auth-context.js";

export default function Statistics() {
  const [valueTDSLabel, setValueTDSLabel] = useState("");
  const [valuePHLabel, setValuePHLabel] = useState("");
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
  const authCtx = useContext(AuthContext);
  const screenWidth = Dimensions.get("window").width;
  const { RefreshButton, ButtonText } = styles;

  async function getData() {
    const token = authCtx.token;
    const source = authCtx.source;
    const options = {
      method: "GET",
      headers: { Auth: token },
      url: `${authCtx.URL}/data/source/${source}`,
    };
    try {
      const response = await axios(options);

      let TDS = response.data.map((data) => {
        return { TDS: data.TDS, date: new Date(data.date * 1000) };
      });
      // console.log(TDS);
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

  const filterYears = (whichValue, setWhichValue, val) => {
    // Stwórz nową tablicę zawierającą rekordy z danymi dziennymi
    console.log("RAW TDS DATA:", whichValue);
    const dailyData = [];
    const labels = [];
    let currentYear = null;
    let currentSum = 0;
    let currentCount = 0;
    for (const record of whichValue) {
      const recordDate = new Date(record.date);
      console.log(recordDate);
      const recordYear = recordDate.getFullYear();

      // Jeśli dzień się zmienił, dodaj nowy rekord do tablicy
      if (currentYear !== recordYear) {
        if (currentYear !== null) {
          // Oblicz średnią i dodaj do tablicy
          const dailyAverage = currentSum / currentCount;
          dailyData.push(dailyAverage);
          labels.push(`${currentYear}`);
          console.log(labels);
        }

        // Zeruj sumę i licznik
        currentSum = 0;
        currentCount = 0;
      }

      // Dodaj wartość do sumy i zwiększ licznik
      currentSum += record[val];
      currentCount += 1;
      currentYear = recordYear;
      // console.log(currentYear);
    }

    // Jeśli tablica nie jest pusta, dodaj ostatni rekord
    if (currentYear !== null) {
      const dailyAverage = currentSum / currentCount;
      dailyData.push(dailyAverage);
      labels.push(`${currentYear}`);
    }
    // console.log(dailyData);
    // console.log(labels);

    const howManyFill = dailyData.length < 5 ? 5 - dailyData.length : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(dailyData);
    let currYear = +labels[0] - howManyFill;
    let labelsData = [];
    for (let i = 0; i < howManyFill; i++) {
      labelsData.push(currYear);
      currYear++;
    }
    labelsData = labelsData.concat(labels);
    val == "TDS"
      ? setValueTDSLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich lat w których zarejestrowano pomiar"
        )
      : setValuePHLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich lat w których zarejestrowano pomiar"
        );

    setWhichValue((prevState) => ({
      ...prevState,
      labels: labelsData.slice(-5),
      datasets: [
        {
          data: data.slice(-5),
        },
      ],
    }));
  };
  const filterMonths = (whichValue, setWhichValue, val) => {
    // Stwórz nową tablicę zawierającą rekordy z danymi dziennymi
    console.log("RAW TDS DATA:", whichValue);
    const dailyMonths = [];
    const labels = [];
    let currentYear = null;
    let currentMonth = null;
    let currentSum = 0;
    let currentCount = 0;
    for (const record of whichValue) {
      const recordDate = new Date(record.date);
      console.log(recordDate);
      const recordMonth = recordDate.getMonth();

      // Jeśli dzień się zmienił, dodaj nowy rekord do tablicy
      if (currentMonth !== recordMonth) {
        if (currentMonth !== null) {
          // Oblicz średnią i dodaj do tablicy
          const dailyAverage = currentSum / currentCount;
          dailyMonths.push(dailyAverage);
          labels.push(`${currentMonth + 1}/${currentYear}`);
          console.log(labels);
        }

        // Zeruj sumę i licznik
        currentSum = 0;
        currentCount = 0;
      }

      // Dodaj wartość do sumy i zwiększ licznik
      currentSum += record[val];
      currentCount += 1;
      currentMonth = recordMonth;
      currentYear = recordDate.getFullYear();
      // console.log(currentMonth);
    }

    // Jeśli tablica nie jest pusta, dodaj ostatni rekord
    if (currentMonth !== null) {
      const dailyAverage = currentSum / currentCount;
      dailyMonths.push(dailyAverage);
      labels.push(`${currentMonth + 1}/${currentYear}`);
    }
    // console.log(dailyMonths);
    // console.log(labels);

    const howManyFill = dailyMonths.length < 5 ? 5 - dailyMonths.length : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(dailyMonths);
    const regex = /^(\d+)/;
    const match = labels[0].match(regex);
    const firstValue = match[1];
    let currMonth = +firstValue - howManyFill - 1;
    let labelsData = [];
    for (let i = 0; i < howManyFill; i++) {
      currMonth = currMonth - i;
      console.log(currMonth);
      if (currMonth < 0) {
        // Jeśli miesiąc jest ujemny, dodaj 12 i oblicz ponownie
        currentYear--;
        labelsData.push(`${((currMonth + 12) % 12) + 1}/${currentYear}`);
      } else {
        labelsData.push(`${(currMonth % 12) + 1}/${currentYear}`);
      }
    }
    labelsData = labelsData.concat(labels);
    val == "TDS"
      ? setValueTDSLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich miesięcy w których zarejestrowano pomiar"
        )
      : setValuePHLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich miesięcy w których zarejestrowano pomiar"
        );
    setWhichValue((prevState) => ({
      ...prevState,
      labels: labelsData.slice(-5),
      datasets: [
        {
          data: data.slice(-5),
        },
      ],
    }));
  };
  const filterDays = (whichValue, setWhichValue, val) => {
    // Stwórz nową tablicę zawierającą rekordy z danymi dziennymi
    console.log("RAW TDS DATA:", whichValue);
    const dailyData = [];
    const labels = [];
    let currentDay = null;
    let currentMonth = null;
    let currMonth = null;
    let currentYear = null;
    let currYear = null;
    let currentSum = 0;
    let currentCount = 0;
    for (const record of whichValue) {
      const recordDate = new Date(record.date);
      console.log(recordDate);
      const recordDay = recordDate.getDate();
      const recordMonth = recordDate.getMonth();
      const recordYear = recordDate.getFullYear();

      // Jeśli dzień się zmienił, dodaj nowy rekord do tablicy
      if (
        currentDay !== recordDay ||
        currYear !== recordYear ||
        currMonth !== recordMonth
      ) {
        if (currentDay !== null) {
          // Oblicz średnią i dodaj do tablicy
          const dailyAverage = currentSum / currentCount;

          dailyData.push(dailyAverage);
          labels.push(`${currentDay}/${currentMonth + 1}/${currentYear}`);
          console.log(labels);
        }

        // Zeruj sumę i licznik
        currentSum = 0;
        currentCount = 0;
      }

      // Dodaj wartość do sumy i zwiększ licznik
      currentSum += record[val];
      currentCount += 1;
      currentDay = recordDay;
      currMonth = recordMonth;
      currYear = recordYear;
      currentMonth = recordDate.getMonth();
      currentYear = recordDate.getFullYear();
      // console.log(currentYear);
    }

    // Jeśli tablica nie jest pusta, dodaj ostatni rekord
    if (currentDay !== null) {
      const dailyAverage = currentSum / currentCount;
      dailyData.push(dailyAverage);
      labels.push(`${currentDay}/${currentMonth + 1}/${currentYear}`);
    }
    // console.log(dailyData);
    // console.log(labels);
    const dataCount = dailyData.length;

    const howManyFill = dailyData < 5 ? 5 - dailyData : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(dailyData);

    val == "TDS"
      ? setValueTDSLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich dni w których zarejestrowano pomiar"
        )
      : setValuePHLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich dni w których zarejestrowano pomiar"
        );
    setWhichValue((prevState) => ({
      ...prevState,
      labels: labels.slice(-5),
      datasets: [
        {
          data: data.slice(-5),
        },
      ],
    }));
  };

  const filterHours = (whichValue, setWhichValue, val) => {
    // Stwórz nową tablicę zawierającą rekordy z danymi dziennymi
    console.log("RAW TDS DATA:", whichValue);
    const dailyHours = [];
    const labels = [];
    let currentMonth = null;
    let currentDay = null;
    let currDay = null;
    let currMonth = null;
    let currentHour = null;
    let currentSum = 0;
    let currentCount = 0;
    for (const record of whichValue) {
      const recordDate = new Date(record.date);
      console.log(recordDate);
      const recordHours = recordDate.getMonth();
      const recordDay = recordDate.getDate();
      const recordMonth = recordDate.getMonth();

      // Jeśli dzień się zmienił, dodaj nowy rekord do tablicy
      if (
        currentHour !== recordHours ||
        currDay !== recordDay ||
        currMonth !== recordMonth
      ) {
        if (currentHour !== null) {
          // Oblicz średnią i dodaj do tablicy
          const dailyAverage = currentSum / currentCount;
          dailyHours.push(dailyAverage);
          labels.push(
            `${currentHour + 1}:00/${currentDay}/${currentMonth + 1}`
          );
          console.log(labels);
        }

        // Zeruj sumę i licznik
        currentSum = 0;
        currentCount = 0;
      }

      // Dodaj wartość do sumy i zwiększ licznik
      currentSum += record[val];
      currentCount += 1;
      currentHour = recordHours;
      currDay = recordDay;
      currMonth = recordMonth;
      currentMonth = recordDate.getMonth();
      currentDay = recordDate.getDate();
      // console.log(currentHour);
    }

    // Jeśli tablica nie jest pusta, dodaj ostatni rekord
    if (currentHour !== null) {
      const dailyAverage = currentSum / currentCount;
      dailyHours.push(dailyAverage);
      labels.push(`${currentHour + 1}:00/${currentDay}/${currentMonth + 1}`);
    }
    // console.log(dailyHours);
    // console.log(labels);

    const howManyFill = dailyHours.length < 5 ? 5 - dailyHours.length : 0;
    let data = [];
    for (let i = 0; i < howManyFill; i++) {
      data.push(0);
    }
    data = data.concat(dailyHours);
    console.log(whichValue);
    let currHour = new Date(whichValue[whichValue.length - 1].date).getHours();
    let currDays = new Date(whichValue[whichValue.length - 1].date).getDate();
    let currMonths = new Date(
      whichValue[whichValue.length - 1].date
    ).getMonth();
    let labelsData = [];
    for (let i = 0; i < howManyFill; i++) {
      currHour = currHour - i;
      console.log(currHour);
      if (currHour < 0) {
        // Jeśli miesiąc jest ujemny, dodaj 12 i oblicz ponownie
        currDays.setDate(currDays - 1);
        currMonths.setDate(currMonths - 1);
        labelsData.push(
          `${((currHour + 24) % 24) + 1}:00/${currDays}/${currMonths + 1}`
        );
      } else {
        labelsData.push(
          `${(currHour % 24) + 1}:00/${currentDay}/${currentMonth + 1}`
        );
      }
    }
    labelsData = labelsData.concat(labels);
    val == "TDS"
      ? setValueTDSLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich godzin w których zarejestrowano pomiar"
        )
      : setValuePHLabel(
          "Wykres średnich wartości przewodności wody z 5 ostatnich godzin w których zarejestrowano pomiar"
        );
    setWhichValue((prevState) => ({
      ...prevState,
      labels: labelsData.slice(-5),
      datasets: [
        {
          data: data.slice(-5),
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
        <Text style={styles.SecondText}>{valueTDSLabel}</Text>

        <LineChart
          data={TDSData}
          width={screenWidth}
          height={280}
          yAxisSuffix=""
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
            onPress={filterYears.bind(this, rawTDSData, setTDSData, "TDS")}
          >
            <Text style={styles.SecondText}>{"R"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterMonths.bind(this, rawTDSData, setTDSData, "TDS")}
          >
            <Text style={styles.SecondText}>{"M"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterDays.bind(this, rawTDSData, setTDSData, "TDS")}
          >
            <Text style={styles.SecondText}>{"D"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterHours.bind(this, rawTDSData, setTDSData, "TDS")}
          >
            <Text style={styles.SecondText}>{"G"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.SecondText}>{valuePHLabel}</Text>
        <LineChart
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
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterYears.bind(this, rawPHData, setPHData, "PH")}
          >
            <Text style={styles.SecondText}>{"R"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterMonths.bind(this, rawPHData, setPHData, "PH")}
          >
            <Text style={styles.SecondText}>{"M"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterDays.bind(this, rawPHData, setPHData, "PH")}
          >
            <Text style={styles.SecondText}>{"D"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={filterHours.bind(this, rawPHData, setPHData, "PH")}
          >
            <Text style={styles.SecondText}>{"G"}</Text>
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
    marginRight: 7,
    marginLeft: 7,
    textAlign: "center",
  },
};
