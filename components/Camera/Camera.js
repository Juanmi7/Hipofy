import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../../constants/Config";
import { store } from "../../store";
import AlertH from "../Alert/Alert";

const CameraButton = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showTicketAlert, setShowTicketAlert] = useState(false);


  const handleCameraButtonPress = () => {
    setShowTicketAlert(true);
    setTimeout(() => {
      setShowTicketAlert(false);
      sendPhoto()
    }, 3000);
  };


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const openCamera = () => {
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    setPhotoTaken(false); // Restablecer la variable de estado cuando se cierra la cámara.
  };
  
  const sendPhoto = async () => {
    try {
      const data = new FormData();
      data.append('file', {
        uri: photoUri,
        name: 'ticket',
        type: photoFile.mimeType,
      });
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/upload-ticket/${props.idList}`, {
        method: "POST",
        headers: {
          "Accept": 'application/json',
          "Content-Type": "multipart/form-data",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: data,
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res)
        AsyncStorage.removeItem("id_list");
        AsyncStorage.removeItem("product_quantity");
        store.update((state) => {
          state.list.create.id = "";
        });
        store.update((state) => {
          state.list.create.status = "";
        });
        store.update((state) => {
          state.list.create.productQuantity = 0;
        });
        store.update((state) => {
          state.list.create.products = [];
        });
        // props.succesUpload()
        setPhotoFile(null)
        setPhotoUri(null);
        setPhotoTaken(false);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoFile(photo)
      setPhotoUri(photo.uri);
      setPhotoTaken(true);
    }
  };

  return (
    <View style={styles.container}>
      {!cameraOpen && !photoTaken ? (
        <TouchableOpacity style={styles.openButton} onPress={openCamera}>
          <Text style={styles.openButtonText}>Abrir Cámara</Text>
        </TouchableOpacity>
      ) : null}
      {cameraOpen && !photoTaken ? (
        <View style={{ borderRadius: 10, overflow: "hidden" }}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => {
              setCameraRef(ref);
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.buttonText}>
                <Ionicons
                  name="camera-reverse"
                  size={35}
                  color="rgba(0, 0, 0, 0.5) "
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>
                <Ionicons name="camera" size={35} color="rgba(0, 0, 0, 0.5)" />
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
            <Text style={styles.closeButtonText}>
              <AntDesign name="closecircleo" size={28} />
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {photoTaken ? (
        <View style={{ marginTop: 20, borderRadius: 10 }}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.buttonContainerInterior}>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => setPhotoTaken(false)}
            >
              <Text style={styles.buttonBackText}>Volver a la Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={handleCameraButtonPress}
              //aqui va la funcion para enviar el ticket a la base de datos
            >
              <Text style={styles.buttonTicket}>Enviar Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {showTicketAlert && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTicketAlert}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AlertH
              text="¡Ticket subido con éxito!"
              closeModal={() => setShowTicketAlert(false)}
            />
          </View>
        </View>
      </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  openButton: {
    fontSize: 20,
    alignSelf: "center",
    color: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "#a4fff7",
    shadowColor: "black",
    fontFamily: "RubikRegular",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 6,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    padding: 6,
  },
  openButtonText: {
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    fontFamily: "RubikRegular",
    fontSize: 17,
    padding: 4,
  },
  camera: {
    marginTop: 20,
    width: 340,
    height: 300,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#a4fff7",

    borderRadius: 5,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: "white",
    marginRight: 15,
    marginLeft: 15,
    padding: 5,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 35,
    right: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    marginTop: 1,
  },
  photo: {
    width: 340,
    height: 300,
    borderRadius: 10,
  },

  buttonBackText: {
    alignSelf: "center",
    color: "white",
    backgroundColor: "#e57373",
    shadowColor: "black",
    fontFamily: "RubikRegular",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 6,
    marginLeft: 15,
    marginRight: 15,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    padding: 6,
  },
  buttonContainerInterior: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
  },
  buttonTicket: {
    alignSelf: "center",
    color: "white",
    backgroundColor: "#80c080",
    shadowColor: "black",
    fontFamily: "RubikRegular",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 6,
    marginLeft: 15,
    marginRight: 15,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    padding: 6,
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

export default CameraButton;
