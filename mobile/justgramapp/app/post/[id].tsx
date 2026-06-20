import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import CommentSection from '@/components/post/CommentSection';

const PostDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { token, user } = useAuthStore();

    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (response.ok) {
                setPost(result.data);
                setLikeCount(result.data.likeCount ?? 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkLikeStatus = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/like/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (response.ok) setIsLiked(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
            checkLikeStatus();
        }
    }, [id]);

    const handleLike = async () => {
        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/like/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                setIsLiked(!nextLiked);
                setLikeCount((prev) => (nextLiked ? prev - 1 : prev + 1));
            }
        } catch (error) {
            console.error(error);
            setIsLiked(!nextLiked);
            setLikeCount((prev) => (nextLiked ? prev - 1 : prev + 1));
        }
    };

    const handleDeletePost = () => {
        Alert.alert(
            "Hapus Postingan",
            "Yakin ingin menghapus postingan ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/feed/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            if (response.ok) {
                                router.back();
                            } else {
                                Alert.alert("Gagal", "Gagal menghapus postingan");
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    } 
                }
            ]
        );
    };

    const handleCommentAdded = () => {
        fetchPost();
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#2B6F7B" />
            </SafeAreaView>
        );
    }

    if (!post) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-400">Post tidak ditemukan</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="ml-4 font-bold text-lg">Post</Text>
                </View>
                
                {user?.id === post.userId && (
                    <TouchableOpacity onPress={handleDeletePost}>
                        <Feather name="trash-2" size={22} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    onPress={() => router.push(`/detail/user/${post.user.username}`)}
                    className="flex-row items-center px-4 py-3"
                >
                    <Image
                        source={{ uri: post.user?.image || 'https://via.placeholder.com/40' }}
                        className="w-9 h-9 rounded-full mr-3 bg-slate-200"
                    />
                    <Text className="font-semibold text-gray-900">{post.user?.username}</Text>
                </TouchableOpacity>

                <Image
                    source={{ uri: post.image }}
                    className="w-full h-[450px] bg-slate-200"
                    resizeMode="cover"
                />

                <View className="flex-row justify-between items-center px-4 py-3">
                    <View className="flex-row items-center">
                        <TouchableOpacity className="mr-4" onPress={handleLike}>
                            <Feather
                                name="heart"
                                size={26}
                                color={isLiked ? '#e63946' : '#262626'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className="mr-4">
                            <Feather name="message-circle" size={26} color="#262626" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Feather name="send" size={26} color="#262626" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Feather name="bookmark" size={26} color="#262626" />
                    </TouchableOpacity>
                </View>

                <View className="px-4 mb-2">
                    <Text className="font-semibold text-[14px] mb-1">{likeCount} likes</Text>
                    <Text className="text-gray-800 text-[14px] leading-relaxed">
                        <Text className="font-bold">{post.user?.username}</Text>{' '}
                        {post.caption}
                    </Text>
                </View>

                <CommentSection
                    postId={post.id}
                    comments={post.comments || []}
                    onCommentAdded={handleCommentAdded}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PostDetailScreen;