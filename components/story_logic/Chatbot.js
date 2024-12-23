import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions, ImageBackground, TouchableWithoutFeedback, Image } from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GEMINI_API_KEY } from "@env";
import backgroundImage from '../../images/Backgrounds/combatModeBackground.png';
import BackArrow from '../../modules/BackArrow';
import verify from '../../images/TinderPage/verify.png';


const Chatbot = ({ navigation, route }) => {
    const { currentProfile } = route.params;
    const characterId = currentProfile.id;
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);


    useEffect(() => {
        // Load messages when the component mounts
        loadMessages();
    }, []);

    useEffect(() => {
        // Save messages whenever they update
        storeMessages(chat, characterId);
    }, [chat]);

    const storeMessages = async (messages, characterId) => {
        try {
            await AsyncStorage.setItem(`chatMessages_${characterId}`, JSON.stringify(messages));
        } catch (error) {
            console.error('Error storing messages:', error);
        }
    };

    const loadMessages = async () => {
        try {
            const storedMessages = await AsyncStorage.getItem(`chatMessages_${characterId}`);
            if (storedMessages) {
                setChat(JSON.parse(storedMessages));
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setChat(updatedChat);
        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: updatedChat,
                }
            );
            console.log("Gemini Pro API Response:", response.data);
            
            const modelResponse = 
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];

                setChat(updatedChatWithModel);
                setUserInput("");
            }
        } catch (error) {
            console.error("Error calling Gemini Pro API", error);
            console.error("Error response:", error.response);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            stop();
            setIsSpeaking(false);
        } else {
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.background}>
                <View style={styles.paddingContainer}>
                    <View style={styles.topNavContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <BackArrow />
                        </TouchableOpacity>
                        <ImageBackground source={currentProfile.animalType} style={styles.avatar} />
                        <Text style={styles.animalName}>{currentProfile.name}</Text>
                        {/* <Text style={styles.animalName}>{`, ${currentProfile.age}`}</Text> */}
                        {currentProfile.verified && <Image source={verify} style={styles.verifiedIcon} />}
                        {/* <ImageBackground source={profileIcon} style={styles.profileIcon} /> */}
                        {/* <TouchableWithoutFeedback onPress={clearChat}>
                            <Image source={eraserIcon} style={styles.eraseIcon} />
                        </TouchableWithoutFeedback> */}
                    </View>
                    {/* <Text style={styles.title}>{currentProfile.name}</Text> */}
                    <FlatList
                        data={chat}
                        renderItem={renderChatItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.chatContainer}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Start Typing..."
                            placeholderTextColor="#aaa"
                            value={userInput}
                            onChangeText={setUserInput}
                        />
                        {/* <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity> */}
                    </View>
                    {loading && <Text style={styles.loading}>Loading...</Text>}
                    {error && <Text style={styles.error}>{error}</Text>}
                </View>
            </ImageBackground>
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width
    },
    paddingContainer: {
        flex: 1,
        width: width,
    },
    background: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    verifiedIcon: {
        width: 30,
        height: 30,
        left: 12
    },
    avatar: {
        width: 80,
        height: 80,
      },
    animalName: {
        fontSize: 30,
        // fontFamily: 'NiceTango-K7XYo'
      },
    topNavContainer: {
        paddingHorizontal: 30, // Padding on left and right
        // paddingVertical: 5,  // Padding on top and bottom
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 100,
        alignItems: 'center', // Vertically align items

    },
    botAvatar: {
        width: 80,
        height: 80,
        borderRadius: 20,
      },
    profileIcon: {
        width: 31,
        height: 38,
        left: 300,
        top: 55,
        position: 'absolute',
      },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center",
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "white",
        // width: window.width,
        padding: 30
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 25,
        color: "lightpink",
        backgroundColor: "#fff",
    },
    button: {
        padding: 10,
        backgroundColor: "#007AFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
    loading: {
        color: "#333",
        marginTop: 10,
        textAlign: "center",
    },
    error: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },
});

export default Chatbot;
