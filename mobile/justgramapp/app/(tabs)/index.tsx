import { View, FlatList, ActivityIndicator, Text, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ListPost from '@/components/PostList';
import { useAuthStore } from '@/store/authStore';
import { Feather } from '@expo/vector-icons';

const FeedScreen = () => {
    const router = useRouter();
    const { token, logout } = useAuthStore();

    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleLogout = () => {
    logout();
    router.replace('/(auth)');
    };

    const fetchFeed = async (pageNumber: number, shouldRefresh = false) => {
        if (isLoading || (!hasMore && !shouldRefresh)) return;

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed?page=${pageNumber}&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                const fetchedPosts = result.data || [];

                if (fetchedPosts.length < 5) {
                    setHasMore(false);
                }

                if (shouldRefresh) {
                    setPosts(fetchedPosts);
                } else {
                    setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
                }

                setPage(pageNumber + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFeed(1, true);
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setHasMore(true);
        fetchFeed(1, true);
    }, []);

    const renderFooter = () => {
        if (!isLoading || isRefreshing) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="large" color="#2B6F7B" />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                <Text className="text-2xl font-bold font-cookie">
                  JustGram  
                </Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Feather name="log-out" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <ListPost item={item} />}
                contentContainerStyle={{ paddingBottom: 110 }}
                onEndReached={() => fetchFeed(page)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#2B6F7B"
                    />
                }
            />
        </SafeAreaView>
    );
};

export default FeedScreen;