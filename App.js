/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native'
import { Button, IconButton, Image, NativeBaseProvider, StatusBar, Text, } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  DrawerActions
} from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Auth State
import { AuthContext } from './component/auth/context';
import RootStackScreen from './component/auth/RootStackScreen';

//Components
import Home from './component/home/home';
import Profile from './component/home/profile';
import ChangePassword from './component/home/changePassword';

//Drawer Import
import DrawerContent from './component/home/DrawerContent';
import Splash from './component/splash';
import auth, { firebase } from "@react-native-firebase/auth"

//Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'
import { store, persistor } from './component/Redux/Store/userStore';
import { socket } from './component/connection/socket';

const App = (navigation) => {
  const AppDrawer = createDrawerNavigator();

  const initialLoginState = {
    isLoading: true,
    expiresIn: null,
    navigate: null,
    accessToken: null
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
      return {
          ...prevState,
          expiresIn: action.expiresIn,
          navigate: action.navigate,
          accessToken: action.accessToken,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          expiresIn: action.expiresIn,
          navigate: action.navigate,
          accessToken: action.accessToken,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          expiresIn: null,
          navigate: null,
          accessToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          expiresIn: action.expiresIn,
          navigate: action.navigate,
          accessToken: action.accessToken,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      // setexpiresIn('fgkj');
      // setIsLoading(false);
      const expiresIn = foundUser.expiresIn;
      const navigate = foundUser.navigate;
      const accessToken = foundUser.accessToken;
      //console.log("signin: " + expiresIn)
      //console.log("signin: " + navigate)
      try {
        await AsyncStorage.setItem('expiresIn', expiresIn);
        await AsyncStorage.setItem('navigate', navigate);
        await AsyncStorage.setItem('accessToken', accessToken);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', expiresIn);
      dispatch({ type: 'LOGIN', expiresIn: expiresIn, accessToken:accessToken, navigate: navigate });
    },
    signOut: async () => {
      // setexpiresIn(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('expiresIn');
        await AsyncStorage.removeItem('navigate');
        await AsyncStorage.removeItem('accessToken');
      } catch (e) {
        console.log(e);
      }
      
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async (newUser) => {
      // setexpiresIn('fgkj');
      // setIsLoading(false);
      const expiresIn = newUser.expiresIn;
      const navigate = newUser.navigate;
      const accessToken = newUser.accessToken;
      try {
        await AsyncStorage.setItem('expiresIn', expiresIn);
        await AsyncStorage.setItem('navigate', navigate);
        await AsyncStorage.setItem('accessToken', accessToken);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'REGISTER', expiresIn: expiresIn, accessToken:accessToken, navigate: navigate });
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      socket.on("connect", () => {
        console.log("socket  " + socket.id); // x8WIv7-mJelg7on_ALbx
        console.log(socket.connected)
    });
      let expiresIn;
      expiresIn = null;
      let navigate;
      navigate = null;
      let accessToken;
      accessToken=null;
      try {
        //User Auth verfiy Here//////////
        let user = firebase.auth().currentUser;
        if (user) {
          //console.log("user12: "+ JSON.stringify(user));

          expiresIn = await AsyncStorage.getItem('expiresIn');        
          navigate = await AsyncStorage.getItem('navigate');  
          accessToken = await AsyncStorage.getItem('accessToken');  
         
          if(user.expiresIn !== expiresIn){
            dispatch({ type: 'LOGOUT' });
          }
        } 
        else {
          console.log("user: "+user);
          await AsyncStorage.removeItem('expiresIn');
          await AsyncStorage.removeItem('navigate');
          await AsyncStorage.removeItem('accessToken');
          expiresIn = null;
          navigate = null;
          accessToken= null;
        }
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', expiresIn: expiresIn,accessToken:accessToken, navigate: navigate });  
    }, 4000);
  }, []);

  
  return (
    <NavigationContainer >
      <Provider store={store}>
      <PersistGate
loading={null}
persistor={persistor}
>
      <NativeBaseProvider>
          <AuthContext.Provider value={authContext}>
          <StatusBar backgroundColor='#071428' barStyle="default" />
            {loginState.isLoading ? (
              <Splash/>
            )
            : (loginState.expiresIn !== null && loginState.navigate !== null && loginState.accessToken !== null) ? (
              <AppDrawer.Navigator drawerPosition="left"
                drawerContent={props => <DrawerContent {...props} />}
                screenOptions={{
                  title: '',

                 /* headerLeft: () => (
                    <Icon style={{ paddingHorizontal: hp(2) }} name="wrap-disabled" size={hp(3.5)} color="#fff"
                      onPress={() => { DrawerActions.openDrawer() }} />

                  ),*/
                  headerRight: () => (
                    <Icon style={{ paddingHorizontal: hp(2) }} name="bell" size={hp(3.5)} color="#fff" />
                  ),


                  headerTitleAlign: 'left',
                  headerStyle: {
                    backgroundColor: '#071428',
                    elevation: 0,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'normal',
                    fontSize: hp(2.5)
                  },
                }} >
                <AppDrawer.Screen name="Home" component={Home} />
                <AppDrawer.Screen name="Profile" component={Profile}
                  options={{ title: 'Profile' }} />
                <AppDrawer.Screen name="ChangePassword" component={ChangePassword}
                  options={{ title: 'ChangePassword' }} />

              </AppDrawer.Navigator>
            )
              :
              <RootStackScreen />
            }

          </AuthContext.Provider>
        
      </NativeBaseProvider>
      </PersistGate>

      </Provider>

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
