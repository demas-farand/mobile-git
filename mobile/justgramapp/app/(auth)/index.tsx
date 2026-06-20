import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setCredentials, setLoading, setError, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Oops!", "Email dan password wajib diisi ya.");
            return;
        }

        try {
            setLoading(true);
            setError(''); 
            
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal login. Cek kembali email dan password Anda.');
            }

            setCredentials(result.data, result.token);
            router.replace('/(tabs)');

        } catch (err: any) {
            setError(err.message);
            Alert.alert("Login Gagal", err.message); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-8"
            >
                <View className="mb-10 items-center">
                    <Text className="text-6xl font-cookie text-active mb-2">
                        JustGram
                    </Text>
                    <Text className="text-gray-500 font-regular mt-2">
                        Welcome Back 🙂
                    </Text>
                </View>
                <View className="mt-5">
                    <TextInput
                        className="bg-gray-200 px-4 py-4 rounded-xl mb-4 text-base font-regular"
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    
                    <TextInput
                        className="bg-gray-200 px-4 py-4 rounded-xl mb-8 text-base font-regular"
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity 
                        className="w-full bg-active rounded-xl py-4 items-center justify-center mb-6"
                        activeOpacity={0.8}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white text-lg font-title">
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mt-2">
                    <Text className="text-gray-500 font-regular">
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text className="text-active font-title">
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}