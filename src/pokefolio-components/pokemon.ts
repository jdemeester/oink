export type PokemonType =
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Psychic'
  | 'Ice'
  | 'Dragon'
  | 'Dark'
  | 'Fairy'
  | 'Normal'
  | 'Fighting'
  | 'Flying'
  | 'Poison'
  | 'Ground'
  | 'Rock'
  | 'Bug'
  | 'Ghost'
  | 'Steel';

export type Pokemon = {
  id: string;
  name: string;
  types: PokemonType[];
  description: string;
  imageUrl: string;
  backImageUrl?: string; // Optional back of card image
  gradientColors: string[]; // Dominant colors from the Pokemon image
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  height: string;
  weight: string;
};

// Type-based gradient colors
export const pokemonTypeGradients: Record<PokemonType, string[]> = {
  Fire: ['#F08030', '#FF6347'],
  Water: ['#6890F0', '#4169E1'],
  Grass: ['#78C850', '#228B22'],
  Electric: ['#F8D030', '#FFD700'],
  Psychic: ['#F85888', '#FF1493'],
  Ice: ['#98D8D8', '#87CEEB'],
  Dragon: ['#7038F8', '#4B0082'],
  Dark: ['#705848', '#2F4F4F'],
  Fairy: ['#EE99AC', '#FFB6C1'],
  Normal: ['#A8A878', '#808080'],
  Fighting: ['#C03028', '#8B0000'],
  Flying: ['#A890F0', '#87CEEB'],
  Poison: ['#A040A0', '#8B008B'],
  Ground: ['#E0C068', '#D2691E'],
  Rock: ['#B8A038', '#A0522D'],
  Bug: ['#A8B820', '#6B8E23'],
  Ghost: ['#705898', '#483D8B'],
  Steel: ['#B8B8D0', '#708090'],
};

// Mock Pokemon data with dominant colors from their official artwork
export const mockPokemon: Pokemon[] = [
  {
    id: '1',
    name: 'Charizard',
    types: ['Fire', 'Flying'],
    description:
      'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
    gradientColors: ['#F08030', '#EE8130', '#FFA756'], // Orange, fire tones
    stats: {
      hp: 78,
      attack: 84,
      defense: 78,
      speed: 100,
    },
    height: '1.7 m',
    weight: '90.5 kg',
  },
  {
    id: '2',
    name: 'Blastoise',
    types: ['Water'],
    description:
      'A brutal Pokémon with pressurized water jets on its shell. They are used for high-speed tackles.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    gradientColors: ['#6890F0', '#4592C4', '#76BDFE'], // Blue, water tones
    stats: {
      hp: 79,
      attack: 83,
      defense: 100,
      speed: 78,
    },
    height: '1.6 m',
    weight: '85.5 kg',
  },
  {
    id: '3',
    name: 'Venusaur',
    types: ['Grass', 'Poison'],
    description:
      'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    gradientColors: ['#78C850', '#A7DB8D', '#58A878'], // Green, grass tones
    stats: {
      hp: 80,
      attack: 82,
      defense: 83,
      speed: 80,
    },
    height: '2.0 m',
    weight: '100.0 kg',
  },
  {
    id: '4',
    name: 'Pikachu',
    types: ['Electric'],
    description:
      'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    gradientColors: ['#F8D030', '#FFD700', '#FFCE4B'], // Yellow, electric tones
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      speed: 90,
    },
    height: '0.4 m',
    weight: '6.0 kg',
  },
  {
    id: '5',
    name: 'Gengar',
    types: ['Ghost', 'Poison'],
    description:
      'Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    gradientColors: ['#705898', '#A040A0', '#9C7BA6'], // Purple, ghost tones
    stats: {
      hp: 60,
      attack: 65,
      defense: 60,
      speed: 110,
    },
    height: '1.5 m',
    weight: '40.5 kg',
  },
  {
    id: '6',
    name: 'Dragonite',
    types: ['Dragon', 'Flying'],
    description:
      'An extremely rarely seen marine Pokémon. Its intelligence is said to match that of humans.',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
    gradientColors: ['#F0A030', '#F8B030', '#C77C4E'], // Orange-brown, dragon tones
    stats: {
      hp: 91,
      attack: 134,
      defense: 95,
      speed: 80,
    },
    height: '2.2 m',
    weight: '210.0 kg',
  },
];
