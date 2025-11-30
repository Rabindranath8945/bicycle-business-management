import { useLocalSearchParams } from "expo-router/build";
import { View, Text } from "react-native";

export default function SaleDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Sale Details Page</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
