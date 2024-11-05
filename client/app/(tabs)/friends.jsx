import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import friends from '../mockData';

const FriendsList = () => {
    const [search, setSearch] = useState('');

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by name..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={text => setSearch(text)}
            />
            <ScrollView>
                {filteredFriends.map(friend => (
                    <TouchableOpacity key={friend.id} style={styles.friendCard}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: friend.photo }} style={styles.image} />
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name}>{friend.name}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.info}>{`${friend.studyYear} | ${friend.degree}`}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchBar: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#000',
    },
    friendCard: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 10,
    },
    imageContainer: {
        paddingLeft: 10,
        marginRight: 20,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    separator: {
        backgroundColor: '#d3d3d3',
        height: 1,
        width: '90%',
        marginBottom: 4,
    },
    info: {
        fontSize: 14,
        color: '#666',
    },
});

export default FriendsList;
