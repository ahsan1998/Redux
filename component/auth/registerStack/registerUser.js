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
import { AuthContext } from '../context';
import RegisterAsset from '../../assets/registerAsset';
import PhoneInput from "react-native-phone-number-input";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { route } from '../../connection/axios';


import { connect } from "react-redux"
import { saveUserDetails } from "../../Redux/Actions/saveUserActions"
const RegisterUser = (props) => {

    const toast = useToast();
    const { signIn, signUp } = React.useContext(AuthContext);
    const [googleLoad, setGoogleLoad] = useState(false);
    const [isVisibleForm, setIsVisibleForm] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phNo, setPhNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
 
    const [animation, setAnimation] = useState('fadeInUpBig');
    const [animation1, setAnimation1] = useState(false);
    const phoneInput = useRef('');
    const [showPass, setShowPass] = useState(true);
    const [press, setPress] = useState(false);

    const LoginBtn = () => {
        if (firstName === "") {
            toast.show({
                title: "First Name",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (lastName === "") {
            toast.show({
                title: "Last Name",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (phoneNumber === "") {
            toast.show({
                title: "Phone Number",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            console.log(phoneNumber)

            setAnimation('bounceOut');
            setIsVisibleForm(false);
            setAnimation1('fadeInUpBig');
        } 
    }
    const registerConfirm = () => {
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
        else if (confirmPassword === "") {
            toast.show({
                title: "Confirm Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            if (password !== confirmPassword) {
                toast.show({
                    title: "Password Confirmation",
                    status: "error",
                    description: "Password doesn't match",
                });
            }
            else {
                setGoogleLoad(true)

                //setGoogleLoad(true); 
                axios
                    .post(route + 'auth/register', {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        phone: phNo
                    })
                    .then((response) => {
                        console.log("aaa " + response.data.id);
/*
                        var userDetails = {};
                        userDetails.id =  response.data.id;
                        userDetails.createdAt = response.data.createdAt;
                        userDetails.updatedAt = response.data.updatedAt;
                        userDetails.firstName = response.data.firstName;
                        userDetails.lastName = response.data.lastName;
                        userDetails.role = response.data.role;
                        userDetails.email = response.data.email;
                        userDetails.avatar = response.data.avatar;
                        userDetails.phone = response.data.phone;
                        userDetails.isActive = response.data.isActive;
       

                        props.reduxSaveUserDetail(userDetails)
                        const foundUser = { id: response.data.id, accessToken: response.data.email, navigate: 'true' }
                        signUp(foundUser);*/
                        props.navigation.navigate('Login')
                        setGoogleLoad(false);
                        toast.show({
                            title: 'Registration Successful',
                            status: "success",
                            description: "Welcome " + firstName + " " + lastName,
                        });
                        toast.show({
                            title: 'Continue to Login',
                            status: "success",
                            description: "Please Login to Authentictate your Account",
                        });
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            if (error.response.status === 409) {
                                toast.show({
                                    title: 'Email Address',
                                    status: "error",
                                    description: "already associated with an Account",
                                });
                                setGoogleLoad(false)
                            }
                            else if (error.response.status === 422) {

                                if (error.response.data.message[0].property === 'email') {
                                    toast.show({
                                        title: 'Email Address',
                                        status: "error",
                                        description: "Invalid Entry",
                                    });
                                    setGoogleLoad(false)
                                }
                                else if (error.response.data.message[0].property === 'phone') {
                                    toast.show({
                                        title: 'Phone Number',
                                        status: "error",
                                        description: "Invalid Entry",
                                    });
                                    setGoogleLoad(false)
                                }
                                setGoogleLoad(false)
                            }
                            else{
                                toast.show({
                                    title: 'Internal Server Error',
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
    }
    useEffect(() => {
    }, []);
    const onChangeTextInput = (text) => {
        const numericRegex = /^[0-9\b]+$/;
        if (numericRegex.test(text)) {
            setPhoneNumber(text)
            const countryCode = "+" + phoneInput.current?.getCallingCode();
            const phNo = countryCode + text
            setPhNo(phNo);
            console.log('valid')
        }
        else {
            console.log("invalid hone")
        }
    }
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
    const backBtn = () => {
        setAnimation('fadeInUpBig');
        setIsVisibleForm(true);
        setAnimation1('bounceOut');
    }
    return (
        <Box bg={'#fff'} safeArea flex={1} w="100%" >
            <Animatable.View style={{
                width: "100%", height: "100%", backgroundColor: 'rgba(255,255,255,0.5)', aspectRatio: 1,
                position: 'absolute',
                justifyContent: 'center',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
                animation="fadeIn" easing="ease-in-out" duration={1000} useNativeDriver={true}  >
                <RegisterAsset width={'100%'} height={"100%"} style={{}} alignSelf='center' />
            </Animatable.View>
            <Box safeArea flex={1} mx='auto' w="100%" justifyContent='center'
                backgroundColor={'rgba(255,255,255,0.8)'}>
                <Animatable.View
                    flex={1}
                    mx='auto'
                    duraton="6000"
                    w="100%"
                    style={styles.container}
                    animation={'fadeInDownBig'}
                    justifyContent={'center'}
                >
                    <HStack mt={4} alignSelf="center" alignItems={'center'} w={'90%'}>
                        <VStack w={'80%'} >
                            <Heading size="xl" width={'100%'} fontWeight="600" color="#071428">
                                Greetings
                            </Heading>
                            <Heading mt="1" width={'100%'} color="#071428" fontWeight="medium" size="md">
                                Register Now!
                            </Heading>
                        </VStack>

                        {!isVisibleForm ?
                            <Stack w={'20%'} alignItems={'flex-end'}>
                                <IconButton
                                    icon={<Icon name={'arrow-left-box'} size={hp(4.5)} color="rgba(7, 20, 40, 0.8)" />} onPress={() => { backBtn() }}
                                    bg="transparent" style={{ marginRight: hp(1), backgroundColor: 'transparent' }} />
                            </Stack>

                            :
                            null
                        }
                    </HStack>
                </Animatable.View>
                {isVisibleForm ?
                    <Animatable.View
                        flex={1}
                        mx='auto'
                        duraton="6000"
                        w="100%"
                        style={styles.container}
                        animation={animation}
                        justifyContent={'center'}
                    >
                        <VStack
                            justifyContent={'center'}
                            p={2} flex={2} space={2} width={'85%'} alignSelf="center" bg='transparent'>
                            <FormControl isRequired style={{ width: '100%', alignSelf: 'center' }}>

                                <Input type="text" size="lg" placeholder="First Name" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    value={firstName}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    onChangeText={text => setFirstName(text)} />
                            </FormControl>
                            <FormControl mt={3} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="text" size="lg" placeholder="Last Name" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    value={lastName}
                                    onChangeText={text => setLastName(text)} />
                            </FormControl>
                            <FormControl mt={3} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <PhoneInput
                                    ref={phoneInput}
                                    textContainerStyle={{ width: '100%', backgroundColor: 'rgba(20, 241, 149, 0.25)', paddingVertical: 0, paddingHorizontal: 0 }}
                                    containerStyle={{ width: '100%', padding: 0, borderWidth: 1, borderColor: '#14F195', alignSelf: 'center' }}
                                    countryPickerButtonStyle={{ paddingVertical: 0, paddingHorizontal: 0, backgroundColor: 'rgba(20, 241, 149, 0.25)' }}
                                    minLength={10} maxLength={10}
                                    defaultValue={phoneNumber}
                                    defaultCode="PK"
                                    keyboardType={"phone-pad"}
                                    disableArrowIcon={true}
                                    layout="first"
                                    autoFocus={false}
                                    placeholder='Phone Number'
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    onChangeText={text => onChangeTextInput(text)}
                                    onChangeFormattedText={(text) => {
                                        onChangeTextInput(text)
                                    }}
                                />
                            </FormControl>
                            <VStack mt={5}>
                                <Button onPress={() => {
                                    LoginBtn()
                                }} size="lg" style={{ backgroundColor: "rgba(7, 20, 40, 0.8)", color: '#ffff' }} borderColor="#071428" borderWidth={2}>
                                    <Heading size="sm" textTransform="uppercase" color='#fff' py={1}>Continue</Heading>
                                </Button>
                            </VStack>
                        </VStack>
                    </Animatable.View>

                    :
                    <Animatable.View
                        flex={1}
                        mx='auto'
                        isVisible={false}
                        duraton="6000"
                        w="100%"
                        style={styles.container}
                        animation={animation1}
                        justifyContent={'center'}
                    >

                        <VStack
                            justifyContent={'center'}
                            p={2} flex={2} space={2} width={'85%'} alignSelf="center" bg='transparent'>
                            <FormControl isRequired style={{ width: '100%', alignSelf: 'center' }}>

                                <Input type="text" size="lg" placeholder="Email Address" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    value={email}
                                    onChangeText={text => setEmail(text)} />
                            </FormControl>
                            <FormControl mt={3} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="password" size="lg" placeholder="Password" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    onChangeText={text => setPassword(text)} secureTextEntry={showPass}
                                    value={password}
                                    InputRightElement={
                                        <IconButton
                                            icon={<Icon name={press == false ? 'eye' : 'eye-off'} size={hp(2.5)} color="#2e2e2e" />} onPress={showPassBtn.bind(this)}
                                            bg="transparent" style={{ marginRight: hp(1), backgroundColor: 'transparent' }} />} />
                            </FormControl>
                            <FormControl mt={3} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="password" size="lg" placeholder="Confirm Password" borderColor="#14F195" bg={'rgba(20, 241, 149, 0.25)'}
                                    _focus={{ borderColor: '#2e2e2e' }}
                                    placeholderTextColor="#2e2e2e" color="#071428"
                                    onChangeText={text => setConfirmPassword(text)} secureTextEntry={showPass}
                                    value={confirmPassword}
                                    InputRightElement={
                                        <IconButton
                                            icon={<Icon name={press == false ? 'eye' : 'eye-off'} size={hp(2.5)} color="#2e2e2e" />} onPress={showPassBtn.bind(this)}
                                            bg="transparent" style={{ marginRight: hp(1), backgroundColor: 'transparent' }} />} />
                            </FormControl>
                            <VStack mt={5}>
                                <Button onPress={() => {
                                    registerConfirm()
                                }} size="lg" style={{ backgroundColor: "rgba(7, 20, 40, 0.8)", color: '#ffff' }} borderColor="#071428" borderWidth={2}>
                                    <Heading size="sm" textTransform="uppercase" color='#fff' py={1}>Register Now</Heading>
                                </Button>
                            </VStack>
                        </VStack>
                    </Animatable.View>

                }
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
)(RegisterUser); 