import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Box, Heading, HStack, IconButton, Image, VStack, Button, Avatar, Modal, FormControl, Input, useToast, Pressable } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-spinkit';
import { connect } from "react-redux";
import { saveUserDetails } from "../Redux/Actions/saveUserActions"

const Profile = (props) => {
    const toast = useToast();

    const [EditProfile, setEditProfile] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [formData, setData] = useState({
        firstName: '',
        lastName: '',
    });
    const EditBtn = () => {
        setEditProfile(true);
    }
    useEffect(() => {
        console.log(props.userDetails.avatar)
    }, [])
    const Savebtn = () => {
        setLoadingVisible(true)
        //console.log(userInfo)
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
        else {
            firestore()
                .collection('Users')
                .doc(props.userDetails.Uid)
                .update({
                    FirstName: formData.firstName,
                    LastName: formData.lastName
                })
                .then(() => {

                    var userDetails = {};
                    userDetails.Uid = props.userDetails.Uid;
                    userDetails.provider = props.userDetails.provider;
                    userDetails.FirstName = formData.firstName;
                    userDetails.LastName = formData.lastName;
                    userDetails.Email = props.userDetails.Email;
                    userDetails.photo = props.userDetails.Photo,
                        userDetails.AccountCreatedOn = props.userDetails.AccountCreatedOn;


                    props.reduxSaveUserDetail(userDetails)
                    toast.show({
                        title: "Success",
                        status: "success",
                        description: "Profile Updated",
                    });
                    setLoadingVisible(false)
                }).catch(error => {
                    console.log(error)
                    toast.show({
                        title: "Unknown Error",
                        status: "warning",
                        description: "Please Try Again",
                    });
                    setLoadingVisible(false)

                });
            setEditProfile(false);
        }
    }
    //<Heading color='coolGray.600' size="md" textAlign='center'>{Date(userInfo.AccountCreatedOn).format("DD-MM-YYYY")}</Heading>

    return (
        <Box bg="#f0f2f5"
            flex={1}
            w="100%"
            h="100%">

            <VStack flex={1} my={5} alignItems="center" my={10}>
                {props.userDetails.avatar !== null ?
                    <Image size={'lg'} source={{ uri: props.userDetails.avatar }} alt="react-native" />

                    :
                    <Image size={'lg'} source={require('../../assets/user.png')} alt="react-native" />
                }

                <VStack my={2} justifyContent='center'>
                    <Heading color='#071428' size="lg" textAlign='center'>{props.userDetails.firstName} {props.userDetails.lastName}</Heading>
                    <Heading color='#071428' size="sm" textAlign='center' mb={5}>{props.userDetails.email}</Heading>

                    <Button my={5} bg={'#14F195'} size={'lg'} _text={{ color: '#071428', fontWeight: "bold" }}
                        onPress={() => { EditBtn() }}
                        startIcon={<Icon name="lead-pencil" size={hp(2.5)} color="#071428" />}>
                        Edit Profile
                    </Button>
                </VStack>
            </VStack>
            <VStack flex={1} w={'100%'} position='absolute' bottom={0}>

                <Pressable bg="#fff" p={5} my={0.5} shadow={2}
                    flexDirection="row" w="100%" justifyContent="space-between" alignItems="center"
                    onPress={() => { props.navigation.navigate('ChangePassword') }}
                >
                    <HStack
                        justifyContent="center">
                        <Icon name="lock" size={hp(3)} color="#071428" />
                        <Heading mx={2} size="md" color='#071428' fontWeight="normal" justifyContent="center">
                            Change Password
                        </Heading>
                    </HStack>
                    <Icon name="arrow-right-box" size={hp(3)} color="#071428" justifyContent="center" />

                </Pressable>
                <HStack bg="#fff" p={5} my={0.5} shadow={2}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HStack
                        justifyContent="center">

                        <Icon name="shield-star" size={hp(3)} color="#071428" />
                        <Heading mx={2} size="md" color='#071428' fontWeight="normal" justifyContent="center">
                            Terms, Privacy &amp; Policy
                        </Heading>
                    </HStack>
                    <Icon name="arrow-right-box" size={hp(3)} color="#071428" justifyContent="center" />

                </HStack>
                <HStack bg="#fff" p={5} my={0.5} shadow={2}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HStack
                        justifyContent="center">
                        <Icon name="lifebuoy" size={hp(3)} color="#071428" />
                        <Heading mx={2} size="md" color='#071428' fontWeight="normal" justifyContent="center">
                            Help &amp; Support
                        </Heading>
                    </HStack>
                    <Icon name="arrow-right-box" size={hp(3)} color="#071428" justifyContent="center" />

                </HStack>
                <HStack bg="#fff" p={5} my={0.5} shadow={2}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <HStack justifyContent="center">
                        <Icon name="power" size={hp(3)} color="#071428" justifyContent="center" />
                        <Heading mx={2} size="md" color='#071428' fontWeight="normal" justifyContent="center">
                            Log Out
                        </Heading>
                    </HStack>
                    <Icon name="arrow-right-box" size={hp(3)} color="#071428" justifyContent="center" />

                </HStack>
            </VStack>
            <Modal isOpen={EditProfile} flex={1} onClose={() => setEditProfile(false)} avoidKeyboard>
                <Modal.Content>
                    <Modal.Header bg={'#fff'}>
                        <Heading color='#000' size="lg" fontWeight="bold" textAlign="center">Edit Profile</Heading>
                    </Modal.Header>
                    <Modal.Body>

                        <VStack mt={0} space={2} alignSelf="center" w={'100%'}>
                            <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>

                                <Input type="text" size="lg" placeholder={props.userDetails.FirstName} borderColor="#14F195"
                                    onChangeText={(value) => setData({ ...formData, firstName: value })} />
                            </FormControl>
                            <FormControl mt={2} isRequired style={{ width: '100%', alignSelf: 'center' }}>
                                <Input type="text" size="lg" placeholder={props.userDetails.LastName} borderColor="#14F195"
                                    onChangeText={(value) => setData({ ...formData, lastName: value })} />
                            </FormControl>
                        </VStack>
                        <VStack mt={5}>
                            <Button onPress={() => {
                                Savebtn()
                            }} size="lg" style={{ backgroundColor: "#14F195", color: '#071428' }} borderColor="#071428" borderWidth={1}>
                                <Heading size="sm" textTransform="uppercase" color='#071428' py={1}>Continue</Heading>
                            </Button>
                        </VStack>
                    </Modal.Body>

                </Modal.Content>

            </Modal>

            <Modal isOpen={loadingVisible} bg="rgba(20, 241, 149, 0.6)" flex={1} avoidKeyboard>
                <Spinner style={styles.spinner} isVisible={true} size={70} type={'WanderingCubes'} color={'#071428'} />
                <Heading fontWeight="bold" size="md" mt={10}>Loading...</Heading>
            </Modal>
        </Box>
    );
}
const styles = StyleSheet.create({
    cont: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spinner: {
        width: '100%',
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
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
