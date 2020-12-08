import React from "react";
import { StyleSheet, Text, Modal, TouchableOpacity } from "react-native";

import colors from "../constants/colors";
import Config from "../components/Config";
import WheelOfFortune from "react-native-wheel-of-fortune";

export class Wheel extends React.Component {
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
        <WheelOfFortune rewards={rewards} />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({});
