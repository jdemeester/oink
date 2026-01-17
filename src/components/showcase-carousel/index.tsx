import { useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useScrollOffset,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ShowcaseItem,
  type ShowcaseItemData,
} from '../showcases/showcase-item';
import { PaginationIndicator } from './pagination-indicator';

export type Props = {
  data: ShowcaseItemData[];
};

export function Carousel({ data }: Props) {
  const { width, height } = useWindowDimensions();

  const animatedRef = useAnimatedRef<Animated.FlatList>();
  const scrollY = useScrollOffset(animatedRef);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Trigger haptic when crossing page boundaries
  useAnimatedReaction(
    () => {
      return Math.round(scrollY.value / height);
    },
    (currentIndex, previousIndex) => {
      if (currentIndex !== previousIndex && previousIndex !== null && currentIndex >= 0 && currentIndex < data.length) {
        runOnJS(triggerHaptic)();
      }
    },
    [height, data.length]
  );

  return (
    <>
      <Animated.FlatList
        ref={animatedRef}
        data={data}
        keyExtractor={(_, index) => String(index)}
        snapToInterval={height}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View style={{ width, height }}>
            <ShowcaseItem
              item={item}
              index={index}
              scrollY={scrollY}
              itemSize={height}
            />
          </View>
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />

      <View
        className="absolute top-1/2 right-3 gap-1.5 z-50"
        pointerEvents="none"
      >
        {data.map((_, index) => (
          <PaginationIndicator
            key={index}
            index={index}
            scrollY={scrollY}
            itemSize={height}
          />
        ))}
      </View>
    </>
  );
}
