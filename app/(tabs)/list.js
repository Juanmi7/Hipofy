import { StyleSheet, View } from 'react-native';
import Lists from '../../components/Lists/Lists';

export default function ListScreen() {
  
  return (
    <View style={styles.container}>
      <Lists/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
