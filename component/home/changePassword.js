import React, { Component, useEffect, useState } from 'react';
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
import auth, { firebase } from "@react-native-firebase/auth"
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spinner from 'react-native-spinkit';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from "react-redux"
import { saveUserDetails } from "../Redux/Actions/saveUserActions"

const ChangePassword = (props) => {
    const toast = useToast();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [password, setPassword] = useState('');
    const [pageLoad, setPageLoad] = useState(false);
    const [PasswordModal, setPasswordModal] = useState(false);

    var userDetails = {};
    userDetails.Uid = props.userDetails.Uid;
    userDetails.Email = props.userDetails.Email;

    const confirmPasswordBtn = async () => {
        if (password === "") {
            toast.show({
                title: "Current Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            //verifyPasswordResetCode(code: string): Promise<void>;
            setPageLoad(true)
            try {
                const emailCred = firebase.auth.EmailAuthProvider.credential(props.userDetails.Email, password)
                // await auth().EmailAuthProvider.credential(firebase.auth().currentUser, password)
                await auth().currentUser.reauthenticateWithCredential(emailCred)
                    .then((res) => {
                        setPageLoad(false);
                        console.log(JSON.stringify(res));
                        toast.show({
                            title: "Account Authenticated",
                            status: "success",
                            description: "Change Your Password",
                        });
                        setPassword('');
                        setPasswordModal(true);
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.code === 'auth/wrong-password') {

                            toast.show({
                                title: "Invalid Password",
                                status: "error",
                                description: "UnAuthorized Access",
                            });
                        }
                        else {

                            toast.show({
                                title: "UnAuthorized Access",
                                status: "error",
                                description: "Try Again",
                            });
                        }
                        setPageLoad(false);
                    });
            } catch (e) {
                setPageLoad(false);
                console.log(e);
                toast.show({
                    title: "Network Error",
                    status: "error",
                    description: "Please Try Again Later",
                });
            }
        }
    }
    const closeModal = () =>{
        setPasswordModal(false);
    }
    const changePasswordBtn = () => {
        if (newPassword === '') {
            toast.show({
                title: "Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else if (confirmPassword === '') {
            toast.show({
                title: "Confirm Password",
                status: "error",
                description: "Field cannot be Empty",
            });
        }
        else {
            if (newPassword !== confirmPassword) {
                console.log(newPassword)
                toast.show({
                    title: "Password Confirmation",
                    status: "error",
                    description: "Password doesn't match",
                });
            }
            else {
                setPageLoad(true);
                firebase.auth().currentUser.updatePassword(newPassword)
                .then((res) => {
                    console.log(JSON.stringify(res))
                     setPageLoad(false)
                     toast.show({
                         title: "Updated Sucessfully",
                         status: "success",
                         description: "Password has been Changed",
                     });
                     setPasswordModal(false);

                 }).catch(error => {
                     console.log(error)
                     setPageLoad(false)
                     toast.show({
                         title: "Unknown Error",
                         status: "warning",
                         description: "Please Try Again",
                     });
                     setPasswordModal(false)

                 });
            }
        }
    }
    return (
        <Box style={styles.container}>

            <Animatable.View
                flex={1}
                mx='auto'
                duraton="3000"
                w="100%"
                animation="fadeInUpBig"
                flex={1}
                justifyContent='center'
                alignItems='center'
            >
                <VStack width={'85%'} justifyContent='center' alignSelf="center" >
                    <Heading size="md" fontWeight="bold">Confirm Your Current Password</Heading>
                    <VStack mt={5}>
                        <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                            <Input type="password" size="lg" placeholder='Current Password' borderColor="#14F195"
                                onChangeText={(value) => setPassword(value)} />
                        </FormControl>
                    </VStack>
                    <VStack mt={5}>
                        <Button onPress={() => {
                            confirmPasswordBtn()
                        }} size="lg" style={{ backgroundColor: "#14F195", color: '#071428' }} borderColor="#071428" borderWidth={1}>
                            <Heading size="sm" textTransform="uppercase" color='#071428' py={1}>Continue</Heading>
                        </Button>
                    </VStack>

                </VStack>

            </Animatable.View>
            <Modal isOpen={PasswordModal} flex={1} onClose={() => closeModal()} avoidKeyboard>
                <Modal.Content>
                    <Modal.Header bg={'#fff'}>
                        <Heading color='#000' size="lg" fontWeight="bold" textAlign="center">Change Password</Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <VStack mt={0} space={2} alignSelf="center" w={'100%'}>
                            <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="password" size="lg" placeholder="New Password" borderColor="#14F195"
                                    onChangeText={(value) => setNewPassword(value)}
                                    InputRightElement={<Icon name="eye" size={hp(2.5)} color="#071428" style={{ marginRight: hp(1) }} />} />
                            </FormControl>
                            <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="password" size="lg" placeholder="Confirm Password" borderColor="#14F195"
                                    onChangeText={(value) => setConfirmPassword(value)}
                                    InputRightElement={<Icon name="eye" size={hp(2.5)} color="#071428" style={{ marginRight: hp(1) }} />} />
                            </FormControl>
                            <VStack mt={5}>
                                <Button onPress={() => {
                                    changePasswordBtn()
                                }} size="lg" style={{ backgroundColor: "#14F195", color: '#071428' }} borderColor="#071428" borderWidth={1}>
                                    <Heading size="sm" textTransform="uppercase" color='#071428' py={1}>Continue</Heading>
                                </Button>
                            </VStack>
                        </VStack>
                    </Modal.Body>

                </Modal.Content>

            </Modal>


            <Modal isOpen={pageLoad} bg="rgba(20, 241, 149, 0.6)" flex={1} avoidKeyboard>
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
    }
});
const mapStateToProps = (state) => {
    return {

        userDetails: state.userDetails
    }
}
export default connect(mapStateToProps, null)(ChangePassword)
