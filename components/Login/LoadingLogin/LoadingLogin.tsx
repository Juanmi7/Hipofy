import { View, StyleSheet, ActivityIndicator, Text, Image } from "react-native";
import Screen from "../../../constants/Screen";

const LoadingLogin = () => {
  return (
    <View style={styles.mainlogin}>
      <View>
        <View style={styles.title}>
          <Image
            source={require("../../../assets/images/hipofy-logo-login.png")}
            style={{ width: 222, height: 192 }}
          />
          <Text style={styles.textMain}>Hipofy</Text>
          <Text style={styles.textSubMain}>Iniciando sesión...</Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingLogin;

const styles = StyleSheet.create({
  mainlogin: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#22C990",
    width: Screen.width,
    height: Screen.height,
  },

  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  textMain: {
    color: "#A4FFF7",
    fontSize: 64,
    fontWeight: "bold",
  },
  textSubMain: {
    color: "#A4FFF7",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
});
