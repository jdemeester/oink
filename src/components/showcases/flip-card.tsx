import { type ViewStyle, type DimensionValue } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type FlipCardProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  style?: ViewStyle;
};

export function FlipCard({
  width,
  height,
  frontContent,
  backContent,
  style,
}: FlipCardProps) {
  const rotateY = useSharedValue(0);
  const isFlipped = useSharedValue(false);
  const startRotation = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .enableTrackpadTwoFingerGesture(false)
    .onBegin(() => {
      'worklet';
      startRotation.value = rotateY.value;
    })
    .onUpdate((event) => {
      'worklet';
      // Map horizontal translation to rotation
      const rotation = event.translationX * 0.3;
      rotateY.value = startRotation.value + rotation;
    })
    .onEnd((event) => {
      'worklet';
      // Determine if we should flip based on translation and velocity
      const shouldFlip =
        Math.abs(event.translationX) > 60 || Math.abs(event.velocityX) > 400;

      if (shouldFlip) {
        // Determine direction
        const swipeDirection = event.translationX > 0 ? 1 : -1;
        const currentSide = isFlipped.value ? 180 : 0;

        // If already on a side and swiping in the flip direction
        if (
          (!isFlipped.value && swipeDirection > 0) ||
          (isFlipped.value && swipeDirection < 0)
        ) {
          isFlipped.value = !isFlipped.value;
          runOnJS(triggerHaptic)();
          rotateY.value = withSpring(isFlipped.value ? 180 : 0, {
            damping: 20,
            stiffness: 90,
          });
        } else {
          // Snap back
          rotateY.value = withSpring(currentSide, {
            damping: 20,
            stiffness: 90,
          });
        }
      } else {
        // Snap back to current side
        const targetRotation = isFlipped.value ? 180 : 0;
        rotateY.value = withSpring(targetRotation, {
          damping: 20,
          stiffness: 90,
        });
      }
    });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const rotateYDeg = `${rotateY.value}deg`;
    const opacity = interpolate(rotateY.value, [0, 90, 180], [1, 0, 0]);

    return {
      transform: [{ perspective: 1000 }, { rotateY: rotateYDeg }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const rotateYDeg = `${rotateY.value - 180}deg`;
    const opacity = interpolate(rotateY.value, [0, 90, 180], [0, 0, 1]);

    return {
      transform: [{ perspective: 1000 }, { rotateY: rotateYDeg }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  // Single tap to flip
  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      'worklet';
      isFlipped.value = !isFlipped.value;
      runOnJS(triggerHaptic)();
      rotateY.value = withSpring(isFlipped.value ? 180 : 0, {
        damping: 20,
        stiffness: 90,
      });
    });

  const composed = Gesture.Exclusive(tap, pan);

  const containerStyle = [
    {
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    width !== undefined && { width },
    height !== undefined && { height },
    style,
  ].filter(Boolean);

  // Use inset: 0 style for faces - participates in layout better than absoluteFill
  const faceStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  return (
    <Animated.View style={containerStyle} collapsable={false}>
      {/* Front of card */}
      <Animated.View style={[faceStyle, frontAnimatedStyle]}>
        {frontContent}
      </Animated.View>

      {/* Back of card */}
      <Animated.View style={[faceStyle, backAnimatedStyle]}>
        {backContent}
      </Animated.View>

      {/* Gesture capture overlay */}
      <GestureDetector gesture={composed}>
        <Animated.View
          style={faceStyle}
          pointerEvents="box-only"
        />
      </GestureDetector>
    </Animated.View>
  );
}
