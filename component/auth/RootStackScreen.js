import React from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import SignUp from './signUp';
import ForgotPassword from './forgotPassword';
import RegisterUser from './registerStack/registerUser';


const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
    <RootStack.Navigator
        screenOptions={{
            headerShown: false
        }}>
        
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="RegisterUser" component={RegisterUser} 
        options={({route: {params}}) => ({
            headerLeft: null,
            headerShown: false,
            cardStyleInterpolator: params?.withAnimation
                ? CardStyleInterpolators.forFadeFromCenter
                : CardStyleInterpolators.forFadeFromCenter,
          })}/>
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </RootStack.Navigator>
);

export default RootStackScreen;