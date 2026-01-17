import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { PokemonCarousel } from '../../pokefolio-components/pokemon-carousel';
import { mockPokemon } from '../../pokefolio-components/pokemon';
import { mockPokemonSet } from '../../pokefolio-components/pokemon-set';

const StyledIonicons = withUniwind(Ionicons);

export default function PokemonShowcase() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ initialIndex?: string; fromSet?: string }>();

  // Use set cards if coming from collection, otherwise use mock Pokemon
  const cards = params.fromSet === 'true' ? mockPokemonSet.cards : mockPokemon;
  const initialIndex = params.initialIndex ? parseInt(params.initialIndex, 10) : 0;

  return (
    <View className="flex-1 bg-background">
      {isLiquidGlassAvailable() ? (
        <Pressable
          className="absolute right-4 rounded-full z-50"
          style={{
            top: insets.top + 12,
          }}
          onPress={router.back}
        >
          <GlassView style={styles.glassView} isInteractive>
            <StyledIonicons name="close" size={24} className="text-muted" />
          </GlassView>
        </Pressable>
      ) : (
        <Pressable
          onPress={router.back}
          className="absolute right-3 p-2.5 rounded-full bg-foreground/10 z-50"
          style={{
            top: insets.top + 12,
          }}
          hitSlop={12}
        >
          <StyledIonicons name="close" size={20} className="text-muted" />
        </Pressable>
      )}
      <PokemonCarousel data={cards} initialIndex={initialIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  glassView: {
    borderRadius: 99,
    padding: 8,
  },
});
