import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  Entregue: { label: 'Entregue', bg: Colors.successLight, color: Colors.success },
  'A caminho': { label: 'A caminho', bg: Colors.infoLight, color: Colors.info },
  Processando: { label: 'Processando', bg: Colors.warningLight, color: Colors.warning },
  Cancelado: { label: 'Cancelado', bg: Colors.dangerLight, color: Colors.danger },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_CONFIG[order.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={styles.date}>{order.date}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.items}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemEmoji}>
            <Text style={styles.itemEmojiText}>{item.emoji}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total pago</Text>
          <Text style={styles.totalValue}>
            R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>
            {order.status === 'Entregue' ? 'Ver detalhes' : 'Rastrear'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  items: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  itemEmoji: {
    width: 42,
    height: 42,
    backgroundColor: Colors.background,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmojiText: {
    fontSize: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  actionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
});
