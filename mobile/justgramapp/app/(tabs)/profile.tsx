import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import UserProfileHeader from '@/components/post/UserProfileHeader';

const ProfileTabScreen = () => {
    const router = useRouter();
    const { token, user } = useAuthStore();

    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarks, setIsBookmarks] = useState(false);

    const fetchProfile = async () => {
        if (!user?.username) return;
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/${user.username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (response.ok) setProfile(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user?.username]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#2B6F7B" />
            </SafeAreaView>
        );
    }

    const displayData = isBookmarks ? (profile?.bookmarks || []) : (profile?.posts || []);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-3">
                <Text className="text-2xl font-bold font-cookie">
                    JustGram
                </Text>
                <TouchableOpacity onPress={() => router.push('/update')}>
                    <Feather name="settings" size={22} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayData}
                ListHeaderComponent={
                    <UserProfileHeader
                        profile={profile}
                        isOwnProfile={true}
                        isBookmarks={isBookmarks}
                        setIsBookmarks={setIsBookmarks}
                    />
                }
                numColumns={3}
                keyExtractor={(item) => (isBookmarks ? item.post.id.toString() : item.id.toString())}
                renderItem={({ item }) => {
                    const post = isBookmarks ? item.post : item;
                    return (
                        <TouchableOpacity 
                            onPress={() => router.push(`/post/${post.id}`)} 
                            className="flex-1 aspect-square p-0.5"
                        >
                            <Image source={{ uri: post.image }} className="w-full h-full bg-gray-200" />
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">Data kosong.</Text>}
            />
        </SafeAreaView>
    );
};

export default ProfileTabScreen;