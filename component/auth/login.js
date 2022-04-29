import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    useToast,
    Modal, View,
    Divider, Stack, HStack, IconButton,
} from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-spinkit';
import { AuthContext } from './context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 
import MainPage from '../assets/mainPage';
import axios from 'axios';
import { route } from '../connection/axios';


import { connect } from "react-redux"
import { saveUserDetails } from "../Redux/Actions/saveUserActions"

const Login = (props) => {

    const toast = useToast();
    const { signIn, signUp } = React.useContext(AuthContext);
    const [googleLoad, setGoogleLoad] = useState(false);
    const [showPass, setShowPass] = useState(true);
    const [press, setPress] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const LoginBtn = () => {
        if (email === "") {
            toast.show({
                title: "Email Address",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (password === "") {
            toast.show({
                title: "Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            setGoogleLoad(true)
            axios
            .post(route + 'auth/login', {
                email: email,
                password: password
            })
            .then((response) => { 

                var userDetails = {};
                userDetails.id =  response.data.user.id;
                userDetails.createdAt = response.data.user.createdAt;
                userDetails.updatedAt = response.data.user.updatedAt;
                userDetails.firstName = response.data.user.firstName;
                userDetails.lastName = response.data.user.lastName;
                userDetails.role = response.data.user.role;
                userDetails.email = response.data.user.email;
                userDetails.avatar = response.data.user.avatar;
                userDetails.phone = response.data.user.phone;
                userDetails.isActive = response.data.user.isActive;
                console.log(response.data.token.expiresIn)
                props.reduxSaveUserDetail(userDetails)
                const foundUser = { expiresIn: JSON.stringify(response.data.token.expiresIn), accessToken: response.data.token.accessToken, navigate: 'true' }
                signIn(foundUser);
                setGoogleLoad(false);
                toast.show({
                    title: 'Login Successful',
                    status: "success",
                    description: "Welcome User" ,
                });
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    if (error.response.status === 404) {
                        toast.show({
                            title: 'Invalid Credentials',
                            status: "error",
                            description: "Try Again",
                        });
                        setGoogleLoad(false)
                    }
                    else {
                        toast.show({
                            title: 'Server Error',
                            status: "error",
                            description: "Try Again",
                        });
                        setGoogleLoad(false)
                    }
                }
                else {
                }
            })
            .finally(() => {

                console.log('complete');
            });

    }

  
    }
    useEffect(() => {
    }, []);
    const showPassBtn = () => {
        if (press == false) {
            setShowPass(false);
            setPress(true);
        }
        else {
            setShowPass(true);
            setPress(false);
        }
    }
    return (
        <Box bg={'#fff'} safeArea flex={1} w="100%" >
            <Animatable.View style={{
                width: "100%", height: "100%", backgroundColor: 'rgba(255,255,255,0.5)', aspectRatio: 1,
                position: 'absolute',
                justifyContent:'center',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
                animation="fadeInUp" easing="ease-in-out" duration={1000} useNativeDriver={true}  >
                <MainPage width={'100%'} height={"100%"} style={{}} alignSelf='center' />
            </Animatable.View>

            <Box safeArea flex={1} mx='auto' w="100%" justifyContent='center' >

                <Animatable.View
                    flex={1}
                    mx='auto'
                    duraton="6000"
                    w="100%"
                    style={styles.container}
                    animation="fadeInUpBig"
                    justifyContent={'center'}
                >
                    <Box mt={4} alignItems="center">
                        <Heading size="xl" width={'85%'} fontWeight="600" color="#071428">
                            Welcome
                        </Heading>
                        <Heading mt="1" width={'85%'} color="#071428" fontWeight="medium" size="md">
                            Sign in to continue!
                        </Heading>
                    </Box>
                    <VStack
                        justifyContent={'center'}
                        p={2} flex={2} space={2} width={'85%'} alignSelf="center" bg='transparent'>
                        <FormControl isRequired style={{ width: '100%', alignSelf: 'center' }}>

                            <Input type="email" size="lg" placeholder="Email Address" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                _focus={{ borderColor: '#2e2e2e' }}
                                placeholderTextColor="#2e2e2e" color="#071428"
                                onChangeText={text => setEmail(text)} />
                        </FormControl>
                        <FormControl mt={3} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="password" size="lg" placeholder="Password" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                _focus={{ borderColor: '#2e2e2e' }}
                                placeholderTextColor="#2e2e2e" color="#071428"
                                onChangeText={text => setPassword(text)} secureTextEntry={showPass}
                                InputRightElement={
                                    <IconButton
                                        icon={<Icon name={press == false ? 'eye' : 'eye-off'} size={hp(2.5)} color="#2e2e2e" />} onPress={showPassBtn.bind(this)}
                                        bg="transparent" style={{ marginRight: hp(1), backgroundColor: 'transparent' }} />} />
                        </FormControl>
                        <Link onPress={() => props.navigation.navigate('ForgotPassword')}
                            _text={{ fontSize: 'md', fontWeight: '700', color: '#071428' }}
                            alignSelf="flex-end"
                            mt="1">
                            Forget Password?
                        </Link>
                        <VStack mt={5}>
                            <Button onPress={() => {
                                LoginBtn()
                            }} size="lg" style={{ backgroundColor: "rgba(7, 20, 40, 0.8)", color: '#ffff' }} borderColor="#071428" borderWidth={2}>
                                <Heading size="sm" textTransform="uppercase" color='#fff' py={1}>Login</Heading>
                            </Button>
                        </VStack>


                    </VStack>
                    <Stack>
                        <VStack mt={5} flexDirection='row' justifyContent="center" alignItems="center" bg="#14F195" py={3}>
                            <Heading size="sm">Don't have an Account? </Heading>
                            <Button onPress={() => props.navigation.navigate('RegisterUser', { withAnimation: true })}
                                size="sm" m={0} p={0} variant="transparent">
                                <Heading size="sm" color='#071428' >Register</Heading>
                            </Button>
                        </VStack>
                    </Stack>
                </Animatable.View>

            </Box>
            <Modal isOpen={googleLoad} bg="rgba(20, 241, 149, 0.6)" flex={1} avoidKeyboard>
                <Spinner style={styles.spinner} isVisible={true} size={70} type={'WanderingCubes'} color={'#071428'} />
                <Heading fontWeight="bold" size="md" mt={10}>Authenticating...</Heading>
            </Modal>
        </Box>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    img: {
        width: "100%",
        height: "25%",
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#071428'
    },
    logo: {
        //height: height_logo
        // width: '60%'
    },
    footer: {
        flex: 0.1,
        alignItems: 'center'
    },
}); 
const mapDispatchToProps = (dispatch) => {
    return {
        reduxSaveUserDetail: (userRDetails) => dispatch(saveUserDetails(userRDetails))

    }
}
export default connect(
    null,
    mapDispatchToProps
)(Login); 