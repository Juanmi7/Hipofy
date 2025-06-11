import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleProp, TextStyle } from 'react-native';

export function IconH(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
    size?: number;
    styleIcon?: StyleProp<TextStyle>
  }) {
    return (
      <FontAwesome
        size={props.size || 26}
        style={props.styleIcon || {}}
        {...props}
      />
    );
  }