import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import { BottomSheet, Chip, Surface, Card, cn, useAccordionItem } from 'heroui-native';
import { BottomSheetScrollView, useBottomSheet } from '@gorhom/bottom-sheet';
import { Linking, Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { AppText } from '../components/app-text';
import { useAppTheme } from '../contexts/app-theme-context';
import { FlipCard } from '../components/showcases/flip-card';
import { type Pokemon } from './pokemon';
import { PriceChart, type PriceDataPoint } from './price-chart';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const StyledFeather = withUniwind(Feather);
const AnimatedView = Animated.createAnimatedComponent(View);

const LAYOUT_TRANSITION = LinearTransition.springify()
  .damping(70)
  .stiffness(1000)
  .mass(2);

// Animated card component that scales based on bottom sheet position
function AnimatedCardContent({ card }: { card: Pokemon }) {
  const { isDark } = useAppTheme();
  const { animatedPosition } = useBottomSheet();

  const cardAnimatedStyle = useAnimatedStyle(() => {
    // When closed (position = 0), card is large and centered
    // When open (position = SCREEN_HEIGHT * 0.9), card is smaller and at top
    const scale = interpolate(
      animatedPosition.value,
      [0, SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.9],
      [1.2, 0.85, 0.7],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      animatedPosition.value,
      [0, SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.9],
      [SCREEN_HEIGHT * 0.15, -50, -120],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <AnimatedView
      style={[styles.animatedCard, cardAnimatedStyle]}
      pointerEvents="box-none"
    >
      <View style={{ width: 320, aspectRatio: 2 / 3 }}>
        <FlipCard
          width="100%"
          height="100%"
          frontContent={
            <View style={StyleSheet.absoluteFill}>
              <Card
                className={cn(
                  'w-full h-full items-center justify-center rounded-2xl p-0 border shadow-lg',
                  isDark ? 'border-neutral-800 shadow-black/40' : 'border-neutral-200 shadow-black/20'
                )}
              >
                <ExpoImage
                  source={{ uri: card.imageUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  priority="high"
                />
              </Card>
            </View>
          }
          backContent={
            <View style={StyleSheet.absoluteFill}>
              <Card
                className={cn(
                  'w-full h-full items-center justify-center rounded-2xl p-0 border shadow-lg',
                  isDark ? 'border-neutral-800 shadow-black/40' : 'border-neutral-200 shadow-black/20'
                )}
              >
                <ExpoImage
                  source={{ uri: card.backImageUrl || card.imageUrl }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  priority="high"
                />
              </Card>
            </View>
          }
        />
      </View>
    </AnimatedView>
  );
}

export type PokemonCardDetailProps = {
  card: Pokemon | null;
  visible: boolean;
  onClose: () => void;
};

// Mock card metadata (this would come from an API)
const getCardMetadata = (card: Pokemon) => ({
  setName: 'Crimson Blaze',
  cardNumber: '001/165',
  rarity: 'Holo Rare',
  artist: 'Mitsuhiro Arita',
  releaseDate: 'March 2025',
  attacks: [
    {
      name: 'Fire Spin',
      damage: '100',
      cost: ['Fire', 'Fire', 'Colorless'],
      description: 'Discard 2 Energy from this Pokémon.',
    },
    {
      name: 'Inferno Wings',
      damage: '200',
      cost: ['Fire', 'Fire', 'Fire', 'Colorless'],
      description: 'This Pokémon does 50 damage to itself.',
    },
  ],
  ability: {
    name: 'Blazing Flight',
    description: 'Once during your turn, you may attach a Fire Energy card from your discard pile to this Pokémon.',
  },
  weakness: 'Water',
  resistance: 'Fighting',
  retreatCost: 2,
});

// Mock price history (this would come from an API)
const getMockPriceHistory = (): PriceDataPoint[] => [
  { date: 'Jan 1', price: 15 },
  { date: 'Jan 8', price: 22 },
  { date: 'Jan 15', price: 45 },
  { date: 'Jan 22', price: 38 },
  { date: 'Jan 29', price: 52 },
  { date: 'Feb 5', price: 48 },
  { date: 'Today', price: 55 },
];

// Mock past sales (this would come from APIs like eBay, TCGPlayer, etc.)
const getMockPastSales = () => [
  {
    id: '1',
    marketplace: 'eBay',
    price: 56.39,
    date: '2 days ago',
    condition: 'Near Mint',
    url: 'https://www.ebay.com',
  },
  {
    id: '2',
    marketplace: 'TCGPlayer',
    price: 52.00,
    date: '3 days ago',
    condition: 'Lightly Played',
    url: 'https://www.tcgplayer.com',
  },
  {
    id: '3',
    marketplace: 'CardMarket',
    price: 48.50,
    date: '5 days ago',
    condition: 'Near Mint',
    url: 'https://www.cardmarket.com',
  },
];

export function PokemonCardDetail({ card, visible, onClose }: PokemonCardDetailProps) {
  const { isDark } = useAppTheme();

  const handleMarketplacePress = (url: string) => {
    Linking.openURL(url);
  };

  // Don't render anything if no card
  if (!card) {
    return null;
  }

  const metadata = getCardMetadata(card);
  const priceHistory = getMockPriceHistory();
  const pastSales = getMockPastSales();
  const currentPrice = priceHistory[priceHistory.length - 1].price;

  return (
    <BottomSheet isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['90%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
          backgroundClassName={cn(isDark ? 'bg-neutral-900' : 'bg-neutral-100')}
        >
          {/* Animated Card - Positioned Absolutely */}
          <AnimatedCardContent card={card} />

          {/* Scrollable Content */}
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-10"
            contentContainerStyle={{ paddingTop: SCREEN_HEIGHT * 0.5 }}
          >
            {/* Card Meta - Types and Rarity */}
            <View className="px-3 pb-4">
              <View className="flex-row items-center gap-2 flex-wrap">
                {/* Rarity Badge */}
                <Chip variant="soft" size="md" color="warning">
                  {metadata.rarity}
                </Chip>

                {/* Types */}
                {card.types.map((type, index) => (
                  <Chip key={index} variant="soft" size="md" color="default">
                    {type}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Stats Section */}
            <View className="px-3 pb-3">
              <AppText className="text-lg font-bold text-foreground mb-3">Stats</AppText>
              <Card
                
                className={cn(
                  'p-4 rounded-2xl border',
                  isDark ? 'border-neutral-800' : 'border-neutral-200'
                )}
              >
                <View className="flex-row flex-wrap gap-4">
                  <View className="flex-1 min-w-[70px] items-center">
                    <AppText className="text-xs text-muted uppercase font-semibold mb-1">HP</AppText>
                    <AppText className="text-2xl font-bold text-foreground">{card.stats.hp}</AppText>
                  </View>
                  <View className="flex-1 min-w-[70px] items-center">
                    <AppText className="text-xs text-muted uppercase font-semibold mb-1">ATK</AppText>
                    <AppText className="text-2xl font-bold text-foreground">{card.stats.attack}</AppText>
                  </View>
                  <View className="flex-1 min-w-[70px] items-center">
                    <AppText className="text-xs text-muted uppercase font-semibold mb-1">DEF</AppText>
                    <AppText className="text-2xl font-bold text-foreground">{card.stats.defense}</AppText>
                  </View>
                  <View className="flex-1 min-w-[70px] items-center">
                    <AppText className="text-xs text-muted uppercase font-semibold mb-1">SPD</AppText>
                    <AppText className="text-2xl font-bold text-foreground">{card.stats.speed}</AppText>
                  </View>
                </View>
              </Card>
            </View>

            {/* Ability Section */}
            {metadata.ability && (
              <View className="px-3 pb-3">
                <AppText className="text-lg font-bold text-foreground mb-3">Ability</AppText>
                <Card
                  
                  className={cn(
                    'p-4 rounded-2xl border',
                    isDark ? 'border-neutral-800' : 'border-neutral-200'
                  )}
                >
                  <AppText className="text-base font-semibold text-foreground mb-2">{metadata.ability.name}</AppText>
                  <AppText className="text-sm text-muted">{metadata.ability.description}</AppText>
                </Card>
              </View>
            )}

            {/* Attacks Section */}
            <View className="px-3 pb-3">
              <AppText className="text-lg font-bold text-foreground mb-3">Attacks</AppText>
              <View className="gap-3">
                {metadata.attacks.map((attack, index) => (
                  <Card
                    key={index}
                    
                    className={cn(
                      'p-4 rounded-2xl border',
                      isDark ? 'border-neutral-800' : 'border-neutral-200'
                    )}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <AppText className="text-base font-semibold text-foreground">{attack.name}</AppText>
                      <AppText className="text-lg font-bold text-foreground">{attack.damage}</AppText>
                    </View>
                    <AppText className="text-sm text-muted">{attack.description}</AppText>
                  </Card>
                ))}
              </View>
            </View>

            {/* Card Info Section */}
            <View className="px-3 pb-3">
              <AppText className="text-lg font-bold text-foreground mb-3">Card Info</AppText>
              <Card
                
                className={cn(
                  'p-4 rounded-2xl border',
                  isDark ? 'border-neutral-800' : 'border-neutral-200'
                )}
              >
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <AppText className="text-sm text-muted">Artist</AppText>
                    <AppText className="text-sm text-foreground">{metadata.artist}</AppText>
                  </View>
                  <View className="flex-row justify-between">
                    <AppText className="text-sm text-muted">Release Date</AppText>
                    <AppText className="text-sm text-foreground">{metadata.releaseDate}</AppText>
                  </View>
                  <View className="flex-row justify-between">
                    <AppText className="text-sm text-muted">Weakness</AppText>
                    <AppText className="text-sm text-foreground">{metadata.weakness}</AppText>
                  </View>
                  <View className="flex-row justify-between">
                    <AppText className="text-sm text-muted">Resistance</AppText>
                    <AppText className="text-sm text-foreground">{metadata.resistance}</AppText>
                  </View>
                  <View className="flex-row justify-between">
                    <AppText className="text-sm text-muted">Retreat Cost</AppText>
                    <AppText className="text-sm text-foreground">{metadata.retreatCost}</AppText>
                  </View>
                </View>
              </Card>
            </View>

            {/* Price History Section */}
            <View className="px-3 pb-3">
              <AppText className="text-lg font-bold text-foreground mb-3">Price History</AppText>
              <Card
                
                className={cn(
                  'p-4 rounded-2xl border',
                  isDark ? 'border-neutral-800' : 'border-neutral-200'
                )}
              >
                <View className="mb-4">
                  <AppText className="text-xs text-muted mb-1">Current Market Price</AppText>
                  <AppText className="text-3xl font-bold text-foreground">${currentPrice.toFixed(2)}</AppText>
                </View>
                <PriceChart data={priceHistory} width={300} height={180} />
              </Card>
            </View>

            {/* Recent Sales Section */}
            <View className="px-3 pb-3">
              <AppText className="text-lg font-bold text-foreground mb-3">Recent Sales</AppText>
              <View className="gap-3">
            {pastSales.map((sale) => (
              <Pressable key={sale.id} onPress={() => handleMarketplacePress(sale.url)}>
                <Card
                  
                  className={cn(
                    'p-4 rounded-xl border',
                    isDark ? 'border-neutral-800' : 'border-neutral-200'
                  )}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <StyledFeather name="shopping-cart" size={16} className="text-muted" />
                      <AppText className="text-sm font-semibold text-foreground">
                        {sale.marketplace}
                      </AppText>
                    </View>
                    <AppText className="text-lg font-bold text-foreground">
                      ${sale.price.toFixed(2)}
                    </AppText>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <AppText className="text-xs text-muted">{sale.condition}</AppText>
                    <AppText className="text-xs text-muted">{sale.date}</AppText>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>
          </BottomSheetScrollView>

          {/* Fixed Header - Glass Style - Absolutely Positioned */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.headerBlur}
            className="border-b border-neutral-200 dark:border-neutral-800"
          >
            <View className="px-6 py-4">
              <View className="flex-row items-center justify-between gap-2">
                {/* Pokemon Name */}
                <AppText className="text-2xl font-bold text-foreground">
                  {card.name}
                </AppText>

                {/* Set Badge and Card Number */}
                <View className="flex-row items-center gap-2">
                  <Chip variant="soft" size="sm" color="accent">
                    {metadata.setName}
                  </Chip>
                  <AppText className="text-sm text-muted">
                    #{metadata.cardNumber}
                  </AppText>
                </View>
              </View>
            </View>
          </BlurView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  animatedCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
