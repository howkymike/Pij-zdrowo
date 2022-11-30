import {
  Button,
  View,
} from "react-native";

export default function UserProfile({ navigation }) {
  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
            title="Go to Home"
            onPress={() => navigation.navigate('Home')}
        />
      </View>
  );
}

