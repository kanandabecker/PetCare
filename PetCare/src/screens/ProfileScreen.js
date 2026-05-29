import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';
import { PETS } from '../data/pets';

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DICAS_ADOCAO = [
  'Pesquise sobre a raça antes de adotar',
  'Certifique-se que sua casa aceita pets',
  'Consulte todos da família antes de decidir',
  'Reserve um orçamento para veterinário',
  'Prepare o espaço com cama, tigelas e brinquedos',
  'Leve ao veterinário na primeira semana',
];

export default function ProfileScreen({ navigation }) {
  const [notifAtivas, setNotifAtivas] = useState(true);
  const [notifNovos, setNotifNovos] = useState(true);
  const [notifDicas, setNotifDicas] = useState(false);
  const [permissaoNotif, setPermissaoNotif] = useState(false);

  const petsFavoritos = PETS.filter(p => p.favorito);
  const totalFavoritos = petsFavoritos.length;

  useEffect(() => {
    verificarPermissaoNotif();
  }, []);

  const verificarPermissaoNotif = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissaoNotif(status === 'granted');
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      setPermissaoNotif(newStatus === 'granted');
    }
  };

  const enviarNotificacaoTeste = async () => {
    if (!permissaoNotif) {
      Alert.alert('Permissão necessária', 'Habilite as notificações nas configurações.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🐾 PetLar — Novo pet disponível!',
        body: 'Um Labrador filhote está esperando por um lar. Clique para ver!',
        sound: true,
        data: { tipo: 'novo_pet' },
      },
      trigger: { seconds: 1 },
    });
    Alert.alert('✅ Notificação enviada!', 'Você receberá a notificação em 1 segundo.');
  };

  const enviarNotificacaoDica = async () => {
    const dica = DICAS_ADOCAO[Math.floor(Math.random() * DICAS_ADOCAO.length)];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💡 Dica de adoção responsável',
        body: dica,
        sound: false,
      },
      trigger: { seconds: 2 },
    });
    Alert.alert('💡 Dica enviada!', `"${dica}"`);
  };

  const limparFavoritos = () => {
    Alert.alert(
      'Limpar favoritos?',
      'Todos os pets favoritados serão removidos da lista.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => Alert.alert('Favoritos limpos!') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header perfil */}
      <LinearGradient
        colors={[COLORS.primary, '#FF8E8E']}
        style={styles.profileHeader}
      >
        <View style={styles.avatarCircle}>
          <Text style={{ fontSize: 48 }}>🧑‍💻</Text>
        </View>
        <Text style={styles.userName}>Futuro adotante</Text>
        <Text style={styles.userEmail}>usuario@petlar.com.br</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{PETS.length}</Text>
            <Text style={styles.statLab}>Pets vistos</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{totalFavoritos}</Text>
            <Text style={styles.statLab}>Favoritos</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLab}>Adotados</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Favoritos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>❤️ Meus favoritos</Text>
          {totalFavoritos > 0 && (
            <TouchableOpacity onPress={limparFavoritos}>
              <Text style={styles.limparBtn}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        {totalFavoritos === 0 ? (
          <View style={styles.emptyFav}>
            <Text style={{ fontSize: 40 }}>🤍</Text>
            <Text style={styles.emptyFavText}>
              Nenhum pet favoritado ainda. Na lista de pets, toque no ❤️ para salvar seus favoritos!
            </Text>
            <TouchableOpacity
              style={styles.verPetsBtn}
              onPress={() => navigation.navigate('Lista')}
            >
              <Text style={styles.verPetsBtnText}>Ver pets disponíveis</Text>
            </TouchableOpacity>
          </View>
        ) : (
          petsFavoritos.map(pet => (
            <TouchableOpacity
              key={pet.id}
              style={styles.favCard}
              onPress={() => navigation.navigate('Detalhes', { pet })}
            >
              <Text style={{ fontSize: 36 }}>{pet.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.favNome}>{pet.nome}</Text>
                <Text style={styles.favRaca}>{pet.raca} • {pet.porte}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notificações</Text>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Ativar notificações</Text>
              <Text style={styles.switchSub}>
                {permissaoNotif ? '✅ Permissão concedida' : '⚠️ Permissão não concedida'}
              </Text>
            </View>
            <Switch
              value={notifAtivas}
              onValueChange={setNotifAtivas}
              trackColor={{ false: '#CCC', true: COLORS.primaryLight }}
              thumbColor={notifAtivas ? COLORS.primary : '#FFF'}
            />
          </View>

          <View style={[styles.switchRow, { opacity: notifAtivas ? 1 : 0.4 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Novos pets disponíveis</Text>
              <Text style={styles.switchSub}>Avise quando houver novos pets</Text>
            </View>
            <Switch
              value={notifNovos}
              onValueChange={setNotifNovos}
              disabled={!notifAtivas}
              trackColor={{ false: '#CCC', true: COLORS.primaryLight }}
              thumbColor={notifNovos ? COLORS.primary : '#FFF'}
            />
          </View>

          <View style={[styles.switchRow, { opacity: notifAtivas ? 1 : 0.4 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Dicas de adoção</Text>
              <Text style={styles.switchSub}>Receba dicas semanais</Text>
            </View>
            <Switch
              value={notifDicas}
              onValueChange={setNotifDicas}
              disabled={!notifAtivas}
              trackColor={{ false: '#CCC', true: COLORS.primaryLight }}
              thumbColor={notifDicas ? COLORS.primary : '#FFF'}
            />
          </View>
        </View>

        {/* Testes de notificação */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Testar notificações</Text>
          <TouchableOpacity style={styles.notifTestBtn} onPress={enviarNotificacaoTeste}>
            <Ionicons name="notifications" size={18} color={COLORS.primary} />
            <Text style={styles.notifTestText}>Enviar notificação de novo pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifTestBtn} onPress={enviarNotificacaoDica}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.secondary} />
            <Text style={[styles.notifTestText, { color: COLORS.secondary }]}>Enviar dica de adoção</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sobre a adoção responsável */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Adoção responsável</Text>
        <View style={styles.card}>
          <Text style={styles.adocaoIntro}>
            Adotar um animal é um compromisso de longo prazo. Aqui estão pontos essenciais:
          </Text>
          {DICAS_ADOCAO.map((dica, i) => (
            <View key={i} style={styles.dicaItem}>
              <View style={styles.dicaNum}>
                <Text style={styles.dicaNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.dicaText}>{dica}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sobre o app */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Sobre o PetLar</Text>
        <View style={[styles.card, { alignItems: 'center', gap: SPACING.sm }]}>
          <Text style={{ fontSize: 48 }}>🐾</Text>
          <Text style={styles.appNome}>PetLar</Text>
          <Text style={styles.appVersao}>Versão 1.0.0</Text>
          <Text style={styles.appDesc}>
            Conectando pets que precisam de lar a famílias cheias de amor. Desenvolvido como projeto acadêmico de React Native + Expo.
          </Text>
          <View style={styles.techRow}>
            {['React Native', 'Expo', 'GPS', 'Câmera', 'Acelerômetro', 'Notificações'].map(t => (
              <View key={t} style={styles.techBadge}>
                <Text style={styles.techText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Profile header
  profileHeader: {
    paddingTop: 48,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.white },
  userEmail: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.md },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.white },
  statLab: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.8)' },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },

  // Sections
  section: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  limparBtn: { fontSize: FONTS.sizes.sm, color: COLORS.danger, fontWeight: '700' },

  // Favoritos
  emptyFav: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyFavText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
  verPetsBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    marginTop: SPACING.sm,
  },
  verPetsBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary },

  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favNome: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  favRaca: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: SPACING.sm,
  },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },

  // Switches
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  switchLabel: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  switchSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  // Notif test
  notifTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
  },
  notifTestText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary },

  // Adoção responsável
  adocaoIntro: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20, marginBottom: SPACING.sm },
  dicaItem: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.xs },
  dicaNum: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dicaNumText: { fontSize: FONTS.sizes.xs, fontWeight: '900', color: COLORS.primary },
  dicaText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20 },

  // App info
  appNome: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.text },
  appVersao: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  appDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: SPACING.sm },
  techBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
  },
  techText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '700' },
});