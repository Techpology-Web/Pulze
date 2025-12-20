import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function MainLayout({ children }) {
    const [selectedSegment, setSelectedSegment] = useState('foryou');
    const { width } = useWindowDimensions();

    const handleSegmentPress = (segment) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedSegment(segment);
    };

    const handleMenuPress = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Handle menu press
    };

    const handleFilterPress = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Handle filter press
    };

    const handleTabPress = (tabName) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Handle tab navigation
    };

    const isSmallScreen = width < 375;
    const headerPadding = isSmallScreen ? 12 : 16;
    const iconSize = isSmallScreen ? 22 : 24;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top Header */}
            <View style={[styles.header, { paddingHorizontal: headerPadding }]}>
                {/* Hamburger Menu Button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleMenuPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="menu" size={iconSize} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Segmented Control */}
                <View style={styles.segmentedControl}>
                    <TouchableOpacity
                        style={[
                            styles.segment,
                            selectedSegment === 'foryou' && styles.segmentActive,
                            { paddingHorizontal: isSmallScreen ? 12 : 16 }
                        ]}
                        onPress={() => handleSegmentPress('foryou')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="star-outline"
                            size={16}
                            color={selectedSegment === 'foryou' ? '#000000' : '#FFFFFF'}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                                styles.segmentText,
                                selectedSegment === 'foryou' && styles.segmentTextActive,
                            ]}
                        >
                            For you
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.segment,
                            selectedSegment === 'nearby' && styles.segmentActive,
                            { paddingHorizontal: isSmallScreen ? 12 : 16 }
                        ]}
                        onPress={() => handleSegmentPress('nearby')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color={selectedSegment === 'nearby' ? '#000000' : '#FFFFFF'}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                                styles.segmentText,
                                selectedSegment === 'nearby' && styles.segmentTextActive,
                            ]}
                        >
                            Nearby
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleFilterPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="options-outline" size={iconSize} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={styles.content}>
                {children}
            </View>

            {/* Bottom Navigation Bar */}
            <SafeAreaView edges={['bottom']} style={styles.bottomNavContainer}>
                <View style={[styles.bottomNav, { paddingHorizontal: headerPadding }]}>
                    <TouchableOpacity
                        style={[styles.bottomNavItem, styles.bottomNavItemActive]}
                        onPress={() => handleTabPress('home')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.bottomNavIconContainer}>
                            <Ionicons name="home" size={24} color="#000000" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bottomNavItem}
                        onPress={() => handleTabPress('explore')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="compass-outline" size={24} color="#666666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bottomNavItem}
                        onPress={() => handleTabPress('favorites')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="heart-outline" size={24} color="#666666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bottomNavItem}
                        onPress={() => handleTabPress('messages')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chatbubbles-outline" size={24} color="#666666" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        backgroundColor: '#000000',
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 25,
        padding: 4,
        minWidth: 200,
        maxWidth: 280,
        flex: 1,
        marginHorizontal: 12,
    },
    segment: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 20,
        minHeight: 36,
    },
    segmentActive: {
        backgroundColor: '#FFFFFF',
    },
    segmentText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    segmentTextActive: {
        color: '#000000',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        backgroundColor: '#000000',
    },
    bottomNavContainer: {
        backgroundColor: '#1A1A1A',
        borderTopWidth: 0.5,
        borderTopColor: '#2A2A2A',
    },
    bottomNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 8,
        minHeight: 56,
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        minHeight: 40,
    },
    bottomNavItemActive: {
        // Active state handled by iconContainer
    },
    bottomNavIconContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
});