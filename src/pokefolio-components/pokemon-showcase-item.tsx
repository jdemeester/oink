import { Image as ExpoImage } from 'expo-image';
import { Chip, Surface, cn } from 'heroui-native';
import { useMemo, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../contexts/app-theme-context';
import { AppText } from '../components/app-text';
import { type Pokemon, pokemonTypeGradients } from './pokemon';
import { FlipCard } from '../components/showcases/flip-card';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type PokemonShowcaseItemProps = {
  index: number;
  scrollY: SharedValue<number>;
  item: Pokemon;
  itemSize: number;
};

export function PokemonShowcaseItem({
  item,
  index,
  scrollY,
  itemSize,
}: PokemonShowcaseItemProps) {
  const { isDark } = useAppTheme();

  // // Floating animation value
  // const floatValue = useSharedValue(0);

  // useEffect(() => {
  //   // Start floating animation - subtle humming motion
  //   floatValue.value = withRepeat(
  //     withTiming(1, {
  //       duration: 1800, // Faster - like a gentle hum
  //       easing: Easing.inOut(Easing.sine),
  //     }),
  //     -1, // Infinite repeat
  //     true // Reverse on each repeat
  //   );
  // }, []);

  // Memoize input ranges
  const inputRange = useMemo(
    () => [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize],
    [index, itemSize]
  );

  const animatedIndex = useDerivedValue(() => {
    'worklet';
    return scrollY.value / itemSize;
  }, [itemSize]);

  // Use gradient colors from the Pokemon data (extracted from image)
  const gradientColors = useMemo(() => [...item.gradientColors, 'transparent'], [item.gradientColors]);

  const rContainerStyle = useAnimatedStyle(() => {
    'worklet';
    const scrollValue = scrollY.value;
    const animIndex = animatedIndex.value;

    const translateY =
      Platform.OS === 'ios'
        ? interpolate(
            scrollValue,
            [inputRange[0], inputRange[1], inputRange[1] + 1],
            [0, 0, 1]
          )
        : 0;

    return {
      opacity: interpolate(
        animIndex,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
      transform: [
        { translateY },
        {
          scale: interpolate(
            scrollValue,
            inputRange,
            [1.2, 1, 0.5],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }, [inputRange, index]);

  const rGradientStyle = useAnimatedStyle(() => {
    'worklet';
    const scrollValue = scrollY.value;
    const animIndex = animatedIndex.value;

    return {
      opacity: interpolate(
        animIndex,
        [index - 1, index, index + 1],
        [0, isDark ? 0.5 : 0.7, 0]
      ),
      transform: [
        {
          scale: interpolate(
            scrollValue,
            inputRange,
            [1.8, 1, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }, [inputRange, index, isDark]);

  const rImageStyle = useAnimatedStyle(() => {
    'worklet';
    const scrollValue = scrollY.value;
    const animIndex = animatedIndex.value;

    // // Subtle humming motion - 6px up and down
    // const floatY = interpolate(floatValue.value, [0, 1], [0, -6]);

    return {
      opacity: interpolate(
        animIndex,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
      transform: [
        // {
        //   translateY: floatY,
        // },
        {
          scale: interpolate(
            scrollValue,
            inputRange,
            [1.5, 1, 0.8],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }, [inputRange, index]);

  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <AnimatedLinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, rGradientStyle]}
        pointerEvents="none"
      />

      <AnimatedView
        className="flex-1 items-center justify-center px-6"
        style={[rContainerStyle]}
      >
        {/* Pokemon Card */}
        <AnimatedView style={[rImageStyle, { width: 280, aspectRatio: 2 / 3 }]} className="items-center">
          <FlipCard
            width="100%"
            height="100%"
            frontContent={
              <View style={StyleSheet.absoluteFill}>
                <Surface
                  className={cn(
                    'w-full h-full items-center justify-center rounded-2xl p-0 border border-neutral-200 shadow-2xl shadow-black/20',
                    isDark && 'shadow-black/40 border-neutral-800'
                  )}
                >
                  <ExpoImage
                    source={{ uri: item.imageUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    priority="high"
                  />
                </Surface>
              </View>
            }
            backContent={
              <View style={StyleSheet.absoluteFill}>
                <Surface
                  className={cn(
                    'w-full h-full items-center justify-center rounded-2xl p-0 border border-neutral-200 shadow-2xl shadow-black/20',
                    isDark && 'shadow-black/40 border-neutral-800'
                  )}
                >
                  <ExpoImage
                    source={{ uri: item.backImageUrl || item.imageUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    priority="high"
                  />
                </Surface>
              </View>
            }
          />
        </AnimatedView>

        {/* Card Info Below */}
        <View className="pt-6 gap-4 w-full items-center">
          {/* Pokemon Name */}
          <AppText className="text-3xl text-foreground font-bold text-center">
            {item.name}
          </AppText>

          {/* Types as Chips */}
          <View className="flex-row flex-wrap justify-center gap-2">
            {item.types.map((type, typeIndex) => (
              <Chip
                key={typeIndex}
                variant="soft"
                size="md"
                color="accent"
              >
                {type}
              </Chip>
            ))}
          </View>

          {/* Stats */}
          <View className="flex-row justify-center gap-6 pt-1">
            <View className="items-center">
              <AppText className="text-xs text-muted uppercase font-semibold mb-1">
                HP
              </AppText>
              <AppText className="text-lg text-foreground font-bold">
                {item.stats.hp}
              </AppText>
            </View>
            <View className="items-center">
              <AppText className="text-xs text-muted uppercase font-semibold mb-1">
                ATK
              </AppText>
              <AppText className="text-lg text-foreground font-bold">
                {item.stats.attack}
              </AppText>
            </View>
            <View className="items-center">
              <AppText className="text-xs text-muted uppercase font-semibold mb-1">
                DEF
              </AppText>
              <AppText className="text-lg text-foreground font-bold">
                {item.stats.defense}
              </AppText>
            </View>
            <View className="items-center">
              <AppText className="text-xs text-muted uppercase font-semibold mb-1">
                SPD
              </AppText>
              <AppText className="text-lg text-foreground font-bold">
                {item.stats.speed}
              </AppText>
            </View>
          </View>
        </View>
      </AnimatedView>
    </View>
  );
}
