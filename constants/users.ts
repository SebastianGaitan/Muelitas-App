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

export const USERS: User[] = [
  {
    id: 'test-user',
    name: 'Tester',
    color: '#9B59B6',
    borderColor: '#7D3C98',
    emoji: '🧪',
    coins: 1000,
  },
];
