import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

import COLORS from "../constants/colors";
import DrinksContext from "../context/drinks-context";
import Config from "../components/Config";
import Wheel from "../components/Wheel";

// Random num generator
const generateRandomNumber = (max) => {
  return Math.round(Math.random() * (max - 1) + 1);
};

// Ensure that back gesture / button returns to the StartScreen
const PlayScreen = (props) => {
  useEffect(() => {
    const backAction = () => {
      props.onChangeScreen("StartScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // Save current shot values, which consist of the name, abv, chance, image and counter
  const [drinkName, setDrinkName] = useState("Press to start");
  const [drinkABV, setDrinkABV] = useState(0);
  const [drinkChance, setDrinkChance] = useState(0);
  const [selectedImage, setSelectedImage] = useState();
  const [count, setCount] = useState(0);

  // Save shot statistic background colors
  const [countColor, setCountColor] = useState("rgb(33,33,33)");
  const [alcColor, setAlcColor] = useState("rgb(33,33,33)");
  const [chanceColor, setChanceColor] = useState("rgb(33,33,33)");

  let wheelRef = React.createRef();

  // Set the count of all ocurrences summed up to 0 when screen is activated
  let countOcc = 0;

  playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/menu.mp3")
    );

    await sound.playAsync();
  };

  // Choose randomly a shot out of the Context database
  const chooseDrink = (context) => {
    playSound();

    // Check if count of all ocurences already has been calculated
    if (countOcc === 0) {
      // Sum up all occurences of all shots in the Context database
      for (const element of context.savedDrinks) {
        countOcc += element.occ;
      }
    }
    // Generate random num
    const random = generateRandomNumber(countOcc);

    // Loop through occurences of all shots in the Context database and add to a counter
    // Check in every iteration if counter is equal or larger than randomly generated num
    // If check is satisfied alter screen object/useStates to current shot of the loop and break loop.
    let counter = 0;
    for (const element of context.savedDrinks) {
      counter += element.occ;
      if (counter >= random) {
        setDrinkName(element.name);
        setDrinkABV(element.abv);
        setDrinkChance(((element.occ / countOcc) * 100).toFixed(0));
        console.log(element.imageUri);
        setSelectedImage(element.imageUri);
        setCount(count + 1);
        if (context.savedWheel[0].active && Math.random() < 0.5) {
          wheelRef.show();
        }
        break;
      }
    }
  };

  // Update color of drinkInformationContainers if there values change
  useEffect(() => {
    if (count > 0) {
      setCountColor(transitionCountColor());
      setAlcColor(transitionAlcColor());
      setChanceColor(transitionChanceColor());
    }
  }, [count, drinkABV, drinkChance]);

  // This will increase the red color of the count background
  // by increasing the rgb from darkgrey to red
  const transitionCountColor = () => {
    let red = String(33 + count * 10);
    let green = String(33 - count * 6);
    let blue = String(33 - count * 6);
    return "rgb(" + red + "," + green + "," + blue + ")";
  };

  // This will change the alc background color from yellow to red
  // depending on the alc percentage
  const transitionAlcColor = () => {
    let red = String(255);
    let green = String(200 - drinkABV * 2.0);
    let blue = String(0);
    return "rgb(" + red + "," + green + "," + blue + ")";
  };

  // This will increase the green color of the chance background
  // by increasing the rgb from darkgreen to green
  const transitionChanceColor = () => {
    let red = String(0);
    let green = String(100 + drinkChance * 2.55);
    let blue = String(0);
    return "rgb(" + red + "," + green + "," + blue + ")";
  };

  return (
    <DrinksContext.Consumer>
      {(context) => (
        <View style={styles.mainContainer}>
          {!context.savedDrinks.length ? (
            <View>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/images/shot_selector_logo.png")}
                  style={styles.image}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ marginBottom: Config.deviceHeight * 0.05 }}>
                  <Text style={styles.bodyText}>
                    No shots/drinks have been entered yet.
                  </Text>
                </View>
                <View>
                  <Text style={styles.bodyText}>To enter shots:</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.bodyText}>Go back </Text>
                    <Ionicons
                      name="md-arrow-round-back"
                      size={22}
                      color={COLORS.black}
                    />
                    <Text style={styles.bodyText}>,</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.bodyText}>press </Text>
                    <Ionicons
                      name="md-finger-print"
                      size={22}
                      color={COLORS.black}
                    />
                    <Text style={styles.bodyText}> "SELECT SHOTS" button.</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.imageContainer}>
                {!selectedImage ? (
                  <Image
                    source={require("../assets/images/shot_selector_logo.png")}
                    style={styles.image}
                  />
                ) : selectedImage == "Bier" ? (
                  <Image
                    source={require("../assets/images/shot_selector_logo.png")}
                    style={styles.image}
                  />
                ) : selectedImage == "Vodka" ? (
                  <Image
                    source={require("../assets/images/icon_shot.png")}
                    style={styles.image}
                  />
                ) : selectedImage == "Bacardi" ? (
                  <Image
                    source={require("../assets/images/knoob.png")}
                    style={styles.image}
                  />
                ) : (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                )}
              </View>
              <Wheel
                ref={(target) => (wheelRef = target)}
                close={() => props.onChangeScreen("StartScreen")}
                shotName={drinkName}
                shotSetter={setDrinkName}
              />
              <View
                style={{
                  flex: 1,
                  width: Config.deviceWidth * 0.95,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text numberOfLines={2} style={styles.drinkText}>
                  {drinkName}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => chooseDrink(context)}
                  activeOpacity={0.7}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>SHOT!</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: Config.deviceWidth,
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                }}
              >
                <Text style={styles.drinksCategoryInformation}>Count</Text>
                <Text style={styles.drinksCategoryInformation}>Alcohol</Text>
                <Text style={styles.drinksCategoryInformation}>Chance</Text>
              </View>

              <View style={styles.drinksInformationContainer}>
                <Text
                  style={[
                    styles.drinksInformationText,
                    { backgroundColor: countColor },
                  ]}
                >
                  {count}
                </Text>
                <Text
                  style={[
                    styles.drinksInformationText,
                    { backgroundColor: alcColor },
                  ]}
                >
                  {drinkABV}%
                </Text>
                <Text
                  style={[
                    styles.drinksInformationText,
                    { backgroundColor: chanceColor },
                  ]}
                >
                  {drinkChance}%
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </DrinksContext.Consumer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: Config.deviceHeight > 700 ? 45 : 40,
    height: Config.deviceHeight / 2.5,
  },
  image: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    maxWidth: Config.deviceWidth * 0.92,
    borderRadius: 12,
    resizeMode: "contain",
  },
  bodyText: {
    textAlign: "center",
    fontFamily: "assistant-regular",
    fontSize: 20,
  },
  drinkText: {
    fontFamily: "assistant-bold",
    textAlign: "center",
    fontSize:
      Config.deviceHeight > 720 && Config.deviceWidth > 390
        ? 74
        : Config.deviceHeight > 600
        ? 70
        : 65,
    lineHeight:
      Config.deviceHeight > 720 && Config.deviceWidth > 390
        ? 70
        : Config.deviceHeight > 600
        ? 65
        : 60,
    paddingTop:
      Config.deviceHeight > 720 && Config.deviceWidth > 390
        ? 30
        : Config.deviceHeight > 600
        ? 25
        : 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: Config.deviceWidth,
    marginBottom:
      Config.deviceHeight > 700
        ? Config.deviceHeight * 0.028
        : Config.deviceHeight * 0.017,
  },
  button: {
    alignSelf: "center",
    backgroundColor: COLORS.secondaryColor,
    width: Config.deviceWidth * 0.6,
    borderRadius: 30,
    paddingVertical: Config.deviceHeight > 600 ? 20 : 18,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: "assistant-bold",
    textAlign: "center",
    fontSize: Config.deviceHeight > 600 ? 50 : 46,
  },
  drinksCategoryInformation: {
    fontFamily: "assistant-bold",
    fontSize: Config.deviceHeight > 600 ? 18 : 16,
  },
  drinksInformationContainer: {
    flexDirection: "row",
    width: Config.deviceWidth,
    height: Config.deviceHeight / 7,
    justifyContent: "space-around",
    borderTopWidth: 2,
  },
  drinksInformationText: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    fontFamily: "assistant-bold",
    fontSize: Config.deviceHeight > 600 ? 40 : 36,
    color: COLORS.white,
    borderWidth: 1,
    backgroundColor: COLORS.secondaryColor,
  },
});

export default PlayScreen;
