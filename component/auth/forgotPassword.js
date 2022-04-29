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
    Divider, Stack, HStack, IconButton, KeyboardAvoidingView,
} from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import * as Animatable from 'react-native-animatable';

import Spinner from 'react-native-spinkit';
import { AuthContext } from './context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';

const ForgotPassword = (props) => {

    const toast = useToast();
    const { signIn } = React.useContext(AuthContext);
    const [googleLoad, setGoogleLoad] = useState(false);
    const [email, setEmail] = useState('');



    const ForgotPasswordBtn = async () => {
        if (email === "") {
            toast.show({
                title: "Email Address",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            //verifyPasswordResetCode(code: string): Promise<void>;

            setGoogleLoad(true)
            try {
                await auth().sendPasswordResetEmail(email);
                toast.show({
                    title: "Reset Link Sent",
                    status: "success",
                    description: "Please Check your Email Address for further Actions",
                });
                setGoogleLoad(false)
            } catch (e) {
                setShowLoading(false);
                console.log(e);
                toast.show({
                    title: "Network Error",
                    status: "error",
                    description: "Please Try Again Later",
                });
            }
        }
        //  const foundUser = { uid: '12345', navigate: 'true' }
        //signIn(foundUser);
    }

    return (
        <Box
            bg={'#fff'}
            safeArea
            flex={1}
            w="100%" >
            <HStack style={styles.header}>

                <Animatable.Image
                    animation="slideInDown"
                    duraton="2500"
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </HStack>


            <Box
                safeArea
                flex={1}
                mx='auto'
                w="100%"
                style={styles.container}

            >
                <Box mt={4} alignItems="center">
                    <Heading size="xl" width={'85%'} fontWeight="600" color="#071428">
                        Reset Password
                    </Heading>
                    <Heading mt="1" width={'85%'} color="#071428" fontWeight="medium" size="sm">
                        Please enter the Email Address associated with your Account, and we'll send an Email with Secure Pin to Reset your Password.
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
                        p={2} flex={1} space={2} my={10} width={'85%'} alignSelf="center">
                        <FormControl isRequired style={{ width: '100%', alignSelf: 'center' }}>

                            <Input type="email" size="lg" placeholder="Email Address" borderColor="#14F195"
                                onChangeText={text => setEmail(text)} />
                        </FormControl>

                        <VStack mt={5}>
                            <Button onPress={() => {
                                ForgotPasswordBtn()
                            }} size="lg" style={{ backgroundColor: "#14F195", color: '#071428' }} borderColor="#071428" borderWidth={1}>
                                <Heading size="sm" textTransform="uppercase" color='#071428' py={1}>Send Instructions</Heading>
                            </Button>
                        </VStack>

                    </VStack>

                    <VStack mt={5} flexDirection='row' justifyContent="center" alignItems="center" bg="#14F195" py={3}>
                        <Heading size="sm">Back to </Heading>
                        <Button onPress={() => props.navigation.navigate('Login')}
                            size="sm" m={0} p={0} variant="transparent">
                            <Heading size="sm" color='#071428' >Login</Heading>
                        </Button>
                    </VStack>
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
export default ForgotPassword;