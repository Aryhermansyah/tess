import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User } from 'lucide-react-native';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useAuthStore } from '@/store/auth-store';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Silakan masukkan username dan password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Username atau password tidak valid');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card} variant="elevated">
      <Text style={styles.title}>Login Admin</Text>
      <Text style={styles.subtitle}>Masuk untuk mengelola detail pernikahan</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Input
        label="Username"
        placeholder="Masukkan username Anda"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        leftIcon={<User size={20} color={colors.textLight} />}
      />

      <Input
        label="Password"
        placeholder="Masukkan password Anda"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon={<Lock size={20} color={colors.textLight} />}
      />

      <Button
        title="Masuk"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={() => alert("Gunakan username: admin, password: wedding2023")}>
          <Text style={styles.helpText}>Butuh bantuan?</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  helpText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
});