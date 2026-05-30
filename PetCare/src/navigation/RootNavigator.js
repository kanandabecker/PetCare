import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DetailScreen from '../screens/DetailScreen';
import LocationScreen from '../screens/LocationScreen';
import CameraScreen from '../screens/CameraScreen';
import SensorScreen from '../screens/SensorScreen';
import AdoptionFormScreen from '../screens/AdoptionFormScreen';
import PetRecordsScreen from '../screens/PetRecordsScreen';
import { COLORS, FONTS } from '../data/theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: FONTS.sizes.lg,
          },
          headerShadowVisible: false,
          headerBackTitle: 'Voltar',
          animation: 'slide_from_right',
        }}
      >
        {/* Tab Navigator como tela raiz */}
        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Telas em pilha (stack) */}
        <Stack.Screen
          name="Detalhes"
          component={DetailScreen}
          options={({ route }) => ({
            title: route.params?.pet?.nome || 'Detalhes do Pet',
            headerStyle: { backgroundColor: route.params?.pet?.cor_card || COLORS.white },
            headerTransparent: true,
            headerTitle: '',
          })}
        />

        <Stack.Screen
          name="Localização"
          component={LocationScreen}
          options={{
            title: 'ONGs próximas',
            headerStyle: { backgroundColor: COLORS.white },
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            title: 'Registrar pet',
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />

        <Stack.Screen
          name="Sensores"
          component={SensorScreen}
          options={{
            title: 'Sensor de atividade',
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />

        <Stack.Screen
          name="AdoptionForm"
          component={AdoptionFormScreen}
          options={{
            title: 'Formulário de Adoção',
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />

        <Stack.Screen
          name="PetRecords"
          component={PetRecordsScreen}
          options={{
            title: 'Cadastrar pet',
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}