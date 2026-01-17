import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button, Chip, Surface, Tabs, TextField, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';

const StyledIonicons = withUniwind(Ionicons);

// Mock Data
const mockPeople = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Buyer',
    stage: 'Actively Searching',
    lastTouch: 'Called 2 days ago',
    isHot: true,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
    category: 'Hot Leads',
  },
  {
    id: 2,
    name: 'Mike Johnson',
    role: 'Seller',
    stage: 'Active Listing',
    lastTouch: 'Met yesterday',
    isHot: false,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
    category: 'Active Clients',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Buyer',
    stage: 'Under Contract',
    lastTouch: 'Email 1 week ago',
    isHot: false,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=20',
    category: 'Active Clients',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Past Client',
    stage: 'Closed',
    lastTouch: 'Closed 6 months ago',
    isHot: false,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=23',
    category: 'Past Clients',
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Sphere',
    stage: 'Friend',
    lastTouch: 'Birthday call 2 months ago',
    isHot: false,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=8',
    category: 'Sphere',
  },
  {
    id: 6,
    name: 'David Martinez',
    role: 'Buyer',
    stage: 'Exploring',
    lastTouch: 'No contact yet',
    isHot: true,
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=12',
    category: 'Hot Leads',
  },
];

const mockProperties = [
  {
    id: 1,
    address: '123 Oak Street',
    beds: 4,
    baths: 3,
    sqft: 2450,
    price: 485000,
    status: 'Active',
    dom: 12,
    category: 'Active Listings',
  },
  {
    id: 2,
    address: '456 Maple Avenue',
    beds: 3,
    baths: 2,
    sqft: 1850,
    price: 375000,
    status: 'Under Contract',
    closingDate: 'Feb 15',
    category: 'Under Contract',
  },
  {
    id: 3,
    address: '789 Pine Road',
    beds: 5,
    baths: 4,
    sqft: 3200,
    price: 725000,
    status: 'Sold',
    soldDate: 'Dec 10',
    soldPrice: 710000,
    category: 'Sold',
  },
  {
    id: 4,
    address: 'Buyer Search: Sarah Chen',
    beds: '3-4',
    baths: '2+',
    sqft: '1800-2500',
    price: 450000,
    status: 'Searching',
    client: 'Sarah Chen',
    category: 'Buyer Searches',
  },
];

const PEOPLE_FILTERS = ['All', 'Hot Leads', 'Active Clients', 'Past Clients', 'Sphere'];
const PROPERTY_FILTERS = [
  'All',
  'Active Listings',
  'Under Contract',
  'Buyer Searches',
  'Sold',
];

