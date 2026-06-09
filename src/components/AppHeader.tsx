import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { useCart } from '../context/CartContext';

interface AppHeaderProps {
  showCart?: boolean;
}

export function AppHeader({ showCart = false }: AppHeaderProps) {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>
          <Text style={styles.logoMy}>MySport</Text>
          <Text style={styles.logoItens}> Itens</Text>
        </Text>
        <Text style={styles.logoSub}>A loja para você</Text>
      </View>
      {showCart && (
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/carrinho')}
        >
          <Ionicons name="cart-outline" size={22} color={Colors.text} />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoMy: {
    color: Colors.primary,
  },
  logoItens: {
    color: Colors.text,
  },
  logoSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  cartBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
});
