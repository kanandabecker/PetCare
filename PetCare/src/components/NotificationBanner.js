import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useNotification } from '../context/Notification';

export default function NotificationBanner() {
  const { banner } = useNotification();

  if (!banner) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {banner.titulo}
      </Text>

      <Text style={styles.message}>
        {banner.mensagem}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    zIndex: 999,

    backgroundColor: '#4CAF50',

    padding: 15,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  message: {
    color: '#fff',
    marginTop: 4,
  },
});