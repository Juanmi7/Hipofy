import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AlertH from "../Alert/Alert";
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import CheckBox from "expo-checkbox";
import { default as localStorage } from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Config from "../../constants/Config";
import LoadingLogin from "./LoadingLogin/LoadingLogin";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height

const Login = () => {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [eye, setEye] = useState(true);
  const [alert, setAlert] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [goToLogin, setGoToLogin] = useState(false)

  const handlePassword = () => {
    setEye(!eye);
  };
  const handleInputBlur = () => {
    setAlert(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Reiniciar los estados alert e isLogged
    setAlert(false);
    setIsLogged(true);
    console.log(email);
    console.log(password);
    if (email !== "" && password !== "") {
      setIsLogging(true);
      const response = await fetch(`${Config.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const dataResponse = await response.json();

      if (isChecked) {
        localStorage.setItem("Email", email);
        localStorage.setItem("Password", password);
      } else {
        localStorage.removeItem("Email");
        localStorage.removeItem("Password");
      }

      //Almacenamiento response en localStorage para traerlo en Profile
      if (response.status === 200) {
        localStorage.setItem("Response", JSON.stringify(dataResponse));
        localStorage.setItem("idUser", dataResponse.data.id);
        localStorage.setItem("Token", dataResponse.data.token);
        localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        router.replace("/home");
        setIsLogging(false);

        if (dataResponse.data.role === "admin") {
          // navigate("profile/admin/");
        }
        setIsLogged(true);
      } else {
        localStorage.clear();
        setIsLogged(false);
        setIsLogging(false);
      }

      try {
        localStorage.setItem("idUser", dataResponse.data.id);
        localStorage.setItem("Token", dataResponse.data.token);
        localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        setIsLogged(true);
        setIsLogging(false);
      } catch (error) {
        setIsLogged(false);
        setIsLogging(false);
      }
    } else {
      setIsLogging(false);
      setAlert(true);
    }
  };

  // const handleCloseModal = () => {
  //   setAlert(false);
  // };
  //UseEffect LocalStorage - Remember me
  // useEffect(() => {
  // localStorage.getItem("Token").then( async (token) => {
  //   if(token){
  //     const responseVerifyToken = await fetch(`${Config.baseURL}/verifyToken`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({}),
  //     });

  //   const dataResponse = await responseVerifyToken.json();

  //     if(dataResponse.status === 200){
  //       localStorage.setItem("idUser", dataResponse.data.id);
  //       localStorage.setItem("Token", dataResponse.data.token);
  //       localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
  //       router.replace('/home')
  //     }
  //   }
  // })
  // if (localStorage.getItem("Email") && localStorage.getItem("Password")) {
  //   document.querySelector("input[name='email']")!.textContent =
  //     localStorage.getItem("Email");
  //   document.querySelector("input[name='password']")!.textContent =
  //     localStorage.getItem("Password");
  //   setIsChecked(true);
  // }
  // }, []);

  const handleLogin = () => {
    setGoToLogin(true)
  }
  const handleRegister = () => {
    setGoToLogin(false)
    router.push("/singupPage");
  }

  return (
    <KeyboardAwareScrollView style={styles.mainlogin}>
      {!isLogged && (
        <Modal animationType="slide" transparent={true} visible={!isLogged}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AlertH
                text={"Email o contraseña incorrectos."}
                closeModal={() => setIsLogged(true)}
              />
            </View>
          </View>
        </Modal>
      )}
      {isLogging ? (
        <LoadingLogin />
      ) : (
        <View>
            <View style={styles.title}>
              <Image
                source={require("../../assets/images/hipofy-logo-login.png")}
                style={{ width: 222, height: 192 }}
              />
              <Text style={styles.textMain}>Hipofy</Text>
              <Text style={styles.textSubMain}>
                La manera inteligente de ahorrar
              </Text>
            </View>
          <View>
            {goToLogin && <View style={styles.login}>
              <TextInput
                inputMode="email"
                value={email}
                onChangeText={setEmail}
                placeholder="Introduce tu email"
                placeholderTextColor="rgba(0, 0, 0, 0.55)"
                onBlur={handleInputBlur}
                style={styles.textInput}
              />
              <TextInput
                inputMode="text"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={eye ? true : false}
                placeholder="Introduce tu contraseña"
                placeholderTextColor="rgba(0, 0, 0, 0.55)"
                onBlur={handleInputBlur}
                style={styles.textInput}
              />
              <Icon
                style={styles.svg}
                name={eye ? "eye" : "eye-slash"}
                onPress={handlePassword}
              />
              <View style={styles.remember}>
                <CheckBox
                  style={styles.checkbox}
                  value={isChecked}
                  onValueChange={setIsChecked}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "RubikRegular",
                    color: "rgba(0, 0, 0, 0.75)",
                  }}
                >
                  Recordar sesión
                </Text>
              </View>
              {/* <View style={styles.buttonSubmit}>
              <Button
                onPress={handleSubmit}
                color={'#FFF'}
                title="Inicia sesión"
              />
            </View> */}
              <Pressable onPress={handleSubmit}>
                <View style={styles.buttonSubmit}>
                  <Text style={styles.buttonSubmitText}>Inicia sesión</Text>
                </View>
              </Pressable>
            </View> }
            
          </View>
          <View style={styles.login}>
            {!goToLogin && <View>
                <Pressable onPress={handleLogin}>
                  <View style={styles.buttonSubmit}>
                    <Text style={styles.buttonSubmitText}>Iniciar sesión</Text>
                  </View>
                </Pressable>
                <View style={styles.separator} />
            </View>
            
            }
            
            
            <View>
              <Pressable onPress={handleRegister}>
                  <View style={styles.buttonSubmit}>
                    <Text style={styles.buttonSubmitText}>Regístrate</Text>
                  </View>
                </Pressable>
            </View>
          </View>
        </View>
      )}
      {alert && (
        <Modal animationType="slide" transparent={true} visible={alert}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AlertH
                text={"El email y la contraseña son obligatorios."}
                closeModal={() => setAlert(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainlogin: {
    paddingTop: 50,
    backgroundColor: "#22C990",
    height: "100%",
  },
  login: {
    backgroundColor: "#62d9b0",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
  centeredView: {},
  svg: {
    position: "absolute",
    right: 30,
    top: 129,
    fontSize: 25,
    color: "rgba(0, 0, 0, 0.5)",
  },
  remember: {
    marginTop: 15,
    flexDirection: "row",
    fontFamily: "RubikRegular",
    fontSize: 18,
  },
  checkbox: {
    marginHorizontal: 10,
  },
  textInput: {
    borderRadius: 6,
    backgroundColor: "#fff",
    textAlign: "left",
    padding: 14,
    marginTop: 15,
    fontSize: 18,
  },
  buttonSubmit: {
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: "#017BFE",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonSubmitText: {
    textAlign: "center",
    fontFamily: "RubikRegular",
    fontSize: 24,
    color: "#FFF",
  },
  registerButton: {
    alignSelf: "center",
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
  separator: {
    marginVertical: 15,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});