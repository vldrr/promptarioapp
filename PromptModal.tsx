import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { fonts, radius } from '../theme';
import { Prompt } from '../types';
import { ToolBadge } from './Common';

interface Props {
  prompt: Prompt | null;
  onClose: () => void;
  onCopied: (id: string) => void;
}

/**
 * Modal de detalhe do prompt.
 * - Botão Copiar com feedback animado (escala + troca de cor) e
 *   anúncio para leitores de tela via accessibilityLiveRegion.
 * - Botão Compartilhar usando a Share API nativa (zero dependências).
 * - Cópia tolerante a falhas: erro no clipboard mostra estado de erro
 *   em vez de quebrar.
 */
export const PromptModal = memo(function PromptModal({ prompt, onClose, onCopied }: Props) {
  const { colors } = useTheme();
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');
  const scale = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopyState('idle');
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [prompt]);

  const copiar = useCallback(async () => {
    if (!prompt) return;
    try {
      await Clipboard.setStringAsync(prompt.prompt);
      setCopyState('done');
      onCopied(prompt.id);
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    } catch {
      setCopyState('error');
    }
    timer.current = setTimeout(() => setCopyState('idle'), 2000);
  }, [prompt, onCopied, scale]);

  const compartilhar = useCallback(async () => {
    if (!prompt) return;
    try {
      await Share.share({
        message: `${prompt.titulo}\n\n${prompt.prompt}\n\n— via PromptÁrio`,
      });
    } catch {
      // usuário cancelou ou share indisponível — silencioso por design
    }
  }, [prompt]);

  const copyLabel =
    copyState === 'done'
      ? '✓ Copiado!'
      : copyState === 'error'
        ? 'Falha ao copiar'
        : 'Copiar prompt';

  return (
    <Modal
      visible={!!prompt}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.bg, borderColor: colors.border },
          ]}
        >
          {prompt && (
            <>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                  <Text style={[styles.categoria, { color: colors.accent }]}>
                    {prompt.categoria.toUpperCase()}
                  </Text>
                  <ToolBadge ferramenta={prompt.ferramenta} />
                </View>
                <Text
                  style={[styles.titulo, { color: colors.text }]}
                  accessibilityRole="header"
                >
                  {prompt.titulo}
                </Text>

                <Text style={[styles.label, { color: colors.textDim }]}>
                  O QUE ESSE PROMPT FAZ
                </Text>
                <Text style={[styles.descricao, { color: colors.text }]}>
                  {prompt.descricao}
                </Text>

                <Text style={[styles.label, { color: colors.textDim }]}>PROMPT</Text>
                <View
                  style={[
                    styles.promptBox,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.promptText, { color: colors.text }]} selectable>
                    {prompt.prompt}
                  </Text>
                </View>
                <View style={{ height: 12 }} />
              </ScrollView>

              <View
                accessibilityLiveRegion="polite"
                accessibilityLabel={copyState === 'done' ? 'Prompt copiado' : undefined}
              >
                <Animated.View style={{ transform: [{ scale }] }}>
                  <Pressable
                    onPress={copiar}
                    accessibilityRole="button"
                    accessibilityLabel="Copiar prompt para a área de transferência"
                    style={[
                      styles.copyBtn,
                      { backgroundColor: colors.accent },
                      copyState === 'done' && { backgroundColor: '#2E9124' },
                      copyState === 'error' && { backgroundColor: colors.danger },
                    ]}
                  >
                    <Text style={[styles.copyText, { color: colors.accentDark }]}>
                      {copyLabel}
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>

              <View style={styles.secondaryRow}>
                <Pressable
                  onPress={compartilhar}
                  accessibilityRole="button"
                  accessibilityLabel="Compartilhar prompt"
                  style={styles.secondaryBtn}
                >
                  <Text style={[styles.secondaryText, { color: colors.textDim }]}>
                    Compartilhar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar detalhes do prompt"
                  style={styles.secondaryBtn}
                >
                  <Text style={[styles.secondaryText, { color: colors.textDim }]}>
                    Fechar
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '88%',
  },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoria: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.2 },
  titulo: { fontFamily: fonts.extraBold, fontSize: 20, marginTop: 8 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    marginTop: 18,
    marginBottom: 6,
  },
  descricao: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 },
  promptBox: { borderRadius: radius.card, borderWidth: 1, padding: 14 },
  promptText: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20 },
  copyBtn: {
    borderRadius: radius.button,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 14,
    minHeight: 48,
    justifyContent: 'center',
  },
  copyText: { fontFamily: fonts.extraBold, fontSize: 15 },
  secondaryRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  secondaryBtn: { paddingVertical: 12, paddingHorizontal: 8, minHeight: 44 },
  secondaryText: { fontFamily: fonts.bold, fontSize: 13 },
});
