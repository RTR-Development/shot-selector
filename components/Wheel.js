import React, { Component, useEffect } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";

import colors from "../constants/colors";
import Config from "../components/Config";
import WheelOfFortune from "react-native-wheel-of-fortune";

let rewards = [];
const allRewards = ["2x", "1x", "New shot", "No shot", "Hand out"];
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

  close = (value, index) => {
    this.setState({
      winnerValue: value,
      winnerIndex: index,
    });
    setTimeout(() => {
      this.setState({ show: false });
    }, 300);
  };
  // _renderTopToPlay() {
  //   if (this.state.started == false) {
  //       if (this.props.playButton) {
  //           return (
  //               <TouchableOpacity onPress={() => this._onPress()}>
  //                   {this.props.playButton()}
  //               </TouchableOpacity>
  //           );
  //       } else {
  //           return (
  //               <View style={styles.modal}>
  //                   <TouchableOpacity onPress={() => this._onPress()}>
  //                       <RNText style={styles.startText}>{this.props.startText ? this.props.startText : "TAP2PLAY"}</RNText>
  //                   </TouchableOpacity>
  //               </View>
  //           );
  //       }
  //   }
  // }

  // _renderPlayButton = () => {
  //   return (
  //     <Text style={styles.tapToStart}>TAP 2 PLAY</Text>
  //   );
  // }

  render() {
    let { show } = this.state;
    return (
      <Modal
        visible={show}
        onRequestClose={this.props.close}
        animationType={"fade"}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            alignSelf: "center",
            maxWidth: "90%",
            maxHeight: "90%",
            paddingBottom: Config.deviceHeight * 0.28,
          }}
        >
          <WheelOfFortune
            onRef={(ref) => (this.child = ref)}
            rewards={rewards}
            getWinner={(value, index) => this.close(value, index)}
            borderWidth={12}
            borderColor={"#000000"}
            knobSize={40}
            duration={2000}
            innerRadius={1}
            colors={["#000000", "#f1c232"]}
            backgroundColor={"#f1c232"}
            textColor={"#FFF"}
            startText={"DoA"}
          />
        </View>
      </Modal>
    );
  }
}

export default Wheel;

const styles = StyleSheet.create({
  tapToStart: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
  },
});
