import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import * as Font from "expo-font";
import { AppLoading } from "expo";
import DrinksContext from "./context/drinks-context";

import InputScreen from "./screens/InputScreen";
import PlayScreen from "./screens/PlayScreen";
import StartScreen from "./screens/StartScreen";

import COLORS from "./constants/colors";
import {
  initShot,
  fetchShots,
  initWheel,
  fetchWheel,
  insertWheel,
} from "./database/sqlite";

//Initialize SQLite database
initShot()
  .then(() => {
    initWheel().then(() => {
      console.log("Initialized database");
    });
  })
  .catch((err) => {
    console.log("Initializing database failed.");
    console.log(err);
  });

//Return default font-family
const fetchFonts = () => {
  return Font.loadAsync({
    "assistant-regular": require("./assets/fonts/Assistant-SemiBold.ttf"),
    "assistant-bold": require("./assets/fonts/Assistant-ExtraBold.ttf"),
  });
};

export default function App() {
  //Check if initial data has been loaded
  //Used for fonts
  const [dataLoaded, setDataLoaded] = useState(false);

  //Manage currently active screen
  const [content, setContent] = useState("StartScreen");

  const [savedDrinks, setSavedDrinks] = useState([]);
  const [savedWheel, setSavedWheel] = useState([]);

  //Handle a screen change
  const changeScreenHandler = (selectedScreen) => {
    setContent(selectedScreen);
  };

  //Fetch data from sqlite database
  //Save into context with the help of the useState savedShots
  async function fetchData() {
    try {
      const fetch = await fetchShots();
      const dataFetch = fetch.rows._array;
      setSavedDrinks(dataFetch.reverse());

      let status = await fetchWheel();
      let dataStatus = status.rows._array;
      if (!dataStatus.length) {
        newStatus = await insertWheel(1);
        status = await fetchWheel();
        dataStatus = status.rows._array;
      }
      setSavedWheel(dataStatus);
      console.log("Data fetched from database");
    } catch (error) {
      console.log("Fetching data from database failed");
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //Set StartScreen as the initial active screen
  //@props changeScreenHandler for screen to call if screen change needs to be executed
  let activeScreen = <StartScreen onChangeScreen={changeScreenHandler} />;

  //Alter currently active screen if content / screen was altered by changeScreenHandler
  if (content !== "StartScreen") {
    if (content === "PlayScreen") {
      activeScreen = <PlayScreen onChangeScreen={changeScreenHandler} />;
    } else if (content === "InputScreen") {
      activeScreen = <InputScreen onChangeScreen={changeScreenHandler} />;
    } else {
      activeScreen = <StartScreen onChangeScreen={changeScreenHandler} />;
    }
  }

  //Load initial data of the app
  //Call fetchFonts to get default fonts
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }

  return (
    <DrinksContext.Provider
      value={{
        savedDrinks: savedDrinks,
        setSavedDrinks: setSavedDrinks,
        savedWheel: savedWheel,
        setSavedWheel: setSavedWheel,
      }}
    >
      <View style={styles.screen}>{activeScreen}</View>
    </DrinksContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primaryColor,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
