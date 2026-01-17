import { Ionicons } from '@expo/vector-icons';
import { Button, Chip, Surface, Tabs } from 'heroui-native';
import { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { useRouter, usePathname } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { AppText } from '../../components/app-text';
import { CardViewer } from '../../pokefolio-components/CardViewer';
import { mockPokemon } from '../../pokefolio-components/pokemon';

const StyledIonicons = withUniwind(Ionicons);

type PokemonCard = {
  id: string;
  name: string;
  set: string;
  rarity: string;
  cardNumber: string;
  type: string;
  imageUrl: string;
  owned: number;
  value?: number;
};

// Mock Pokemon card data
const mockCards: PokemonCard[] = [
  {
    id: '1',
    name: 'Charizard',
    set: 'Base Set',
    rarity: 'Holo Rare',
    cardNumber: '4/102',
    type: 'Fire',
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
    owned: 1,
    value: 450,
  },
  {
    id: '2',
    name: 'Pikachu',
    set: 'Base Set',
    rarity: 'Common',
    cardNumber: '58/102',
    type: 'Electric',
    imageUrl: 'https://images.pokemontcg.io/base1/58_hires.png',
    owned: 3,
    value: 15,
  },
  {
    id: '3',
    name: 'Blastoise',
    set: 'Base Set',
    rarity: 'Holo Rare',
    cardNumber: '2/102',
    type: 'Water',
    imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png',
    owned: 0,
    value: 380,
  },
];

export default function PokefolioScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'collection' | 'wishlist'>('collection');
  const [cards] = useState<PokemonCard[]>(mockCards);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const collectionCards = cards.filter((card) => card.owned > 0);
  const wishlistCards = cards.filter((card) => card.owned === 0);
  const displayCards = activeTab === 'collection' ? collectionCards : wishlistCards;

  const handleCardPress = (index: number) => {
    const card = displayCards[index];

    // Find matching Pokemon from mockPokemon or create a mock one
    const pokemonCard = mockPokemon.find(p => p.name === card.name) || mockPokemon[0];

    // Navigate to card detail page
    router.push(`/card/${pokemonCard.id}`);
  };

  const totalValue = collectionCards.reduce(
    (sum, card) => sum + (card.value || 0) * card.owned,
    0
  );

  const getRarityColor = (rarity: string) => {
    if (rarity.includes('Holo')) return 'accent';
    if (rarity === 'Rare') return 'warning';
    return 'default';
  };

  return (
    <View className="flex-1 bg-background">
      {/* Fixed Header */}
      <View
        className="bg-background border-b border-border pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="px-5 flex-row items-center justify-between">
          <View className="flex-1">
            <AppText className="text-2xl font-bold text-foreground">Pokefolio</AppText>
            <AppText className="text-sm text-muted mt-1">
              Your Pokemon card collection
            </AppText>
          </View>
          <View className="flex-row gap-2">
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push('/collection')}
            >
              <StyledIonicons name="grid-outline" size={18} className="text-foreground" />
              <Button.Label>Sets</Button.Label>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push('/showcase')}
            >
              <StyledIonicons name="eye-outline" size={18} className="text-foreground" />
              <Button.Label>Showcase</Button.Label>
            </Button>
          </View>
        </View>

        {/* Stats */}
        <View className="px-5 mt-4 flex-row gap-3">
          <Surface variant="secondary" className="flex-1 p-3">
            <AppText className="text-xs text-muted mb-1">Total Cards</AppText>
            <AppText className="text-2xl font-bold text-foreground">
              {collectionCards.reduce((sum, card) => sum + card.owned, 0)}
            </AppText>
          </Surface>
          <Surface variant="secondary" className="flex-1 p-3">
            <AppText className="text-xs text-muted mb-1">Total Value</AppText>
            <AppText className="text-2xl font-bold text-foreground">
              ${totalValue}
            </AppText>
          </Surface>
        </View>

        {/* Tabs */}
        <View className="px-5 mt-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'collection' | 'wishlist')}
            variant="pill"
          >
            <Tabs.List>
              <Tabs.Trigger value="collection">
                <Tabs.Label>Collection</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="wishlist">
                <Tabs.Label>Wishlist</Tabs.Label>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </View>
      </View>

      {/* Cards Grid */}
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-4">
        {displayCards.length > 0 ? (
          <View className="flex-row flex-wrap gap-3">
            {displayCards.map((card, index) => (
              <Pressable
                key={card.id}
                onPress={() => handleCardPress(index)}
                style={{ width: '48%' }}
              >
                <Surface variant="secondary" className="p-3">
                <View className="gap-2">
                  {/* Card Image */}
                  <View className="bg-background rounded-lg overflow-hidden aspect-[2/3]">
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Card Info */}
                  <View>
                    <AppText className="text-sm font-semibold text-foreground" numberOfLines={1}>
                      {card.name}
                    </AppText>
                    <AppText className="text-xs text-muted" numberOfLines={1}>
                      {card.set} • {card.cardNumber}
                    </AppText>
                  </View>

                  {/* Rarity & Owned */}
                  <View className="flex-row items-center justify-between">
                    <Chip size="sm" variant="soft" color={getRarityColor(card.rarity)}>
                      <Chip.Label className="text-xs">{card.rarity}</Chip.Label>
                    </Chip>
                    {card.owned > 0 && (
                      <AppText className="text-xs text-muted">x{card.owned}</AppText>
                    )}
                  </View>

                  {/* Value */}
                  {card.value && (
                    <AppText className="text-sm font-bold text-foreground">
                      ${card.value}
                    </AppText>
                  )}
                </View>
              </Surface>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Surface variant="secondary" className="p-8 items-center">
              <StyledIonicons
                name="albums-outline"
                size={48}
                className="text-muted mb-4"
              />
              <AppText className="text-lg font-semibold text-foreground mb-2">
                {activeTab === 'collection' ? 'No cards yet' : 'Wishlist is empty'}
              </AppText>
              <AppText className="text-sm text-muted mb-6 text-center">
                {activeTab === 'collection'
                  ? 'Start building your collection'
                  : 'Add cards you want to collect'}
              </AppText>
              <Button variant="primary">
                <StyledIonicons name="add-outline" size={18} className="text-white" />
                <Button.Label>Add Card</Button.Label>
              </Button>
            </Surface>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <Button variant="primary" size="lg" isIconOnly>
          <StyledIonicons name="add-outline" size={24} className="text-white" />
        </Button>
      </View>

      {/* Card Viewer Modal */}
      <CardViewer
        cards={displayCards}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}
