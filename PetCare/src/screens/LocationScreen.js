import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';
import { ONGS } from '../data/pets';

// Calcula distância simples (Haversine simplificado em km)
function calcDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

export default function LocationScreen({ route }) {
  const ongFiltro = route?.params?.ongNome || null;

  const [localizacao, setLocalizacao] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarLocalizacao = async () => {
    setLoading(true);
    setErro(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão de localização negada. Habilite nas configurações do dispositivo.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocalizacao(loc.coords);

      // Geocoding reverso
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode.length > 0) {
        const g = geocode[0];
        setEndereco(`${g.street || ''}, ${g.district || ''}, ${g.city || ''} - ${g.region || ''}`);
      }
    } catch (e) {
      setErro('Não foi possível obter sua localização. Verifique se o GPS está ativo.');
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarLocalizacao();
  }, []);

  const ongsComDistancia = ONGS.map(ong => ({
    ...ong,
    distancia: localizacao
      ? calcDistancia(localizacao.latitude, localizacao.longitude, ong.latitude, ong.longitude)
      : null,
  })).sort((a, b) =>
    a.distancia && b.distancia ? parseFloat(a.distancia) - parseFloat(b.distancia) : 0
  );

  const openMaps = (ong) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${ong.latitude},${ong.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o Maps.')
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ONGs próximas 📍</Text>
        <Text style={styles.headerSub}>Encontre abrigos e ONGs perto de você</Text>
      </View>

      {/* Minha localização */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="navigate" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Minha localização</Text>
            {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
            {erro && <Text style={styles.erroText}>{erro}</Text>}
            {localizacao && !loading && (
              <View>
                <Text style={styles.coordText}>
                  📍 Lat: {localizacao.latitude.toFixed(5)} | Lon: {localizacao.longitude.toFixed(5)}
                </Text>
                {endereco && (
                  <Text style={styles.enderecoText} numberOfLines={2}>{endereco.trim()}</Text>
                )}
                <Text style={styles.precisaoText}>
                  Precisão: ±{localizacao.accuracy ? localizacao.accuracy.toFixed(0) : '?'} metros
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.reloadBtn} onPress={buscarLocalizacao} disabled={loading}>
          <Ionicons name="refresh" size={16} color={COLORS.primary} />
          <Text style={styles.reloadText}>Atualizar localização</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa visual simples */}
      {localizacao && (
        <View style={styles.mapaBox}>
          <Text style={styles.mapaTitle}>🗺️ Sua posição</Text>
          <View style={styles.mapaVisual}>
            {/* Grid simulando mapa */}
            {Array.from({ length: 5 }).map((_, row) => (
              <View key={row} style={styles.mapaRow}>
                {Array.from({ length: 7 }).map((_, col) => (
                  <View
                    key={col}
                    style={[
                      styles.mapaCell,
                      row === 2 && col === 3 && styles.mapaCellCenter,
                    ]}
                  >
                    {row === 2 && col === 3 ? (
                      <Text style={{ fontSize: 20 }}>📍</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
            {/* ONGs no grid */}
            <View style={styles.mapaPins}>
              {ongsComDistancia.slice(0, 3).map((ong, i) => (
                <View key={ong.id} style={[styles.mapaPin, { left: 20 + i * 80, top: 10 + i * 20 }]}>
                  <Text style={{ fontSize: 14 }}>🏥</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.mapaDica}>
            * Mapa ilustrativo. Toque em "Abrir no Maps" para navegar.
          </Text>
        </View>
      )}

      {/* Lista de ONGs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ONGs parceiras ({ONGS.length})</Text>
        {ongsComDistancia.map(ong => (
          <View
            key={ong.id}
            style={[
              styles.ongCard,
              ongFiltro === ong.nome && styles.ongCardDestaque,
            ]}
          >
            <View style={styles.ongTop}>
              <View style={styles.ongIconBox}>
                <Ionicons name="business" size={22} color={COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.ongNomeRow}>
                  <Text style={styles.ongNome}>{ong.nome}</Text>
                  {ongFiltro === ong.nome && (
                    <View style={styles.ongDestaqueBadge}>
                      <Text style={styles.ongDestaqueBadgeText}>Este pet</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.ongCidade}>{ong.cidade}</Text>
                {ong.distancia && (
                  <View style={styles.distRow}>
                    <Ionicons name="walk-outline" size={13} color={COLORS.secondary} />
                    <Text style={styles.distText}>{ong.distancia} km de distância</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.ongDesc}>{ong.descricao}</Text>

            <View style={styles.ongContatos}>
              <View style={styles.contatoItem}>
                <Ionicons name="call-outline" size={14} color={COLORS.primary} />
                <Text style={styles.contatoText}>{ong.telefone}</Text>
              </View>
              <View style={styles.contatoItem}>
                <Ionicons name="mail-outline" size={14} color={COLORS.primary} />
                <Text style={styles.contatoText}>{ong.email}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.mapsBtn} onPress={() => openMaps(ong)}>
              <Ionicons name="map" size={16} color={COLORS.white} />
              <Text style={styles.mapsBtnText}>Abrir no Google Maps</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.text },
  headerSub: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },

  // Card localização
  card: {
    margin: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-start', marginBottom: SPACING.sm },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  erroText: { fontSize: FONTS.sizes.sm, color: COLORS.danger, lineHeight: 18 },
  coordText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, fontFamily: 'monospace', marginBottom: 2 },
  enderecoText: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600', marginBottom: 2 },
  precisaoText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xs,
  },
  reloadText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },

  // Mapa visual
  mapaBox: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  mapaTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  mapaVisual: {
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.md,
    padding: 4,
    position: 'relative',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapaRow: { flexDirection: 'row' },
  mapaCell: {
    width: 42,
    height: 22,
    borderWidth: 0.5,
    borderColor: '#C8E6C9',
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapaCellCenter: { backgroundColor: '#FF6B6B22' },
  mapaPins: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapaPin: { position: 'absolute' },
  mapaDica: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },

  // ONGs
  section: { paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },

  ongCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ongCardDestaque: { borderColor: COLORS.primary },
  ongTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.sm },
  ongIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongNomeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, flexWrap: 'wrap' },
  ongNome: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  ongDestaqueBadge: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2 },
  ongDestaqueBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '700' },
  ongCidade: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  distText: { fontSize: FONTS.sizes.sm, color: COLORS.secondary, fontWeight: '700' },
  ongDesc: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20, marginBottom: SPACING.sm },
  ongContatos: { gap: 5, marginBottom: SPACING.sm },
  contatoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contatoText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
  },
  mapsBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.white },
});