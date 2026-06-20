import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';

const BtnFollow = ({ targetUserId, customClass }: { targetUserId: number, customClass?: string }) => {
    const { token, user } = useAuthStore();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (user?.id === targetUserId) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/follow/${targetUserId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.data) {
                    setIsFollowing(true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkFollowStatus();
    }, [targetUserId]);

    const handleToggleFollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/follow/${targetUserId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setIsFollowing(false);
            } else {
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/follow`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ followUserId: targetUserId }) 
                });
                if (res.ok) setIsFollowing(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.id === targetUserId) return null;

    const appliedClass = customClass || "px-16 py-3 rounded-full mt-6";

    return (
        <TouchableOpacity
            onPress={handleToggleFollow}
            disabled={isLoading}
            className={`${appliedClass} ${isFollowing ? 'bg-gray-200' : 'bg-[#2B6F7B]'}`}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={isFollowing ? "black" : "white"} />
            ) : (
                <Text className={`font-bold text-center ${isFollowing ? 'text-black' : 'text-white'}`}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default BtnFollow;