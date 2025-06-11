import { useState } from "react";
import Config from "../../../constants/Config";
import { Button, Text } from "react-native";

const DeleteButton = (props) => {
  const [deleteLists, setDeleteLists] = useState(false);


  //Const declarations
  const data_id = props.data._id;

  //Delete functions
  const deleteList = async (data_id) => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      const response = await fetch(`${Config.baseURL}/list/${data_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });
      if (response.ok) {
        await response.json();
        setDeleteLists(deleteLists);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteList = () => {
    //Borrar la lista de la base de datos
    deleteList(data_id);
  };

  return (
    <View>
      <Text>DeleteButton</Text>
      <Button onPress={handleDeleteList}>
        <Text>Borrar lista</Text>
      </Button>
    </View>
  );
};

export default DeleteButton;
