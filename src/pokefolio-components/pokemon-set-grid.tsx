import { ScrollView, View } from 'react-native';
import { PokemonCardSlot } from './pokemon-card-slot';
import { type PokemonSet } from './pokemon-set';

export type PokemonSetGridProps = {
  set: PokemonSet;
  onCardPress?: (cardIndex: number) => void;
};

export function PokemonSetGrid({ set, onCardPress }: PokemonSetGridProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row flex-wrap gap-3">
        {set.cards.map((card, index) => {
          return (
            <View key={card.id} className="w-[23%]">
              <PokemonCardSlot
                card={card}
                onPress={() => onCardPress?.(index)}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
