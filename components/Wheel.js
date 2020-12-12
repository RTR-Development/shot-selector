import React, { Component } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";

import colors from "../constants/colors";
import Config from "../components/Config";
import WheelOfFortune from "react-native-wheel-of-fortune";

let rewards = [];
const allRewards = ["2x", "1x", "New shot", "No shot", "Hand out"];
const numOfRewards = [4, 6, 8];

async function generateReward() {
  rewards = [];
  numOfItems = numOfRewards[Math.floor(Math.random() * 3) + 1];
  console.log(numOfItems);
  for (i = 0; i < numOfItems; i++) {
    rewards.push(allRewards[Math.floor(Math.random() * allRewards.length)]);
  }
}

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
    generateReward();
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
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
        onRequestClose={this.close}
        animationType={"fade"}
        transparent={true}
      >
        <View style={{ flex: 1 }}>
          <WheelOfFortune
            onRef={(ref) => (this.child = ref)}
            rewards={rewards}
            getWinner={(value, index) =>
              this.setState({ winnerValue: value, winnerIndex: index })
            }
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
