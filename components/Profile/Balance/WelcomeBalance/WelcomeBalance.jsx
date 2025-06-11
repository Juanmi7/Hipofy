import { useEffect, useState } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../../../../constants/Screen";
import EditProfile from "../EditProfile/EditProfile";
import { store } from "../../../../store";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import AutoScrolling from "react-native-auto-scrolling";

const WelcomeBalance = () => {
  const router = useRouter();

  const [loginData, setLoginData] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getUserInformation = async () => {
      const loginDataAux = await AsyncStorage.getItem("Response");
      const loginDataParse = JSON.parse(loginDataAux);
      setLoginData(loginDataParse);
      setUsername(capitalizeFirstLetter(loginDataParse.data.user));
    };
    getUserInformation();
  }, []);

  // Handle functions
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const closeSession = async () => {
    await AsyncStorage.removeItem("Token");
    await AsyncStorage.removeItem("Refresh_Token");
    await AsyncStorage.removeItem("Response");
    await AsyncStorage.removeItem("idUser");
    await AsyncStorage.removeItem("id_list");
    await AsyncStorage.removeItem("product_quantity");
    await AsyncStorage.removeItem("Is_Invited");
    store.update((state) => {
      state.list.create.id = "";
    });
    store.update((state) => {
      state.list.create.status = "";
    });
    router.replace("/login");
  };

  /* Función para capitalizar la primera letra del nombre del usuario */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View
      style={{
        flexDirection: "column",
        borderWidth: 2,
        padding: 15,
        borderRadius: 8,
        borderColor: "rgba(0,0,0,0.25)",
      }}
    >
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <FontAwesome5 name="earlybirds" size={100} color="rgba(0,0,0,0.75)" />
        <AutoScrolling style={styles.scrolling1}>
          <Text
            style={{
              alignSelf: "center",
              marginLeft: 20,
              fontSize: 40,

              color: "rgba(0,0,0,0.75)",
              fontFamily: "RubikBold",
            }}
          >
            Hola, {username}
          </Text>
        </AutoScrolling>
      </View>

      <View style={styles.separator} />
      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "RubikBold",
          }}
        >
          Bienvenido a la mejor manera de ahorrar.{" "}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "RubikBold",
          }}
        >
          Aquí podrás ver todos tus datos, así como el historial de tus compras.
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setOpenModal(true)}
        >
          <Text style={styles.textStyle}>Edita tu perfil</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.buttonOpen,
            { marginTop: 10, backgroundColor: "#DC3444" },
          ]}
          onPress={closeSession}
        >
          <Text style={styles.textStyle}>Cerrar sesión</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setOpenModal(!openModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <EditProfile closeModal={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WelcomeBalance;

const styles = StyleSheet.create({
  separator: {
    marginVertical: 15,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  scrolling1: {
    width: 330,
  },
  buttonOpen: {
    backgroundColor: "#017BFE",
  },
  textStyle: {
    color: "white",
    fontFamily: "RubikBold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
