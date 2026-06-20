import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

interface BtnBookmarkProps {
    postId: number;
    size?: number;
    color?: string;
}

const BtnBookmark = ({ postId, size = 24, color = '#262626' }: BtnBookmarkProps) => {
    const { token } = useAuthStore();
    const [isSaved, setIsSaved] = useState(false);
    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);

    const checkSavedStatus = async () => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/bookmark/${postId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const result = await response.json();
            if (response.ok) setIsSaved(result.data);
        } catch (error) {
            console.error('Check bookmark error:', error);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        if (postId) checkSavedStatus();
    }, [postId]);

    const handleToggleBookmark = async () => {
        const nextSaved = !isSaved;
        setIsSaved(nextSaved); // optimistic
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/bookmark/${postId}`,
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                setIsSaved(!nextSaved); // rollback
            }
        } catch (error) {
            console.error('Bookmark toggle error:', error);
            setIsSaved(!nextSaved);
        } finally {
            setLoading(false);
        }
    };

    if (checking) return null;

    return (
        <TouchableOpacity onPress={handleToggleBookmark} disabled={loading}>
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Feather
                    name="bookmark"
                    size={size}
                    color={isSaved ? '#2B6F7B' : color}
                />
            )}
        </TouchableOpacity>
    );
};

export default BtnBookmark;