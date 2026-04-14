import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { palette } from '../constants/colors';

export type QuoteCardProps = {
  quote: string;
  author: string;
  loading: boolean;
};

export default function QuoteCard({ quote, author, loading }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityLabel={loading ? 'Loading quote' : `Quote by ${author}`}
    >
      <View style={[styles.accentBar, { backgroundColor: palette.gold }]} />
      <View style={styles.body}>
        {loading ? (
          <>
            <View style={[styles.skelLine, { backgroundColor: colors.border }]} />
            <View style={[styles.skelLineShort, { backgroundColor: colors.border }]} />
            <View style={[styles.skelAuthor, { backgroundColor: colors.border }]} />
          </>
        ) : (
          <>
            <Text style={[styles.quote, { color: colors.text }]}>&ldquo;{quote}&rdquo;</Text>
            <Text style={[styles.author, { color: colors.secondaryText }]}>— {author}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 16,
  },
  accentBar: { width: 4 },
  body: { flex: 1, padding: 16 },
  quote: { fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  author: { marginTop: 10, fontSize: 14, fontWeight: '600' },
  skelLine: { height: 14, borderRadius: 6, marginBottom: 10, width: '100%' },
  skelLineShort: { height: 14, borderRadius: 6, marginBottom: 10, width: '72%' },
  skelAuthor: { height: 12, borderRadius: 6, width: '40%' },
});
