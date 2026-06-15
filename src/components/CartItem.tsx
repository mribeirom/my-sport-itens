import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.product.imageUrl ? (
          <Image
            source={{ uri: item.product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.emoji}>📦</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.variant}>
          {item.product.categorySlug}
        </Text>
        <Text style={styles.price}>
          R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => updateQuantity(item.product.sku, item.quantity - 1)}
        >
          <Text style={styles.controlBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.controlBtn, styles.controlBtnPrimary]}
          onPress={() => updateQuantity(item.product.sku, item.quantity + 1)}
        >
          <Text style={[styles.controlBtnText, styles.controlBtnTextPrimary]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  variant: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  controlBtnTextPrimary: {
    color: Colors.textInverse,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 16,
    textAlign: 'center',
  },
});
