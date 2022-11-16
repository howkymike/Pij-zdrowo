import {
    Button,
    View,
} from "react-native";



export default function Home({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                title="Go to Profile"
                onPress={() => navigation.navigate('UserProfile')}
            />
        </View>
    );
}