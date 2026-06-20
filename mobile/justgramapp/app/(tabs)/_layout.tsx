import React from 'react';
import { Dimensions, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/utils/color';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.active,
                tabBarInactiveTintColor: colors.inactive,
                tabBarShowLabel: false,
                tabBarLabelPosition: 'beside-icon',
                
                tabBarItemStyle: {
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                },

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 35,
                    right: 35,
                    marginHorizontal: 15,
                    backgroundColor: '#F4F8F9',
                    height: 60,
                    borderRadius: 20,
                    borderTopWidth: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                width: 55,
                                height: 55,
                                borderRadius: 27.5,
                                backgroundColor: colors.active,
                                justifyContent: "center",
                                alignItems: "center",
                                top: Platform.OS === 'ios' ? -10 : -2,
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                            }}
                        >
                            <Feather name="plus" size={30} color="white" />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="update"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;