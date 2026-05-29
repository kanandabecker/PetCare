import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

export function InfoBadge({ icon, label, value, color = COLORS.primaryLight }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function CheckBadge({ label, checked }) {
  return (
    <View style={[styles.checkBadge, { backgroundColor: checked ? '#E8F5E9' : '#FFEBEE' }]}>
      <Ionicons
        name={checked ? 'checkmark-circle' : 'close-circle'}
        size={16}
        color={checked ? COLORS.success : COLORS.primary}
      />
      <Text style={[styles.checkLabel, { color: checked ? '#2E7D32' : '#C62828' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flex: 1,
    minWidth: 75,
    gap: 4,
  },
  value: {
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  checkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 5,
  },
  checkLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
});