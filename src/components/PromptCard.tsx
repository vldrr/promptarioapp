import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts, radius } from '../utils/theme';
import { Prompt } from '../utils/types';
import { ToolBadge } from './Common';

interface Props {
  item: Prompt;
  favorito: boolean;
  onPress: (item: Prompt) => void;
  onToggleFav: (id: string) => void;
}

/**
 * Card de prompt.
 * - React.memo com comparador: só re-renderiza se o item ou o estado de
 *   favorito mudarem — favoritar 1 card não re-renderiza os outros 79.
 * - Callbacks recebem id/item (estáveis via useCallback no App), evitando
 *   closures novas por item.
 * - Fade+slide de entrada com useNativeDriver (roda na thread de UI).
 */
export const PromptCard = memo(
  function PromptCard({ item, favorito, onPress, onToggleFav }: Props) {
    const { colors } = useTheme();
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, [anim]);

    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
          ],
        }}
      >
        <Pressable
          onPress={() => onPress(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.titulo}. ${item.descricao}`}
          accessibilityHint="Abre o prompt completo para copiar"
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { backgroundColor: colors.surfaceHi, transform: [{ scale: 0.99 }] },
          ]}
        >
          <View style={styles.top}>
            <Text style={[styles.categoria, { color: colors.accent }]}>
              {item.categoria.toUpperCase()}
            </Text>
            <Pressable
              hitSlop={12}
              onPress={() => onToggleFav(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: favorito }}
              accessibilityLabel={
                favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
              }
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text
                style={{ fontSize: 22, color: favorito ? colors.star : colors.textDim }}
              >
                {favorito ? '★' : '☆'}
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.titulo, { color: colors.text }]}>{item.titulo}</Text>
          <Text
            style={[styles.descricao, { color: colors.textDim }]}
            numberOfLines={2}
          >
            {item.descricao}
          </Text>
          <View style={styles.bottom}>
            <ToolBadge ferramenta={item.ferramenta} />
            <Text style={[styles.verMais, { color: colors.accent }]}>Ver prompt →</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prev, next) =>
    prev.item === next.item &&
    prev.favorito === next.favorito &&
    prev.onPress === next.onPress &&
    prev.onToggleFav === next.onToggleFav
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoria: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.2 },
  titulo: { fontFamily: fonts.extraBold, fontSize: 16, marginTop: 6, lineHeight: 22 },
  descricao: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, marginTop: 6 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  verMais: { fontFamily: fonts.bold, fontSize: 12 },
});
