// constants/users.ts
export type User = {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  emoji: string;
  photo?: string;
  avatar?: any;
  coins: number;
};

export const USERS: User[] = [];
