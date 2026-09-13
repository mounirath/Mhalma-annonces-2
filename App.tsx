import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppDataProvider, SettingsProvider, useData, useSettings } from './src/store';
import { useTheme } from './src/theme';
import { useL10n } from './src/i18n';
import { Txt } from './src/ui';

import Home from './src/screens/Home';
import SearchScreen from './src/screens/SearchScreen';
import CategoryScreen, { CategoriesGrid } from './src/screens/CategoryScreen';
import Detail from './src/screens/Detail';
import CreateAd from './src/screens/CreateAd';
import MyAds from './src/screens/MyAds';
import Favorites from './src/screens/Favorites';
import Messages from './src/screens/Messages';
import Chat from './src/screens/Chat';
import Profile from './src/screens/Profile';
import Auth from './src/screens/Auth';
import Admin from './src/screens/Admin';
import GeoZones from './src/screens/GeoZones';
import BusinessAds from './src/screens/BusinessAds';
import Notifications from './src/screens/Notifications';
import SectorPicker from './src/screens/SectorPicker';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Dummy = () => <View style={{ flex: 1 }} />;

function TabBar({ state, navigation }: any) {
  const { c, shadow } = useTheme();
  const { t } = useL10n();
  const insets = useSafeAreaInsets();
  const { convs } = useData();
  const unread = convs.reduce((n: number, cv: any) => n + cv.unread, 0);

  const items = [
    { key: 'Home', icon: 'home-outline', active: 'home', label: t('home') },
    { key: 'SearchTab', icon: 'search', active: 'search', label: t('search') },
    { key: '__create', icon: 'add', active: 'add', label: t('publish') },
    { key: 'Messages', icon: 'chatbubble-ellipses-outline', active: 'chatbubble-ellipses', label: t('messages'), badge: unread },
    { key: 'Profile', icon: 'person-outline', active: 'person', label: t('profile') },
  ];

  const focusedName = state.routes[state.index]?.name;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: c.surface,
        borderTopWidth: 1,
        borderTopColor: c.border,
        paddingTop: 9,
        paddingBottom: Math.max(insets.bottom, 12),
        paddingHorizontal: 4,
      }}
    >
      {items.map((it) => {
        if (it.key === '__create') {
          return (
            <Pressable key="create" onPress={() => navigation.navigate('CreateAd')} style={{ flex: 1, alignItems: 'center', gap: 3 }} accessibilityRole="button">
              <View
                style={[
                  { width: 54, height: 54, borderRadius: 20, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', marginTop: -26 },
                  shadow(3) as any,
                ]}
              >
                <Ionicons name="add" size={30} color={c.onPrimary} />
              </View>
              <Txt size={10.5} weight="700" color={c.primary} align="center">
                {it.label}
              </Txt>
            </Pressable>
          );
        }
        const focused = focusedName === it.key;
        return (
          <Pressable
            key={it.key}
            onPress={() => navigation.navigate(it.key)}
            style={{ flex: 1, alignItems: 'center', gap: 2 }}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
          >
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: focused ? c.primaryContainer : 'transparent',
              }}
            >
              <Ionicons name={(focused ? it.active : it.icon) as any} size={21} color={focused ? c.onPrimaryContainer : c.textMuted} />
              {it.badge ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: 6,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: c.danger,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                  }}
                >
                  <Txt size={9.5} weight="900" color="#fff" align="center">
                    {it.badge > 9 ? '9+' : it.badge}
                  </Txt>
                </View>
              ) : null}
            </View>
            <Txt size={10.5} weight={focused ? '800' : '600'} color={focused ? c.text : c.textMuted} align="center" numberOfLines={1}>
              {it.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SearchTab" component={SearchScreen} />
      <Tab.Screen name="CreateTab" component={Dummy} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function RootNav() {
  const { c, dark } = useTheme();
  const { authed } = useSettings();

  const theme = useMemo(() => {
    const base = dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: c.primary,
        background: c.background,
        card: c.surface,
        text: c.text,
        border: c.border,
        notification: c.danger,
      },
    };
  }, [dark, c]);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!authed ? (
          <Stack.Screen name="Auth" component={Auth} options={{ animation: 'fade' }} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ animation: 'fade' }} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="CreateAd" component={CreateAd} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="MyAds" component={MyAds} />
            <Stack.Screen name="Favorites" component={Favorites} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Admin" component={Admin} />
            <Stack.Screen name="GeoZones" component={GeoZones} />
            <Stack.Screen name="BusinessAds" component={BusinessAds} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="SectorPicker" component={SectorPicker} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Categories" component={CategoriesGrid} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const [fontsLoaded] = useFonts({ ...Ionicons.font, ...MaterialIcons.font });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#F3F7F5' }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Gate>
          <AppDataProvider>
            <RootNav />
          </AppDataProvider>
        </Gate>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
