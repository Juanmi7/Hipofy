import React, { useState, useEffect } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function QuantityProductModal(props: any) {

  const [productInCart, setProductInCart] = useState(undefined)

  const getQuantityFromAProductInCartLis = () => {
    console.log('props.selectedProducts')
    console.log(props.selectedProducts)
    console.log(props.productSelectedTMP);
    
    const productAdded = props.selectedProducts.find(
      (selectedProduct) => selectedProduct._id === props.productSelectedTMP._id
    );
    // const productInCartAux = props.selectedProducts.find((p: any) => p._id === props.productSelectedTMP._id)
    setProductInCart(productAdded)
    console.log(productAdded);
  }

  useEffect(() => {
    getQuantityFromAProductInCartLis()
  },[])

  return (
    <View>
      <Modal
        key={props.index}
        animationType="slide"
        transparent={true}
        visible={props.showQuantityModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>

            {productInCart ?
            <Text style={styles.cardTitle}>Añadir más cantidad</Text>
            :
            <Text style={styles.cardTitle}>Elije la cantidad</Text>
            }
              <View style={styles.separator} />
            </View>
            
            <View style={styles.lineBlack} />

            <View style={styles.cardContent}>
              <View style={{alignSelf: 'center'}}>
                <Image source={{ uri: props.productSelectedTMP.imagenUrl }} style={styles.tinyLogo} />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 18, textAlign:'center'}}>{props.productSelectedTMP.name_product}</Text>
              </View>
              {productInCart && 
                <View style={{flexDirection:'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 16, textAlign:'center'}}>Tienes en el carrito {productInCart.quantity} unidade(s) de este producto</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent:'center'}}>
                    <Text style={{fontSize: 16, textAlign:'center'}}>Vas a cambiar la cantidad actual por:</Text>
                  </View>
                </View>
              }
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TextInput keyboardType="numeric"
                  value={String(props.productQuantityTMP)}
                  onChangeText={(text) => {
                    if(!Number.isNaN(text) && Number(text) > 0){
                      props.setProductQuantityTMP(text)
                    }else{
                      props.setProductQuantityTMP('')
                    }
                  }}
                  style={styles.inputQuantity} />
              </View>
              <View>
                <Pressable
                  style={styles.buttonCreate}
                  onPress={() => props.addProductToList(props.productSelectedTMP)}
                >
                  <Text style={styles.textCreate}>
                    Aceptar
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.buttonCancel}
                  onPress={() => {
                    props.setShowQuantityModal(false)
                    props.setProductSelectedTMP(null)
                  }}
                >
                  <Text style={styles.textCreate}>
                    No quiero ese producto
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
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
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderRadius: 5,
    backgroundColor: "#22c990",
    marginLeft: 12,
    marginRight: 12,
    marginTop: 20,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderRadius: 5,
    backgroundColor: "#e57373",
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
  separator: {
    height: 2,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});
