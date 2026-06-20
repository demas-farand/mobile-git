import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
    const router = useRouter();

    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setCredentials, setLoading, setError, isLoading } = useAuthStore();


    const handleRegister = async () => {
        if (!fullname || !username || !email || !password) {
            Alert.alert("Data Tidak Lengkap", "Semua kolom wajib diisi ya.");
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    fullname, 
                    username, 
                    email, 
                    password 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = Array.isArray(result.message) 
                    ? result.message.join('\n') 
                    : result.message || 'Gagal mendaftar. Silakan coba lagi.';
                
                throw new Error(errorMessage);
            }

            setCredentials(result.data, result.token);

            Alert.alert("Success", "Akun berhasil dibuat!", [
                { text: "OK", onPress: () => router.replace('/(tabs)') }
            ]);

        } catch (err: any) {
            setError(err.message);
            Alert.alert("Registrasi Gagal", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8 py-10">
                    <View className="mb-10 items-center">
                        <Text className="text-4xl font-title text-active mb-2">
                            Create Account
                        </Text>
                        <Text className="text-[15px] text-gray-500 font-regular text-center">
                            Join and start sharing your moment 😀
                        </Text>
                    </View>

                    <View className="w-full">
                        <TextInput
                            className="w-full bg-gray-200 text-gray-800 rounded-xl px-5 py-4 mb-4 text-base font-regular"
                            placeholder="Full Name"
                            placeholderTextColor="#9CA3AF"
                            value={fullname}
                            onChangeText={setFullname}
                        />

                        <TextInput
                            className="w-full bg-gray-200 text-gray-800 rounded-xl px-5 py-4 mb-4 text-base font-regular"
                            placeholder="Username"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <TextInput
                            className="w-full bg-gray-200 text-gray-800 rounded-xl px-5 py-4 mb-4 text-base font-regular"
                            placeholder="Email"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        
                        <TextInput
                            className="w-full bg-gray-200 text-gray-800 rounded-xl px-5 py-4 mb-8 text-base font-regular"
                            placeholder="Password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity 
                            className="w-full bg-active rounded-xl py-4 items-center justify-center mb-6"
                            activeOpacity={0.8}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white text-lg font-title">
                                    Register
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-2">
                        <Text className="text-gray-500 text-[15px] font-regular">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-active text-[15px] font-title">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}