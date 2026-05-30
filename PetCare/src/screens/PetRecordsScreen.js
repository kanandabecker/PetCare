import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from '../context/Notification';

import { usePets } from '../context/Pets';
import { COLORS, FONTS, SPACING, RADIUS } from '../data/theme';

export default function PetRecordsScreen({ route, navigation }) {
    const pet = route?.params?.pet;

    const { adicionarPet } = usePets();

    const [nome, setNome] = useState('');
    const [raca, setRaca] = useState('');
    const [cidade, setCidade] = useState('');
    const [descricao, setDescricao] = useState('');

    const [especie, setEspecie] = useState('Cachorro');
    const [porte, setPorte] = useState('Médio');

    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('Macho');

    const { mostrarBanner } = useNotification();

    const salvar = async() => {
        if (!nome.trim()) {
            Alert.alert(
                'Erro',
                'Preencha o nome do pet.'
            );
            return;
        }

        const petFinal = {
            id: Date.now(),

            nome,
            raca: raca || 'Sem raça definida',
            especie,
            porte,

            cidade: cidade || 'Não informado',

            descricao:
                descricao ||
                `${nome} está procurando um novo lar cheio de amor.`,

            historia:
                `${nome} foi registrado através do aplicativo e aguarda uma família responsável.`,

            idade: 'Não informado',

            sexo: 'Macho',

            foto: pet?.foto || null,

            emoji: especie === 'Gato' ? '🐱' : '🐶',

            favorito: false,

            vacinado: false,
            castrado: false,
            vermifugado: false,

            cor: 'Não informado',

            ong: 'Cadastro Comunitário',

            dataEntrada: new Date().toISOString(),

            cor_card:
                especie === 'Gato'
                    ? '#FFF4D6'
                    : '#FFEAEA',
        };

        adicionarPet(petFinal);

        const config = JSON.parse(
            await AsyncStorage.getItem(
                'configNotificacoes'
            )
        );

        if (
            config?.notifAtivas &&
            config?.notifNovos
        ) {
            mostrarBanner(
                '🐾 Novo Pet Disponível',
                `${petFinal.nome} foi adicionado para adoção`
            );
        }

        Alert.alert(
            'Sucesso',
            'Pet publicado para adoção!',
            [
                {
                    text: 'OK',
                    onPress: () =>
                        navigation.navigate('Tabs', {
                            screen: 'Lista',
                        }),
                },
            ]
        );

    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>
                    Cadastrar pet 🐾
                </Text>

                <Text style={styles.subtitle}>
                    Complete as informações para colocar o pet em adoção
                </Text>
            </View>

            {pet?.foto && (
                <Image
                    source={{ uri: pet.foto }}
                    style={styles.image}
                />
            )}

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name="paw-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <TextInput
                        placeholder="Nome do pet"
                        value={nome}
                        onChangeText={setNome}
                        style={styles.input}
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name="heart-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <TextInput
                        placeholder="Raça"
                        value={raca}
                        onChangeText={setRaca}
                        style={styles.input}
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name="location-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <TextInput
                        placeholder="Cidade"
                        value={cidade}
                        onChangeText={setCidade}
                        style={styles.input}
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name="time-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <TextInput
                        placeholder="Idade (Ex: 2 anos)"
                        value={idade}
                        onChangeText={setIdade}
                        style={styles.input}
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name="document-text-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <TextInput
                        placeholder="Descrição do pet"
                        value={descricao}
                        onChangeText={setDescricao}
                        style={[styles.input, styles.textArea]}
                        multiline
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    Espécie
                </Text>

                <View style={styles.optionsRow}>
                    {['Cachorro', 'Gato'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                especie === item &&
                                styles.optionBtnActive,
                            ]}
                            onPress={() => setEspecie(item)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    especie === item &&
                                    styles.optionTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>
                    Sexo
                </Text>

                <View style={styles.optionsRow}>
                    {['Macho', 'Fêmea'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                sexo === item &&
                                styles.optionBtnActive,
                            ]}
                            onPress={() => setSexo(item)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    sexo === item &&
                                    styles.optionTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>
                    Porte
                </Text>

                <View style={styles.optionsRow}>
                    {['Pequeno', 'Médio', 'Grande'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                porte === item &&
                                styles.optionBtnActive,
                            ]}
                            onPress={() => setPorte(item)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    porte === item &&
                                    styles.optionTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={salvar}
                >
                    <Ionicons
                        name="heart"
                        size={20}
                        color={COLORS.white}
                    />

                    <Text style={styles.saveBtnText}>
                        Publicar para adoção
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: SPACING.xxl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    title: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '900',
        color: COLORS.text,
    },

    subtitle: {
        marginTop: 4,
        color: COLORS.textLight,
        fontSize: FONTS.sizes.sm,
    },

    image: {
        width: '92%',
        height: 250,
        alignSelf: 'center',
        marginTop: SPACING.md,
        borderRadius: RADIUS.lg,
        backgroundColor: '#EEE',
    },

    form: {
        padding: SPACING.md,
        gap: SPACING.md,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    input: {
        flex: 1,
        height: 52,
        color: COLORS.text,
        fontSize: FONTS.sizes.md,
    },

    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },

    sectionTitle: {
        fontSize: FONTS.sizes.md,
        fontWeight: '800',
        color: COLORS.text,
    },

    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },

    optionBtn: {
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.full,
    },

    optionBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    optionText: {
        color: COLORS.textLight,
        fontWeight: '700',
    },

    optionTextActive: {
        color: COLORS.white,
    },

    saveBtn: {
        marginTop: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.full,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },

    saveBtnText: {
        color: COLORS.white,
        fontWeight: '800',
        fontSize: FONTS.sizes.md,
    },
});