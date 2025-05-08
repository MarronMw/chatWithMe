import { StatusBar, StyleSheet, Text, View } from "react-native";
import AIChatApp from "./screens/AIChatApp";

export default function App() {
  return <AIChatApp />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
