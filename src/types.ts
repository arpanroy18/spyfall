export interface Player {
  id: string;
  name: string;
  isSpy?: boolean;
  isLeader?: boolean;
  score: number;
}

export interface GameConfig {
  numSpies: number;
  timeLimit: number;
  country: string;
}

export interface GameState {
  id: string;
  isPlaying: boolean;
  timeRemaining: number;
  location?: string;
  players: Player[];
  currentTurn?: string;
  votingFor?: string;
  votes: Record<string, boolean>;
  config: GameConfig;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const COUNTRIES = {
  'Canada': [
    'CN Tower',
    'Banff National Park',
    'Hockey Arena',
    'Tim Hortons',
    'Parliament Hill',
    'Stanley Park',
    'Niagara Falls',
    'Montreal Metro',
    'Vancouver Seawall',
    'Canadian Museum of History',
    'Rideau Canal',
    'Royal Ontario Museum',
    'Whistler Ski Resort',
    'Calgary Stampede Grounds',
    'Quebec City Old Town'
  ],
  'United States': [
    'Empire State Building',
    'Disney World',
    'Grand Canyon',
    'Times Square',
    'White House',
    'Hollywood Walk of Fame',
    'Las Vegas Casino',
    'Central Park',
    'Golden Gate Bridge',
    'Mount Rushmore',
    'NASA Space Center',
    'Broadway Theater',
    'Pentagon',
    'Statue of Liberty',
    'Mall of America'
  ],
  'United Kingdom': [
    'Big Ben',
    'Buckingham Palace',
    'London Underground',
    'Tower Bridge',
    'Stonehenge',
    'Edinburgh Castle',
    'British Museum',
    'Oxford University',
    'London Eye',
    'Westminster Abbey',
    'Tower of London',
    'Shakespeare\'s Globe',
    'Piccadilly Circus',
    'Royal Albert Hall',
    'Hadrian\'s Wall'
  ],
  'France': [
    'Eiffel Tower',
    'Louvre Museum',
    'Palace of Versailles',
    'Notre-Dame Cathedral',
    'French Riviera Beach',
    'Mont Saint-Michel',
    'Champs-Élysées',
    'French Vineyard',
    'Paris Metro',
    'French Café',
    'Arc de Triomphe',
    'Disneyland Paris',
    'French Alps Ski Resort',
    'French Fashion House',
    'French Bakery'
  ],
  'Germany': [
    'Brandenburg Gate',
    'Neuschwanstein Castle',
    'Berlin Wall',
    'Oktoberfest',
    'Cologne Cathedral',
    'Reichstag Building',
    'BMW Factory',
    'Black Forest',
    'Hamburg Port',
    'Dresden Opera House',
    'Munich Beer Hall',
    'Berlin Zoo',
    'German Christmas Market',
    'Heidelberg University',
    'Deutsche Bahn Station'
  ],
  'India': [
    'Taj Mahal',
    'Gateway of India',
    'Jaipur Palace',
    'Indian Railway Station',
    'Varanasi Ghats',
    'Bollywood Studio',
    'Kerala Backwaters',
    'Delhi Spice Market',
    'Golden Temple',
    'Indian Cricket Stadium',
    'Mysore Palace',
    'Dharavi',
    'Indian Tech Park',
    'Ajanta Caves',
    'Indian Wedding Hall'
  ],
  'China': [
    'Great Wall',
    'Forbidden City',
    'Shanghai Tower',
    'Terracotta Army',
    'Temple of Heaven',
    'West Lake',
    'Chinese Opera House',
    'Beijing Hutong',
    'Hong Kong Harbor',
    'Chengdu Panda Base',
    'Chinese Tea House',
    'Silk Market',
    'Chinese Tech Campus',
    'Shanghai Metro',
    'Chinese Garden'
  ]
} as const;

export interface GameLookup {
  [gameId: string]: GameState;
}