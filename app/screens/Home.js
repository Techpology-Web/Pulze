import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, PanResponder, Animated as RNAnimated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

// Mock data
const mockAccounts = [
    {
        image_array: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
        ],
        full_name: 'Klara Lundin',
        bio: 'I love the outdoors, long walks on the beach, and sailing. Looking for a hiking partner.',
        gender: 1, // 0: male, 1: female
        age: 23,
    },
    {
        image_array: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
        ],
        full_name: 'Marcus Johnson',
        bio: 'Photographer, traveler, coffee enthusiast. Always up for an adventure!',
        gender: 0,
        age: 28,
    },
    {
        image_array: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        ],
        full_name: 'Sofia Martinez',
        bio: 'Yoga instructor and wellness coach. Passionate about mindfulness and healthy living.',
        gender: 1,
        age: 26,
    },
    {
        image_array: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
        ],
        full_name: 'Alex Chen',
        bio: 'Software engineer, music lover, and foodie. Let\'s grab dinner and talk about tech!',
        gender: 0,
        age: 31,
    },
];

function ProfileCard({ account, onMatch, onNoMatch, onNextUser }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const translateX = useRef(new RNAnimated.Value(0)).current;
    const translateY = useRef(new RNAnimated.Value(0)).current;
    const rotate = useRef(new RNAnimated.Value(0)).current;
    const scale = useRef(new RNAnimated.Value(1)).current;

    const maxImageIndex = account.image_array.length - 1;

    // Reset animation when account changes
    React.useEffect(() => {
        translateX.setValue(0);
        translateY.setValue(0);
        rotate.setValue(0);
        scale.setValue(1);
        setCurrentImageIndex(0);
    }, [account]);

    const handleImageClick = (side) => {
        if (side === 'left' && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else if (side === 'right' && currentImageIndex < maxImageIndex) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                translateX.setOffset(translateX._value);
                translateY.setOffset(translateY._value);
                rotate.setOffset(rotate._value);
                // Don't use offset for scale to avoid accumulation issues
                translateX.setValue(0);
                translateY.setValue(0);
                rotate.setValue(0);
            },
            onPanResponderMove: (evt, gestureState) => {
                translateX.setValue(gestureState.dx);
                translateY.setValue(gestureState.dy * 0.2);
                // Calculate rotation based on horizontal movement (more subtle like Tinder)
                const rotationDeg = gestureState.dx / 15;
                rotate.setValue(rotationDeg);
                // Calculate scale - gets smaller as you drag further (like Tinder)
                // The further you drag, the smaller it gets
                const dragDistance = Math.abs(gestureState.dx);
                const maxDrag = SCREEN_WIDTH * 0.5; // Scale based on half screen width
                const scaleFactor = Math.min(dragDistance / maxDrag, 1); // Clamp to 0-1
                const scaleAmount = 1 - (scaleFactor * 0.25); // Scale down up to 25% (from 1.0 to 0.75)
                scale.setValue(Math.max(0.75, scaleAmount));
            },
            onPanResponderRelease: (evt, gestureState) => {
                translateX.flattenOffset();
                translateY.flattenOffset();
                rotate.flattenOffset();
                // Scale doesn't use offset, so no need to flatten
                const swipeThreshold = 100;

                if (gestureState.dx > swipeThreshold) {
                    // Swipe right = match (exit to bottom-right corner)
                    const exitX = SCREEN_WIDTH * 1.5;
                    const exitY = SCREEN_HEIGHT * 0.6;
                    const exitRotate = 25;
                    const currentScale = scale._value; // Get current scale value

                    RNAnimated.parallel([
                        RNAnimated.timing(translateX, {
                            toValue: exitX,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(translateY, {
                            toValue: exitY,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(rotate, {
                            toValue: exitRotate,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(scale, {
                            toValue: 0.6, // Scale down to 60% when exiting
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        onMatch(account);
                        onNextUser();
                    });
                } else if (gestureState.dx < -swipeThreshold) {
                    // Swipe left = no match (exit to bottom-left corner)
                    const exitX = -SCREEN_WIDTH * 1.5;
                    const exitY = SCREEN_HEIGHT * 0.6;
                    const exitRotate = -25;
                    const currentScale = scale._value; // Get current scale value

                    RNAnimated.parallel([
                        RNAnimated.timing(translateX, {
                            toValue: exitX,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(translateY, {
                            toValue: exitY,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(rotate, {
                            toValue: exitRotate,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        RNAnimated.timing(scale, {
                            toValue: 0.6, // Scale down to 60% when exiting
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        onNoMatch(account);
                        onNextUser();
                    });
                } else {
                    // Snap back to center
                    RNAnimated.parallel([
                        RNAnimated.spring(translateX, { 
                            toValue: 0, 
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                        RNAnimated.spring(translateY, { 
                            toValue: 0, 
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                        RNAnimated.spring(rotate, { 
                            toValue: 0, 
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                        RNAnimated.spring(scale, { 
                            toValue: 1, 
                            useNativeDriver: true,
                            tension: 50,
                            friction: 7,
                        }),
                    ]).start();
                }
            },
        })
    ).current;

    const genderIcon = account.gender === 1 ? '♀' : '♂';
    const genderColor = account.gender === 1 ? '#FF69B4' : '#4169E1';

    // Convert rotate value to degrees string
    const rotateDeg = rotate.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    return (
        <RNAnimated.View 
            style={[
                styles.card,
                {
                    transform: [
                        { translateX: translateX },
                        { translateY: translateY },
                        { rotate: rotateDeg },
                        { scale: scale },
                    ],
                },
            ]}
            {...panResponder.panHandlers}
        >
            {/* Left side clickable area for previous image */}
            <TouchableOpacity 
                style={styles.imageNavigationLeft}
                onPress={() => handleImageClick('left')}
                activeOpacity={0.8}
            />
            
            {/* Right side clickable area for next image */}
            <TouchableOpacity 
                style={styles.imageNavigationRight}
                onPress={() => handleImageClick('right')}
                activeOpacity={0.8}
            />

            <Image
                source={{ uri: account.image_array[currentImageIndex] }}
                style={styles.cardImage}
                contentFit="cover"
                transition={200}
            />
                
                {/* Gradient overlay for text readability */}
                <View style={styles.gradientOverlay}>
                    <View style={styles.gradientOverlayDark} />
                    <View style={styles.gradientOverlayFade} />
                </View>
                
                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.profileHeader}>
                        <Text style={styles.profileName}>
                            {account.full_name}, {account.age}
                        </Text>
                        <Text style={[styles.genderIcon, { color: genderColor }]}>
                            {genderIcon}
                        </Text>
                    </View>
                    <Text style={styles.profileBio}>{account.bio}</Text>
                </View>

                {/* Pagination Dots */}
                {account.image_array.length > 1 && (
                    <View style={styles.pagination}>
                        {account.image_array.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentImageIndex && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                )}
            </RNAnimated.View>
    );
}

export default function HomeScreen() {
    const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
    const keyRef = React.useRef(0);
    const matchArray = React.useRef([]);
    const noMatchArray = React.useRef([]);

    const handleMatch = (account) => {
        matchArray.current.push(account);
        // Empty function - just stores to array
    };

    const handleNoMatch = (account) => {
        noMatchArray.current.push(account);
        // Empty function - just stores to array
    };

    const handleNextUser = () => {
        if (currentAccountIndex < mockAccounts.length - 1) {
            setCurrentAccountIndex(currentAccountIndex + 1);
        } else {
            // Loop back to start
            setCurrentAccountIndex(0);
        }
        // Force re-render of card to reset image index
        keyRef.current += 1;
    };

    const currentAccount = mockAccounts[currentAccountIndex];

    return (
        <View style={styles.container}>
            {currentAccount && (
                <ProfileCard
                    key={keyRef.current}
                    account={currentAccount}
                    onMatch={handleMatch}
                    onNoMatch={handleNoMatch}
                    onNextUser={handleNextUser}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: SCREEN_WIDTH * 0.95,
        height: CARD_HEIGHT,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    gradientOverlayDark: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    gradientOverlayFade: {
        position: 'absolute',
        bottom: '40%',
        left: 0,
        right: 0,
        height: '20%',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    profileInfo: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        marginRight: 8,
    },
    genderIcon: {
        fontSize: 24,
        fontWeight: '600',
    },
    profileBio: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '400',
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        gap: 6,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    paginationDotActive: {
        backgroundColor: '#9D4EDD',
        width: 24,
    },
    imageNavigationLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.25,
        zIndex: 5,
    },
    imageNavigationRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.25,
        zIndex: 5,
    },
});