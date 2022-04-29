import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Box, Flex, Heading, Stack,Spinner } from 'native-base';

const Splash = () => {

    const [animation, setAnimation] = useState('bounceIn');
    useEffect(() => {
        return () => { // ComponentWillUnmount in Class Component
            setAnimation(false);
        }
      }, []);
    return (
        <Box style={styles.container}>
            <StatusBar backgroundColor='#071428' barStyle="light-content" />
            <Box style={styles.header}>
                <Animatable.Image
                    animation={animation}
                    duraton="3000"
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                    onAnimationEnd={() => {
                        setTimeout(() => {
                            
                        setAnimation('bounceOut');
                        //navigation.navigate('Login');
                        }, 4000);
                    }}
                />
                
            </Box>
        <Stack style={styles.footer}>

                    <Heading size="md" mb={4} color="#071428">Gathering Information</Heading>
                    <Spinner
                        color="#071428"
                        size="large"
                        style={styles.activityIndicator}
                    />
                </Stack>
        </Box>
    );
};
const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#071428'
    },
    header: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 0.1,
        backgroundColor: '#14F195',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        alignItems: 'center'
    },
    logo: {
        width: '100%',
        //height: height_logo
        height: '50%',
        alignSelf: 'center'
    },
});


export default Splash;