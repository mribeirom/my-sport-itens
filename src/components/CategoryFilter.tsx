import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  selectedSlug,
  onSelect,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* "Todos" option */}
      <TouchableOpacity
        style={[styles.chip, selectedSlug === 'todos' && styles.chipActive]}
        onPress={() => onSelect('todos')}
        activeOpacity={0.75}
      >
        <Text style={[styles.chipText, selectedSlug === 'todos' && styles.chipTextActive]}>
          Todos
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isActive = cat.slug === selectedSlug;
        return (
          <TouchableOpacity
            key={cat.slug}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat.slug)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
