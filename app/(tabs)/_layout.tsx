// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import {
  IconBook,
  IconCalendar,
  IconDeviceGamepad2,
  IconGift,
} from '@tabler/icons-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#FFFBF0',
          borderTopWidth: 0,
          elevation: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <IconBook stroke={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <IconCalendar stroke={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => (
            <IconDeviceGamepad2 stroke={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, size }) => (
            <IconGift stroke={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
