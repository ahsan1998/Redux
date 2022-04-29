import React, { Component, useEffect, useState } from 'react';
import { StyleSheet} from 'react-native';
import { Box, Heading, Modal, Text, View, } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Spinner from 'react-native-spinkit';
import { connect } from "react-redux" 

function FeedScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Coin Market!</Text>
      </View>
    );
  }
  
  function NotificationsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bot!</Text>
      </View>
    );
  }

  const Tab = createMaterialTopTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          tabBarActiveTintColor: '#14F195',
          tabBarLabelStyle: { fontSize: hp(1.6) },
          tabBarStyle: { backgroundColor: '#071428' },
          swipeEnabled:true,
        }}
        tabBarStyle={{
            elevation:0,
            borderBottomWidth:1,
            borderBottomColor:'#14F195'
        }}
      >
        <Tab.Screen
          name="CoinMarket"
          component={FeedScreen}
          options={{ tabBarLabel: 'Coin Market' }}
        />
        <Tab.Screen
          name="Bot"
          component={NotificationsScreen}
          options={{ tabBarLabel: 'Bot' }}
        />
      </Tab.Navigator>
    );
  }  
const Home = (props) => {
    const [updated, setUpdated] = useState(false);
    const [expiresIn, setExpiresIn] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [pageLoad, setPageLoad] = useState(true);
    const [userInfo, setuserInfo] = useState({
        FirstName: '',
        LastName: '',
        photo: '',
        AccountCreatedOn: '',
        Email: '',
        load: false
    })
    const setData = async () => {
        try {
            const expiresInVar = await AsyncStorage.getItem('expiresIn');
            setExpiresIn(expiresInVar);
            const accessTokenVar = await AsyncStorage.getItem('accessToken');
            console.log(accessTokenVar + " " + expiresInVar)
            setAccessToken(accessTokenVar);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            
            setUpdated(true);
            setPageLoad(false)

        }

    }

    useEffect(() => { 
      setData();
      console.log(props)
    }, [updated]);

    return (
        <Box style={styles.container}>
            <Box bg={'#071428'} py={4} px={4} justifyContent={'center'}>
                <Heading size="md" fontWeight="normal" color='#fff' >Welcome {props.userDetails.firstName} {props.userDetails.lastName}</Heading>
            </Box>
            <MyTabs />
            <Modal isOpen={pageLoad} bg="rgba(20, 241, 149, 0.6)" flex={1} avoidKeyboard>
                <Spinner style={styles.spinner} isVisible={true} size={70} type={'Wave'} color={'#071428'} />
                <Heading fontWeight="bold" size="md" mt={10}>Gathering Information...</Heading>
            </Modal>
        </Box>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    }
}); 
const mapStateToProps = (state) => {
    return {

        userDetails: state.userDetails
    }
} 
export default connect(mapStateToProps, null)(Home)
