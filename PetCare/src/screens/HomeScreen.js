import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';
import { PETS } from '../data/pets';
import { useFavorites } from '../context/Favorites';

const { width } = Dimensions.get('window');

const STATS = [
  { icon: 'paw', label: 'Pets disponíveis', value: PETS.length, color: '#FFE0E0' },
  { icon: 'home-outline', label: 'Adotados este mês', value: 23, color: '#E0F7F5' },
  { icon: 'business-outline', label: 'ONGs parceiras', value: 3, color: '#FFF9E0' },
];

const CATEGORIAS = [
  { label: 'Todos', icon: '🐾', filter: null },
  { label: 'Cachorros', icon: '🐶', filter: 'Cachorro' },
  { label: 'Gatos', icon: '🐱', filter: 'Gato' },
  { label: 'Pequenos', icon: '🐩', filter: 'Pequeno', campo: 'porte' },
  { label: 'Grandes', icon: '🐕', filter: 'Grande', campo: 'porte' },
];

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);

  const { isFavorite } = useFavorites();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const petsFiltrados = PETS.filter(p => {
    const cat = CATEGORIAS[categoriaSelecionada];
    if (!cat.filter) return true;
    if (cat.campo === 'porte') return p.porte === cat.filter;
    return p.especie === cat.filter;
  }).slice(0, 6);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Hero */}
      <LinearGradient
        colors={[COLORS.primary, '#FF8E8E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>Olá, adotante! 👋</Text>
              <Text style={styles.heroTitle}>Encontre seu{'\n'}melhor amigo 🐾</Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroSub}>
            {PETS.length} pets esperando por um lar com amor
          </Text>

          {/* Busca rápida — navega para a tela de lista */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Lista')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>Buscar pets por nome, raça...</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <Animated.View
            key={i}
            style={[styles.statCard, { backgroundColor: s.color, opacity: fadeAnim }]}
          >
            <Ionicons name={s.icon} size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Categorias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIAS.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.catBtn, categoriaSelecionada === i && styles.catBtnActive]}
              onPress={() => setCategoriaSelecionada(i)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[
                styles.catLabel,
                categoriaSelecionada === i && styles.catLabelActive,
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pets em destaque */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Em destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Lista')}>
            <Text style={styles.verTodos}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {petsFiltrados.map(pet => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.featuredCard, { backgroundColor: pet.cor_card }]}
              onPress={() => navigation.navigate('Detalhes', { pet })}
              activeOpacity={0.88}
            >
              <Text style={styles.featuredEmoji}>{pet.emoji}</Text>
              <Text style={styles.featuredNome}>{pet.nome}</Text>
              <Text style={styles.featuredRaca}>{pet.raca}</Text>
              <View style={styles.featuredFooter}>
                <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.featuredCidade}>{pet.cidade.split(',')[0]}</Text>
              </View>
              {isFavorite(pet.id) && (
                <View style={styles.favBadge}>
                  <Ionicons name="heart" size={12} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Banner de adoção responsável */}
      <View style={styles.section}>
        <LinearGradient
          colors={[COLORS.secondary, '#38B2A8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Adote com responsabilidade 💙</Text>
            <Text style={styles.bannerSub}>
              Adotar é um compromisso para a vida toda. Saiba como se preparar.
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Text style={styles.bannerBtnText}>Saiba mais</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 60 }}>🏡</Text>
        </LinearGradient>
      </View>

      {/* Ferramentas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ferramentas</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Localização')}
          >
            <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.toolIcon}>
              <Ionicons name="location" size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.toolLabel}>ONGs próximas</Text>
            <Text style={styles.toolSub}>Ver no mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Camera')}
          >
            <LinearGradient colors={['#4ECDC4', '#38B2A8']} style={styles.toolIcon}>
              <Ionicons name="camera" size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.toolLabel}>Registrar pet</Text>
            <Text style={styles.toolSub}>Câmera / Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Sensores')}
          >
            <LinearGradient colors={['#FFE66D', '#FFC107']} style={styles.toolIcon}>
              <Ionicons name="phone-portrait" size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.toolLabel}>Sensor pet</Text>
            <Text style={styles.toolSub}>Acelerômetro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Perfil')}
          >
            <LinearGradient colors={['#A29BFE', '#6C63FF']} style={styles.toolIcon}>
              <Ionicons name="person" size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.toolLabel}>Meu perfil</Text>
            <Text style={styles.toolSub}>Favoritos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  hero: {
    paddingTop: 56,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  greeting: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  heroTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.white, lineHeight: 36 },
  heroSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.md },
  notifBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  searchPlaceholder: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 9, color: COLORS.textLight, textAlign: 'center' },

  section: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  verTodos: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },

  categoriesRow: { marginHorizontal: -SPACING.md, paddingLeft: SPACING.md },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  catBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catIcon: { fontSize: 16 },
  catLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  catLabelActive: { color: COLORS.white },

  featuredCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    width: 140,
    alignItems: 'center',
    position: 'relative',
  },
  featuredEmoji: { fontSize: 48, marginBottom: SPACING.xs },
  featuredNome: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  featuredRaca: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginBottom: SPACING.xs },
  featuredFooter: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featuredCidade: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  favBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 4,
  },

  banner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  bannerSub: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: SPACING.sm,
  },
  bannerBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.secondary },

  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  toolCard: {
    width: (width - SPACING.md * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolLabel: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  toolSub: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
});