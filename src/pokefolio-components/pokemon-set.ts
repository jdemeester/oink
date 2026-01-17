import { type Pokemon } from './pokemon';

export type PokemonSetCard = Pokemon & {
  number: string; // Card number in set (e.g., "001", "025")
  isCollected: boolean; // Whether the user owns this card
};

export type PokemonSet = {
  id: string;
  name: string;
  icon: string; // Set icon/logo URL
  totalCards: number;
  collectedCards: number;
  cards: PokemonSetCard[];
};

export const mockPokemonSet: PokemonSet = {
  id: '1',
  name: 'Crimson Blaze',
  icon: 'https://images.pokemontcg.io/swsh11/logo.png',
  totalCards: 30,
  collectedCards: 9,
  cards: [
    // Card 1 - Charizard (collected)
    {
      id: '1',
      number: '001',
      name: 'Charizard',
      types: ['Fire', 'Flying'],
      description: 'Spits fire that is hot enough to melt boulders.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
      gradientColors: ['#F08030', '#EE8130', '#FFA756'],
      stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
      height: '1.7 m',
      weight: '90.5 kg',
      isCollected: true,
    },
    // Card 2 - Not collected
    {
      id: '2',
      number: '002',
      name: 'Bulbasaur',
      types: ['Grass', 'Poison'],
      description: 'A strange seed was planted on its back at birth.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      gradientColors: ['#78C850', '#A7DB8D', '#58A878'],
      stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
      height: '0.7 m',
      weight: '6.9 kg',
      isCollected: false,
    },
    // Card 3 - Not collected
    {
      id: '3',
      number: '003',
      name: 'Squirtle',
      types: ['Water'],
      description: 'After birth, its back swells and hardens into a shell.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      gradientColors: ['#6890F0', '#4592C4', '#76BDFE'],
      stats: { hp: 44, attack: 48, defense: 65, speed: 43 },
      height: '0.5 m',
      weight: '9.0 kg',
      isCollected: false,
    },
    // Continue pattern for remaining cards...
    {
      id: '4',
      number: '004',
      name: 'Pikachu',
      types: ['Electric'],
      description: 'When several gather, their electricity could cause lightning storms.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      gradientColors: ['#F8D030', '#FFD700', '#FFCE4B'],
      stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
      height: '0.4 m',
      weight: '6.0 kg',
      isCollected: false,
    },
    {
      id: '5',
      number: '005',
      name: 'Gengar',
      types: ['Ghost', 'Poison'],
      description: 'Under a full moon, it likes to mimic shadows and laugh.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
      gradientColors: ['#705898', '#A040A0', '#9C7BA6'],
      stats: { hp: 60, attack: 65, defense: 60, speed: 110 },
      height: '1.5 m',
      weight: '40.5 kg',
      isCollected: false,
    },
    {
      id: '6',
      number: '006',
      name: 'Blastoise',
      types: ['Water'],
      description: 'Pressurized water jets on its shell are used for high-speed tackles.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
      gradientColors: ['#6890F0', '#4592C4', '#76BDFE'],
      stats: { hp: 79, attack: 83, defense: 100, speed: 78 },
      height: '1.6 m',
      weight: '85.5 kg',
      isCollected: true,
    },
    {
      id: '7',
      number: '007',
      name: 'Dragonite',
      types: ['Dragon', 'Flying'],
      description: 'An extremely rarely seen marine Pokémon.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
      gradientColors: ['#F0A030', '#F8B030', '#C77C4E'],
      stats: { hp: 91, attack: 134, defense: 95, speed: 80 },
      height: '2.2 m',
      weight: '210.0 kg',
      isCollected: false,
    },
    {
      id: '8',
      number: '008',
      name: 'Venusaur',
      types: ['Grass', 'Poison'],
      description: 'The plant blooms when absorbing solar energy.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
      gradientColors: ['#78C850', '#A7DB8D', '#58A878'],
      stats: { hp: 80, attack: 82, defense: 83, speed: 80 },
      height: '2.0 m',
      weight: '100.0 kg',
      isCollected: true,
    },
    // Add more cards to reach 30...
  ].concat(
    // Generate remaining cards (9-30) as not collected
    Array.from({ length: 22 }, (_, i) => ({
      id: String(9 + i),
      number: String(9 + i).padStart(3, '0'),
      name: `Mystery Card ${9 + i}`,
      types: ['Normal'] as const,
      description: 'A mysterious Pokémon card.',
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${132 + i}.png`,
      gradientColors: ['#A8A878', '#C6C6A7', '#808080'],
      stats: { hp: 50, attack: 50, defense: 50, speed: 50 },
      height: '1.0 m',
      weight: '10.0 kg',
      isCollected: i < 6, // First 6 are collected (cards 9-14)
    }))
  ),
};
