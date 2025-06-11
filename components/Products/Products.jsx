import { useState, useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CardProduct from "./CardProduct/CardProduct";
import Config from "../../constants/Config";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height
const Products = () => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [productsByMarket, setProductsByMarket] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const tokenAux = await AsyncStorage.getItem("Token");
        const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
        const response = await fetch(
          `${Config.baseURL}/product/${selectedMarket}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": tokenAux,
              "auth-token-refresh": refreshTokenAux,
            },
          }
        );
        if (response.status !== 200) {
          console.log("Error getting all products");
          console.log(response);
        } else {
          const data = await response.json();
          console.log("All products ok");
          setAllProducts(data.data);
          setMatchingProducts([...data.data]);
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting all products");
      }
    };

    getAllProducts();
  }, [selectedMarket]);

  useEffect(() => {
    const getSupermarkets = async () => {
      try {
        const tokenAux = await AsyncStorage.getItem("Token");
        const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
        const response = await fetch(`${Config.baseURL}/supermarkets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": tokenAux,
            "auth-token-refresh": refreshTokenAux,
          },
        });
        if (response.status !== 200) {
          console.log("Error getting all markets");
        } else {
          const data = await response.json();
          console.log("All markets ok");
          setProductsByMarket(data.data.map((supermarket) => supermarket._id));
          setLoading(true);
        }
      } catch (error) {
        console.log("Error getting all markets");
      }
    };

    getSupermarkets();
  }, []);

  useEffect(() => {
    const searchMatchingProducts = async () => {
      try {
        const tokenAux = await AsyncStorage.getItem("Token");
        const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
        const searchTermPlusQuery =
          selectedMarket && selectedMarket !== "ALL" && selectedMarket !== ""
            ? searchTerm + "?supermarket=" + selectedMarket
            : searchTerm;
        const response = await fetch(
          `${Config.baseURL}/products/${searchTermPlusQuery}`,
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

    if (searchTerm !== "" && searchTerm.length >= 3) {
      searchMatchingProducts();
    } else {
      const listAux = [...allProducts];
      setMatchingProducts(listAux); // Limpiar la lista de productos coincidentes si el campo de búsqueda está vacío
    }
  }, [searchTerm]);

  const sortByPriceFunction = () => {
    setSortBy("price");
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
    sortByFunction();
  };

  const sortByFunction = () => {
    console.log("allproduct: ", allProducts);
    const filteredProducts = allProducts
      .filter(
        (product) =>
          product.name_product
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (selectedMarket === "" ||
            selectedMarket === "ALL" ||
            product.market.some((item) => item.name_market === selectedMarket))
      )
      .sort((a, b) => {
        if (sortBy === "price") {
          const aPrice = Math.max(
            ...a.market.filter((item) => item.price).map((item) => item.price)
          );
          const bPrice = Math.max(
            ...b.market.filter((item) => item.price).map((item) => item.price)
          );
          return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
        } else if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name_product.localeCompare(b.name_product)
            : b.name_product.localeCompare(a.name_product);
        } else {
          return 0;
        }
      });

    console.log("filteredProducts: ", filteredProducts);
    const listAux = [...filteredProducts];
    console.log("listAux: ", listAux);
    setMatchingProducts(listAux);
  };

  const markets = [
    ...new Set(
      allProducts.flatMap((product) =>
        product.market.map((item) => item.name_market)
      )
    ),
    `Filtrar por supermercado`,
  ];

  return (
    <ScrollView style={{ width: width }}>
      <View>
        <TextInput
          placeholder="Escribe producto que deseas buscar..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={styles.input}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: width,
          }}
        >
          <Pressable>
            <View>
              <SelectDropdown
                defaultButtonText="Filtrar por supermercado"
                data={["Todos los supermercados", ...productsByMarket]}
                buttonStyle={{
                  marginHorizontal: 0,
                  backgroundColor: "transparent",
                  width: width * 0.56,
                }}
                buttonTextStyle={{
                  fontSize: 15,
                  textAlign: "left",
                  fontFamily: "RubikBold",
                }}
                onSelect={(selectedItem, index) => {
                  if (selectedItem === "Todos los supermercados") {
                    setSelectedMarket("ALL");
                  } else {
                    setSelectedMarket(selectedItem);
                  }
                  console.log(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />
            </View>
          </Pressable>
          <Pressable onPress={() => sortByPriceFunction()} style={{}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "RubikBold",
                textAlign: "left",
              }}
            >
              Ordenar por precio
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View>
        {loading ? (
          <View>
            <View>
              {matchingProducts.map((product, index) => (
                <View key={index}>
                  <CardProduct
                    nombre={product.name_product}
                    supermercado={product.market[0].name_market}
                    precio={product.market[0].price}
                    imagenUrl={product.img}
                  />
                  <View
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: "rgba(0,0,0,0.75)",
                      marginBottom: 10,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  ></View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Spinner />
        )}
      </View>
    </ScrollView>
  );
};

export default Products;

const styles = StyleSheet.create({
  input: {
    borderRadius: 6,
    backgroundColor: "#A4FFF7",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    padding: 15,
    width: width - 10,
    marginTop: 15,
    color: "#000",
    fontSize: 15,
    alignSelf: "center",
    fontFamily: "RubikRegular",
  },
});
