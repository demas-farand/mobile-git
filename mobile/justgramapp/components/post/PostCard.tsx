import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

const PostCard = ({ item }: { item: any }) => {
    const router = useRouter();
    const { token } = useAuthStore();

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.likeCount || 0);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const likeRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/like/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const likeData = await likeRes.json();
                if (likeRes.ok && likeData.data) setIsLiked(true);

                const saveRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/bookmark/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const saveData = await saveRes.json();
                if (saveRes.ok && saveData.data) setIsSaved(true);
            } catch (error) {
                console.error(error);
            }
        };
        checkStatus();
    }, [item.id]);

    const handleLike = async () => {
        const previousState = isLiked;
        const previousCount = likeCount;
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/like/${item.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                setIsLiked(previousState);
                setLikeCount(previousCount);
            }
        } catch (error) {
            setIsLiked(previousState);
            setLikeCount(previousCount);
        }
    };

    const handleSave = async () => {
        const previousState = isSaved;
        setIsSaved(!isSaved);

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/bookmark/${item.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) setIsSaved(previousState);
        } catch (error) {
            setIsSaved(previousState);
        }
    };

    return (
        <View className="mb-6">
            <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={() => router.push(`/detail/user/${item.user.username}`)}
            >
                <Image
                    source={{ uri: item.user.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                    className="w-8 h-8 rounded-full bg-slate-200"
                />
                <Text className="ml-3 font-semibold text-gray-800 text-[15px]">
                    {item.user.username}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/post/${item.id}`)}>
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[400px] bg-slate-200"
                    resizeMode="cover"
                />
            </TouchableOpacity>

            <View className="flex-row justify-between items-center px-4 py-3">
                <View className="flex-row items-center">
                    <TouchableOpacity className="mr-4 flex-row items-center" onPress={handleLike}>
                        <Feather name="heart" size={24} color={isLiked ? "red" : "#262626"} />
                        <Text className="ml-2 font-medium">{likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="mr-4 flex-row items-center" onPress={() => router.push(`/post/${item.id}`)}>
                        <Feather name="message-circle" size={24} color="#262626" />
                        <Text className="ml-2 font-medium">{item.commentCount || 0}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Feather name="bookmark" size={24} color={isSaved ? "#2B6F7B" : "#262626"} />
                </TouchableOpacity>
            </View>

            <View className="px-4">
                <Text className="text-gray-800 text-[14px] leading-relaxed">
                    <Text className="font-bold">{item.user.username}</Text> {item.caption}
                </Text>
            </View>
        </View>
    );
};

export default PostCard;