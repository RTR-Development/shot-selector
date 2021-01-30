import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

import Config from "../components/Config";
import COLORS from "../constants/colors";
import BottomPopup from "../components/BottomPopup";

import DrinksContext from "../context/drinks-context";
import { insertShot, deleteShot, updateWheel } from "../database/sqlite";

const popupList = [
  {
    id: 1,
    name: "Camera",
  },
  {
    id: 2,
    name: "Gallery",
  },
  {
    id: 3,
    name: "Close",
  },
];

const InputScreen = (props) => {
  // Ensure that back gesture / button returns to the StartScreen
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

  // Save current TextInput values of the name, abv and occurrence;
  // save the currently selected image
  const [drinkName, setDrinkName] = useState();
  const [drinkABV, setDrinkABV] = useState();
  const [drinkOccurence, setDrinkOccurence] = useState(1);
  const [selectedImage, setSelectedImage] = useState();

  // Manage BottomPopup
  // onShowPopup makes BottomPopup visible on screen
  // onClosePopup makes BottomPopup invisible on screen
  let popupRef = React.createRef();
  const onShowPopup = async () => {
    await playSound("menu");
    popupRef.show();
  };
  const onClosePopup = () => {
    popupRef.close();
  };

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  // Add filled in shot into SQLite database and Context database
  const handleAddAction = async (context) => {
    await playSound("menu");
    // Check if a shot name has been added
    if (!drinkName) {
      Alert.alert(
        "No name specified",
        "Please enter a name of the shot or drink",
        [{ text: "OK" }]
      );
      // Check if a shot occurence has been added
    } else if (!Number.isInteger(parseInt(drinkABV))) {
      Alert.alert(
        "No correct ALC specified",
        "Please enter an alcohol percentage between 0% and 100%",
        [{ text: "OK" }]
      );
    } else {
      // Create persistant filesystem path
      let newPath = "";
      if (selectedImage) {
        newPath = FileSystem.documentDirectory + selectedImage.split("/").pop();
        // Move file from cache location to persistant file location
        try {
          await FileSystem.moveAsync({
            from: selectedImage,
            to: newPath,
          });
        } catch (err) {
          console.log(err);
        }
      }
      // Insert into databases
      try {
        const dbResult = await insertShot(
          drinkName,
          drinkABV,
          parseInt(drinkOccurence),
          newPath
        );
        console.log(dbResult);
        context.setSavedDrinks((curSavedDrinks) => [
          {
            id: dbResult.insertId,
            name: drinkName,
            abv: drinkABV,
            occ: parseInt(drinkOccurence),
            imageUri: newPath,
          },
          ...curSavedDrinks,
        ]);
        console.log("Data successfully added to database");
      } catch (err) {
        console.log("Failed to add data to database");
        console.log(err);
      }
      // Clear all textinputs and image selector
      setSelectedImage(null);
      this.nameInput.clear();
      this.abvInput.clear();
      setDrinkOccurence(1);
      this.occInput.setNativeProps({ value: 1 });
    }
  };

  // const handleDefaultAction = async (context) => {
  //   await playSound("menu");

  //   // Create default options
  //   const defaultDrinks = ["Bier", "Vodka", "Bacardi"];
  //   const defaultABV = [5, 35, 30];
  //   const defaultPictures = ["Bier", "Vodka", "Bacardi"];

  //   // Select random number
  //   const magic = Math.floor(Math.random() * defaultDrinks.length);

  //   // Select shots from options according to random number
  //   let drinkName = defaultDrinks[magic];
  //   let drinkABV = defaultABV[magic];
  //   let drinkOccurence = 1;
  //   let drinkPicture = defaultPictures[magic];

  //   // Insert into databases
  //   try {
  //     const dbResult = await insertShot(
  //       drinkName,
  //       drinkABV,
  //       drinkOccurence,
  //       drinkPicture
  //     );
  //     console.log(dbResult);
  //     context.setSavedDrinks((curSavedDrinks) => [
  //       {
  //         id: dbResult.insertId,
  //         name: drinkName,
  //         abv: drinkABV,
  //         occ: parseInt(drinkOccurence),
  //         imageUri: drinkPicture,
  //       },
  //       ...curSavedDrinks,
  //     ]);
  //     console.log("Data successfully added to database");
  //   } catch (err) {
  //     console.log("Failed to add data to database");
  //     console.log(err);
  //   }
  // };

  // Delete selected shot out of SQLite database and Context database
  const handleDeleteAction = async (context, id) => {
    await playSound("break_glass");
    try {
      const dbResult = await deleteShot(id);
      context.setSavedDrinks(
        context.savedDrinks.filter((item) => item.id !== id)
      );
      console.log("Data successfully deleted from database");
    } catch (err) {
      console.log("Failed to delete data from database");
      console.log(err);
    }
  };

  // Change wheel status switch in SQLite database and Context database
  const handleSwitchAction = async (context) => {
    await playSound("menu");
    try {
      if (context.savedWheel[0].active == 1) {
        const dbResult = await updateWheel(0);
        context.setSavedWheel([{ active: 0 }]);
      } else {
        const dbResult = await updateWheel(1);
        context.setSavedWheel([{ active: 1 }]);
      }
    } catch (err) {
      console.log("Failed to change wheel status");
      console.log(err);
    }
  };

  playSound = async (song) => {
    if (song == "menu") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/menu.mp3")
      );
      await sound.playAsync();
    } else if (song == "break_glass") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/break_glass.mp3")
      );
      await sound.playAsync();
    } else {
      console.log("Requested sound not found");
    }
  };

  return (
    <DrinksContext.Consumer>
      {(context) => (
        <View style={styles.mainContainer}>
          <View style={styles.imageContainerInputLogo}>
            <Image
              source={require("../assets/images/input_shots_title_logo.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.inputContainer}>
            <View>
              <View style={[styles.inputCategory, { paddingTop: 8 }]}>
                <Text style={styles.textCategory}>Name:</Text>
              </View>
              <View style={[styles.inputCategory, { paddingTop: 19 }]}>
                <Text style={styles.textCategory}>ALC:</Text>
              </View>
              <View style={[styles.inputCategory, { paddingTop: 13 }]}>
                <Text style={styles.textCategory}>Chance:</Text>
              </View>
            </View>
            <View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Name of beverage"
                  placeholderTextColor="rgba(100, 100, 100, 0.6)"
                  onChangeText={(value) => setDrinkName(value)}
                  ref={(input) => {
                    nameInput = input;
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    abvInput.focus();
                  }}
                  blurOnSubmit={false}
                  numberOfLines={1}
                />
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Alcohol % of beverage"
                  placeholderTextColor="rgba(100, 100, 100, 0.6)"
                  keyboardType="decimal-pad"
                  onChangeText={(value) => setDrinkABV(value)}
                  ref={(input) => {
                    abvInput = input;
                  }}
                  returnKeyType="done"
                  numberOfLines={1}
                />
              </View>

              <View style={styles.inputBox}>
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#D1D1D1"
                  thumbTintColor="white"
                  onValueChange={(value) => setDrinkOccurence(value)}
                  ref={(input) => {
                    occInput = input;
                  }}
                />
                <Text style={styles.sliderText}>{drinkOccurence}x</Text>
              </View>
            </View>
            <View style={{ paddingTop: 34 }}>
              <TouchableOpacity onPress={onShowPopup} activeOpacity={0.7}>
                <Ionicons
                  name="ios-image"
                  size={Config.deviceWidth > 350 ? 60 : 55}
                  color="white"
                  style={styles.ionicon}
                />
              </TouchableOpacity>
              {!selectedImage ? (
                <Text style={styles.textIonicon}>Not selected</Text>
              ) : (
                <Text style={styles.textIonicon}>SELECTED</Text>
              )}
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Text style={[styles.textCategory, { color: "black" }]}>
              Total Drinks: {context.savedDrinks.length}
            </Text>
            <TouchableOpacity
              onPress={() => handleAddAction(context)}
              activeOpacity={0.7}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>ADD!</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center" }}>Wheel:</Text>
              <Switch
                style={{ alignSelf: "center" }}
                onValueChange={() => handleSwitchAction(context)}
                value={context.savedWheel[0].active ? true : false}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center" }}>Random:</Text>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => handleDefaultAction(context)}
                activeOpacity={0.7}
              >
                <Image
                  source={require("../assets/images/icon_shot.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.flatListContainer}>
            {context.savedDrinks.length ? (
              <Text style={styles.headListText}>TAP to delete</Text>
            ) : (
              <View></View>
            )}
            <FlatList
              data={context.savedDrinks}
              renderItem={(itemData) => (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteAction(context, itemData.item.id)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.list}>
                      <Text style={styles.listText}>{itemData.item.name}</Text>
                      <Text style={styles.listText}>{itemData.item.abv}</Text>
                      <Text style={styles.listText}>{itemData.item.occ}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <View style={{ width: Config.deviceWidth }}>
                  <Text style={[styles.textCategory, { paddingTop: 20 }]}>
                    No shots have been added
                  </Text>
                  <Ionicons
                    style={styles.ionicon}
                    name="ios-arrow-down"
                    size={24}
                    color="black"
                  />
                </View>
              }
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          <BottomPopup
            title="Select an image"
            ref={(target) => (popupRef = target)}
            onTouchOutside={onClosePopup}
            data={popupList}
            onImageTaken={imageTakenHandler}
          />
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
  imageContainerInputLogo: {
    flex: 1,
    width: "100%",
    marginTop: Config.deviceHeight * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: Config.deviceHeight > 700 ? "65%" : "55%",
    resizeMode: "contain",
  },
  inputContainer: {
    marginTop: Config.deviceHeight * 0.01,
    flexDirection: "row",
    padding: Config.deviceHeight > 700 ? 7 : 5,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryColor,
  },
  inputCategory: {
    marginHorizontal: Config.deviceWidth * 0.01,
  },
  textCategory: {
    fontFamily: "assistant-regular",
    fontSize: Config.deviceWidth > 350 ? 20 : 18,
    textAlign: "center",
    color: COLORS.white,
  },
  ionicon: {
    textAlign: "center",
  },
  textIonicon: {
    fontFamily: "assistant-regular",
    fontSize: Config.deviceWidth > 350 ? 14 : 13,
    color: COLORS.white,
    marginTop: Config.deviceHeight > 600 ? -4 : -3,
    fontStyle: "italic",
  },
  inputBox: {
    padding: Config.deviceHeight > 600 ? 5 : 4,
  },
  input: {
    fontFamily: "assistant-regular",
    borderColor: COLORS.shadow,
    borderWidth: 1.5,
    borderRadius: 3,
    padding: Config.deviceHeight > 600 ? 2 : 1.8,
    textAlign: "center",
    backgroundColor: COLORS.white,
    width: Config.deviceWidth / 2.1,
  },
  sliderText: {
    fontFamily: "assistant-regular",
    fontSize: Config.deviceHeight > 600 ? 18 : 16,
    textAlign: "center",
    marginTop: -7.5,
    color: COLORS.white,
  },
  actionContainer: {
    marginTop: Config.deviceHeight * 0.02,
  },
  buttonContainer: {
    width: Config.deviceWidth * 0.25,
    paddingVertical: Config.deviceWidth * 0.04,
    backgroundColor: COLORS.secondaryColor,
    borderRadius: 20,
    margin: 12,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.white,
    fontFamily: "assistant-bold",
    fontSize: Config.deviceHeight > 600 ? 24 : 22,
    fontSize: 30,
  },
  headListText: {
    textAlign: "center",
    fontFamily: "assistant-regular",
    fontSize: 16,
  },
  flatListContainer: {
    flex: 1,
    alignItems: "center",
  },
  listContainer: {
    borderTopWidth: 2,
    borderColor: COLORS.secondaryColor,
  },
  list: {
    borderBottomWidth: 2,
    borderRadius: 0,
    borderColor: COLORS.secondaryColor,
    width: Config.deviceWidth,
    flexDirection: "row",
    paddingVertical: Config.deviceHeight * 0.003,
    backgroundColor: COLORS.shadow,
  },
  listText: {
    flex: 1,
    textAlign: "center",
    fontFamily: "assistant-regular",
    fontSize: 16,
    paddingVertical: Config.deviceHeight * 0.007,
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
  },
});

export default InputScreen;
