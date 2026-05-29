import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

export default function PetCard({ pet, onPress, onFavorite }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: pet.cor_card || COLORS.card }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Emoji do pet */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{pet.emoji}</Text>
        {/* Botão favorito */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => onFavorite && onFavorite(pet.id)}
        >
          <Ionicons
            name={pet.favorito ? 'heart' : 'heart-outline'}
            size={20}
            color={pet.favorito ? COLORS.primary : COLORS.textLight}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{pet.nome}</Text>
        <Text style={styles.raca} numberOfLines={1}>{pet.raca}</Text>

        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pet.porte}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: pet.sexo === 'Macho' ? '#D1ECF1' : '#F8D7DA' }]}>
            <Ionicons
              name={pet.sexo === 'Macho' ? 'male' : 'female'}
              size={10}
              color={pet.sexo === 'Macho' ? '#0C5460' : '#721C24'}
            />
            <Text style={[styles.badgeText, { color: pet.sexo === 'Macho' ? '#0C5460' : '#721C24', marginLeft: 2 }]}>
              {pet.sexo}
            </Text>
          </View>
        </View>

        {/* Idade e cidade */}
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={11} color={COLORS.textMuted} />
          <Text style={styles.footerText}>{pet.idade}</Text>
        </View>
        <View style={styles.footer}>
          <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
          <Text style={styles.footerText} numberOfLines={1}>{pet.cidade.split(',')[0]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  heartBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  raca: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.xs,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9ECEF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    flex: 1,
  },
});