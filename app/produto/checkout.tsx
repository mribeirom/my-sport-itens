import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import { useCart } from '@/src/context/CartContext';
import { DELIVERY_ADDRESSES } from '@/src/constants/products';
import { DeliveryMethod, PaymentMethod } from '@/src/types';

const DELIVERY_OPTIONS = [
  {
    id: 'express' as DeliveryMethod,
    label: 'Entrega Expressa',
    detail: '1 dia útil · Grátis',
    icon: '⚡',
    price: 0,
  },
  {
    id: 'standard' as DeliveryMethod,
    label: 'Entrega Padrão',
    detail: '2–5 dias úteis',
    icon: '📦',
    price: 0,
  },
];

const PAYMENT_OPTIONS = [
  {
    id: 'credit' as PaymentMethod,
    label: 'Cartão de Crédito',
    detail: '**** **** **** 4821 · Visa',
    icon: '💳',
  },
  {
    id: 'pix' as PaymentMethod,
    label: 'Pix',
    detail: 'Pagamento imediato',
    icon: '⚡',
  },
  {
    id: 'boleto' as PaymentMethod,
    label: 'Boleto Bancário',
    detail: 'Vence em 1–3 dias',
    icon: '🧾',
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [delivery, setDelivery] = useState<DeliveryMethod>('express');
  const [payment, setPayment] = useState<PaymentMethod>('credit');

  const handleConfirm = () => {
    Alert.alert(
      '🎉 Pedido Confirmado!',
      `Seu pedido #IMS-00313 foi realizado com sucesso.\n\nTotal: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      [
        {
          text: 'Ver Pedidos',
          onPress: () => {
            clearCart();
            router.push('/perfil');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Delivery Address */}
        <Text style={styles.sectionLabel}>Endereço de entrega</Text>
        {DELIVERY_ADDRESSES.map((addr, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.optionCard, selectedAddress === idx && styles.optionCardActive]}
            onPress={() => setSelectedAddress(idx)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{addr.label}</Text>
              <Text style={styles.optionDetail}>{addr.street}</Text>
              <Text style={styles.optionDetail}>{addr.city}</Text>
            </View>
            <View
              style={[
                styles.radio,
                selectedAddress === idx && styles.radioActive,
              ]}
            >
              {selectedAddress === idx && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addAddressBtn}>
          <Ionicons name="add-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.addAddressText}>Adicionar novo endereço</Text>
        </TouchableOpacity>

        {/* Delivery Method */}
        <Text style={styles.sectionLabel}>Método de entrega</Text>
        {DELIVERY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.optionCard, delivery === opt.id && styles.optionCardActive]}
            onPress={() => setDelivery(opt.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>{opt.icon}</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDetail}>{opt.detail}</Text>
            </View>
            <View style={[styles.radio, delivery === opt.id && styles.radioActive]}>
              {delivery === opt.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Payment */}
        <Text style={styles.sectionLabel}>Pagamento</Text>
        {PAYMENT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.optionCard, payment === opt.id && styles.optionCardActive]}
            onPress={() => setPayment(opt.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>{opt.icon}</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDetail}>{opt.detail}</Text>
            </View>
            <View style={[styles.radio, payment === opt.id && styles.radioActive]}>
              {payment === opt.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>
            {totalItems} {totalItems === 1 ? 'item' : 'itens'} · Frete grátis
          </Text>
          <Text style={styles.footerTotal}>
            R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmBtnText}>Confirmar Pedido</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 44 : 12,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  backBtn: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8F4',
  },
  optionIcon: {
    width: 38,
    height: 38,
    backgroundColor: Colors.background,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  optionDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginTop: 2,
    paddingVertical: 4,
  },
  addAddressText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  spacer: {
    height: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
