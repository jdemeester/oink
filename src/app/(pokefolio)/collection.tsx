import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { PokemonSetHeader } from '../../pokefolio-components/pokemon-set-header';
import { PokemonSetGrid } from '../../pokefolio-components/pokemon-set-grid';
import { mockPokemonSet } from '../../pokefolio-components/pokemon-set';

const StyledIonicons = withUniwind(Ionicons);

export default function PokemonCollection() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCardPress = (cardIndex: number) => {
    router.push({
      pathname: '/showcase',
      params: {
        initialIndex: cardIndex.toString(),
        fromSet: 'true',
      },
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <PokemonSetHeader set={mockPokemonSet} />

      {/* Close button */}
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

      {/* Card grid */}
      <PokemonSetGrid set={mockPokemonSet} onCardPress={handleCardPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  glassView: {
    borderRadius: 99,
    padding: 8,
  },
});
