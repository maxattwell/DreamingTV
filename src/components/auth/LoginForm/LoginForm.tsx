import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../styles';
import Button from '../../common/Button';
import { useAuthFlow } from '../../../hooks';
import { isEmpty, isValidEmail } from '../../../utils';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const {
    tempToken,
    loading,
    error,
    getEphemeralAccount,
    register,
    verify,
    clearError,
    resetFlow,
  } = useAuthFlow();

  const handleGetEphemeralAccount = async () => {
    await getEphemeralAccount();
  };

  const handleSubmitEmail = async () => {
    clearError();
    
    if (isEmpty(email) || !isValidEmail(email)) {
      return;
    }

    const success = await register({ email });
    if (success) {
      setShowVerification(true);
    }
  };

  const handleVerifyCode = async () => {
    clearError();
    
    if (isEmpty(verificationCode)) {
      return;
    }

    const success = await verify({ code: verificationCode, email });
    if (success) {
      onLoginSuccess();
    }
  };

  const handleBackToStart = () => {
    resetFlow();
    setEmail('');
    setVerificationCode('');
    setShowVerification(false);
  };

  if (!tempToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to DreamingTV</Text>
        <Text style={styles.subtitle}>Sign in to sync your Dreaming Spanish progress</Text>
        <Button onPress={handleGetEphemeralAccount} loading={loading}>
          Sign In
        </Button>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  if (showVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <TextInput
          placeholder="Enter the code sent to your email"
          value={verificationCode}
          onChangeText={setVerificationCode}
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
        />
        <View style={styles.buttonRow}>
          <Button onPress={handleVerifyCode} disabled={isEmpty(verificationCode)} loading={loading}>
            Verify
          </Button>
          <Button onPress={handleBackToStart} variant="secondary">
            Back
          </Button>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.buttonRow}>
        <Button onPress={handleSubmitEmail} disabled={isEmpty(email)} loading={loading}>
          Submit
        </Button>
        <Button onPress={handleBackToStart} variant="secondary">
          Back
        </Button>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: spacing.md,
    marginVertical: spacing.sm,
    width: 250,
    borderRadius: 8,
    fontSize: typography.fontSize.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default LoginForm;