import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setErrorMsg('');
      const user = await login(email, password);
      if (user.role === 'Customer') {
        router.replace('/(customer)/dashboard');
      } else {
        router.replace('/(delivery)/dashboard');
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerPart}>
          {/* Using a placeholder for the Logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>A-Z</Text>
          </View>
          <Text style={styles.brandName}>A-Z Supermarket</Text>
          <Text style={styles.caption}>Fresh. Fast. Delivered.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Welcome Back!</Text>
          <Text style={styles.formCaption}>Log in to continue shopping</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your email" 
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password" 
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.extraLarge,
  },
  headerPart: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  logoText: {
    color: COLORS.surface,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  caption: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    marginTop: 4,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.extraLarge,
    ...SHADOWS.medium,
  },
  formHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  formCaption: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginBottom: SIZES.large,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SIZES.small,
    fontSize: SIZES.font,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    fontSize: SIZES.font,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  loginBtn: {
    backgroundColor: COLORS.accent,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.small,
    ...SHADOWS.light,
  },
  loginBtnText: {
    color: COLORS.surface,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: SIZES.font,
  },
  linkText: {
    color: COLORS.accent,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
