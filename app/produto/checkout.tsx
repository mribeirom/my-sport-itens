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
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { DeliveryMethod, PaymentMethod } from '@/src/types';
import { createOrder } from '@/src/services/api';

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

function generateOrderCode(): string {
  const num = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `IMS-${num}`;
}

function generatePaymentCode(): string {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<{ street: string; city: string; uf: string; } | null>(null);
  const [fetchingCep, setFetchingCep] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryMethod>('express');
  const [payment, setPayment] = useState<PaymentMethod>('credit');
  const [loading, setLoading] = useState(false);

  const handleCepChange = async (text: string) => {
    const rawCep = text.replace(/\D/g, '');
    setCep(rawCep);
    if (rawCep.length === 8) {
      setFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          Alert.alert('CEP não encontrado', 'Verifique o CEP digitado.');
          setAddress(null);
        } else {
          setAddress({
            street: data.logradouro,
            city: data.localidade,
            uf: data.uf,
          });
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível buscar o endereço.');
      } finally {
        setFetchingCep(false);
      }
    } else {
      setAddress(null);
    }
  };

  const handleConfirm = async () => {
    if (!user?.code) {
      Alert.alert('Erro', 'Você precisa estar logado para finalizar o pedido.');
      return;
    }
    if (!address) {
      Alert.alert('Erro', 'Por favor, informe um CEP válido para a entrega.');
      return;
    }

    setLoading(true);
    try {
      const orderCode = generateOrderCode();
      const paymentCode = generatePaymentCode();

      await createOrder({
        code: orderCode,
        userCode: user.code,
        items: items.map((item) => ({
          productSku: item.product.sku,
          name: item.product.name,
          imageUrl: item.product.imageUrl || '',
          unitPrice: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        })),
        totalAmount: totalPrice,
        status: 'paid',
        paymentCode,
      });

      clearCart();

      Alert.alert(
        '🎉 Pedido Confirmado!',
        `Seu pedido #${orderCode} foi realizado com sucesso.\n\nTotal: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        [
          {
            text: 'Ver Pedidos',
            onPress: () => {
              router.push('/perfil');
            },
          },
        ]
      );
    } catch (error: any) {
      let msg = 'Não foi possível criar o pedido. Tente novamente.';
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.detail) msg = parsed.detail;
      } catch {}
      Alert.alert('Erro no Pedido', msg);
    } finally {
      setLoading(false);
    }
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
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite o CEP (somente números)"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="number-pad"
            maxLength={8}
            value={cep}
            onChangeText={handleCepChange}
          />
          {fetchingCep && <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 8 }} />}
        </View>

        {address && (
          <View style={[styles.optionCard, styles.optionCardActive, { marginTop: 12 }]}>
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>🏠</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>Endereço Selecionado</Text>
              <Text style={styles.optionDetail}>{address.street}</Text>
              <Text style={styles.optionDetail}>{address.city} - {address.uf}</Text>
            </View>
            <View style={[styles.radio, styles.radioActive]}>
              <View style={styles.radioDot} />
            </View>
          </View>
        )}

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
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirmar Pedido</Text>
          )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
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
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
