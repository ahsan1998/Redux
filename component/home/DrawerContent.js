import React, { useState, useContext, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
    Drawer,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar, Box, HStack, Heading, VStack, useToast, Image } from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AuthContext } from '../auth/context';
import { connect } from "react-redux";
import { saveUserDetails } from "../Redux/Actions/saveUserActions" 

function DrawerContent(props) {
    const { signOut, toggleTheme } = useContext(AuthContext);
    const toast = useToast();


    useEffect(() => {
        console.log(props.userDetails.avatar)
    }, []);

    const signOutBtn = async () => {

        var userDetails = {};
        userDetails.id = '';
        userDetails.createdAt = '';
        userDetails.updatedAt = '';
        userDetails.firstName = '';
        userDetails.lastName = '';
        userDetails.role = '';
        userDetails.email = '';
        userDetails.avatar = '';
        userDetails.phone = '';
        userDetails.isActive = '';

    }
    return (

        <DrawerContentScrollView {...props}>
            <Box flex={1}>
                <HStack p={3} alignItems='center' >
                    {props.userDetails.avatar !== null ?
                        <Image size={12} source={{ uri: props.userDetails.avatar }} alt="react-native" />

                        :
                        <Image size={12} source={require('../../assets/user.png')} alt="react-native" />
                    }
                    <VStack ml={2}>
                        <Heading size={'sm'} >{props.userDetails.firstName} {props.userDetails.lastName}</Heading>
                        <Heading size={'xs'} fontWeight="normal">{props.userDetails.email}</Heading>
                    </VStack>
                </HStack>
                <Drawer.Section title="Be A Trader" >
                    <DrawerItem
                        labelStyle={{
                            fontSize: hp(2),
                            color: '#071428',
                            fontWeight: "700"
                        }}
                        icon={({ color, size }) => (
                            <Icon
                                name="magnify"
                                color={'#071428'}
                                size={size}
                            />
                        )}
                        label="Search"
                        onPress={() => { props.navigation.navigate('Search') }}
                    /><DrawerItem
                        labelStyle={{
                            fontSize: hp(2),
                            color: '#071428',
                            fontWeight: "700"
                        }}
                        icon={({ color, size }) => (
                            <Icon
                                name="bullseye"
                                color={'#071428'}
                                size={size}
                            />
                        )}
                        label="Discover"
                        onPress={() => { props.navigation.navigate('Category') }}
                    />
                    <DrawerItem
                        labelStyle={{
                            fontSize: hp(2),
                            color: '#071428',
                            fontWeight: "700"
                        }}
                        icon={({ color, size }) => (
                            <Icon
                                name="robot"
                                color={'#071428'}
                                size={size}
                            />
                        )}
                        label="Our Bot"
                        onPress={() => { props.navigation.navigate('Category') }}
                    />

                    <DrawerItem
                        labelStyle={{
                            fontSize: hp(2),
                            color: '#071428',
                            fontWeight: "700"
                        }}
                        icon={({ color, size }) => (
                            <Icon
                                name="bitcoin"
                                color={'#071428'}
                                size={size}
                            />
                        )}
                        label="Coin Market"
                        onPress={() => { props.navigation.navigate('Category') }}
                    />
                </Drawer.Section>
                <Drawer.Section title="Account" >

                    <DrawerItem
                        labelStyle={{
                            fontSize: hp(2),
                            color: '#071428',
                            fontWeight: "700"
                        }}
                        icon={({ color, size }) => (
                            <Icon
                                name="account-box"
                                color={'#071428'}
                                size={size}
                            />
                        )}
                        label="Profile"
                        onPress={() => { props.navigation.navigate('Profile') }}
                    />
                         <DrawerItem
                            labelStyle={{
                                fontSize: hp(2),
                                color: '#071428',
                                fontWeight: "700"
                            }}
                            icon={({ color, size }) => (
                                <Icon
                                    name="update"
                                    color={'#071428'}
                                    size={size}
                                />
                            )}
                            label="Change Password"
                            onPress={() => { props.navigation.navigate('ChangePassword') }}
                        /> 
                </Drawer.Section>

            </Box>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem

                    labelStyle={{
                        fontSize: hp(2),
                        color: '#071428',
                        fontWeight: "bold"
                    }}
                    icon={({ color, size }) => (
                        <Icon
                            name="power"
                            color={'#071428'}
                            size={size}
                        />
                    )}
                    label="Log Out"
                    onPress={() => { signOutBtn() }}
                />
            </Drawer.Section>

        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    bottomDrawerSection: {
        borderTopColor: '#14F195',
        borderTopWidth: 1,
        backgroundColor: '#14F195',
        fontWeight: 'bold',
        color: '#071428',
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

const mapStateToProps = (state) => {
    return {

        userDetails: state.userDetails
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveUserDetail: (userRDetails) => dispatch(saveUserDetails(userRDetails))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent)
