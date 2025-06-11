import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { IconH } from "../../../core/IconH/IconH";
import Config from "../../../../constants/Config";
import AlertH from "../../../Alert/Alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "../../../Spinner/Spinner";
import { useRouter } from "expo-router";

const EditProfile = (props) => {
  const router = useRouter();

  const [loginData, setLoginData] = useState(undefined);
  const [loginDataParse, setLoginDataParse] = useState(undefined);
  const [idUser, setIdUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [created, setCreated] = useState(false);
  const [useLists, setUseLists] = useState({
    username: "",
    lastname: "",
    email: "",
  });

  // Obtener la información del usuario

  const getProfile = useCallback(async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/userallinfo/${idUser}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });
      if (response.status !== 200) {
        console.log("Error getting data");
      } else {
        const responseData = await response.json();
        setUseLists(responseData.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      console.log("Error getting data");
    }
  }, [idUser]);

  // Patch de la información del usuario

  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  const closeModalFunction = () => {
    props.closeModal();
  };

  const deleteAccount = async() => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");

      const response = await fetch(`${Config.baseURL}/user/${idUser}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        }
      });
      if (response.status !== 200) {
        console.log("Error deleting data");
        setShowWarningAlert(true);
        props.closeModal();
      } else {
        console.log("User deleted");
        props.closeModal();
        router.replace("/login");
        await AsyncStorage.removeItem("Token");
        await AsyncStorage.removeItem("Refresh_Token");
        await AsyncStorage.removeItem("Response");
        await AsyncStorage.removeItem("idUser");
        await AsyncStorage.removeItem("id_list");
        await AsyncStorage.removeItem("product_quantity");
        store.update((state) => {
          state.list.create.id = "";
        });
        store.update((state) => {
          state.list.create.status = "";
        });
      }
    } catch (error) {
      setShowWarningAlert(true);
      console.log("Error Deleting data");
    }
  };

  const patchProfile = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");

      // Validación de contraseña
      if (password !== confirmPassword) {
        setPasswordError(true);
        return; // Detener el envío de la información
      } else {
        setPasswordError(false);
      }

      const response = await fetch(`${Config.baseURL}/updateuser/${idUser}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          username: username !== "" ? username : undefined,
          lastname: lastname !== "" ? lastname : undefined,
          email: email !== "" ? email : undefined,
          password: password !== "" ? password : undefined,
        }),
      });
      if (response.status !== 200) {
        console.log("Error updating data");
        setShowWarningAlert(true);
        props.closeModal();
      } else {
        console.log("Data updated");
        getProfile();
        setCreated(true);
      }
    } catch (error) {
      console.log("Error updating data");
      setShowWarningAlert(true);
    }

    handleResetInfo();
    getProfile();
  };

  const handleCreated = () => {
    setCreated(false);
    props.closeModal();
  }
  const handleWarning = () => {
    setShowWarningAlert(false);
    props.closeModal();
  }

  const handleResetInfo = () => {
    setUsername("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setPasswordError(false);
      setCreated(false);
    }, 5000);
  };

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    const initPage = async () => {
      const loginDataAux = await AsyncStorage.getItem("Response");
      setLoginData(loginDataAux);
      const loginDataParseAux = JSON.parse(loginDataAux);
      setLoginDataParse(loginDataParseAux);
      setIdUser(loginDataParseAux.data.id);
    };
    initPage();
  }, []);

  return (
    <View>
      <View>
        {loading ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <IconH name="user-circle" color="rgba(0,0,0,0.75)" />
              <Text style={{ fontSize: 24, fontWeight: "700", marginLeft: 5 }}>
                Modificar tu perfil
              </Text>
            </View>
            <View style={styles.separator} />
            <View>
              <View>
                <View>
                  <View>
                    <Text style={styles.labelTextInput}>Nombre:</Text>
                    <TextInput
                      type="text"
                      name="username"
                      style={styles.textInput}
                      value={
                        username.charAt(0).toUpperCase() + username.slice(1)
                      }
                      onChangeText={setUsername}
                      placeholder={useLists.username}
                    />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.labelTextInput}>Apellidos:</Text>
                    <TextInput
                      type="text"
                      name="lastname"
                      style={styles.textInput}
                      value={
                        lastname.charAt(0).toUpperCase() + lastname.slice(1)
                      }
                      onChangeText={setLastname}
                      placeholder={useLists.lastname}
                    />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.labelTextInput}>Email:</Text>
                    <TextInput
                      type="text"
                      name="email"
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder={useLists.email}
                    />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.labelTextInput}>Nueva contraseña:</Text>
                    <TextInput
                      type="password"
                      name="password"
                      style={styles.textInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Nueva contraseña"
                    />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.labelTextInput}>
                      Confirmar contraseña:
                    </Text>
                    <TextInput
                      type="password"
                      name="confirmPassword"
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirmar contraseña"
                    />
                  </View>
                  {passwordError ? (
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={passwordError}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <AlertH
                            text={"Las contraseñas no coinciden."}
                            alertType={"warning"}
                            closeModal={() => setPasswordError(false)}
                          />
                        </View>
                      </View>
                    </Modal>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={patchProfile}
                  >
                    <Text style={styles.textStyle}>Guardar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={closeModalFunction}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </Pressable>
                </View>
                <View style={{marginTop: 20}}>

                  <Pressable
                    style={[styles.buttonDeleteAccount, styles.buttonDeleteAccountColor]}
                    onPress={deleteAccount}
                  >
                    <Text style={styles.textStyle}>Borrar cuenta de usuario</Text>
                  </Pressable>
                </View>
                {created ? (
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={created}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <AlertH
                            text={"Perfil actualizado correctamente."}
                            alertType={"success"}
                            closeModal={handleCreated}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                ) : null}
                {showWarningAlert ? (
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={showWarningAlert}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <AlertH
                            text={
                              "No se ha podido actualizar el perfil, inténtelo más tarde."
                            }
                            alertType={"warning"}
                            closeModal={handleWarning}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonDeleteAccount: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 2,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#017BFE",
  },
  buttonCancel: {
    backgroundColor: "#DC3444",
  },
  buttonDeleteAccountColor: {
    backgroundColor: "#596267",
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
});
