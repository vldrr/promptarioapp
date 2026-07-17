import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, palettes } from '../theme';

/**
 * Barreira de erro global: qualquer exceção de renderização mostra
 * uma tela de recuperação em vez de fechar o app.
 * Classe (exigência do React para error boundaries), tema fixo dark
 * por não poder usar hooks aqui.
 */

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error('[ErrorBoundary]', error);
    // Ponto único para plugar Sentry/observabilidade no futuro:
    // Sentry.captureException(error);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    const c = palettes.dark;
    return (
      <View style={[styles.root, { backgroundColor: c.bg }]}>
        <Text style={[styles.title, { color: c.text }]}>Algo deu errado</Text>
        <Text style={[styles.msg, { color: c.textDim }]}>
          O aplicativo encontrou um erro inesperado. Toque abaixo para tentar novamente.
        </Text>
        <Pressable
          onPress={this.reset}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
          style={[styles.btn, { backgroundColor: c.accent }]}
        >
          <Text style={[styles.btnText, { color: c.accentDark }]}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontFamily: fonts.extraBold, fontSize: 20, marginBottom: 8 },
  msg: { fontFamily: fonts.medium, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  btn: { marginTop: 20, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
  btnText: { fontFamily: fonts.extraBold, fontSize: 15 },
});
