import { useState, useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome"
import { IconH } from "../core/IconH/IconH";

const AlertH = (props: any) => {
  const [isAlert, setIsAlert] = useState(true);

  const handleAlert = () => {
    setIsAlert(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false);
    }, 5000);

    return () => {
      clearTimeout(1);
    };
  });

  const closeModalFunction = () => {
    props.closeModal();
  };

  const iconName = props.alerType === "success" ? "check" : "warning";
  const iconColor = props.alertType === "success" ? "#008000" : "#656565";

  return (
    <View>
      <View>
          <View style={{ padding: 20 }}>
            {/* <View> */}
              <Text style={{ fontSize: 20, fontWeight: "600", display: "flex", flexDirection: "column"}}>
                <Text style={{marginRight: 20}}>
                  <IconH name={iconName} color={iconColor} />
                </Text>
                <Text>{props.text}</Text>
              </Text>
            {/* </View> */}
            <View style={styles.separator} />
            <View>
            <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={closeModalFunction}
                  >
                    <Text style={styles.textStyle}>
                      Ok
                    </Text>
                  </Pressable>
                </View>
            </View>
          </View>
      </View>
    </View>
  );
};

export default AlertH;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
    width: "40%",
    marginLeft: "30%"
  },
  buttonOpen: {
    backgroundColor: "#017BFE",
  },
  buttonCancel: {
    backgroundColor: "#ff7575",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  separator: {
    marginVertical: 15,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  textInput: {
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 14,
    width: "100%",
    color: "#000",
    fontSize: 20,
  },
  labelTextInput: {
    fontSize: 16,
  },
});
