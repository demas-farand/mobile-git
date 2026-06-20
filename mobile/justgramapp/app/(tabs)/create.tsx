import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

const CreateScreen = () => {
    const router = useRouter();
    const { token } = useAuthStore();
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!image || !caption) {
            Alert.alert("Oops!", "Lengkapi foto dan caption dulu ya.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'photo.jpg',
        } as any);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Sukses", "Postingan berhasil diunggah!");
                router.replace('/(tabs)');
            } else {
                throw new Error(result.message || 'Gagal upload');
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Gagal", "Terjadi kesalahan saat upload.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background px-4">
            <View className="flex-row items-center justify-between py-4">
                <Text className="font-cookie text-3xl text-active">JustGram</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left-circle" size={30} color="#2B6F7B" />
                </TouchableOpacity>
            </View>

            <View className="bg-white rounded-3xl p-4 shadow-sm mt-2">
                <TouchableOpacity onPress={pickImage} className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden mb-5">
                    {image ? (
                        <Image source={{ uri: image }} className="w-full h-full" />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Feather name="camera" size={40} color="#CBD5E1" />
                        </View>
                    )}
                </TouchableOpacity>

                <Text className="font-title text-gray-700 mb-2">Caption</Text>
                <TextInput
                    className="border border-gray-200 rounded-xl px-4 py-3 text-base font-regular text-gray-700 mb-6"
                    placeholder="Tulis sesuai untuk postingan anda...."
                    placeholderTextColor="#94A3B8"
                    value={caption}
                    onChangeText={setCaption}
                />

                <TouchableOpacity 
                    className="bg-teal-700 rounded-xl py-4 items-center"
                    onPress={handlePost}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-title text-lg">Upload Post</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateScreen;