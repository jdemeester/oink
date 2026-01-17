import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Chip, Card, cn } from 'heroui-native';
import BottomSheet, { BottomSheetScrollView, useBottomSheet } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';
import { useMemo, useCallback, useRef } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { FlipCard } from '../../../components/showcases/flip-card';
import { mockPokemon } from '../../../pokefolio-components/pokemon';
import { PriceChart, type PriceDataPoint } from '../../../pokefolio-components/price-chart';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const StyledFeather = withUniwind(Feather);
const AnimatedView = Animated.createAnimatedComponent(View);

// Mock card metadata
const getCardMetadata = () => ({
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

const getMockPriceHistory = (): PriceDataPoint[] => [
  { date: 'Jan 1', price: 15 },
  { date: 'Jan 8', price: 22 },
  { date: 'Jan 15', price: 45 },
  { date: 'Jan 22', price: 38 },
  { date: 'Jan 29', price: 52 },
  { date: 'Feb 5', price: 48 },
  { date: 'Today', price: 55 },
];

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

export default function CardDetailScreen() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);

  const card = mockPokemon.find((p) => p.id === id) || mockPokemon[0];
  const metadata = getCardMetadata();
  const priceHistory = getMockPriceHistory();
  const pastSales = getMockPastSales();
  const currentPrice = priceHistory[priceHistory.length - 1].price;

  // Just 2 snap points like Pokemon Pocket - low and high
  const snapPoints = useMemo(() => ['30%', '65%'], []);

  const handleMarketplacePress = (url: string) => {
    Linking.openURL(url);
  };

  // Card dimensions and positioning
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = CARD_WIDTH * 1.5; // 420px
  const CARD_TOP = SCREEN_HEIGHT * 0.12;
  const PADDING = 20;

  // Container style - dynamically shrinks to available space and clips overflow
  const cardContainerStyle = useAnimatedStyle(() => {
    const availableHeight = animatedPosition.value - CARD_TOP - PADDING;
    return {
      maxHeight: Math.max(150, availableHeight), // never collapse below 150
      overflow: 'hidden', // clips the card so it can't overlap the sheet
    };
  });

  // Card style - scales based on ACTUAL available space (not snap point index)
  // This makes the scaling continuous and adaptive as you drag
  const cardAnimatedStyle = useAnimatedStyle(() => {
    // How much vertical space exists between card top and bottom sheet top
    const availableHeight = animatedPosition.value - CARD_TOP - PADDING;

    // Calculate scale to fit within available space
    // Min scale: 0.4 (40% size), Max scale: 1.0 (100% size)
    const scale = Math.min(1, Math.max(0.4, availableHeight / CARD_HEIGHT));

    return {
      width: CARD_WIDTH * scale,
      height: CARD_HEIGHT * scale,
    };
  });

  const handleSheetChanges = useCallback((_index: number) => {
    // Optional: handle snap point changes
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={cn('flex-1', isDark ? 'bg-neutral-950' : 'bg-neutral-200')}>
        {/* Back Button */}
        <View className="absolute top-12 left-4 z-20">
          <Pressable
            onPress={() => router.back()}
            className={cn(
              'size-10 rounded-full items-center justify-center',
              isDark ? 'bg-neutral-800/80' : 'bg-white/80'
            )}
          >
            <StyledFeather name="arrow-left" size={20} className="text-foreground" />
          </Pressable>
        </View>

        {/* Card at top - Animated */}
        <AnimatedView
          style={[styles.cardContainer, cardContainerStyle]}
          pointerEvents="box-none"
        >
          <AnimatedView style={cardAnimatedStyle}>
            <FlipCard
              width="100%"
              height="100%"
              frontContent={
                <View style={StyleSheet.absoluteFill}>
                  <Card
                    className={cn(
                      'w-full h-full items-center justify-center rounded-2xl p-0 border shadow-2xl',
                      isDark ? 'border-neutral-800 shadow-black/60' : 'border-neutral-200 shadow-black/30'
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
                      'w-full h-full items-center justify-center rounded-2xl p-0 border shadow-2xl',
                      isDark ? 'border-neutral-800 shadow-black/60' : 'border-neutral-200 shadow-black/30'
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
          </AnimatedView>
        </AnimatedView>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          animatedPosition={animatedPosition}
          animatedIndex={animatedIndex}
          enableOverDrag={false}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          overDragResistanceFactor={10}
          maxDynamicContentSize={SCREEN_HEIGHT * 0.65}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          backgroundStyle={{
            backgroundColor: isDark ? '#171717' : '#f5f5f5',
            borderRadius: 24,
          }}
          handleIndicatorStyle={{
            backgroundColor: isDark ? '#525252' : '#d4d4d4',
            width: 40,
          }}
        >
          {/* Glass Header */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.headerBlur}
          >
            <View className="px-6 py-4">
              <View className="flex-row items-center justify-between gap-2">
                <AppText className="text-2xl font-bold text-foreground">
                  {card.name}
                </AppText>
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

          {/* Scrollable Content */}
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
            contentContainerStyle={{ paddingTop: 72, paddingBottom: 40 }}
          >
            {/* Card Meta - Types and Rarity */}
            <View className="px-3 pb-4">
              <View className="flex-row items-center gap-2 flex-wrap">
                <Chip variant="soft" size="md" color="warning">
                  {metadata.rarity}
                </Chip>
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
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-start', // align to top so overflow clips the bottom
    zIndex: 1,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
