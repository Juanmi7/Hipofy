import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import AlertH from "../Alert/Alert";
import Icon from "react-native-vector-icons/FontAwesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons/faArrowLeftLong";
import {
  Button,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, router, useRouter } from "expo-router";
import Market from "../Market/Market";
import Config from "../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardProduct from "../Products/CardProduct/CardProduct";
import { store } from "../../store";
import CameraButton from "../Camera/Camera";
import QuantityProductModal from "./QuantityProductModal/QuantityProductModal";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height

const NewList = (props) => {
  const router = useRouter();

  const [listName, setListName] = useState("");
  const [productName, setProductName] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [listNameError, setListNameError] = useState(false);
  const [noSelectedProducts, setNoSelectedProducts] = useState(false);
  const [idList, setIdList] = useState("");
  const [alert, setAlert] = useState(false);
  const [savedList, setSavedList] = useState(false);
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [toSelectSupermarket, setToSelectedMarket] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [productSelectedTMP, setProductSelectedTMP] = useState({});
  const [productQuantityTMP, setProductQuantityTMP] = useState(1);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleListNameChange = (e) => {
    setListName(e);
  };

  const handleInputChange = (e) => {
    setProductName(e);
    setShowDropdown(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const openModalToAddQuantity = (product) => {
    if (product) {
      setShowQuantityModal(true);
      setProductSelectedTMP({
        _id: product._id,
        name_product: product.name_product,
        imagenUrl: product.img,
        obj: product,
      });
    }
  };

  const addProductToList = (productParam) => {
    const product = productParam.obj;
    console.log("product");
    console.log(product);
    const isProductAdded = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (!isProductAdded) {
      product.quantity = productQuantityTMP ? productQuantityTMP : 1;
      console.log("product");
      console.log(product);
      setSelectedProducts((prevProducts) => [...prevProducts, product]);
      setProductName("");
      setProductQuantityTMP(1);
    } else {
      const productAdded = selectedProducts.find(
        (selectedProduct) => selectedProduct._id === product._id
      );
      productAdded.quantity = Number(
        productQuantityTMP ? productQuantityTMP : 1
      );
      const selectProductsFiletered = selectedProducts.filter(
        (p) => p._id !== productAdded._id
      );
      setSelectedProducts([...selectProductsFiletered, productAdded]);
      setProductName("");
      setProductQuantityTMP(1);
    }
    setShowQuantityModal(false);
  };

  const removeProductFromList = (product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter(
        (selectedProduct) => selectedProduct._id !== product._id
      )
    );
  };

  const createList = async (isSave) => {
    if (listName === "") {
      setListNameError(true);
      return;
    }

    if (selectedProducts.length === 0) {
      setNoSelectedProducts(true);
      return;
    }

    try {
      const idUserAux = await AsyncStorage.getItem("idUser");
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          id_user: idUserAux,
          id_products: selectedProducts.map((product) => {
            return {
              id: product._id,
              name: product.name_product,
              quantity: product.quantity,
            };
          }),
          name_list: listName,
          status: "Guardada",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la lista");
      } else {
        const data = await response.json();
        setIdList(data.datasave._id);
        setProductsQuantity(data.datasave.id_products.length);
        console.log(data.datasave.id_products.length);
        AsyncStorage.setItem("id_list", data.datasave._id);
        AsyncStorage.setItem(
          "product_quantity",
          String(data.datasave.id_products.length)
        );
        console.log("datasave: ");
        console.log(data);
        console.log(`data.datasave._id: ${data.datasave._id}`);
        store.update((state) => {
          state.list.create.id = data.datasave._id;
        });
        store.update((state) => {
          state.list.create.status = "EDIT";
        });
        store.update((state) => {
          state.list.create.productQuantity = data.datasave.id_products.length;
        });
        store.update((state) => {
          state.list.create.products = data.datasave.id_products;
        });
        if (!isSave) {
          setToSelectedMarket(true);
        }else{
          router.replace("/list");
        }
      }
    } catch (error) {
      console.log("Error creating list:", error);
    }
  };

  const updateList = async (isSave) => {
    try {

      // setIsLoading(true);
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      setIdList(props.actualList._id);
      const response = await fetch(
        `${Config.baseURL}/list/${props.actualList._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "auth-token": tokenAux,
            "auth-token-refresh": refreshTokenAux,
          },
          body: JSON.stringify({
            name_list: listName,
            id_products: selectedProducts.map((product) => {
              return {
                id: product._id,
                name: product.name_product,
                quantity: product.quantity,
              };
            }),
            status: "Guardada",
          }),
        }
      );

      if (response.ok) {
        await response.json();
        console.log("update list");
        AsyncStorage.setItem(
          "product_quantity",
          String(selectedProducts.length)
        );
        console.log("update list");
        AsyncStorage.setItem(
          "product_quantity",
          String(selectedProducts.length)
        );
        store.update((state) => {
          state.list.create.productQuantity = selectedProducts.length;
        });
        store.update((state) => {
          state.list.create.products = selectedProducts.id_products;
        });
        // props.setAlertGreen(true);
        // props.setAlertRed(false);
        if (!isSave) {
          setToSelectedMarket(true);
        }else{
          router.replace("/list");
        }
      } else {
        // props.setAlertGreen(false);
        // props.setAlertRed(true);
        throw new Error("Error al actualizar la lista");
      }
    } catch (error) {
      console.log(error);
    }
    // setIsLoading(false);
  };
  const handleButtonSave = () => {
    if (props.actualList) {
      updateList();
    } else {
      createList();
      setToSelectedMarket(true);
    }
  };

  const handleButtonLater = () => {
    setShowSaveAlert(true);
    setTimeout(() => {
      if (props.actualList) {
        updateList(true);
      } else {
        createList(true);
      }
      setShowSaveAlert(false);
    }, 3500);
  };

  useEffect(() => {
    if (idList !== "") {
      console.log(idList);
      AsyncStorage.setItem("id_list", idList);
      setSavedList(true);
    }
  }, [idList]);

  useEffect(() => {
    console.log(props.actualList);
    if (props.actualList) {
      setListName(props.actualList.name_list);
      setSelectedProducts(
        props.actualList.id_products.map((product) => {
          return {
            _id: product.id,
            name_product: product.name,
            quantity: product.quantity,
          };
        })
      );
    }
  }, []);

  const handleListNameFocus = () => {
    setListNameError(false);
  };

  const handleInputFocus = () => {
    setNoSelectedProducts(false);
  };

  useEffect(() => {
    const searchMatchingProducts = async () => {
      try {
        const tokenAux = await AsyncStorage.getItem("Token");
        const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
        const response = await fetch(
          `${Config.baseURL}/products/${productName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": tokenAux,
              "auth-token-refresh": refreshTokenAux,
            },
          }
        );
        const { data } = await response.json();
        setMatchingProducts(data.slice(0, 20));
      } catch (error) {
        console.log("Error searching for products:", error);
      }
    };

    if (productName !== "" && productName.length >= 3) {
      searchMatchingProducts();
    } else {
      setMatchingProducts([]); // Limpiar la lista de productos coincidentes si el campo de búsqueda está vacío
    }
  }, [productName]);

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.container}>
          {!toSelectSupermarket ? (
            <View>
              <View style={styles.crearListaView}>
                {props.actualList ? (
                  <Text style={styles.crearLista}>Editar lista</Text>
                ) : (
                  <Text style={styles.crearLista}>Crear nueva lista</Text>
                )}
              </View>
              <View>
                <TextInput
                  placeholder="Nombre de la lista..."
                  value={listName.charAt(0).toUpperCase() + listName.slice(1)}
                  onChangeText={(text) => handleListNameChange(text)}
                  onFocus={() => setShowDropdown(false)}
                  style={styles.input}
                />
                <View style={styles.separator} />
                <TextInput
                  placeholder="Escribe producto que deseas buscar..."
                  value={
                    productName.charAt(0).toUpperCase() + productName.slice(1)
                  }
                  onChangeText={(text) => handleInputChange(text)}
                  style={styles.input}
                />
                <View style={styles.separator} />
              </View>

              <View style={{ marginTop: 10 }}>
                <View>
                  {showDropdown && (
                    <View>
                      {matchingProducts && matchingProducts.length > 0
                        ? matchingProducts.map((product, index) => (
                            <View
                              style={{
                                borderBottomWidth: 3,
                                borderBottomColor: "#c7bcba",
                                width: "100%",
                              }}
                              key={product._id}
                            >
                              <CardProduct
                                nombre={product.name_product}
                                supermercado={product.market[0].name_market}
                                precio={product.market[0].price}
                                imagenUrl={product.img}
                              />
                              <View style={styles.buttonAddProduct}>
                                <TouchableOpacity
                                  style={styles.buttonFont}
                                  onPress={() => openModalToAddQuantity(product)}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      fontFamily: "RubikMedium",
                                      paddingLeft: 10,
                                      paddingRight: 10,
                                    }}
                                  >
                                    Agregar a la lista
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            {showQuantityModal &&
                              <QuantityProductModal
                                key={index}
                                index={index}
                                productSelectedTMP={productSelectedTMP}
                                productQuantityTMP={productQuantityTMP}
                                showQuantityModal={showQuantityModal}
                                setProductQuantityTMP={setProductQuantityTMP}
                                addProductToList={addProductToList}
                                setProductSelectedTMP={setProductSelectedTMP}
                                setShowQuantityModal={setShowQuantityModal}
                                selectedProducts={selectedProducts}
                              />
                            }
                            </View>
                          ))
                        : null}
                    </View>
                  )}
                </View>
                <View style={styles.list}>
                  <Text style={styles.listName}>
                    {listName !== "" ? `${listName}:` : "Sin Nombre"}
                  </Text>
                  <View style={{ marginTop: 10, marginLeft: 24 }}>
                    {selectedProducts.map((product) => (
                      <View
                        key={product._id}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginRight: 5,
                          marginBottom: 5,
                          borderBottomWidth: 1,
                          borderBottomColor: "#c7bcba",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => removeProductFromList(product)}
                        >
                          {
                            <AntDesign
                              name="closecircleo"
                              size={26}
                              color="#807c7b"
                              marginLeft={-10}
                            />
                          }
                          {/* <Text
                <View style={styles.list}>
                  <Text style={styles.listName}>
                    {listName !== "" ? `${listName}:` : "Sin Nombre"}
                  </Text>
                  <View style={{ marginTop: 10, marginLeft: 24 }}>
                    {selectedProducts.map((product) => (
                      <View
                        key={product._id}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginRight: 5,
                          marginBottom: 5,
                          borderBottomWidth: 1,
                          borderBottomColor: "#c7bcba",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => removeProductFromList(product)}
                        >
                          {
                            <AntDesign
                              name="closecircleo"
                              size={26}
                              color="#807c7b"
                              marginLeft={-10}
                            />
                          }
                          {/* <Text
                              style={{
                                fontSize: 10,
                                backgroundColor: "#c7bcba",
                                borderRadius: 50,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 5,
                                paddingBottom: 5,
                                fontWeight: "bold",
                                textAlign: "center",
                                justifyContent: "center",
                                color: "white",
                                marginLeft: -12,
                              }}
                            >
                              X
                            </Text> */}
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: 15,
                            marginRight: 5,
                            fontSize: 22,
                            fontFamily: "Escrita",
                            marginBottom: 5,
                            color: "#807c7b",
                          }}
                        >
                          {`${product.quantity} - ${product.name_product}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={styles.buttonCreate}
                    onPress={handleButtonSave}
                  >
                    <Text style={styles.textCreate}>
                      Recomiendame un supermercado
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.buttonCreate}
                    onPress={handleButtonLater}
                  >
                    <Text style={styles.textCreate}>
                      Guardar y continuar después
                    </Text>
                  </Pressable>
                  {showSaveAlert && (
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={showSaveAlert}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <AlertH
                            alerType={"success"}
                            text={
                              "Lista guardada correctamente. Puedes continuar en la sección de listas."
                            }
                            closeModal={() => setShowSaveAlert(false)}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                  {/* </Link> */}
                </View>
              </View>

              {alert && (
                <Modal animationType="slide" transparent={true} visible={alert}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <AlertH
                        text={
                          "Lo sentimos, algo no ha ido como debía... ¡Inténtalo de nuevo!"
                        }
                        closeModal={() => setAlert(false)}
                      />
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          ) : (
            <View>
              <Market />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default NewList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
  },
  separator: {
    height: 1,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderRadius: 5,
    backgroundColor: "#22c990",
    marginLeft: 12,
    marginRight: 12,
    marginTop: 20,
  },
  textCreate: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
    fontFamily: "RubikBold",
  },
  crearListaView: {
    paddingTop: 2,
    paddingBottom: 5,
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    color: "rgba(0, 0, 0, 0.5)",
    marginRight: 100,
    marginBottom: 10,
  },
  crearLista: {
    marginTop: 20,
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.5)",
    fontFamily: "RubikRegular",
  },

  input: {
    height: 40,
    color: "#AFAFAF",
    padding: 6,
    fontSize: 15,
    paddingLeft: 15,
    marginTop: 15,
    fontFamily: "RubikRegular",
  },
  list: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 15,
  },
  listName: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Escrita",
    fontSize: 30,
    color: "#807c7b",
    marginBottom: 5,
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
    padding: 40,
  },
  buttonContainer: {
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 40,
    marginRight: 40,
    // marginTop: -35,
    // width: "100%",
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
  buttonAddProduct: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 25,
  },

  buttonFont: {
    backgroundColor: "#22c999",
    borderRadius: 50,
    padding: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    fontFamily: "RubikRegular",
  },
  cardTitle: {
    fontSize: 24,
    marginHorizontal: 18,
    marginVertical: 20,
    fontFamily: "RubikBold",
  },
  lineBlack: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  },
  inputQuantity: {
    borderRadius: 6,
    backgroundColor: "#A4FFF7",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    padding: 15,
    marginTop: 15,
    color: "#000",
    fontSize: 15,
    alignSelf: "center",
    fontFamily: "RubikRegular",
  },
});
