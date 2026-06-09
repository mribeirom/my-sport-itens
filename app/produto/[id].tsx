import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import { PRODUCTS } from '@/src/constants/products';
import { useCart } from '@/src/context/CartContext';

export default function ProdutoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem, totalItems } = useCart();

  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[Math.floor((product.sizes.length - 1) / 2)] ?? 0
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Produto não encontrado</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    router.push('/carrinho');
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => router.push('/carrinho')}
        >
          <Ionicons name="heart-outline" size={20} color={Colors.text} />
          {totalItems > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroEmoji}>{product.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.categoryBrand}>
            {product.category} · {product.brand}
          </Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {stars.map((filled, i) => (
                <Ionicons
                  key={i}
                  name={filled ? 'star' : 'star-outline'}
                  size={14}
                  color={Colors.star}
                />
              ))}
            </View>
            <Text style={styles.ratingValue}>{product.rating}</Text>
            <Text style={styles.ratingCount}>({product.reviewCount} avaliações)</Text>
          </View>

          <Text style={styles.price}>
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>

          {/* Size selector */}
          {product.sizes.length > 1 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeLabel}>Tamanho</Text>
              <View style={styles.sizes}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeBtn,
                      selectedSize === size && styles.sizeBtnActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeBtnText,
                        selectedSize === size && styles.sizeBtnTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descLabel}>Descrição</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 44 : 10,
    paddingBottom: 10,
  },
  navBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  navBadge: {
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
  navBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingBottom: 20,
  },
  heroContainer: {
    height: 220,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroEmoji: {
    fontSize: 110,
  },
  infoSection: {
    paddingHorizontal: 20,
    gap: 6,
  },
  categoryBrand: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  sizeSection: {
    marginTop: 10,
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  sizes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBtn: {
    width: 46,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  sizeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sizeBtnTextActive: {
    color: '#fff',
  },
  descSection: {
    marginTop: 10,
  },
  descLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  descText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyValue: {
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backLink: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
});
