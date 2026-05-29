import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';
import { PETS } from '../data/pets';
import PetCard from '../components/PetCard';
import { useFavorites } from '../context/Favorites';

const { width } = Dimensions.get('window');

const FILTROS_ESPECIE = [
  { label: 'Todos', value: null },
  { label: 'Cachorros', value: 'Cachorro' },
  { label: 'Gatos', value: 'Gato' },
];

const FILTROS_PORTE = [
  { label: 'Qualquer porte', value: null },
  { label: 'Pequeno', value: 'Pequeno' },
  { label: 'Médio', value: 'Médio' },
  { label: 'Grande', value: 'Grande' },
];

export default function ListScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState(null);
  const [filtroPorte, setFiltroPorte] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const petsFiltrados = PETS.filter(pet => {
    const termoBusca = busca.toLowerCase();
    const matchBusca =
      !busca ||
      pet.nome.toLowerCase().includes(termoBusca) ||
      pet.raca.toLowerCase().includes(termoBusca) ||
      pet.cidade.toLowerCase().includes(termoBusca) ||
      pet.especie.toLowerCase().includes(termoBusca);

    const matchEspecie = !filtroEspecie || pet.especie === filtroEspecie;
    const matchPorte = !filtroPorte || pet.porte === filtroPorte;

    return matchBusca && matchEspecie && matchPorte;
  });

  const handleFavorite = (pet) => {
    toggleFavorite(pet);
  };

  const petComFavorito = (pet) => ({
    ...pet,
    favorito: isFavorite(pet.id),
  });

  const limparFiltros = () => {
    setBusca('');
    setFiltroEspecie(null);
    setFiltroPorte(null);
  };

  const temFiltroAtivo = busca || filtroEspecie || filtroPorte;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header fixo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Pets para adoção 🐾</Text>
            <Text style={styles.headerSub}>
              {petsFiltrados.length} de {PETS.length} pets disponíveis
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.filtroBtn, mostrarFiltros && styles.filtroBtnAtivo]}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={mostrarFiltros ? COLORS.white : COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, raça, cidade..."
            placeholderTextColor={COLORS.textMuted}
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de espécie rápidos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.especieRow}>
          {FILTROS_ESPECIE.map((f) => (
            <TouchableOpacity
              key={f.label}
              style={[
                styles.especieBtn,
                filtroEspecie === f.value && styles.especieBtnAtivo,
              ]}
              onPress={() => setFiltroEspecie(f.value)}
            >
              <Text
                style={[
                  styles.especieBtnText,
                  filtroEspecie === f.value && styles.especieBtnTextAtivo,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Painel de filtros expandido */}
        {mostrarFiltros && (
          <View style={styles.filtrosPanel}>
            <Text style={styles.filtrosTitulo}>Filtrar por porte</Text>
            <View style={styles.filtrosPorteRow}>
              {FILTROS_PORTE.map((f) => (
                <TouchableOpacity
                  key={f.label}
                  style={[
                    styles.porteBtn,
                    filtroPorte === f.value && styles.porteBtnAtivo,
                  ]}
                  onPress={() => setFiltroPorte(f.value)}
                >
                  <Text
                    style={[
                      styles.porteBtnText,
                      filtroPorte === f.value && styles.porteBtnTextAtivo,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Lista de pets */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* Badge de filtro ativo */}
        {temFiltroAtivo && (
          <TouchableOpacity style={styles.limparFiltros} onPress={limparFiltros}>
            <Ionicons name="close-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.limparFiltrosText}>Limpar filtros</Text>
          </TouchableOpacity>
        )}

        {petsFiltrados.length === 0 ? (
          <Animated.View style={[styles.empty, { opacity: fadeAnim }]}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Nenhum pet encontrado</Text>
            <Text style={styles.emptySub}>
              Tente buscar por outro nome, raça ou cidade
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={limparFiltros}>
              <Text style={styles.emptyBtnText}>Ver todos os pets</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
            {petsFiltrados.map((pet) => (
              <PetCard
                key={pet.id}
                pet={petComFavorito(pet)}
                onPress={() => navigation.navigate('Detalhes', { pet: petComFavorito(pet) })}
                onFavorite={() => handleFavorite(pet)}
              />
            ))}
          </Animated.View>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 52,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  filtroBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  filtroBtnAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    padding: 0,
  },

  // Filtros espécie
  especieRow: {
    marginHorizontal: -SPACING.md,
    paddingLeft: SPACING.md,
    marginBottom: SPACING.xs,
  },
  especieBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  especieBtnAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  especieBtnText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  especieBtnTextAtivo: {
    color: COLORS.white,
  },

  // Painel filtros
  filtrosPanel: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  filtrosTitulo: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  filtrosPorteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  porteBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  porteBtnAtivo: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  porteBtnText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  porteBtnTextAtivo: {
    color: COLORS.white,
  },

  // Limpar filtros
  limparFiltros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  limparFiltrosText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Lista
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    marginTop: SPACING.sm,
  },
  emptyBtnText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});