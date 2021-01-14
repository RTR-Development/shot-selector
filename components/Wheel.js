import React, { Component } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";

import COLORS from "../constants/colors";
import Config from "../components/Config";
import WheelOfFortune from "./WheelOfFortune";

let rewards = [];
const allRewards = ["2x", "1x", "Share 2!", "New Shot!", "No Shot!", "Hand out"];
const numOfRewards = [4, 6, 8];

class Wheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      winnerValue: null,
      winnerIndex: null,
    };
    this.child = null;
  }

  show = () => {
    //Calculate random rewards for wheel
    rewards = [];
    numOfItems = numOfRewards[Math.floor(Math.random() * 3)];
    for (i = 0; i < numOfItems; i++) {
      rewards.push(allRewards[Math.floor(Math.random() * allRewards.length)]);
    }
    //Show wheel modal
    this.setState({ show: true });
  };

  close = (value, index, shotName, shotSetter) => {
    this.setState({
      winnerValue: value,
      winnerIndex: index,
    });
    setTimeout(() => {
      this.setState({ show: false });
    }, 300);
    if (
      this.state.winnerValue === "2x" ||
      this.state.winnerValue === "1x" ||
      this.state.winnerValue === "Hand out"
    ) {
      shotSetter(this.state.winnerValue + " " + shotName);
    } else {
      shotSetter(this.state.winnerValue);
    }
  };

  render() {
    let { show } = this.state;
    return (
      <Modal
        visible={show}
        onRequestClose={this.props.close}
        animationType={"fade"}
        transparent={true}
      >
        <View style={styles.container}>
          <WheelOfFortune
            onRef={(ref) => (this.child = ref)}
            rewards={rewards}
            getWinner={(value, index) =>
              this.close(
                value,
                index,
                this.props.shotName,
                this.props.shotSetter
              )
            }
            borderWidth={12}
            borderColor={COLORS.black}
            knobSize={40}
            duration={5000}
            innerRadius={10}
            colors={[COLORS.red, COLORS.primaryColor]}
            backgroundColor={COLORS.primaryColor}
          />
        </View>
      </Modal>
    );
  }
}

export default Wheel;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    maxWidth: "90%",
    maxHeight: "90%",
    paddingBottom: Config.deviceHeight * 0.28,
  },
  // tapToStart: {
  //   fontSize: 50,
  //   color: COLORS.white,
  //   fontFamily: "assistant-bold",
  // },
});
