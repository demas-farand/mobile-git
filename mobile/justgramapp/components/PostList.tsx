import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BtnBookmark from '@/components/post/BtnBookmark';
import React from 'react';

const ListPost = ({ item }) => {
    const router = useRouter();

    const goToDetail = () => {
        router.push(`/post/${item.id}`);
    };

    const goToProfile = () => {
        router.push(`/${item.user.username}`);
    };

    return (
        <View className="mb-6">
            <TouchableOpacity className="flex-row items-center px-4 py-3" onPress={goToProfile}>
                <Image
                    source={{ uri: item.user.image }}
                    className="w-8 h-8 rounded-full bg-slate-200"
                />
                <Text className="ml-3 font-semibold text-gray-800 text-[15px]">
                    {item.user.username}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} onPress={goToDetail}>
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-[400px] bg-slate-200"
                    resizeMode="cover"
                />
            </TouchableOpacity>

            <View className="flex-row justify-between items-center px-4 py-3">
                <View className="flex-row items-center">
                    <TouchableOpacity className="mr-4">
                        <Feather name="heart" size={24} color="#262626" />
                    </TouchableOpacity>
                    <TouchableOpacity className="mr-4" onPress={goToDetail}>
                        <Feather name="message-circle" size={24} color="#262626" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="send" size={24} color="#262626" />
                    </TouchableOpacity>
                </View>
                <BtnBookmark postId={item.id} />
            </View>

            <View className="px-4">
                <Text className="text-gray-800 text-[14px] leading-relaxed">
                    <Text className="font-bold">{item.user.username}</Text>{' '}
                    {item.caption}
                </Text>
            </View>
        </View>
    );
};

export default ListPost;