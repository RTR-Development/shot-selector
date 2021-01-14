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

const deviceHeight = Dimensions.get("window").height;

class BottomPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };

  handleCancel = (value) => (event) => {
    this.setState({ show: value });
  };

  //Ask for CAMERA and CAMERA_ROLL permissions
  verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
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

  //Open camera and save taken picture
  takeImageHandler = async () => {
    const hasPermission = await this.verifyPermissions();
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

  //Open image gallery and save selected picture
  useImageRoll = async () => {
    const hasPermission = await this.verifyPermissions();
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

  renderOutsideTouchable(onTouch) {
    const view = <View style={styles.outsideContainer} />;
    if (!onTouch) return view;
    return (
      <TouchableWithoutFeedback onPress={onTouch} style={styles.container}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  renderTitle = (title) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    );
  };

  renderContent = (data) => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={this.renderItem}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    );
  };

  renderItem = ({ item }) => {
    if (item.name === "Camera") {
      return (
        <View>
          <TouchableOpacity onPress={this.takeImageHandler} activeOpacity={0.7}>
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
          <TouchableOpacity onPress={this.useImageRoll} activeOpacity={0.7}>
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
            onPress={this.handleCancel(false)}
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

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    let { show } = this.state;
    const { onTouchOutside, title, data } = this.props;
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={show}
        onRequestClose={this.close}
      >
        <View style={styles.container}>
          {this.renderOutsideTouchable(onTouchOutside)}
          <View style={styles.popupContainer}>
            {this.renderTitle(title)}
            {this.renderContent(data)}
          </View>
        </View>
      </Modal>
    );
  }
}

export default BottomPopup;

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
    maxHeight: deviceHeight * 0.4,
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
