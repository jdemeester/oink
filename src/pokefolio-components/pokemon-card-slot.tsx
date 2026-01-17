import { Image as ExpoImage } from 'expo-image';
import { Surface, cn } from 'heroui-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../components/app-text';
import { useAppTheme } from '../contexts/app-theme-context';
import { type PokemonSetCard } from './pokemon-set';

export type PokemonCardSlotProps = {
  card: PokemonSetCard;
  onPress?: () => void;
};

export function PokemonCardSlot({ card, onPress }: PokemonCardSlotProps) {
  const { isDark } = useAppTheme();

  if (!card.isCollected) {
    // Empty slot - card not collected
    return (
      <Pressable onPress={onPress}>
        <Surface
          className={cn(
            'items-center justify-center rounded-lg aspect-[2/3] border-2 border-dashed',
            isDark ? 'bg-neutral-900/30 border-neutral-700' : 'bg-neutral-100/50 border-neutral-300'
          )}
        >
          <AppText
            className={cn(
              'text-2xl font-bold',
              isDark ? 'text-neutral-700' : 'text-neutral-400'
            )}
          >
            {card.number}
          </AppText>
        </Surface>
      </Pressable>
    );
  }

  // Collected card - show image
  return (
    <Pressable onPress={onPress}>
      <Surface
        className={cn(
          'items-center justify-center rounded-lg aspect-[2/3] overflow-hidden border',
          isDark ? 'border-neutral-700' : 'border-neutral-300'
        )}
      >
        <ExpoImage
          source={{ uri: card.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </Surface>
    </Pressable>
  );
}
