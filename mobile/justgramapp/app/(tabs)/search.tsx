import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import BtnFollow from '@/components/post/BtnFollow';

const SearchScreen = () => {
    const router = useRouter();
    const { token } = useAuthStore();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                executeSearch(searchQuery);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const executeSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/search?username=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setResults(result.data || []);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
            <View className="flex-row items-center justify-between px-6 py-4">
                <Text className="text-3xl text-gray-800 font-cookie">
                    JustGram
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left-circle" size={28} color="#DC2626" />
                </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-center mt-2 mb-4 text-gray-800">
                Searching User by Username
            </Text>

            <View className="px-6 mb-6">
                <TextInput
                    className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
                    placeholder="Ketik username..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {isSearching ? (
                <ActivityIndicator size="large" color="#2B6F7B" className="mt-10" />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                    ListEmptyComponent={
                        searchQuery.trim().length > 0 ? (
                            <Text className="text-center text-gray-400 mt-10">User tidak ditemukan.</Text>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity 
                                onPress={() => router.push(`/detail/user/${item.username}`)}
                                className="flex-row items-center flex-1"
                            >
                                <Image 
                                    source={{ uri: item.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
                                    className="w-12 h-12 rounded-full bg-gray-200"
                                />
                                <View className="ml-4 flex-1">
                                    <Text className="font-bold text-gray-800 text-[15px]" numberOfLines={1}>
                                        {item.fullname}
                                    </Text>
                                    <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
                                        @{item.username}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <BtnFollow 
                                targetUserId={item.id} 
                                customClass="px-6 py-2 rounded-full" 
                            />
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default SearchScreen;