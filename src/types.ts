export interface Player {
  id: string;
  name: string;
  isSpy?: boolean;
  isLeader?: boolean;
  role?: string;
  score: number;
}

export interface GameConfig {
  numSpies: number;
  timeLimit: number;
}

export interface GameState {
  id: string;
  isPlaying: boolean;
  timeRemaining: number;
  location?: string | null;
  players: Player[];
  waitingPlayers?: Player[];
  currentTurn?: string | null;
  votingFor?: string;
  votes: Record<string, boolean>;
  config: GameConfig;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const LOCATIONS = [
  {
    "location": "Airplane",
    "roles": [
      "First Class Passenger",
      "Air Marshall",
      "Mechanic",
      "Economy Class Passenger",
      "Stewardess",
      "Co-Pilot",
      "Captain"
    ]
  },
  {
    "location": "Bank",
    "roles": [
      "Armored Car Driver",
      "Manager",
      "Consultant",
      "Customer",
      "Robber",
      "Security Guard",
      "Teller"
    ]
  },
  {
    "location": "Beach",
    "roles": [
      "Beach Waitress",
      "Kite Surfer",
      "Lifeguard",
      "Thief",
      "Beach Goer",
      "Beach Photographer",
      "Ice Cream Truck Driver"
    ]
  },
  {
    "location": "Broadway Theater",
    "roles": [
      "Coat Check Lady",
      "Prompter",
      "Cashier",
      "Visitor",
      "Director",
      "Actor",
      "Crewman"
    ]
  },
  {
    "location": "Casino",
    "roles": [
      "Bartender",
      "Head Security Guard",
      "Bouncer",
      "Manager",
      "Hustler",
      "Dealer",
      "Gambler"
    ]
  },
  {
    "location": "Cathedral",
    "roles": [
      "Priest",
      "Beggar",
      "Sinner",
      "Parishioner",
      "Tourist",
      "Sponsor",
      "Choir Singer"
    ]
  },
  {
    "location": "Circus Tent",
    "roles": [
      "Acrobat",
      "Animal Trainer",
      "Magician",
      "Visitor",
      "Fire Eater",
      "Clown",
      "Juggler"
    ]
  },
  {
    "location": "Corporate Party",
    "roles": [
      "Entertainer",
      "Manager",
      "Unwelcomed Guest",
      "Owner",
      "Secretary",
      "Accountant",
      "Delivery Boy"
    ]
  },
  {
    "location": "Crusader Army",
    "roles": [
      "Monk",
      "Imprisoned Arab",
      "Servant",
      "Bishop",
      "Squire",
      "Archer",
      "Knight"
    ]
  },
  {
    "location": "Day Spa",
    "roles": [
      "Customer",
      "Stylist",
      "Masseuse",
      "Manicurist",
      "Makeup Artist",
      "Dermatologist",
      "Beautician"
    ]
  },
  {
    "location": "Embassy",
    "roles": [
      "Security Guard",
      "Secretary",
      "Ambassador",
      "Government Official",
      "Tourist",
      "Refugee",
      "Diplomat"
    ]
  },
  {
    "location": "Hospital",
    "roles": [
      "Nurse",
      "Doctor",
      "Anesthesiologist",
      "Intern",
      "Patient",
      "Therapist",
      "Surgeon"
    ]
  },
  {
    "location": "Hotel",
    "roles": [
      "Doorman",
      "Security Guard",
      "Manager",
      "Housekeeper",
      "Customer",
      "Bartender",
      "Bellman"
    ]
  },
  {
    "location": "Military Base",
    "roles": [
      "Deserter",
      "Colonel",
      "Medic",
      "Soldier",
      "Sniper",
      "Officer",
      "Tank Engineer"
    ]
  },
  {
    "location": "Movie Studio",
    "roles": [
      "Stuntman",
      "Sound Engineer",
      "Cameraman",
      "Director",
      "Costume Artist",
      "Actor",
      "Producer"
    ]
  },
  {
    "location": "Ocean Liner",
    "roles": [
      "Rich Passenger",
      "Cook",
      "Captain",
      "Bartender",
      "Musician",
      "Waiter",
      "Mechanic"
    ]
  },
  {
    "location": "Passenger Train",
    "roles": [
      "Mechanic",
      "Border Patrol",
      "Train Attendant",
      "Passenger",
      "Restaurant Chef",
      "Engineer",
      "Stoker"
    ]
  },
  {
    "location": "Pirate Ship",
    "roles": [
      "Cook",
      "Sailor",
      "Slave",
      "Cannoneer",
      "Bound Prisoner",
      "Cabin Boy",
      "Brave Captain"
    ]
  },
  {
    "location": "Polar Station",
    "roles": [
      "Medic",
      "Geologist",
      "Expedition Leader",
      "Biologist",
      "Radioman",
      "Hydrologist",
      "Meteorologist"
    ]
  },
  {
    "location": "Police Station",
    "roles": [
      "Detective",
      "Lawyer",
      "Journalist",
      "Criminalist",
      "Archivist",
      "Patrol Officer",
      "Criminal"
    ]
  },
  {
    "location": "Restaurant",
    "roles": [
      "Musician",
      "Customer",
      "Bouncer",
      "Hostess",
      "Head Chef",
      "Food Critic",
      "Waiter"
    ]
  },
  {
    "location": "School",
    "roles": [
      "Gym Teacher",
      "Student",
      "Principal",
      "Security Guard",
      "Janitor",
      "Lunch Lady",
      "Maintenance Man"
    ]
  },
  {
    "location": "Service Station",
    "roles": [
      "Manager",
      "Tire Specialist",
      "Biker",
      "Car Owner",
      "Car Wash Operator",
      "Electrician",
      "Auto Mechanic"
    ]
  },
  {
    "location": "Space Station",
    "roles": [
      "Engineer",
      "Alien",
      "Space Tourist",
      "Pilot",
      "Commander",
      "Scientist",
      "Doctor"
    ]
  },
  {
    "location": "Submarine",
    "roles": [
      "Cook",
      "Commander",
      "Sonar Technician",
      "Electronics Technician",
      "Sailor",
      "Radioman",
      "Navigator"
    ]
  },
  {
    "location": "Supermarket",
    "roles": [
      "Customer",
      "Cashier",
      "Butcher",
      "Janitor",
      "Security Guard",
      "Food Sample Demonstrator",
      "Shelf Stocker"
    ]
  },
  {
    "location": "University",
    "roles": [
      "Graduate Student",
      "Professor",
      "Dean",
      "Psychologist",
      "Maintenance Man",
      "Student",
      "Janitor"
    ]
  }
] as const;

export interface GameLookup {
  [gameId: string]: GameState;
}