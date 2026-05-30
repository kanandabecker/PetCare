import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

export default function CameraScreen({ navigation }) {
  const [foto, setFoto] = useState(null);
  const [modo, setModo] = useState(null); // 'camera' | 'galeria'
  const [info, setInfo] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const mostrarFoto = (uri, source) => {
    setFoto(uri);
    setModo(source);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Habilite o acesso à câmera nas configurações do app.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      mostrarFoto(asset.uri, 'camera');
      setInfo({
        largura: asset.width,
        altura: asset.height,
        tamanho: asset.fileSize ? `${(asset.fileSize / 1024).toFixed(0)} KB` : 'N/A',
        tipo: asset.type || 'image',
        fonte: 'Câmera',
      });
    }
  };

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Habilite o acesso à galeria nas configurações do app.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      mostrarFoto(asset.uri, 'galeria');
      setInfo({
        largura: asset.width,
        altura: asset.height,
        tamanho: asset.fileSize ? `${(asset.fileSize / 1024).toFixed(0)} KB` : 'N/A',
        tipo: asset.type || 'image',
        fonte: 'Galeria',
      });
    }
  };

  const limpar = () => {
    setFoto(null);
    setModo(null);
    setInfo(null);
    fadeAnim.setValue(0);
  };

  const salvar = () => {
    if (!foto) {
      Alert.alert('Erro', 'Tire uma foto primeiro.');
      return;
    }

    navigation.navigate('PetRecords', {
      pet: { foto },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registrar pet 📷</Text>
        <Text style={styles.headerSub}>
          Fotografe um pet encontrado ou escolha da galeria
        </Text>
      </View>

      {!foto ? (
        /* Opções de captura */
        <View style={styles.optionsContainer}>
          {/* Dicas */}
          <View style={styles.dicasBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.secondary} />
            <Text style={styles.dicasText}>
              Registre pets encontrados abandonados ou fotos para o processo de adoção. As fotos ajudam as ONGs a identificar e cuidar dos animais.
            </Text>
          </View>

          {/* Botões de captura */}
          <TouchableOpacity style={styles.optionCard} onPress={abrirCamera} activeOpacity={0.88}>
            <LinearGradient
              colors={[COLORS.primary, '#FF8E8E']}
              style={styles.optionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="camera" size={52} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.optionTitle}>Tirar foto</Text>
            <Text style={styles.optionSub}>Abrir câmera do dispositivo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={abrirGaleria} activeOpacity={0.88}>
            <LinearGradient
              colors={[COLORS.secondary, '#38B2A8']}
              style={styles.optionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="images" size={52} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.optionTitle}>Escolher da galeria</Text>
            <Text style={styles.optionSub}>Selecionar foto já existente</Text>
          </TouchableOpacity>

          {/* Exemplos de uso */}
          <View style={styles.usosBox}>
            <Text style={styles.usosTitle}>Como usar esta função:</Text>
            {[
              { icon: 'paw', text: 'Fotografar pet encontrado perdido' },
              { icon: 'heart', text: 'Registrar pet resgatado para adoção' },
              { icon: 'person', text: 'Documentar visita a ONG' },
              { icon: 'trophy', text: 'Compartilhar adoção bem-sucedida' },
            ].map((u, i) => (
              <View key={i} style={styles.usoItem}>
                <View style={styles.usoIcon}>
                  <Ionicons name={u.icon} size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.usoText}>{u.text}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        /* Preview da foto */
        <Animated.View style={[styles.previewContainer, { opacity: fadeAnim }]}>
          {/* Badge de fonte */}
          <View style={styles.fonteBadge}>
            <Ionicons
              name={modo === 'camera' ? 'camera' : 'images'}
              size={14}
              color={COLORS.white}
            />
            <Text style={styles.fonteText}>
              {modo === 'camera' ? 'Foto tirada agora' : 'Da galeria'}
            </Text>
          </View>

          {/* Imagem */}
          <Image source={{ uri: foto }} style={styles.previewImage} resizeMode="cover" />

          {/* Info técnica */}
          {info && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>📊 Informações da imagem</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Largura</Text>
                  <Text style={styles.infoValue}>{info.largura}px</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Altura</Text>
                  <Text style={styles.infoValue}>{info.altura}px</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tamanho</Text>
                  <Text style={styles.infoValue}>{info.tamanho}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fonte</Text>
                  <Text style={styles.infoValue}>{info.fonte}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Legenda */}
          <View style={styles.legendaBox}>
            <Ionicons name="create-outline" size={18} color={COLORS.textLight} />
            <Text style={styles.legendaText}>
              Esta foto será usada para registrar o pet no sistema.
            </Text>
          </View>

          {/* Ações */}
          <View style={styles.acoes}>
            <TouchableOpacity style={styles.btnLimpar} onPress={limpar}>
              <Ionicons name="trash-outline" size={18} color={COLORS.textLight} />
              <Text style={styles.btnLimparText}>Descartar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
              <Ionicons name="save-outline" size={18} color={COLORS.white} />
              <Text style={styles.btnSalvarText}>Salvar registro</Text>
            </TouchableOpacity>
          </View>

          {/* Tirar nova foto */}
          <View style={styles.novaFotoRow}>
            <TouchableOpacity style={styles.novaFotoBtn} onPress={abrirCamera}>
              <Ionicons name="camera" size={16} color={COLORS.primary} />
              <Text style={styles.novaFotoText}>Nova foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.novaFotoBtn} onPress={abrirGaleria}>
              <Ionicons name="images" size={16} color={COLORS.primary} />
              <Text style={styles.novaFotoText}>Outra da galeria</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

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

  // Options
  optionsContainer: { padding: SPACING.md, gap: SPACING.md },
  dicasBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: '#E0F7F5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  dicasText: { flex: 1, fontSize: FONTS.sizes.sm, color: '#004D40', lineHeight: 20 },

  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: SPACING.sm,
  },
  optionGradient: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  optionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  optionSub: { fontSize: FONTS.sizes.sm, color: COLORS.textLight },

  usosBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  usosTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  usoItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  usoIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usoText: { fontSize: FONTS.sizes.sm, color: COLORS.text },

  // Preview
  previewContainer: { padding: SPACING.md, gap: SPACING.md },
  fonteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  fonteText: { fontSize: FONTS.sizes.sm, color: COLORS.white, fontWeight: '700' },

  previewImage: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.lg,
    backgroundColor: '#EEE',
  },

  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  infoTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  infoItem: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  infoValue: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },

  legendaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#F5F5F5',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  legendaText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textLight },

  acoes: { flexDirection: 'row', gap: SPACING.sm },
  btnLimpar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
  },
  btnLimparText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textLight },
  btnSalvar: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
  },
  btnSalvarText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.white },

  novaFotoRow: { flexDirection: 'row', gap: SPACING.sm },
  novaFotoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
  },
  novaFotoText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary },
});