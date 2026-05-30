import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS, RADIUS } from '../data/theme';

export default function AdoptionFormScreen({ route, navigation }) {
    const { pet } = route.params;

    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = () => {
        if (!nome || !telefone) {
            if (Platform.OS === 'web') {
                window.alert('Preencha pelo menos nome e telefone.');
            } else {
                Alert.alert('Atenção', 'Preencha pelo menos nome e telefone.');
            }
            return;
        }

        if (Platform.OS === 'web') {
            window.alert(
                `Pedido enviado! 🐾\n\nSua solicitação para adotar ${pet.nome} foi enviada para ${pet.ong}.`
            );
            navigation.goBack();
        } else {
            Alert.alert(
                'Pedido enviado! 🐾',
                `Sua solicitação para adotar ${pet.nome} foi enviada para ${pet.ong}.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Formulário de Adoção 🐾</Text>
            <Text style={styles.subtitle}>Pet: {pet.nome}</Text>

            <TextInput
                placeholder="Seu nome"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                placeholder="Idade"
                style={styles.input}
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
            />

            <TextInput
                placeholder="Telefone"
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
            />

            <TextInput
                placeholder="E-mail"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Por que quer adotar esse pet?"
                style={[styles.input, styles.textArea]}
                value={mensagem}
                onChangeText={setMensagem}
                multiline
            />

            <Button title="Enviar solicitação" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.md,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: FONTS.sizes.xl,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        marginBottom: SPACING.md,
        color: COLORS.textLight,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});