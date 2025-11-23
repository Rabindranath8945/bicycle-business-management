import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function NewPurchase() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>New Purchase Page</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
