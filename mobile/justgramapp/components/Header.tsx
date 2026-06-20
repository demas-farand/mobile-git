import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
}

const Header = ({ title = "JustGram", showBack = true }: HeaderProps) => {
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-between py-4 px-4 bg-background">
            <Text className="font-cookie text-3xl text-active">{title}</Text>
            {showBack && (
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left-circle" size={30} color="#2B6F7B" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;