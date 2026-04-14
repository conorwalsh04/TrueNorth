export type CsvHabitLog = {
  date: string;
  count: number;
  notes: string | null;
  habitId: number;
};

export type CsvHabit = { id: number; name: string; categoryId: number };
export type CsvCategory = { id: number; name: string };

export async function exportLogsToCSV(
  _logs: CsvHabitLog[],
  _habits: CsvHabit[],
  _categories: CsvCategory[],
): Promise<void> {
  return;
}
