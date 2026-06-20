import React from 'react';
import { View, Text, Image } from 'react-native';

interface UserInfoProps {
    profile: {
        image?: string;
        fullname: string;
        username: string;
        bio?: string;
        followerCount: number;
        followingCount: number;
    };
}

const UserInfo = ({ profile }: UserInfoProps) => {
    return (
        <View className="items-center pt-4 px-4">
            <View className="flex-row items-center justify-center mb-4">
                <View className="items-center w-20">
                    <Text className="text-xl font-bold text-gray-900">
                        {profile?.followerCount ?? 0}
                    </Text>
                    <Text className="text-gray-500 text-sm">followers</Text>
                </View>

                <Image
                    source={{ uri: profile?.image || 'https://via.placeholder.com/150' }}
                    className="w-24 h-24 rounded-full mx-6 bg-slate-200"
                />

                <View className="items-center w-20">
                    <Text className="text-xl font-bold text-gray-900">
                        {profile?.followingCount ?? 0}
                    </Text>
                    <Text className="text-gray-500 text-sm">following</Text>
                </View>
            </View>

            <Text className="text-lg font-bold text-gray-900">{profile?.fullname}</Text>
            <Text className="text-gray-400 mb-1">{profile?.username}</Text>
            {profile?.bio ? (
                <Text className="text-gray-700 text-center mb-2">{profile.bio}</Text>
            ) : null}
        </View>
    );
};

export default UserInfo;