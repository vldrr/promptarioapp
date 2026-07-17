import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts, MIN_TOUCH, radius } from '../utils/theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  soFavoritos: boolean;
  onToggleFavoritos: () => void;
}

/**
 * Barra de busca com botão de limpar e filtro rápido de favoritos.
 * O debounce acontece no App (useDebounce) — aqui o input responde
 * instantaneamente, mantendo a digitação fluida.
 */
export const SearchBar = memo(function SearchBar({
  value,
  onChange,
  soFavoritos,
  onToggleFavoritos,
}: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Buscar prompt, categoria ou IA..."
          placeholderTextColor={colors.textDim}
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Campo de busca de prompts"
          accessibilityHint="Digite para filtrar a lista de prompts"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChange('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
          >
            <Text style={[styles.clear, { color: colors.textDim }]}>✕</Text>
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={onToggleFavoritos}
        accessibilityRole="button"
        accessibilityState={{ selected: soFavoritos }}
        accessibilityLabel={
          soFavoritos ? 'Mostrando apenas favoritos' : 'Mostrar apenas favoritos'
        }
        style={[
          styles.favFilter,
          { backgroundColor: colors.surface, borderColor: colors.border },
          soFavoritos && { borderColor: colors.star },
        ]}
      >
        <Text style={{ fontSize: 20, color: soFavoritos ? colors.star : colors.textDim }}>
          ★
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.medium,
    fontSize: 14,
    minHeight: MIN_TOUCH,
  },
  clear: { fontSize: 16, paddingLeft: 8 },
  favFilter: {
    width: MIN_TOUCH + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
  },
});
