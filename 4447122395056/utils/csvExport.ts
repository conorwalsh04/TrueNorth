import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

export type CsvHabitLog = {
  date: string;
  count: number;
  notes: string | null;
  habitId: number;
  completed: number;
};

export type CsvHabit = { id: number; name: string; categoryId: number };
export type CsvCategory = { id: number; name: string };

function escapeCsvCell(v: string | null): string {
  const s = v ?? '';
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildHabitLogsCsv(
  logs: CsvHabitLog[],
  habits: CsvHabit[],
  categories: CsvCategory[],
): string {
  const habitById = new Map(habits.map((h) => [h.id, h]));
  const catById = new Map(categories.map((c) => [c.id, c]));
  const header = 'date,habit,category,count,notes,completed';
  const rows = logs.map((l) => {
    const h = habitById.get(l.habitId);
    const catName = h ? (catById.get(h.categoryId)?.name ?? '') : '';
    const habitName = h?.name ?? String(l.habitId);
    return [
      l.date,
      escapeCsvCell(habitName),
      escapeCsvCell(catName),
      String(l.count),
      escapeCsvCell(l.notes),
      String(l.completed),
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

export async function exportLogsToCSV(
  logs: CsvHabitLog[],
  habits: CsvHabit[],
  categories: CsvCategory[],
): Promise<void> {
  const csv = buildHabitLogsCsv(logs, habits, categories);

  if (Platform.OS === 'web') {
    Alert.alert('Export', 'CSV export is available on iOS and Android in Expo Go.');
    return;
  }

  const dir = FileSystem.cacheDirectory;
  if (!dir) {
    Alert.alert('Export failed', 'Cache directory is not available.');
    return;
  }

  const path = `${dir}truenorth-habits-export.csv`;
  await FileSystem.writeAsStringAsync(path, csv, { encoding: 'utf8' });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    Alert.alert('Export saved', `File written to:\n${path}`);
    return;
  }

  await Sharing.shareAsync(path, {
    mimeType: 'text/csv',
    dialogTitle: 'Export TrueNorth habit logs',
  });
}
