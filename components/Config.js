import { Dimensions } from "react-native";

// Get device dimensions
const Config = {
  deviceWidth: Dimensions.get("window").width,
  deviceHeight: Dimensions.get("window").height,
};

export default Config;
