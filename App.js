import 'react-native-gesture-handler';
import * as React from 'react';
import {Button, View, Text, Alert, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import {createBottomTabNavigator} from 'react-navigation-tabs';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.savegps = this.savegps.bind(this);
    this.getBookmarkList = this.getBookmarkList.bind(this);
    this.createNewBookmark = this.createNewBookmark.bind(this);
    this.baseUrl = 'http://192.168.17.10:8000';
    this.sessionId = 'zwkb6rcl7hzh7ffv6ll8tmv6l7490sxj';
  }
  savegps() {
    // Instead of navigator.geolocation, just use Geolocation.

    Geolocation.getCurrentPosition(
      async position => {
        this.createNewBookmark(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  async createNewBookmark(position) {
    let url = this.baseUrl + '/bookmarks.json';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: 'sessionid=' + this.sessionId,
          mode: 'cors',
        },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          alt: position.coords.altitude,
        }),
      });

      const responseJson = await response.json();
      console.log(responseJson);
      Alert.alert('Gps Location is saved ');
    } catch (error) {
      console.error(error);
    }
  }
  async getBookmarkList() {
    let url = this.baseUrl + '/bookmarks.json';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: 'sessionid =' + this.sessionId,
        },
      });
      const responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    return (
      <View style={styles.cent}>
        <Text>GPS LOCATION APP</Text>
        <Button title="Save Bookmark Location" onPress={() => this.savegps()} />
        <Button
          title="List all Bookmarks"
          onPress={() => this.getBookmarkList()}
        />
      </View>
    );
  }
}

class LoginScreen extends React.Component {
  render() {
    return (
      // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      //   <Text>Details Screen</Text>
      //   <Button
      //     title="Go to Details... again"
      //     onPress={() => this.props.navigation.push('Details')}
      //   />
      //   <Button
      //     title="Go to Home"
      //     onPress={() => this.props.navigation.navigate('Home')}
      //   />
      //   <Button
      //     title="Go back"
      //     onPress={() => this.props.navigation.goBack()}
      //   />
      // </View>
      <View style={styles.cent}>
        <Text>Login Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator = createBottomTabNavigator({
  Bookmark: HomeScreen,
  Login: LoginScreen,
});

export default createAppContainer(TabNavigator);
