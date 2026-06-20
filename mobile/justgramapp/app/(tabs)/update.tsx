import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/authStore';

const UpdateScreen = () => {
    const router = useRouter();
    const { token, user, setCredentials } = useAuthStore();

    const [fullname, setFullname] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [bio, setBio] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.username) return;
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await response.json();
                if (response.ok && result.data) {
                    setFullname(result.data.fullname || '');
                    setUsernameInput(result.data.username || '');
                    setBio(result.data.bio || '');
                    setCurrentImage(result.data.image || null);
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Gagal memuat data pengguna.");
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserData();
    }, [user?.username]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        if (!fullname || !usernameInput) {
            Alert.alert("Oops", "Fullname dan Username tidak boleh kosong.");
            return;
        }

        setIsUpdating(true);

        try {
            const updateRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/update-user`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullname: fullname,
                    username: usernameInput,
                    bio: bio
                })
            });

            const updateData = await updateRes.json();

            if (!updateRes.ok) {
                const errorMessage = Array.isArray(updateData.message) 
                    ? updateData.message[0] 
                    : updateData.message;
                throw new Error(errorMessage || "Gagal update data text.");
            }

            if (setCredentials && updateData.data) {
                setCredentials(updateData.data, token as string);
            }

            if (imageUri) {
                const formData = new FormData();
                formData.append('image', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: 'profile-update.jpg',
                } as any);

                const photoRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/update-photo-profile`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                });

                const photoData = await photoRes.json();

                if (!photoRes.ok) {
                    const errorMessage = Array.isArray(photoData.message) 
                        ? photoData.message[0] 
                        : photoData.message;
                    throw new Error(errorMessage || "Gagal update foto profile.");
                }

                if (setCredentials && photoData.data) {
                    setCredentials(photoData.data, token as string);
                }
            }

            Alert.alert("Sukses", "Profil berhasil diperbarui!");
            router.replace('/(tabs)/profile');
            
        } catch (error: any) {
            console.error(error);
            Alert.alert("Gagal", error.message || "Terjadi kesalahan sistem saat update profil.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isFetching) {
        return (
            <SafeAreaView className="flex-1 bg-[#F8FAFC] items-center justify-center">
                <ActivityIndicator size="large" color="#2B6F7B" />
            </SafeAreaView>
        );
    }

    const displayImage = imageUri || currentImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <Text className="text-3xl text-gray-800 font-cookie">JustGram</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Feather name="arrow-left-circle" size={28} color="#DC2626" />
                        </TouchableOpacity>
                    </View>

                    <View className="items-center mt-6 mb-8">
                        <TouchableOpacity onPress={pickImage} className="relative">
                            <Image
                                source={{ uri: displayImage }}
                                className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-100"
                            />
                            <View className="absolute bottom-0 right-0 bg-[#2B6F7B] p-1.5 rounded-full border-2 border-white">
                                <Feather name="camera" size={14} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 space-y-4">
                        <View className="mb-4">
                            <Text className="text-gray-400 mb-2 font-medium">Fullname</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
                                value={fullname}
                                onChangeText={setFullname}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-400 mb-2 font-medium">Username</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
                                value={usernameInput}
                                onChangeText={setUsernameInput}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mb-8">
                            <Text className="text-gray-400 mb-2 font-medium">Biodata</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
                                value={bio}
                                onChangeText={setBio}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleUpdate}
                            disabled={isUpdating}
                            className="bg-[#2B6F7B] py-4 rounded-xl items-center"
                        >
                            {isUpdating ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Update User</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UpdateScreen;