import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Image, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native'
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { API, graphqlOperation } from 'aws-amplify';
import { createMessage } from '../src/graphql/mutations';
import { updateChatRoomLastMessage } from '../components/InputBox/InputBox';
import * as ImageManipulator from 'expo-image-manipulator';
import { useUser } from '../context/userContext';
import { useMessage } from '../context/messageContext';


export interface SelectedMedia {
    uri: string,
    base64?: string | undefined,
    width: number | null,
    height: number | null,
    exif?: any
    type?: string
}

export const CameraScreen = () => {

    const { userId } = useUser()

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

    let defaultSelectedMedia = {
        uri: '',
        base64: '',
        height: null,
        width: null,
        exif: null
    }

    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>(defaultSelectedMedia)

    const navigation = useNavigation();

    const route = useRoute();

    const camera = useRef<Camera | null>()

    const isFocused = useIsFocused();

    const { messages, setMessages,setChatRoomId } = useMessage();

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasCameraPermission(status === 'granted')
    }

    const takePictureAsync = async () => {
        if (camera.current) {
            try {
                const options = { quality: 1, base64: true, skipProcessing: false }

                const picture = await camera.current.takePictureAsync(options);
                setSelectedMedia({
                    ...picture,
                    type: 'image'
                })
            } catch (err) {

            }
        }
    }

    useEffect(() => {
        if (isFocused && !hasCameraPermission) {
            setChatRoomId(route.params.chatRoomId)
            requestCameraPermission();
        }
    });

    const resizeImage = (height: number, width: number) => {
        if (height > width) {
            let newHeight = width;
            let newWidth = width / height * width
            return { newHeight, newWidth }
        } else if (width > height) {
            let newWidth = height;
            let newHeight = height / width * height;
            return { newHeight, newWidth };
        }
    }


    const onOpenGallery = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Allow Camera Roll Permission',
                '',
                [
                    { text: 'Go to app settings', onPress: () => Linking.openURL('app-settings:') },
                    {
                        text: 'Cancel',
                        onPress: () => { },
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            )
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });


        if (!result.cancelled) {
            setSelectedMedia(result)
        }
    }

    const compressImage = async (uri: string, format = ImageManipulator.SaveFormat.JPEG, imageHeight: number, imageWidth: number) => {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{
                resize: {
                    height: resizeImage(imageHeight, imageWidth)?.newHeight,
                    width: resizeImage(imageHeight, imageWidth)?.newWidth
                }
            }],
            { compress: 0, format, base64: true },
        );
        return result;
        // return { type, width, height, uri,base64 }
    };


    const handleSendMedia = async () => {
        try {
            let res = await compressImage(
                selectedMedia?.uri,
                ImageManipulator.SaveFormat.JPEG,
                selectedMedia?.height ?? 0,
                selectedMedia?.width ?? 0
            )
            // creating new message
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage,
                    {
                        input: {
                            content: res.base64,
                            userId: userId,
                            chatRoomId: route.params.chatRoomId,
                            type: selectedMedia.type
                        }
                    }
                )
            )

            // updating last message
            updateChatRoomLastMessage(newMessageData.data.createMessage.id, route.params.chatRoomId)
            setSelectedMedia(defaultSelectedMedia);

            // navigation.goBack();


        } catch (err) {
            console.log(err)
        }
    }

    if (hasCameraPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false) {
        return (
            <View style={[styles.container, styles.noPermissionContainer]}>
                <Text style={styles.topText}>Start taking pictures and recording videos</Text>
                <TouchableOpacity onPress={() => {
                    Linking.openURL('app-settings:')
                }}>
                    <Text style={styles.bottomText}>
                        Allow camera access
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (selectedMedia?.base64) {
        return (
            <View style={[styles.container, { backgroundColor: '#000' }]}>
                <Image
                    source={{ uri: `data:image/gif;base64,${selectedMedia.base64}` }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                >
                </Image>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[styles.sideButton]}
                        onPress={() => {
                            setSelectedMedia(defaultSelectedMedia)
                        }}
                    >
                        <Ionicons name="md-close" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sideButton]}
                        onPress={handleSendMedia}
                    >
                        <Ionicons name="md-send" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                ref={camera}
                type={type}
                flashMode={flash}
            >
                <View style={[styles.buttonContainer, styles.topButtonContainer]}>
                    <TouchableOpacity
                        style={styles.flashButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="ios-close" size={45} color="#cdd0cb" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flashButton}
                        onPress={() => {
                            setFlash(
                                flash === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off
                            );
                        }}
                    >
                        <Ionicons name="md-flash" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                </View>
                <View style={[styles.buttonContainer, styles.bottomButtonContainer]}>
                    <TouchableOpacity
                        style={[styles.sideButton, styles.galleryButton]}
                        onPress={onOpenGallery}>
                        <Ionicons name="md-images" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={takePictureAsync}>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sideButton, styles.switchCameraButton]}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Ionicons name="md-refresh" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        marginBottom: 20,
    },
    noPermissionContainer: {
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topText: {
        color: 'white',
        marginBottom: 75
    },
    bottomText: {
        color: 'red'
    },
    camera: {
        flex: 1,
    },
    flashButton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        height: 50,
        paddingHorizontal: 20
    },
    topButtonContainer: {
        top: '5%'
    },
    bottomButtonContainer: {
        bottom: '5%',
    },
    galleryButton: {},
    cameraButton: {
        width: 50,
        height: 50,
        backgroundColor: Colors.light.tint,
        borderRadius: 50,
        borderColor: Colors.light.background,
        borderWidth: 5
    },
    switchCameraButton: {},
    sideButton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    imagePreview: {
        marginTop: 40,
        flex: 1,
        width: '100%',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    }
}); 