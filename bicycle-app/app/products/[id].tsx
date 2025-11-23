import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Product Details Page</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
