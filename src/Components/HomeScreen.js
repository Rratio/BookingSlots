import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Header} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {getAllData} from './Actions/index';
import {bindActionCreators} from 'redux';
import deviceStorage from './Storage/deviceStorage';
const slots = require('./slots.json');

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    deviceStorage.retriveUserDataWithSlots().then(slot => {
      this.props.AllData.slots = slot;
    });
  }

  renderTimeSlots = () => {
    this.props.AllData.slots = slots;

    return (
      <FlatList
        style={Styles.flatList}
        data={this.props.AllData.slots}
        numColumns={1}
        keyExtractor={(item, index) => String(index)}
        renderItem={item => {
          return (
            <TouchableOpacity
              onPress={() => {
                Actions.push('Detail', {slots: Object.keys(item.item)});
              }}>
              <View
                style={
                  item.item[Object.keys(item.item)].booked &&
                  item.item[Object.keys(item.item)].details
                    ? Styles.timeTextSelectedView
                    : Styles.timeTextView
                }>
                <Text style={Styles.timeText}>{Object.keys(item.item)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={Styles.containerStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      />
    );
  };

  render() {
    return (
      <View style={Styles.chooseTimeView}>
        <Header androidStatusBarColor="#5FCACC" style={Styles.header}>
          <Text style={Styles.dateHeaderTxt}>Booking Slots</Text>
        </Header>
        {this.renderTimeSlots()}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  header: {
    backgroundColor: '#5FCACC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    paddingBottom: 30,
  },
  dateHeaderTxt: {
    fontSize: 20,
    left: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chooseTimeView: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  timeTextView: {
    width: 250,
    height: 45,
    top: 15,
    marginTop: 30,
    marginLeft: 30,
    borderRadius: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  timeTextSelectedView: {
    width: 250,
    height: 45,
    top: 15,
    marginTop: 30,
    marginLeft: 30,
    borderRadius: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  timeText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  containerStyle: {
    paddingBottom: 30,
  },
  time: {
    fontSize: 12,
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    AllData: state.AllData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getAllData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
