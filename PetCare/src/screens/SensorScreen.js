import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Vibration,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

const THRESHOLD_SHAKE = 1.8;       // Limiar para detectar agitação
const THRESHOLD_PASSOS = 1.3;      // Limiar para contar "passos"

export default function SensorScreen() {
  const [dados, setDados] = useState({ x: 0, y: 0, z: 0 });
  const [ativo, setAtivo] = useState(false);
  const [passos, setPassos] = useState(0);
  const [shakes, setShakes] = useState(0);
  const [intensidade, setIntensidade] = useState(0);
  const [historico, setHistorico] = useState([]);

  const subscription = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const ultimoShake = useRef(0);
  const ultimoPasso = useRef(0);

  const pulsar = () => {
    Animated.sequence([
      Animated.spring(pulseAnim, { toValue: 1.3, useNativeDriver: true, speed: 20 }),
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
  };

  const animarShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const iniciar = () => {
    setAtivo(true);
    setPassos(0);
    setShakes(0);
    setHistorico([]);

    Accelerometer.setUpdateInterval(100); // 10 leituras/segundo

    subscription.current = Accelerometer.addListener(({ x, y, z }) => {
      setDados({ x, y, z });

      const mag = Math.sqrt(x * x + y * y + z * z);
      setIntensidade(mag);

      const agora = Date.now();

      // Detectar SHAKE
      if (mag > THRESHOLD_SHAKE && agora - ultimoShake.current > 800) {
        ultimoShake.current = agora;
        setShakes(s => s + 1);
        animarShake();
        Vibration.vibrate(80);
        pulsar();
        setHistorico(h => [
          { tipo: '🌀 Agitação', ts: new Date().toLocaleTimeString(), mag: mag.toFixed(2) },
          ...h.slice(0, 9),
        ]);
      }

      // Detectar PASSOS (movimento moderado)
      if (mag > THRESHOLD_PASSOS && mag <= THRESHOLD_SHAKE && agora - ultimoPasso.current > 400) {
        ultimoPasso.current = agora;
        setPassos(p => p + 1);
      }
    });
  };

  const parar = () => {
    setAtivo(false);
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (subscription.current) subscription.current.remove();
    };
  }, []);

  const getCorIntensidade = () => {
    if (intensidade < 1) return '#6BCB77';
    if (intensidade < 1.5) return '#FFB347';
    return COLORS.primary;
  };

  const getLabelIntensidade = () => {
    if (intensidade < 1) return 'Parado 😴';
    if (intensidade < 1.3) return 'Leve movimento 🐾';
    if (intensidade < 1.8) return 'Caminhando 🚶';
    return 'Agitado! 🌀';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sensor de atividade 📱</Text>
        <Text style={styles.headerSub}>
          Acelerômetro detecta movimento e agitação — simule o monitor de atividade do pet!
        </Text>
      </View>

      <View style={styles.content}>
        {/* Indicador visual central */}
        <View style={styles.sensorBox}>
          <Animated.View
            style={[
              styles.petEmoji,
              {
                transform: [
                  { scale: pulseAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            <Text style={{ fontSize: 80 }}>{intensidade > THRESHOLD_SHAKE ? '🌀' : '🐕'}</Text>
          </Animated.View>

          {ativo && (
            <View style={[styles.statusBadge, { backgroundColor: getCorIntensidade() }]}>
              <Text style={styles.statusText}>{getLabelIntensidade()}</Text>
            </View>
          )}

          {!ativo && (
            <Text style={styles.inativoDica}>
              Toque em "Iniciar" e mexa o dispositivo!
            </Text>
          )}
        </View>

        {/* Botão iniciar/parar */}
        <TouchableOpacity
          style={[styles.mainBtn, ativo ? styles.mainBtnStop : styles.mainBtnStart]}
          onPress={ativo ? parar : iniciar}
        >
          <Ionicons name={ativo ? 'stop-circle' : 'play-circle'} size={24} color={COLORS.white} />
          <Text style={styles.mainBtnText}>{ativo ? 'Parar sensor' : 'Iniciar sensor'}</Text>
        </TouchableOpacity>

        {/* Dados brutos do acelerômetro */}
        {ativo && (
          <View style={styles.rawDataBox}>
            <Text style={styles.rawTitle}>📡 Dados do acelerômetro</Text>
            <View style={styles.axesRow}>
              {[
                { eixo: 'X', valor: dados.x, cor: '#FF6B6B' },
                { eixo: 'Y', valor: dados.y, cor: '#4ECDC4' },
                { eixo: 'Z', valor: dados.z, cor: '#FFE66D' },
              ].map(({ eixo, valor, cor }) => (
                <View key={eixo} style={[styles.eixoCard, { borderTopColor: cor }]}>
                  <Text style={[styles.eixoLabel, { color: cor }]}>{eixo}</Text>
                  <Text style={styles.eixoValor}>{valor.toFixed(3)}</Text>
                  <View style={[styles.eixoBarra, { backgroundColor: cor + '33' }]}>
                    <View style={[
                      styles.eixoBarraFill,
                      {
                        backgroundColor: cor,
                        width: `${Math.min(Math.abs(valor) * 50, 100)}%`,
                      }
                    ]} />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.magRow}>
              <Text style={styles.magLabel}>Magnitude total:</Text>
              <Text style={[styles.magValor, { color: getCorIntensidade() }]}>
                {intensidade.toFixed(3)} g
              </Text>
            </View>
          </View>
        )}

        {/* Contadores */}
        <View style={styles.countersRow}>
          <View style={[styles.counterCard, { backgroundColor: '#FFE5B4' }]}>
            <Text style={{ fontSize: 36 }}>👣</Text>
            <Text style={styles.counterValor}>{passos}</Text>
            <Text style={styles.counterLabel}>Passos detectados</Text>
          </View>
          <View style={[styles.counterCard, { backgroundColor: '#E8D5F5' }]}>
            <Text style={{ fontSize: 36 }}>🌀</Text>
            <Text style={styles.counterValor}>{shakes}</Text>
            <Text style={styles.counterLabel}>Agitações detectadas</Text>
          </View>
        </View>

        {/* Histórico de eventos */}
        {historico.length > 0 && (
          <View style={styles.historicoBox}>
            <Text style={styles.historicoTitle}>📋 Histórico de agitações</Text>
            {historico.map((h, i) => (
              <View key={i} style={styles.historicoItem}>
                <Text style={styles.historicoTipo}>{h.tipo}</Text>
                <Text style={styles.historicoMag}>mag: {h.mag}</Text>
                <Text style={styles.historicoTs}>{h.ts}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Legenda */}
        <View style={styles.legendaBox}>
          <Text style={styles.legendaTitle}>ℹ️ Como funciona</Text>
          <Text style={styles.legendaText}>
            O acelerômetro mede a aceleração do dispositivo nos eixos X, Y e Z em unidades de gravidade (g).{'\n\n'}
            • {'<'} 1.3g → Parado{'\n'}
            • 1.3g – 1.8g → Movimento leve (conta passos){'\n'}
            • {'>'} 1.8g → Agitação detectada (shake){'\n\n'}
            Em um app de pets real, isso poderia monitorar a atividade física diária do animal! 🐕
          </Text>
        </View>
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
  headerSub: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, lineHeight: 20 },

  content: { padding: SPACING.md, gap: SPACING.md },

  // Sensor box
  sensorBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 180,
    justifyContent: 'center',
  },
  petEmoji: { marginBottom: SPACING.md },
  statusBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
  },
  statusText: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.white },
  inativoDica: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center' },

  // Botão main
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
  },
  mainBtnStart: { backgroundColor: COLORS.primary },
  mainBtnStop: { backgroundColor: '#E74C3C' },
  mainBtnText: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.white },

  // Dados brutos
  rawDataBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  rawTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.white, marginBottom: SPACING.sm },
  axesRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  eixoCard: {
    flex: 1,
    backgroundColor: '#2D2D44',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderTopWidth: 3,
  },
  eixoLabel: { fontSize: FONTS.sizes.lg, fontWeight: '900', marginBottom: 2 },
  eixoValor: { fontSize: FONTS.sizes.sm, color: '#FFFFFF', fontFamily: 'monospace', marginBottom: 4 },
  eixoBarra: { height: 6, borderRadius: 3, overflow: 'hidden' },
  eixoBarraFill: { height: '100%', borderRadius: 3 },
  magRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  magLabel: { fontSize: FONTS.sizes.sm, color: '#AAAAAA' },
  magValor: { fontSize: FONTS.sizes.lg, fontWeight: '900' },

  // Contadores
  countersRow: { flexDirection: 'row', gap: SPACING.sm },
  counterCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  counterValor: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.text },
  counterLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, textAlign: 'center' },

  // Histórico
  historicoBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  historicoTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  historicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historicoTipo: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600' },
  historicoMag: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontFamily: 'monospace' },
  historicoTs: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  // Legenda
  legendaBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  legendaTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: '#2E7D32', marginBottom: SPACING.sm },
  legendaText: { fontSize: FONTS.sizes.sm, color: '#2E7D32', lineHeight: 22 },
});