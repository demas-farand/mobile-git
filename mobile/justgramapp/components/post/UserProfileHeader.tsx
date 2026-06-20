import React from 'react';
import { View } from 'react-native';
import UserInfo from './UserInfo';
import BtnFollow from './BtnFollow';
import UserProfileTab from './UserProfileTab';

interface UserProfileHeaderProps {
    profile: any;
    isOwnProfile: boolean;
    isBookmarks: boolean;
    setIsBookmarks: (value: boolean) => void;
}

const UserProfileHeader = ({
    profile,
    isOwnProfile,
    isBookmarks,
    setIsBookmarks,
}: UserProfileHeaderProps) => {
    return (
        <View>
            <UserInfo profile={profile} />

            {!isOwnProfile && (
                <View className="items-center mb-2">
                    {profile?.id && (
                    <BtnFollow targetUserId={profile.id} />
)}
                </View>
            )}

            <View className="h-px bg-gray-200 mx-4 mt-2" />

            <UserProfileTab isBookmarks={isBookmarks} setIsBookmarks={setIsBookmarks} />
        </View>
    );
};

export default UserProfileHeader;