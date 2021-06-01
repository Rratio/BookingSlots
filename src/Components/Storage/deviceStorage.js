import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceStorage = {
  // manager storage
  async _storeUserDataWithSlots(data) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(data));
    } catch (error) {
      console.log('error', error);
    }
  },

  async retriveUserDataWithSlots() {
    try {
      let userInfo = await AsyncStorage.getItem('user_data');
      if (userInfo !== null) {
        return JSON.parse(userInfo);
      } else {
        return userInfo;
      }
    } catch (error) {
      console.log('catch', error);
    }
  },
};

export default deviceStorage;
