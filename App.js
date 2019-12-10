import 'react-native-gesture-handler';
import * as React from 'react';
import {Button, View, Text, StyleSheet, TextInput} from 'react-native';
import {createAppContainer} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import {createBottomTabNavigator} from 'react-navigation-tabs';

let baseUrl = 'http://192.168.17.10:8000';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.savegps = this.savegps.bind(this);
    this.getBookmarkList = this.getBookmarkList.bind(this);
    this.createNewBookmark = this.createNewBookmark.bind(this);
    this.state = {
      data: 'the data',
    };
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
    let url = baseUrl + '/bookmarks.json';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          alt: position.coords.altitude,
        }),
        credentials: 'same-origin',
      });

      const responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.error(error);
    }
  }
  async getBookmarkList() {
    let url = baseUrl + '/bookmarks.json';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
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
        <Text>{this.state.data}</Text>
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
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: '',
      password: '',
      currentMessage: 'Not logged in',
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    this.setState({
      currentMessage: 'Logging in...',
    });

    let url = baseUrl + '/login/';
    let formData = new FormData();
    formData.append('username', this.state.currentUsername);
    formData.append('password', this.state.password);
    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({currentMessage: 'Currently logged in'});
        } else if (response.status === 403) {
          this.setState({currentMessage: 'Authentication error'});
        } else {
          this.setState({currentMessage: 'Server error try again later'});
        }
      })
      .then(data => {})
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    this.setState({
      currentMessage: 'Logged out',
    });

    let url = baseUrl + '/logout/';
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({currentMessage: 'Logged out '});
        }
      })
      .then(data => {})
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.cent}>
        <Text>Enter Username:</Text>
        <TextInput
          placeholder="Username"
          onChangeText={text => this.setState({currentUsername: text})}
        />
        <Text>Enter Password:</Text>
        <TextInput
          placeholder="Password"
          onChangeText={text => this.setState({password: text})}
        />
        <Button title="Login" onPress={() => this.login()} />
        <Button title="Logout" onPress={() => this.logout()} />
        <Text>{this.state.currentMessage}</Text>
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
  Login: LoginScreen,
  Bookmark: HomeScreen,
});

export default createAppContainer(TabNavigator);
