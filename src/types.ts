export type GameCategory = 
    | "RPG" 
    | "Shooter" 
    | "Strategy" 
    | "Action" 
    | "Adventure" 
    | "Sports"
    | "Racing";

export interface Game {
    readonly id: number;
    title: string;
    price: number;
    description: string;
    category: GameCategory;
    releaseYear?: number
    tags: string[];
}

export interface GameStore {
    games: Game[]
    lastUpdated: Date;
}