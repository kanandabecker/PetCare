import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) {
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return { bg: COLORS.secondary, text: COLORS.white, border: COLORS.secondary };
      case 'outline':
        return { bg: 'transparent', text: COLORS.primary, border: COLORS.primary };
      case 'danger':
        return { bg: COLORS.danger, text: COLORS.white, border: COLORS.danger };
      case 'ghost':
        return { bg: 'transparent', text: COLORS.textLight, border: 'transparent' };
      default:
        return { bg: COLORS.primary, text: COLORS.white, border: COLORS.primary };
    }
  };

  const colors = getColors();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? '#CCCCCC' : colors.bg,
          borderColor: disabled ? '#CCCCCC' : colors.border,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={18} color={colors.text} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: colors.text }, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={18} color={colors.text} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: 2,
  },
  iconRight: {
    marginLeft: 2,
  },
});