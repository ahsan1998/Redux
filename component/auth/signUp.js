import React, {useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
    useToast,
    Modal, View,
} from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import * as Animatable from 'react-native-animatable';

import { firebase, auth } from '@react-native-firebase/auth';
import Spinner from 'react-native-spinkit';
import { AuthContext } from './context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const SignUp = (props) => {

    const toast = useToast();
    const { signUp } = React.useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [uid, setUid] = useState('');
    const [formData, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const SignUpBtn = () => {
        console.log(formData)
        if (formData.firstName === "") {
            toast.show({
                title: "First Name",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (formData.lastName === "") {
            toast.show({
                title: "Last Name",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (formData.email === "") {
            toast.show({
                title: "Email Address",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (formData.password === "") {
            toast.show({
                title: "Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (formData.confirmPassword === "") {
            toast.show({
                title: "Confirm Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            if (formData.password !== formData.confirmPassword) {
                toast.show({
                    title: "Password Confirmation",
                    status: "error",
                    description: "Password doesn't match",
                });
            }
            else {
                setLoader(true);
                firebase.auth()
                    .createUserWithEmailAndPassword(formData.email, formData.password)
                    .then((user) => {
                        setUid(user.user.uid);
                        console.log(user.user.uid);
                        console.log(JSON.stringify(user));
                        firestore()
                            .collection('Users')
                            .doc(user.user.uid)
                            .set({
                                FirstName: formData.firstName,
                                LastName: formData.lastName,
                                Email: formData.email,
                                photo: '',
                                AccountCreatedOn: Date.now()
                            })
                            .then((user1) => {
                               console.log(JSON.stringify(user1))
                                toast.show({
                                    title: "Welcome " + formData.firstName + " "+ formData.lastName,
                                    status: "success",
                                    description: "Account Created Successfully",
                                });
                                console.log('User account created & signed in! '+ user.user.uid);
                               
                                const foundUser = { uid: user.user.uid,provider: user.user.providerId, navigate: 'true' }
                                signUp(foundUser);
                                setLoader(false)
                            }).catch(error => {
                                console.log(error)
                                toast.show({
                                    title: "Unknown Error",
                                    status: "warning",
                                    description: "Please Try Again",
                                });
                                setLoader(false)
                                
                            });
                        
                    })
                    .catch(error => {
                        if (error.code === 'auth/email-already-in-use') {

                            toast.show({
                                title: "Email Already Exist",
                                status: "error",
                                description: "Email is already in use",
                            });
                            setLoader(false);
                            console.log('That email address is already in use!');
                        }

                        if (error.code === 'auth/invalid-email') {
                            toast.show({
                                title: "Invalid Email Address",
                                status: "error",
                                description: "Email is incorrect",
                            });
                            setLoader(false);
                            console.log('That email address is invalid!');
                        }

                    });

            }

        }
        //const foundUser = { email: 'email@email.com', status: 'true' }
        //signUp(foundUser);
    }

    return (
        <Box
            bg={'#fff'}
            safeArea
            flex={1}
            w="100%" >

            <View style={styles.header}>
                <Animatable.Image
                    animation="slideInDown"
                    duraton="2500"
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Box
                safeArea
                flex={1}
                mx='auto'
                w="100%"
                style={styles.container}

            >
                <Box mt={4} alignItems="center">
                    <Heading size="xl" width={'85%'} fontWeight="600" color="#071428">
                        Create an Account
                    </Heading>
                    <Heading mt="1" width={'85%'} color="#071428" fontWeight="medium" size="md">
                        Let's Get Started
                    </Heading>
                </Box>
                <Animatable.View
                    flex={1}
                    mx='auto'
                    duraton="3000"
                    w="100%"
                    style={styles.container}
                    animation="fadeInUpBig"
                >
                    <VStack
                        p={2} flex={2} space={2} my={10} width={'85%'} alignSelf="center" >

                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>

                            <Input type="text" size="lg" placeholder="First Name" borderColor="#14F195"
                                onChangeText={(value) => setData({ ...formData, firstName: value })} />
                        </FormControl>
                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="text" size="lg" placeholder="Last Name" borderColor="#14F195"
                                onChangeText={(value) => setData({ ...formData, lastName: value })} />
                        </FormControl>
                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="email" size="lg" placeholder="Email Address" borderColor="#14F195"
                                onChangeText={(value) => setData({ ...formData, email: value })} />
                        </FormControl>
                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="password" size="lg" placeholder="Password" borderColor="#14F195"
                                onChangeText={(value) => setData({ ...formData, password: value })}
                                InputRightElement={<Icon name="eye" size={hp(2.5)} color="#071428" style={{ marginRight: hp(1) }} />} />
                        </FormControl>
                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="password" size="lg" placeholder="Confirm Password" borderColor="#14F195"
                                onChangeText={(value) => setData({ ...formData, confirmPassword: value })}
                                InputRightElement={<Icon name="eye" size={hp(2.5)} color="#071428" style={{ marginRight: hp(1) }} />} />
                        </FormControl>
                        <VStack mt={5}>
                            <Button onPress={() => {
                                SignUpBtn()
                            }} size="lg" style={{ backgroundColor: "#14F195", color: '#071428' }} borderColor="#071428" borderWidth={1}>
                                <Heading size="sm" textTransform="uppercase" color='#071428' py={1}>Continue</Heading>
                            </Button>
                        </VStack>
                        <VStack mt={5} flexDirection='row' justifyContent="center" alignItems="center" bg="#14F195" py={3}>
                            <Heading size="sm">Back to </Heading>
                            <Button onPress={() => props.navigation.navigate('Login')}
                                size="sm" m={0} p={0} variant="transparent">
                                <Heading size="sm" color='#071428' >Login</Heading>
                            </Button>
                        </VStack>

                    </VStack>


                </Animatable.View>
            </Box>
            <Modal isOpen={loader} bg="rgba(20, 241, 149, 0.6)" flex={1} avoidKeyboard>
                <Spinner style={styles.spinner} isVisible={true} size={70} type={'WanderingCubes'} color={'#071428'} />
                <Heading fontWeight="bold" size="md" mt={10}>Authenticating...</Heading>
            </Modal>
        </Box>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#071428',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        //height: height_logo
        width: '60%'
    },
    footer: {
        flex: 0.1,
        alignItems: 'center'
    },
});
export default SignUp;