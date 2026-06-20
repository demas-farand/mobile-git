import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface UserProfileTabProps {
    isBookmarks: boolean;
    setIsBookmarks: (value: boolean) => void;
}

const UserProfileTab = ({ isBookmarks, setIsBookmarks }: UserProfileTabProps) => {
    return (
        <View className="flex-row justify-center items-center px-4 py-4 gap-3">
            <TouchableOpacity
                onPress={() => setIsBookmarks(false)}
                className={`flex-1 py-3 rounded-xl items-center ${
                    !isBookmarks ? 'bg-[#2B6F7B]' : 'bg-transparent'
                }`}
            >
                <Text
                    className={`font-semibold ${!isBookmarks ? 'text-white' : 'text-gray-500'}`}
                >
                    Posts
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setIsBookmarks(true)}
                className={`flex-1 py-3 rounded-xl items-center ${
                    isBookmarks ? 'bg-[#2B6F7B]' : 'bg-transparent'
                }`}
            >
                <Text
                    className={`font-semibold ${isBookmarks ? 'text-white' : 'text-gray-500'}`}
                >
                    Bookmarks
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserProfileTab;