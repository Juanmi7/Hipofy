import { useState, useEffect } from "react";
import { View } from "react-native";
import SingleList from "./SingleList/SingleList"

const Lists = () => {
  //UseStates
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <View>
      <View>
        <SingleList/>
      </View>
    </View>
  );
};

export default Lists;
