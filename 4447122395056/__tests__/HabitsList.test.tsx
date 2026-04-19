import { render, screen } from '@testing-library/react-native';
import React from 'react';
import HabitsTab from '../app/(tabs)/habits';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (callback: () => void) => {
      React.useEffect(() => {
        callback();
      }, []);
    },
  };
});

jest.mock('../hooks/useHabits', () => ({
  useHabits: () => ({
    habits: [
      {
        id: 1,
        name: 'Morning Run',
        description: null,
        categoryId: 1,
        userId: 1,
        createdAt: '2026-01-01',
      },
    ],
    loading: false,
    refresh: jest.fn(),
    addHabit: jest.fn(),
    updateHabit: jest.fn(),
    deleteHabit: jest.fn(),
  }),
}));

jest.mock('../hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Fitness', colour: '#E74C3C', icon: '🏃', userId: 1 },
    ],
    loading: false,
    refresh: jest.fn(),
    addCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  }),
}));

jest.mock('../hooks/useLogs', () => ({
  useLogs: () => ({
    logs: [],
    loading: false,
    refresh: jest.fn(),
    addLog: jest.fn(),
    updateLog: jest.fn(),
  }),
}));

jest.mock('../utils/api', () => ({
  fetchMotivationalQuote: async () => ({ quote: 'Test', author: 'Author' }),
}));

function wrap(ui: React.ReactElement) {
  return (
    <ThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );
}

describe('HabitsTab', () => {
  it('shows seeded habit names and not empty state', async () => {
    render(wrap(<HabitsTab />));

    expect(await screen.findByText('Morning Run')).toBeTruthy();
    expect(await screen.findByLabelText(/List updated at/)).toBeTruthy();
    expect(screen.queryByText('Start your journey. Add your first habit.')).toBeNull();
  });
});
