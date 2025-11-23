import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function NewProduct() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>New Product Page</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
