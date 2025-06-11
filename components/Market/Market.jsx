import Spinner from "../Spinner/Spinner";
import { useState, useEffect } from "react";
import AlertH from "../Alert/Alert";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import Config from "../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../store";
import { FontAwesome } from "@expo/vector-icons";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height

const Market = (props) => {
  let actualListId = store.useState((state) => state.list.create.id);
  let productsQuantityStore = store.useState(
    (state) => state.list.create.productQuantity
  );
  const router = useRouter();
  //UseStates
  const [markets, setMarkets] = useState({});
  const [prices, setPrices] = useState({});
  const [productsCount, setProductsCount] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [array, setArray] = useState([]);
  const [recomended, setRecomended] = useState(undefined);
  const [isLoadingRecomended, setIsLoadingRecomended] = useState(false);
  const [savedMoney, setSavedMoney] = useState([]);
  const [savedMarket, setSavedMarket] = useState([]);
  const [respuesta, setRespuesta] = useState(null);
  const [id_list, setIdList] = useState(null);
  const [productsQuantity, setProductsQuantity] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const [showProductNames, setShowProductNames] = useState(false);
  const [showProductNamesRecomended, setShowProductNamesRecomended] =
    useState(false);
  const [supermarketAdditionPrice, setSupermarketAdditionPrice] = useState(0)

  //Const declarations
  const configInit = async () => {
    const respuestaAux = await AsyncStorage.getItem("Response");
    setRespuesta(respuestaAux);
    const id_listAux = await AsyncStorage.getItem("id_list");
    setIdList(id_listAux);
    const productsQuantityAux = await AsyncStorage.getItem("product_quantity");
    setProductsQuantity(productsQuantityAux);
    const respuestaJson = JSON.parse(respuestaAux);
    setIdUser(respuestaJson.data.id);
  };

  const merged = Object.entries(markets).map((market) => {
    return {
      market: market[0],
      products: market[1],
      price: prices[market[0]],
    };
  });

  //Handle functions
  const handleButtonRedirect = (market, price) => {
    if (market && price) {
      updateSupermarketName(market, price);
    }
  };

  //Fetch functions
  const fetchMarkets = async (id) => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const idListAsync = await AsyncStorage.getItem("id_list");
      setIsLoading(true);
      const response = await fetch(
        `${Config.baseURL}/listsmarket/${actualListId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": tokenAux,
            "auth-token-refresh": refreshTokenAux,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMarkets(data.data.marketCount);
        setPrices(data.data.priceCount);
        setSupermarketAdditionPrice(Number.parseFloat(data.data.totalEstimatedPrice).toFixed(2))
        setProductsCount(data.data.productsCount);
        console.log("todo el producto:", data.data.productsCount);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setIsLoading(false);
  };

  const updateSupermarketName = async (market, price) => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const idListAsync = await AsyncStorage.getItem("id_list");
      setIsLoading(true);
      const response = await fetch(`${Config.baseURL}/list/${actualListId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          status: "Comprando",
          supermarkets: market,
          price: price,
        }),
      });
      if (response.ok) {
        await response.json();
        store.update((state) => {
          state.list.create.status = "Comprando";
        });
        router.replace("/list");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //Handle filters functions

  const handlePriceFilter = () => {
    let orderPrice = merged;
    if (priceFilterActive) {
      orderPrice = merged.sort((a, b) => {
        return a.price - b.price;
      });
    } else {
      orderPrice = merged.sort((a, b) => {
        return a.price + b.price;
      });
    }
    setPriceFilterActive(!priceFilterActive);
    setArray(orderPrice);
  };

  const handleProductsFilter = () => {
    const orderProducts = merged.sort((a, b) => {
      return b.products - a.products;
    });
    setArray(orderProducts);
  };

  const recomendedMarket = () => {
    setIsLoadingRecomended(true);
    const products = merged.map((products) => products.products);
    const maxProducts = Math.max(...products); //Mayor producto individual
    const savedMoney = [];

    if (maxProducts == productsQuantity) {
      //Igualdad de productos
      const equalProducts = merged.filter(
        (product) => product.products == productsQuantity
      );

      const equalPrices = equalProducts.sort((a, b) => {
        return a.price - b.price;
      });

      setRecomended(equalPrices[0]);

      //Calcular el ahorro
      for (let index = 1; index < equalPrices.length; index++) {
        savedMoney[equalPrices[index].market] =
          equalPrices[index].price - equalPrices[0].price;
      }

      //Array de los ahorros
      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      //Filtrar los ahorros mayores a 0
      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else if (maxProducts < productsQuantity) {
      //Menor producto individual filtrado por cantidad y precio
      const lessProducts = merged.filter(
        (product) => product.products < productsQuantity
      );

      //Filtrar entre los de menor cantidad por cantidad y precio
      const sortLessProducts = lessProducts.sort((a, b) => {
        if (a.products != b.products) {
          return b.products - a.products;
        } else {
          return a.price - b.price;
        }
      });

      setRecomended(sortLessProducts[0]);

      //Calcular el ahorro
      for (let index = 1; index < sortLessProducts.length; index++) {
        savedMoney[sortLessProducts[index].market] =
          sortLessProducts[index].price - sortLessProducts[0].price;
      }

      //Array de los ahorros
      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      //Filtrar los ahorros mayores a 0
      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else {
      //Caso que nunca pasaría
      const never = merged.sort((a, b) => {
        return a.price - b.price;
      });
      setRecomended(never[0]);
      setIsLoadingRecomended(false);
    }
  };

  //Toggle functions
  const toggleProductNamesVisibility = () => {
    setShowProductNames(!showProductNames);
  };
  const toggleProductNamesVisibilityRecomended = () => {
    setShowProductNamesRecomended(!showProductNamesRecomended);
  };
  //UseEffects

  useEffect(() => {
    console.log("primer useeffect");
    fetchMarkets(id_list);
  }, [actualListId]);

  useEffect(() => {
    console.log("segundo useeffect");
    setArray(merged);
    recomendedMarket();
  }, [markets, prices]);

  useEffect(() => {
    console.log("tercero useeffect");
    configInit();
  }, [isLoading]);

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          marginBottom: 10,
        }}
      >
        <View>
          <Text style={styles.headerSupermarketsOutCard}>
            Lista de la compra
          </Text>
        </View>

        <View style={styles.separator} />

        <View>
          {isLoadingRecomended ? (
            <Spinner />
          ) : (
            recomended && (
              <View style={styles.supermarketCard}>
                <View>
                  {/* <View>
                    <Text style={styles.supermarketCardTitle}>
                      {recomended.market}
                    </Text>
                  </View> */}
                  <View style={{}} />
                  <View style={styles.supermarketCardContent}>
                    {recomended.products === productsQuantity ? (
                      <View>
                        <Text style={styles.supermarketCardContentText}>
                          Tiene todos tus producto(s)
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.supermarketCardContentText}>
                          Tu lista de {productsQuantityStore} productos tiene un
                          precio total estimado de:
                          <Text style={styles.supermarketCardContentPriceText}>
                            {' '+supermarketAdditionPrice}
                            €
                          </Text>
                          {/* Tiene {recomended.products} productos de{" "} */}
                        </Text>
                      </View>
                    )}
                    {/* <View style={styles.supermarketCardContentPrice}>
                      <Text style={styles.supermarketCardContentText}> </Text>
                      <Text style={styles.supermarketCardContentPriceText}>
                        {recomended.price !== undefined
                          ? recomended.price.toFixed(2)
                          : recomended.price}{" "}
                        €
                      </Text>
                    </View> */}
                  </View>
                  <View>
                    {/* <Pressable
                      onPress={() =>
                        handleButtonRedirect(
                          recomended.market,
                          recomended.price
                        )
                      }
                      key={recomended.market}
                      style={styles.productNamesButton}
                    >
                      <Text style={styles.textButtonProductList}>
                        Ir al Supermercado
                      </Text>
                    </Pressable>
                    <TouchableOpacity
                      onPress={() => toggleProductNamesVisibilityRecomended()}
                      style={styles.productNamesButtonList}
                    >
                      <Text style={styles.textButtonProductList}>
                        Explorar productos aquí
                      </Text>
                    </TouchableOpacity> */}
                    {showProductNamesRecomended && (
                      <View style={styles.productListRecomended}>
                        {productsCount[recomended.market] &&
                        Array.isArray(productsCount[recomended.market]) ? (
                          productsCount[recomended.market].map(
                            (product, index) => (
                              <View
                                key={product._id}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  marginLeft: 10,
                                }}
                              >
                                <FontAwesome
                                  name="check"
                                  size={24}
                                  color="green"
                                />
                                <Text style={styles.textListRecomendedOpen}>
                                  {product.name_product}
                                </Text>
                              </View>
                            )
                          )
                        ) : (
                          <Text>
                            No hay productos disponibles {recomended.market}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )
          )}
        </View>
        <View style={styles.otrosSupermercados}>
          <View>
            <Text style={styles.headerSupermarketsOutCard}>
              Supermercados y Productos
            </Text>
          </View>

          <View style={styles.separator} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              marginBottom: 15,
              fontFamily: "RubikMedium",

              color: "rgba(0,0,0,0.5)",
            }}
          >
            Ordenar por:
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{}}>
              <TouchableOpacity
                onPress={handlePriceFilter}
                style={{ width: 160 }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "RubikItalic",
                    color: "rgba(0,0,0,0.75)",
                    backgroundColor: "#C3E6CB",
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderRadius: 10,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Precio
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            ></View>
            <View style={{}}>
              <TouchableOpacity
                onPress={handleProductsFilter}
                style={{
                  width: 160,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "RubikItalic",
                    color: "rgba(0,0,0,0.75)",
                    backgroundColor: "#C3E6CB",
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderRadius: 10,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  productos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Modal animationType="slide" transparent={true} visible={error}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <AlertH
                    text={"Hubo un error. ¡Inténtalo de nuevo!"}
                    closeModal={() => setError(false)}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <View style={{ flex: 1, flexDirection: "column" }}>
              {array &&
                array.length !== 0 &&
                array.map((market, index) => (
                  <View key={index} style={styles.supermarketCard}>
                    <View style={[styles.supermarketCardOthers]}>
                      <View>
                        <View>
                          <Text style={styles.supermarketCardTitle}>
                            {market.market}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: "rgba(0,0,0,0.10)",
                            borderWidth: 2,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                          }}
                        />
                        <View style={styles.supermarketCardContent}>
                          {market.products === productsQuantity ? (
                            <View>
                              <Text style={styles.supermarketCardContentText}>
                                Tiene todos tus productos
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <Text style={styles.supermarketCardContentText}>
                                Tiene {market.products} producto(s) de{" "}
                                {productsQuantityStore} que tiene tu lista de la
                                compra
                              </Text>
                            </View>
                          )}
                          <View style={styles.supermarketCardContentPrice}>
                            <Text style={styles.supermarketCardContentText}>
                              Precio estimado:{" "}
                            </Text>
                            <Text
                              style={styles.supermarketCardContentPriceText}
                            >
                              {market.price !== undefined
                                ? market.price.toFixed(2)
                                : market.price}{" "}
                              €
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.productNamesButton}
                      onPress={() =>
                        handleButtonRedirect(market.market, market.price)
                      }
                    >
                      <Text style={styles.textButtonProductList}>
                        Ir al Supermercado
                      </Text>
                    </TouchableOpacity>
                    {/* Botón para mostrar/ocultar los nombres de los productos */}
                    <TouchableOpacity
                      style={styles.productNamesButtonList}
                      onPress={() => toggleProductNamesVisibility()}
                    >
                      <Text style={styles.textButtonProductList}>
                        Explorar productos aquí
                      </Text>
                    </TouchableOpacity>
                    {/* Mostrar los nombres de los productos si la variable de estado showProductNames es verdadera */}
                    {showProductNames && (
                      <View style={styles.productListRecomended}>
                        {productsCount[market.market].map((product, index) => (
                          <View
                            key={product._id}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginLeft: 10,
                            }}
                          >
                            <FontAwesome name="check" size={24} color="green" />
                            <Text style={styles.textListRecomendedOpen}>
                              {product.name_product}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}
        </View>
        {alert && (
          <AlertH text="Debes seleccionar un supermercado para continuar." />
        )}
      </View>
    </ScrollView>
  );
};

export default Market;

const styles = StyleSheet.create({
  separator: {
    marginBottom: 30,
    height: 1.75,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerSupermarketsOutCard: {
    fontSize: 30,
    marginVertical: 10,
    marginHorizontal: 10,
    color: "rgba(0, 0, 0, 0.5)",

    fontFamily: "RubikBold",
  },
  otrosSupermercados: {
    marginTop: 30,
  },
  supermarketCard: {
    borderWidth: 2,
    borderColor: "#C3E6CB",
    alignSelf: "center",
    width: width - 25,
    borderRadius: 10,
    marginBottom: 10,
  },
  supermarketCardOthers: {
    marginVertical: 10,
  },
  supermarketCardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(0,0,0,0.50)",
    marginHorizontal: 10,
    marginVertical: 9,
  },
  supermarketCardContent: {
    padding: 10,
    flex: 1,
    flexDirection: "column",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  supermarketCardContentPrice: {
    flex: 2,
    flexDirection: "row",
    marginTop: 10,
  },
  supermarketCardContentText: {
    fontFamily: "RubikRegular",
    fontSize: 20,
  },
  supermarketCardContentPriceText: {
    fontSize: 20,
    fontFamily: "RubikBold",
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
  productNamesButton: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#C3E6CB",
    borderRadius: 20,
    padding: 14,
    width: "95%",
  },
  productNamesButtonList: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: "#C3E6CB",
    borderRadius: 20,
    padding: 14,
    width: "95%",
  },
  textButtonProductList: {
    fontSize: 15,
    fontFamily: "RubikMedium",
    color: "rgba(0,0,0,0.75)",
    textAlign: "center",
  },
  productListRecomended: {
    marginTop: -16,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 10,
    borderColor: "#C3E6CB",
    width: "100%",
  },
  textListRecomendedOpen: {
    fontSize: 16,
    fontFamily: "RubikMedium",
    color: "rgba(0,0,0,0.75)",
    textAlign: "left",
    borderBottomWidth: 3,
    borderBottomColor: "#C3E6CB",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
