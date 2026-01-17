import { useCallback, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useScrollOffset,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  PokemonShowcaseItem,
} from './pokemon-showcase-item';
import { PokemonPaginationIndicator } from './pokemon-pagination-indicator';
import { type Pokemon } from './pokemon';

export type PokemonCarouselProps = {
  data: Pokemon[];
  initialIndex?: number;
};

export function PokemonCarousel({ data, initialIndex = 0 }: PokemonCarouselProps) {
  const { width, height } = useWindowDimensions();

  const animatedRef = useAnimatedRef<Animated.FlatList>();
  const scrollY = useScrollOffset(animatedRef);

  // const triggerHaptic = useCallback(() => {
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // }, []);

  // // Trigger haptic when crossing page boundaries
  // useAnimatedReaction(
  //   () => {
  //     return Math.round(scrollY.value / height);
  //   },
  //   (currentIndex, previousIndex) => {
  //     if (currentIndex !== previousIndex && previousIndex !== null && currentIndex >= 0 && currentIndex < data.length) {
  //       runOnJS(triggerHaptic)();
  //     }
  //   },
  //   [height, data.length]
  // );

  const getItemLayout = useCallback(
    (_: Pokemon[] | null | undefined, index: number) => ({
      length: height,
      offset: height * index,
      index,
    }),
    [height]
  );

  const keyExtractor = useCallback((item: Pokemon) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Pokemon; index: number }) => (
      <View style={{ width, height }}>
        <PokemonShowcaseItem
          item={item}
          index={index}
          scrollY={scrollY}
          itemSize={height}
        />
      </View>
    ),
    [width, height, scrollY]
  );

  return (
    <>
      <Animated.FlatList
        ref={animatedRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        snapToInterval={height}
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        initialScrollIndex={initialIndex}
      />

      <View
        className="absolute top-1/2 right-3 gap-1.5 z-50"
        pointerEvents="none"
      >
        {data.map((_, index) => (
          <PokemonPaginationIndicator
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
