import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Share,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';
import { CheckBadge, InfoBadge } from '../components/InfoBadge';
import Button from '../components/Button';
import { useFavorites } from './../context/Favorites';


export default function DetailScreen({ route, navigation }) {
  const { pet } = route.params;
  const [interesse, setInteresse] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { toggleFavorite, isFavorite } = useFavorites();

  const favorito = isFavorite(pet.id);

  const handleFavorite = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.4, useNativeDriver: true, friction: 3 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    toggleFavorite(pet);
  };

  const handleAdotar = async () => {
    Alert.alert(
      `Adotar ${pet.nome}? 🐾`,
      `Você está prestes a manifestar interesse em adotar ${pet.nome}.\n\nA ${pet.ong} entrará em contato para dar os próximos passos do processo de adoção!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, quero adotar!',
          onPress: async () => {
            setInteresse(true);
            // Enviar notificação local
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Interesse registrado! 🐾`,
                body: `Seu interesse em adotar ${pet.nome} foi enviado para ${pet.ong}. Aguarde o contato!`,
                sound: true,
              },
              trigger: { seconds: 2 },
            });
            Alert.alert(
              '✅ Interesse registrado!',
              `A ${pet.ong} receberá seu contato e entrará em breve. Verifique suas notificações!`,
              [{ text: 'Ótimo!', style: 'default' }]
            );
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Conheça ${pet.nome}, um ${pet.raca} de ${pet.idade} esperando por um lar! 🐾 Acesse o app PetLar para saber mais.`,
        title: `Adote ${pet.nome}!`,
      });
    } catch (e) { }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero do pet */}
        <LinearGradient
          colors={[pet.cor_card || '#FFE5B4', '#FFFFFF']}
          style={styles.hero}
        >
          {/* Botão voltar */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>

          {/* Botões de ação */}
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleFavorite}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={favorito ? 'heart' : 'heart-outline'}
                  size={22}
                  color={favorito ? COLORS.primary : COLORS.text}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Emoji grande */}
          {
            pet.foto ? (
              <Image
                source={{ uri: pet.foto }}
                style={styles.bigImage}
              />
            ) : (
              <Text style={styles.bigEmoji}>
                {pet.emoji}
              </Text>
            )
          }
          {/* Nome e raça */}
          <View style={styles.heroInfo}>
            <Text style={styles.petNome}>{pet.nome}</Text>
            <Text style={styles.petRaca}>{pet.raca} • {pet.especie}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.primary} />
              <Text style={styles.locationText}>{pet.cidade}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.ongText}>
                {pet.ong || 'PetCare'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Badges de info */}
          <View style={styles.infoGrid}>
            <InfoBadge icon="time-outline" label="Idade" value={pet.idade} color={COLORS.primaryLight} />
            <InfoBadge icon="resize-outline" label="Porte" value={pet.porte} color="#E0F7F5" />
            <InfoBadge icon={pet.sexo === 'Macho' ? 'male' : 'female'} label="Sexo" value={pet.sexo} color="#E8EAF6" />
            <InfoBadge icon="calendar-outline" label="Entrada" value={
              pet.dataEntrada
                ? pet.dataEntrada.split('-')[0]
                : 'Hoje'
            } color="#E8F5E9" />
          </View>

          {/* Saúde */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saúde 🩺</Text>
            <View style={styles.healthRow}>
              <CheckBadge label="Vacinado" checked={pet.vacinado} />
              <CheckBadge label="Castrado" checked={pet.castrado} />
              <CheckBadge label="Vermifugado" checked={pet.vermifugado} />
            </View>
          </View>

          {/* Sobre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre {pet.nome} 💬</Text>
            <Text style={styles.descricao}>
              {pet.descricao || 'Sem descrição.'}
            </Text>
          </View>

          {/* História */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>História 📖</Text>
            <View style={styles.historiaCard}>
              <Ionicons name="heart" size={20} color={COLORS.primary} />
              <Text style={styles.historia}>
                {pet.historia || 'História não informada.'}
              </Text>
            </View>
          </View>

          {/* Cor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características 🎨</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🎨 {pet.cor}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>📏 Porte {pet.porte}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🏠 {pet.ong}</Text>
              </View>
            </View>
          </View>

          {/* ONG */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ONG responsável 🏢</Text>
            <View style={styles.ongCard}>
              <View style={styles.ongIcon}>
                <Ionicons name="business" size={24} color={COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ongNome}>{pet.ong}</Text>
                <Text style={styles.ongCidade}>{pet.cidade}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Localização', { ongNome: pet.ong })}
                  style={styles.ongMapBtn}
                >
                  <Ionicons name="map-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.ongMapText}>Ver no mapa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Status adoção */}
          {interesse && (
            <View style={styles.interesseBox}>
              <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
              <Text style={styles.interesseText}>
                Você demonstrou interesse em adotar {pet.nome}! A ONG entrará em contato em breve. 💚
              </Text>
            </View>
          )}

          {/* Botões de ação */}
          <View style={styles.bottomBtns}>
            <Button
              title={interesse ? '✅ Interesse enviado' : `Quero adotar ${pet.nome}!`}
              onPress={() => navigation.navigate('AdoptionForm', { pet })}
              fullWidth
              icon={interesse ? 'checkmark-circle' : 'paw'}
            />
            <Button
              title="Ver ONGs no mapa"
              onPress={() => navigation.navigate('Localização')}
              variant="outline"
              fullWidth
              icon="location-outline"
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero: {
    paddingTop: 56,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtns: {
    position: 'absolute',
    top: 56,
    right: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bigEmoji: { fontSize: 100, marginVertical: SPACING.sm },
  heroInfo: { alignItems: 'center' },
  petNome: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.text },
  petRaca: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginBottom: SPACING.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' },
  locationText: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600' },
  dot: { color: COLORS.textMuted },
  ongText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },


  bigImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginVertical: SPACING.md,
    borderWidth: 4,
    borderColor: COLORS.white,
  },

  // Content
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  infoGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg, marginTop: -SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },

  // Saúde
  healthRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },

  // Descrição
  descricao: { fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 24, letterSpacing: 0.2 },

  // História
  historiaCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  historia: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 23 },

  // Tags
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  tagText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },

  // ONG Card
  ongCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ongIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongNome: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  ongCidade: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },
  ongMapBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ongMapText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },

  // Interesse
  interesseBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  interesseText: { flex: 1, fontSize: FONTS.sizes.sm, color: '#2E7D32', fontWeight: '600', lineHeight: 20 },

  // Botões
  bottomBtns: { marginTop: SPACING.md },
});