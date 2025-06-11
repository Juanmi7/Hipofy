
import { StyleSheet, View } from 'react-native';
import NewList from '../../components/NewList/NewList';
import { Stack } from 'expo-router';

export default function CreateListScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Lista", headerStyle: {backgroundColor: '#22C990'}}}  />
      <NewList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
