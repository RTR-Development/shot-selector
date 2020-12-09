import React, { Component } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";

import colors from "../constants/colors";
import Config from "../components/Config";
import WheelOfFortune from "react-native-wheel-of-fortune";

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
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };
  render() {
    let { show } = this.state;
    const rewards = this.props.data;
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
          />
        </View>
      </Modal>
    );
  }
}

export default Wheel;

const styles = StyleSheet.create({});