export default function CRMScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'people' | 'properties'>('people');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = activeTab === 'people' ? PEOPLE_FILTERS : PROPERTY_FILTERS;

  const filteredPeople =
    activeFilter === 'All'
      ? mockPeople
      : mockPeople.filter((p) => p.category === activeFilter);

  const filteredProperties =
    activeFilter === 'All'
      ? mockProperties
      : mockProperties.filter((p) => p.category === activeFilter);

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Under Contract':
        return 'warning';
      case 'Searching':
        return 'accent';
      default:
        return 'default';
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Fixed Header */}
      <View
        className="bg-background border-b border-border pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        {/* Tabs */}
        <View className="px-5 mb-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as 'people' | 'properties');
              setActiveFilter('All');
            }}
            variant="pill"
          >
            <Tabs.List>
              <Tabs.Trigger value="people">
                <Tabs.Label>People</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="properties">
                <Tabs.Label>Properties</Tabs.Label>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </View>

        {/* Search */}
        <View className="px-5 mb-3">
          <TextField>
            <View className="w-full flex-row items-center">
              <TextField.Input
                className="flex-1 pl-10"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              <StyledIonicons
                name="search-outline"
                size={18}
                className="absolute left-3 text-muted"
                pointerEvents="none"
              />
            </View>
          </TextField>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 gap-2"
        >
          {filters.map((filter) => (
            <Pressable key={filter} onPress={() => setActiveFilter(filter)}>
              <Chip
                size="sm"
                variant={activeFilter === filter ? 'primary' : 'secondary'}
              >
                <Chip.Label className="text-xs">{filter}</Chip.Label>
              </Chip>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-4">
        {activeTab === 'people' ? (
          filteredPeople.length > 0 ? (
            <View className="gap-3">
              {filteredPeople.map((person) => (
                <Surface key={person.id} variant="secondary" className="p-4">
                  <View className="flex-row items-center gap-3">
                    <Avatar size="md" alt={person.name}>
                      <Avatar.Image source={{ uri: person.avatar }} />
                      <Avatar.Fallback>
                        {person.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Avatar.Fallback>
                    </Avatar>
                    <View className="flex-1">
                      <AppText className="text-base font-semibold text-foreground mb-1">
                        {person.name}
                      </AppText>
                      <View className="flex-row items-center gap-2 mb-2">
                        <Chip
                          size="sm"
                          variant="soft"
                          color={person.isHot ? 'danger' : 'default'}
                        >
                          <Chip.Label className="text-xs">
                            {person.role} • {person.stage}
                          </Chip.Label>
                        </Chip>
                      </View>
                      <AppText className="text-xs text-muted">
                        {person.lastTouch}
                      </AppText>
                    </View>
                    <View className="flex-row gap-2">
                      <Button variant="ghost" size="sm" isIconOnly>
                        <StyledIonicons
                          name="call-outline"
                          size={18}
                          className="text-foreground"
                        />
                      </Button>
                      <Button variant="ghost" size="sm" isIconOnly>
                        <StyledIonicons
                          name="chatbubble-outline"
                          size={18}
                          className="text-foreground"
                        />
                      </Button>
                    </View>
                  </View>
                </Surface>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Surface variant="secondary" className="p-8 items-center">
                <StyledIonicons
                  name="people-outline"
                  size={48}
                  className="text-muted mb-4"
                />
                <AppText className="text-lg font-semibold text-foreground mb-2">
                  No contacts yet
                </AppText>
                <AppText className="text-sm text-muted mb-6 text-center">
                  Start building your network by adding your first contact
                </AppText>
                <Button variant="primary">
                  <StyledIonicons
                    name="add-outline"
                    size={18}
                    className="text-white"
                  />
                  <Button.Label>Add Contact</Button.Label>
                </Button>
              </Surface>
            </View>
          )
        ) : filteredProperties.length > 0 ? (
          <View className="gap-3">
            {filteredProperties.map((property) => (
              <Surface key={property.id} variant="secondary" className="p-4">
                <View className="gap-3">
                  {/* Property Header */}
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <AppText className="text-base font-semibold text-foreground mb-1">
                        {property.address}
                      </AppText>
                      <AppText className="text-sm text-muted mb-2">
                        {property.beds} bed • {property.baths} bath •{' '}
                        {property.sqft.toLocaleString()} sqft
                      </AppText>
                    </View>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getStatusChipColor(property.status)}
                    >
                      <Chip.Label className="text-xs">{property.status}</Chip.Label>
                    </Chip>
                  </View>

                  {/* Property Details */}
                  <View className="flex-row items-center justify-between">
                    <AppText className="text-lg font-bold text-foreground">
                      ${property.price.toLocaleString()}
                    </AppText>
                    {property.status === 'Active' && property.dom && (
                      <AppText className="text-xs text-muted">
                        {property.dom} days on market
                      </AppText>
                    )}
                    {property.status === 'Under Contract' &&
                      property.closingDate && (
                        <AppText className="text-xs text-muted">
                          Closing: {property.closingDate}
                        </AppText>
                      )}
                    {property.status === 'Sold' && property.soldDate && (
                      <AppText className="text-xs text-muted">
                        Sold: {property.soldDate}
                      </AppText>
                    )}
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Surface variant="secondary" className="p-8 items-center">
              <StyledIonicons
                name="home-outline"
                size={48}
                className="text-muted mb-4"
              />
              <AppText className="text-lg font-semibold text-foreground mb-2">
                No properties yet
              </AppText>
              <AppText className="text-sm text-muted mb-6 text-center">
                Add your first listing or buyer search to get started
              </AppText>
              <Button variant="primary">
                <StyledIonicons
                  name="add-outline"
                  size={18}
                  className="text-white"
                />
                <Button.Label>Add Property</Button.Label>
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
    </View>
  );
}
