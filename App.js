import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

export default function FaceAuthExample() {

  const [supportFaceId, setsupportFaceId] = useState(false);
  const [supportTouchId, setsupportTouchId] = useState(false);
  const [supportBio, setsupportBio] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    async function checkBioDevice() {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert('Biometric not available');
        return;
      }
      if (Platform.OS == 'ios') {
        if (biometryType === 'FaceID') {
          console.log('Device supports Face ID');
          setsupportFaceId(true);
        }
        if (biometryType === 'TouchID') {
          console.log('Device supports Touch ID');
          setsupportTouchId(true);
        }
      } else {
        if (biometryType === 'Biometrics') {
          setsupportBio(true);
          console.log('Generic biometrics (could be face or fingerprint on Android)');
        }
      }
    }
    checkBioDevice();
  }, []);

  async function authWithFace() {
    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Face',
        cancelButtonText: 'Cancel',
      });

      if (result.success) {
        Alert.alert('Authenticated with Face!');
      } else {
        Alert.alert('Authentication failed or canceled');
      }

    } catch (error) {
      console.warn('Biometric error', err);
      Alert.alert('Error', err.message || 'Biometric authentication failed');
    }

  }
  async function authWithFingerprint() {
    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Touch',
        cancelButtonText: 'Cancel',
      });

      if (result.success) {
        Alert.alert('Authenticated with Finger!');
      } else {
        Alert.alert('Authentication failed or canceled');
      }

    } catch (error) {
      console.warn('Biometric error', err);
      Alert.alert('Error', err.message || 'Biometric authentication failed');
    }

  }

  return (
    <View style={{ marginTop: 80 }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title=" Auth  Face  " onPress={authWithFace} />
        <Button title="Auth Finger" onPress={authWithFingerprint} />
      </View>

      {Platform.OS === 'ios' ?
        <View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
          <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, marginVertical: 10 }}>
            {supportFaceId ? <Text> ✅ Device supports Face ID</Text> : <Text> ❌ Device supports Face ID</Text>}
          </View>
          <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, marginVertical: 10 }}>
            {supportTouchId ? <Text> ✅ Device supports Touch ID</Text> : <Text> ❌ Device supports Touch ID</Text>}
          </View>
        </View>
        :
        <View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
          <View style={{ borderWidth: 0.5, borderRadius: 10, padding: 10, marginVertical: 10 }}>
            {supportBio ? <Text> ✅ Device supports Face or Touch ID</Text> : <Text> ❌ Device supports Face or Touch ID</Text>}
          </View>
        </View>
      }
    </View>
  );
}
