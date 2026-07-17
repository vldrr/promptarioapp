import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts, MIN_TOUCH, radius, toolColors } from '../utils/theme';

/** Badge colorida da ferramenta de IA. Memoizada: só re-renderiza se a ferramenta mudar. */
export const ToolBadge = memo(function ToolBadge({ ferramenta }: { ferramenta: string }) {
  const color = toolColors[ferramenta] ?? toolColors.Geral;
  return (
    <View
      style={[styles.toolBadge, { borderColor: color }]}
      accessibilityLabel={`Ferramenta: ${ferramenta}`}
    >
      <View style={[styles.toolDot, { backgroundColor: color }]} />
      <Text style={[styles.toolText, { color }]}>{ferramenta}</Text>
    </View>
  );
});

/** Chip de filtro (categorias, ferramentas, ordenação). */
export const Chip = memo(function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: (label: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => onPress(label)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Filtro ${label}${active ? ', selecionado' : ''}`}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: colors.surface, borderColor: colors.border },
        active && { backgroundColor: colors.accent, borderColor: colors.accent },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.accentDark : colors.textDim },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
});

/** Estado vazio da lista, com orientação de ação. */
export const EmptyState = memo(function EmptyState() {
  const { colors } = useTheme();
  return (
    <View style={styles.empty} accessibilityRole="text">
      <Text style={[styles.emptyIcon, { color: colors.textDim }]}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Nenhum prompt encontrado
      </Text>
      <Text style={[styles.emptyText, { color: colors.textDim }]}>
        Ajuste a busca ou limpe os filtros para ver mais resultados.
      </Text>
    </View>
  );
});

/** Cabeçalho com logo e alternador de tema. */
export const Header = memo(function Header() {
  const { colors, mode, toggleTheme } = useTheme();
  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.logo, { color: colors.text }]} accessibilityRole="header">
          PROMPT<Text style={{ color: colors.accent }}>ÁRIO</Text>
        </Text>
        <Text style={[styles.tagline, { color: colors.textDim }]}>
          Prompts prontos para copiar e usar
        </Text>
      </View>
      <Pressable
        onPress={toggleTheme}
        accessibilityRole="button"
        accessibilityLabel={
          mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
        }
        style={({ pressed }) => [
          styles.themeBtn,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={{ fontSize: 18 }}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  toolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.chip,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  toolDot: { width: 6, height: 6, borderRadius: 3 },
  toolText: { fontFamily: fonts.bold, fontSize: 11 },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.chip,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipText: { fontFamily: fonts.bold, fontSize: 12 },

  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 16, marginBottom: 6 },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
    color: undefined,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { fontFamily: fonts.extraBold, fontSize: 26, letterSpacing: 1 },
  tagline: { fontFamily: fonts.medium, fontSize: 13, marginTop: 2 },
  themeBtn: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
