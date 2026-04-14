import { StyleSheet, Text, View } from 'react-native';

export type CategoryBadgeProps = {
  name: string;
  colour: string;
  icon: string;
};

export default function CategoryBadge({ name, colour, icon }: CategoryBadgeProps) {
  return (
    <View
      style={[styles.pill, { backgroundColor: colour }]}
      accessibilityLabel={`Category ${name}`}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
    marginTop: 8,
  },
  icon: { fontSize: 14 },
  name: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
});
