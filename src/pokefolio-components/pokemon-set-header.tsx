import { Image as ExpoImage } from 'expo-image';
import { Chip, Surface, cn } from 'heroui-native';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../components/app-text';
import { useAppTheme } from '../contexts/app-theme-context';
import { type PokemonSet } from './pokemon-set';

export type PokemonSetHeaderProps = {
  set: PokemonSet;
};

export function PokemonSetHeader({ set }: PokemonSetHeaderProps) {
  const { isDark } = useAppTheme();
  const collectionPercentage = Math.round((set.collectedCards / set.totalCards) * 100);

  return (
    <View className="relative">
      {/* Background gradient */}
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#0a0a0a'] : ['#fef3c7', '#fed7aa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <View className="p-6 items-center gap-4">
        {/* Set icon */}
        <Surface
          className={cn(
            'w-20 h-20 rounded-2xl items-center justify-center',
            isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
          )}
        >
          <AppText className="text-4xl">🎴</AppText>
        </Surface>

        {/* Set name */}
        <AppText className="text-2xl font-bold text-foreground text-center">
          {set.name}
        </AppText>

        {/* Stats */}
        <View className="flex-row items-center gap-4">
          {/* Collection progress */}
          <View className="flex-row items-center gap-2">
            <View
              className={cn(
                'w-8 h-8 rounded-full items-center justify-center',
                isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
              )}
            >
              <AppText className="text-xs font-bold text-blue-500">
                {collectionPercentage}%
              </AppText>
            </View>
            <AppText className="text-sm text-muted">
              {set.collectedCards}/{set.totalCards}
            </AppText>
          </View>

          {/* Collected badge */}
          <Chip variant="soft" size="sm" color="accent">
            {set.collectedCards} Collected
          </Chip>
        </View>
      </View>
    </View>
  );
}
