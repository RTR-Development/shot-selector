import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Config from "../components/Config";
import Colors from "../constants/colors";

const StartScreen = (props) => {
  //Open link to privacy statement
  privacyHandler = async () => {
    Alert.alert(
      "Privacy Statement",
      "Do you want to open our privacy statement in a webbrowser?",
      [
        {
          text: "Yes",
          onPress: () => {
            Linking.openURL(
              "http://www.rtrdevelopment.com/privacy-policy.html"
            ).catch((err) => console.error("Couldn't load page", err));
          },
        },
        {
          text: "No",
          onPress: () => console.log("Privacy statement cancelled"),
        },
      ]
    );
  };

  //Go to store page for user to like the app
  likeHandler = async () => {
    Linking.openURL(
      "http://play.google.com/store/apps/details?id=com.rtrdevelopment.shot_selector"
    ).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/shot_selector_logo.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonList}>
        <TouchableOpacity
          onPress={() => props.onChangeScreen("PlayScreen")}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>START</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.onChangeScreen("InputScreen")}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>SELECT SHOTS</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.ioniconContainer}>
        <TouchableOpacity
          onPress={() => privacyHandler()}
          style={styles.ionicon}
        >
          <Ionicons
            name="md-help-circle"
            size={Config.deviceHeight > 600 ? 48 : 42}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => likeHandler()} style={styles.ionicon}>
          <Ionicons
            name="md-thumbs-up"
            size={Config.deviceHeight > 600 ? 48 : 42}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
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
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Config.deviceHeight > 600 ? "90%" : "85%",
    resizeMode: "contain",
  },
  buttonList: {
    width: Config.deviceHeight > 600 ? "80%" : "75%",
    marginBottom: Config.deviceHeight * 0.07,
  },
  buttonContainer: {
    backgroundColor: Colors.darkGray,
    borderRadius: 30,
    margin: Config.deviceHeight > 600 ? 12 : 11,
    paddingVertical: Config.deviceHeight > 600 ? 16 : 15,
    paddingHorizontal: Config.deviceHeight > 600 ? 12 : 11,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: "assistant-bold",
    textAlign: "center",
    fontSize: Config.deviceHeight > 600 ? 40 : 35,
  },
  ioniconContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  ionicon: {
    marginHorizontal: Config.deviceWidth * 0.08,
    marginBottom: Config.deviceHeight * 0.09,
  },
});

export default StartScreen;
