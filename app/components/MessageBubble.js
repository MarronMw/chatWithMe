import React from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function MessageBubble({
  message,
  isSpeaking,
  onReadAloud,
  onStopSpeech,
  pulseAnim,
}) {
  return (
    <Animated.View
      style={[
        styles.message,
        message.type === "user" ? styles.userMessage : styles.aiMessage,
        message.type === "user" && { transform: [{ scale: pulseAnim }] },
      ]}
    >
      {message.type === "ai" && (
        <View style={styles.aiHeader}>
          <FontAwesome5 name="robot" size={20} color="#7c4dff" />
          <Text style={styles.aiHeaderText}>Me (AI)</Text>
        </View>
      )}

      <Text
        style={[
          styles.messageText,
          message.type === "user" && styles.userMessageText,
        ]}
      >
        {message.text}
      </Text>

      {message.type === "ai" && (
        <View style={styles.readButtons}>
          <TouchableOpacity
            style={[styles.readAloudButton, isSpeaking && styles.stopButton]}
            onPress={() =>
              isSpeaking ? onStopSpeech() : onReadAloud(message.text)
            }
          >
            <Ionicons
              name={isSpeaking ? "stop-circle" : "volume-high"}
              size={16}
              color="#fff"
            />
            <Text style={styles.readAloudText}>
              {isSpeaking ? "Stop" : "Read Aloud"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});
