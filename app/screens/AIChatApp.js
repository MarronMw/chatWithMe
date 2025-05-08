import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import Axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import TypingDots from "../components/TypingDots";
import MessageBubble from "../components/MessageBubble";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_API_KEY;

//hide the status bar
StatusBar.setHidden(true);

const AIChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await getAIResponse(userMsg.text);
      const aiMsg = { type: "ai", text: responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const getAIResponse = async (text) => {
    try {
      const response = await Axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data;
      return (
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI."
      );
    } catch (error) {
      console.error("AI error:", error.response?.data || error.message);
      return "Error retrieving AI response.";
    }
  };

  const handleReadAloud = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      rate: 0.9,
      pitch: 1.1,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <ImageBackground
      source={require("./../assets/bg.png")} // Replace with your own futuristic background image
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Ionicons name="chatbubbles" size={28} color="#7c4dff" />
            <Text style={[styles.headerText, { textTransform: "uppercase" }]}>
              ChatWithMe
            </Text>
            <View style={styles.statusLight} />
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && (
              <View style={styles.welcomeContainer}>
                <Ionicons
                  name="planet"
                  size={50}
                  color="#7c4dff"
                  style={styles.welcomeIcon}
                />
                <Text style={styles.welcomeTitle}>Welcome to ChatWithMe</Text>
                <Text style={styles.welcomeSubtitle}>
                  Your futuristic AI assistant
                </Text>
              </View>
            )}

            {messages.map((msg, index) => (
              // <MessageBubble key={index} message={msg} />
              <MessageBubble
                key={index}
                message={msg}
                isSpeaking={isSpeaking}
                onReadAloud={handleReadAloud}
                onStopSpeech={handleStopSpeech}
                pulseAnim={pulseAnim}
              />
            ))}

            {loading && (
              <View style={[styles.message, styles.aiMessage]}>
                <TypingDots />
              </View>
            )}
          </ScrollView>

          <LinearGradient
            colors={["rgba(30,30,40,0.8)", "rgba(20,20,30,0.9)"]}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#aaa"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              maxLength={200}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={loading}
            >
              <Ionicons
                name={loading ? "time" : "send"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 77, 255, 0.3)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 10,
    letterSpacing: 1.5,
    textShadowColor: "rgba(124, 77, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4caf50",
    marginLeft: 10,
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  chatContainer: {
    flex: 1,
    marginTop: 10,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  message: {
    maxWidth: "85%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: "rgba(124, 77, 255, 0.9)",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
    marginRight: 5,
  },
  aiMessage: {
    backgroundColor: "rgba(30, 30, 40, 0.9)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "rgba(124, 77, 255, 0.2)",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  aiHeaderText: {
    color: "#7c4dff",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  messageText: {
    color: "#eee",
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 77, 255, 0.2)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(50, 50, 60, 0.7)",
    color: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(124, 77, 255, 0.3)",
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(124, 77, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#7c4dff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  readButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  readAloudButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(124, 77, 255, 0.7)",
    borderRadius: 15,
  },
  stopButton: {
    backgroundColor: "rgba(255, 80, 80, 0.7)",
  },
  readAloudText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 5,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingBubble: {
    flexDirection: "row",
    padding: 10,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7c4dff",
    marginHorizontal: 2,
  },
  welcomeContainer: {
    alignItems: "center",
    padding: 30,
    marginTop: 50,
    marginBottom: 30,
    backgroundColor: "rgba(30, 30, 40, 0.5)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 77, 255, 0.3)",
  },
  welcomeIcon: {
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
  },
});

export default AIChatApp;
