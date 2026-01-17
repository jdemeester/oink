import { Ionicons } from '@expo/vector-icons';
import { Button, Surface } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../components/app-text';

const StyledIonicons = withUniwind(Ionicons);

type PokemonCard = {
  id: string;
  name: string;
  set: string;
  cardNumber: string;
  imageUrl: string;
  owned: number;
  value?: number;
};

type CardViewerProps = {
  cards: PokemonCard[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
};

export function CardViewer({ cards, initialIndex, visible, onClose }: CardViewerProps) {
  const { height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const translateY = useSharedValue(0);

  // Reset to initialIndex when viewer becomes visible
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  const currentCard = cards[currentIndex];

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -50 && currentIndex < cards.length - 1) {
        runOnJS(goToNext)();
      } else if (event.translationY > 50 && currentIndex > 0) {
        runOnJS(goToPrevious)();
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible || !currentCard) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/95">
        {/* Close Button - Top Right */}
        <View className="absolute top-12 right-5 z-10">
          <Button variant="ghost" size="sm" isIconOnly onPress={onClose}>
            <StyledIonicons name="close" size={24} className="text-white" />
          </Button>
        </View>

        {/* Card Display with Vertical Scroll */}
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-1 items-center justify-center px-5" style={animatedStyle}>
            <View className="w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden bg-white/5">
              <Image
                source={{ uri: currentCard.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>

            {/* Card Info */}
            <View className="mt-6 items-center">
              <AppText className="text-2xl font-bold text-white mb-1">
                {currentCard.name}
              </AppText>
              <AppText className="text-sm text-white/60 mb-2">
                {currentCard.set} • {currentCard.cardNumber}
              </AppText>
              {currentCard.owned > 1 && (
                <AppText className="text-sm text-white/80">
                  Owned: {currentCard.owned}
                </AppText>
              )}
              {currentCard.value && (
                <AppText className="text-lg font-semibold text-white mt-2">
                  ${currentCard.value}
                </AppText>
              )}
            </View>
          </Animated.View>
        </GestureDetector>

        {/* Step Counter - Bottom Right with Blur */}
        <View className="absolute bottom-8 right-5">
          <Surface variant="secondary" className="px-4 py-2 bg-white/10 backdrop-blur-xl">
            <AppText className="text-white text-sm font-semibold">
              {currentIndex + 1} / {cards.length}
            </AppText>
          </Surface>
        </View>
      </View>
    </Modal>
  );
}
