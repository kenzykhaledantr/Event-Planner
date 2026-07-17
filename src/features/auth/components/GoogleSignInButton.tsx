import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useGoogleAuthRequest, completeGoogleSignIn } from '../services/googleAuthService';

export function GoogleSignInButton() {
  const [request, response, promptAsync] = useGoogleAuthRequest();

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        completeGoogleSignIn(idToken).catch(() => {
          Alert.alert('Sign-in failed', 'Please try again.');
        });
      }
    }
  }, [response]);

  return (
    <Button
      label="Continue with Google"
      variant="secondary"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}