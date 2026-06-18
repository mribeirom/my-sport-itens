import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  paid: { label: 'Pago', bg: Colors.successLight, color: Colors.success },
  delivered: { label: 'Entregue', bg: Colors.successLight, color: Colors.success },
  processing: { label: 'Processando', bg: Colors.warningLight, color: Colors.warning },
  shipped: { label: 'A caminho', bg: Colors.infoLight, color: Colors.info },
  cancelled: { label: 'Cancelado', bg: Colors.dangerLight, color: Colors.danger },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const statusKey = (order.status || 'paid').toLowerCase();
  const status = STATUS_MAP[statusKey] || STATUS_MAP.paid;

  const handlePress = () => {
    router.push(`/pedido/${encodeURIComponent(order.code)}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.75}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.code}</Text>
          <Text style={styles.date}>
            {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.items}>
        {order.items.slice(0, 4).map((item, index) => (
          <View key={index} style={styles.itemThumb}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.itemEmojiText}>📦</Text>
            )}
          </View>
        ))}
        {order.items.length > 4 && (
          <View style={[styles.itemThumb, styles.itemMore]}>
            <Text style={styles.itemMoreText}>+{order.items.length - 4}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total pago</Text>
          <Text style={styles.totalValue}>
            R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Ver detalhes</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  itemThumb: {
    width: 42,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  itemEmojiText: {
    fontSize: 22,
  },
  itemMore: {
    backgroundColor: Colors.borderLight,
  },
  itemMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
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
