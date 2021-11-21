import React, { Component } from "react";
import {
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../constants/colors";
import Config from "./Config";

const BottomPopup = (props) => {
  // Ask for device permissions
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions granted!",
        "Please give the app permission to use the camera and camera roll",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  // Open camera and save taken picture
  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    this.props.onImageTaken(image.uri);
    this.setState({ show: false });
  };

  // Open image gallery and save selected picture
  const useImageRoll = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    this.props.onImageTaken(image.uri);
    this.setState({ show: false });
  };

  const renderOutsideTouchable = (show, showSetter) => {
    const view = <View style={styles.outsideContainer} />;
    if (!show) return view;
    return (
      <TouchableWithoutFeedback
        onPress={showSetter(false)}
        style={styles.container}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  };

  const renderTitle = (title) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    );
  };

  const renderContent = (data) => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (item.name === "Camera") {
      return (
        <View>
          <TouchableOpacity onPress={takeImageHandler} activeOpacity={0.7}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Ionicons
                name="ios-camera"
                size={34}
                color={COLORS.secondaryColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (item.name === "Gallery") {
      return (
        <View>
          <TouchableOpacity onPress={useImageRoll} activeOpacity={0.7}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Ionicons
                name="ios-images"
                size={34}
                color={COLORS.secondaryColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            onPress={() => props.showSetter(false)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <Modal animationType={"fade"} transparent={true}>
      <View style={styles.container}>
        {renderOutsideTouchable(props.show, props.showSetter)}
        <View style={styles.popupContainer}>
          {renderTitle(props.title)}
          {renderContent(props.data)}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outsideContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: COLORS.white,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    maxHeight: Config.deviceHeight * 0.4,
  },
  separator: {
    opacity: 0.2,
    backgroundColor: COLORS.black,
    height: 1,
  },
  titleText: {
    color: COLORS.secondaryColor,
    fontSize: 25,
    marginTop: 15,
    marginBottom: 30,
  },
  itemContainer: {
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    marginLeft: 7,
    marginRight: 7,
    fontSize: 20,
    color: COLORS.secondaryColor,
  },
});

export default BottomPopup;
