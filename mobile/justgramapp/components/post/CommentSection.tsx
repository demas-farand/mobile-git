import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Feather } from '@expo/vector-icons';

const CommentSection = ({ postId, comments, onCommentAdded }: any) => {
    const { token, user } = useAuthStore();
    const [commentText, setCommentText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handlePostComment = async () => {
        if (!commentText.trim()) return;

        setIsPosting(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    postId: Number(postId), 
                    content: commentText 
                })
            });

            if (response.ok) {
                setCommentText('');
                onCommentAdded();
            } else {
                Alert.alert("Gagal", "Gagal mengirim komentar.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        Alert.alert(
            "Hapus Komentar",
            "Yakin ingin menghapus komentar ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/comment/${commentId}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (response.ok) {
                                onCommentAdded(); 
                            } else {
                                Alert.alert("Gagal", "Gagal menghapus komentar.");
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="px-4 mt-4">
            <Text className="font-bold text-gray-800 mb-2">Comments</Text>
            
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row mb-3 items-center justify-between">
                        <View className="flex-row flex-1 mr-3">
                            <Text className="font-bold text-gray-800 mr-2">{item.user.username}</Text>
                            <Text className="text-gray-600 flex-1">{item.content}</Text>
                        </View>
                        {user?.id === item.userId && (
                            <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                <Feather name="trash-2" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                scrollEnabled={false}
            />

            <View className="flex-row items-center mt-2 border-t border-gray-100 pt-3">
                <TextInput
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 bg-gray-50"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <TouchableOpacity 
                    onPress={handlePostComment} 
                    disabled={isPosting}
                    className="ml-3"
                >
                    {isPosting ? (
                        <ActivityIndicator size="small" color="#2B6F7B" />
                    ) : (
                        <Text className="text-[#2B6F7B] font-bold">Post</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CommentSection;