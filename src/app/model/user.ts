export interface SymbolItem {
  value: string;
  label: string;
}

export type SymbolGroup = SymbolItem[];

export interface SymbolGroups {
  [groupName: string]: SymbolGroup;
}

export interface Portfolio {
  [coins: string]: number;
}


export interface UserSettings {
  symbols: SymbolGroups;
  portfolio: Portfolio;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  settings: UserSettings;
}
