import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Image, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native'
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


export const CameraScreen = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

    const [pictureData, setPictureData] = useState<string | undefined>('')

    const navigation = useNavigation();

    const camera = useRef<Camera | null>()

    const isFocused = useIsFocused();

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasCameraPermission(status === 'granted')
    }

    const takePictureAsync = async () => {
        if (camera.current) {
            try {
                const options = { quality: 1, base64: true, skipProcessing: false }

                const picture = await camera.current.takePictureAsync(options);
                setPictureData(picture.base64)
            } catch (err) {

            }
        }
    }

    useEffect(() => {
        if (isFocused && !hasCameraPermission) {
            requestCameraPermission();
        }
    });


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
            setPictureData(result.base64);
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

    if (pictureData) {
        return (
            <View style={[styles.container, { backgroundColor: '#000' }]}>
                <Image
                    source={{ uri: `data:image/gif;base64,${pictureData}` }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                >
                </Image>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[styles.sideButton]}
                        onPress={() => {
                            setPictureData('')
                        }}
                    >
                        <Ionicons name="md-close" size={35} color="#cdd0cb" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sideButton]}
                        onPress={() => {
                        }}
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