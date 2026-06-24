import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('Customer'); // Default role
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    // Password validation: minimum 6 characters, one letter, one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('Password must be at least 6 characters long and contain both letters and numbers.');
      return;
    }

    try {
      setErrorMsg('');
      const user = await register({ fullName, email, password, city, country, role });
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerPart}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>A-Z</Text>
          </View>
          <Text style={styles.brandName}>A-Z Supermarket</Text>
          <Text style={styles.caption}>Fresh. Fast. Delivered.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Create Account</Text>
          <Text style={styles.formCaption}>Join thousands of happy shoppers</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your full name" 
              placeholderTextColor={COLORS.textLight}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

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
              placeholder="Min 6 chars, letters & numbers" 
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: SIZES.small }]}>
              <Text style={styles.label}>City/Town</Text>
              <TextInput 
                style={styles.input} 
                placeholder="City" 
                placeholderTextColor={COLORS.textLight}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Country</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Country" 
                placeholderTextColor={COLORS.textLight}
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'Customer' && styles.roleBtnActive]} 
                onPress={() => setRole('Customer')}
              >
                <Text style={[styles.roleBtnText, role === 'Customer' && styles.roleBtnTextActive]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'Delivery Boy' && styles.roleBtnActive]} 
                onPress={() => setRole('Delivery Boy')}
              >
                <Text style={[styles.roleBtnText, role === 'Delivery Boy' && styles.roleBtnTextActive]}>Delivery Boy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Log In</Text>
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
    marginBottom: SIZES.large,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  logoText: {
    color: COLORS.surface,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 24,
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
    fontSize: SIZES.font - 2,
  },
  row: {
    flexDirection: 'row',
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleBtn: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  roleBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  roleBtnText: {
    color: COLORS.textLight,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  roleBtnTextActive: {
    color: COLORS.surface,
  },
  registerBtn: {
    backgroundColor: COLORS.accent,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.small,
    ...SHADOWS.light,
  },
  registerBtnText: {
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
