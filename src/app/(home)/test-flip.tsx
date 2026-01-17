import { View } from 'react-native';
import { FlipCard } from '../../components/showcases/flip-card';
import { Surface } from 'heroui-native';
import { AppText } from '../../components/app-text';

export default function TestFlip() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppText className="text-lg mb-4">Tap or swipe the card to flip</AppText>
      <View style={{ width: 200, height: 300 }}>
        <FlipCard
          width="100%"
          height="100%"
          frontContent={
            <Surface className="w-full h-full items-center justify-center rounded-3xl bg-blue-500">
              <AppText className="text-white text-2xl font-bold">FRONT</AppText>
            </Surface>
          }
          backContent={
            <Surface className="w-full h-full items-center justify-center rounded-3xl bg-red-500">
              <AppText className="text-white text-2xl font-bold">BACK</AppText>
            </Surface>
          }
        />
      </View>
    </View>
  );
}
