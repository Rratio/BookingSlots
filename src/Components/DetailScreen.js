import React, {Component, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  Image,
  Platform,
  PermissionsAndroid,
  Warning,
  Modal,
  Animated,
} from 'react-native';
import {Header, Button, InputGroup, Input, Container} from 'native-base';
import {Actions} from 'react-native-router-flux';
import deviceStorage from './Storage/deviceStorage';
import CameraRoll from '@react-native-community/cameraroll';
import {connect} from 'react-redux';
import {getAllData} from './Actions/index';
import {bindActionCreators} from 'redux';
const slots = require('./slots.json');

function GetImageData({closeModalVisible}) {
  let [isValue, setValue] = useState('false');
  let [isData, setData] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    CameraRoll.getPhotos({
      first: 200,
      assetType: 'Photos',
    }).then(result => {
      setValue('true');
      setData(result.edges);
    });

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, isValue]);

  const renderItem = item => {
    let index = item.index;
    item = item.item;
    return (
      <TouchableHighlight key={index} style={styles.imageTouchStyle}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [80, 0],
                }),
              },
            ],
          }}>
          <Image
            style={styles.singleImageSelect}
            source={{uri: item.node.image.uri}}
          />
        </Animated.View>
      </TouchableHighlight>
    );
  };

  return (
    <Modal
      isVisible={true}
      transparent={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onRequestClose={closeModalVisible}>
      <Container style={styles.modalContainer1}>
        <Container style={styles.modalContainer2}>
          <Header androidStatusBarColor="#5FCACC" style={styles.gelleryHeader}>
            <Text style={styles.galleryHeaderText}>Photo Gallery</Text>
          </Header>
          <FlatList
            style={styles.flatListView}
            data={isData}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </Container>
      </Container>
    </Modal>
  );
}

class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      openImageModal: false,
    };
  }

  componentDidMount() {
    let AllData = this.props.AllData;
    AllData.slots.map(item => {
      if (Object.keys(item)[0] === this.props.slots[0]) {
        let slot = item[Object.keys(item)[0]];
        this.setState({
          firstName: slot.details.Firstname,
          lastName: slot.details.Lastname,
          phoneNumber: slot.details.phone,
        });
      }
    });
  }

  closeModalVisible = () => {
    this.setState({openImageModal: false});
  };

  onSubmit = async () => {
    let AllData = this.props.AllData;
    if (this.state.firstName && this.state.lastName && this.state.phoneNumber) {
      AllData.slots.map(item => {
        if (Object.keys(item)[0] === this.props.slots[0]) {
          var slot = item[Object.keys(item)[0]];
          slot.booked = true;
          let data = {
            Firstname: this.state.firstName,
            Lastname: this.state.lastName,
            phone: this.state.phoneNumber,
          };
          slot.details = data;
        }
      });
      AllData.slots = slots;
      deviceStorage._storeUserDataWithSlots(slots);
      await Actions.pop();
      await Actions.refresh({key: Math.random()});
    }
  };

  permission = async () => {
    try {
      if (Platform.OS === 'android') {
        const userResponse = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        this.setState({openImageModal: true});
        return userResponse;
      }
    } catch (err) {
      Warning(err);
    }
    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#5FCACC" style={styles.container1}>
          <Text style={styles.logoText}>Detail Screen</Text>
        </Header>
        <View style={styles.topView}>
          <View style={styles.topView1}>
            <InputGroup style={styles.inputGroup}>
              <Input
                numberOfLines={1}
                keyboardType="default"
                style={styles.input}
                placeholder="Enter Firstname"
                placeholderTextColor="#bababa"
                value={this.state.firstName}
                onChangeText={name => this.setState({firstName: name})}
              />
            </InputGroup>
            <InputGroup style={styles.inputGroup}>
              <Input
                numberOfLines={1}
                keyboardType="default"
                style={styles.input}
                placeholder="Enter Lastname"
                placeholderTextColor="#bababa"
                value={this.state.lastName}
                onChangeText={name => this.setState({lastName: name})}
              />
            </InputGroup>
            <InputGroup style={styles.inputGroup}>
              <Input
                numberOfLines={1}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Enter Phone number"
                placeholderTextColor="#bababa"
                value={this.state.phoneNumber}
                onChangeText={number => this.setState({phoneNumber: number})}
              />
            </InputGroup>
          </View>
          <View style={styles.container2}>
            <Button style={styles.buttonStyle} onPress={() => Actions.pop()}>
              <Text style={styles.btnTxt}>CANCEL</Text>
            </Button>
            <Button style={styles.buttonStyle} onPress={this.onSubmit}>
              <Text style={styles.btnTxt}>SAVE</Text>
            </Button>
          </View>
        </View>
        <Button onPress={this.permission} style={styles.gelleryShowButton}>
          <Text style={styles.gelleryText}>+</Text>
        </Button>
        {this.state.openImageModal ? (
          <GetImageData closeModalVisible={this.closeModalVisible} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    height: 120,
    width: '100%',
    backgroundColor: '#5FCACC',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 30,
    top: -20,
    left: -90,
  },
  topView: {
    marginTop: -40,
    width: '90%',
    height: '70%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    elevation: 10,
    borderRadius: 10,
  },
  topView1: {marginTop: 10},
  inputGroup: {
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    alignSelf: 'center',
    elevation: 5,
    width: 150,
    marginTop: 40,
    height: 50,
    backgroundColor: '#5FCACC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleImageSelect: {
    width: 'auto',
    borderRadius: 10,
    height: 120,
  },
  btnTxt: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  gelleryShowButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  gelleryText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageTouchStyle: {
    width: '31.5%',
    height: 120,
    borderWidth: 0.5,
    borderColor: '#ddd',
    margin: 3,
    borderRadius: 10,
  },
  gelleryHeader: {
    backgroundColor: '#5FCACC',
  },
  galleryHeaderText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#FFFFFF',
  },
  flatListView: {
    marginTop: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#0000006b',
  },
  modalContainer2: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    maxHeight: '100%',
    width: '100%',
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen);
