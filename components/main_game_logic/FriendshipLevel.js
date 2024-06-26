import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Button, StyleSheet, Text } from 'react-native';
import heart_empty from "../../images/ProfilePage/heart_empty.png";
import heart_full from "../../images/ProfilePage/heart_full.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TasksContext } from '../../components/main_game_logic/TasksContext';

const MAX_FRIENDSHIP = 5;

export const FriendshipLevel = ({ id, style = {} }) => {
  const { friendshipLevel, incrementFriendship } = useContext(TasksContext);

  useEffect(() => {
    const loadFriendshipLevel = async () => {
        const level = await AsyncStorage.getItem(`friendshipLevel_${id}`);
    };

    loadFriendshipLevel();
}, [id]);

useEffect(() => {
    AsyncStorage.setItem(`friendshipLevel_${id}`, friendshipLevel.toString());
    console.log(`Current Friendship Level: ${friendshipLevel}`);  // Logs the current level to the console
}, [friendshipLevel, id]);

  const updateHearts = () => {
    const hearts = [];
    for (let i = 0; i < MAX_FRIENDSHIP; i++) {
      hearts.push(
        <Image
          key={i}
          source={i < friendshipLevel ? heart_full : heart_empty}
          style={styles.heart}
        />
      );
    }
    return hearts;
  };

  const incrementHeart = () => {
    if (friendshipLevel < MAX_FRIENDSHIP) {
      setFriendshipLevel(prevLevel => prevLevel + 1);
    }
  };

  const decrementHeart = () => {
    if (friendshipLevel > 0) {
      setFriendshipLevel(prevLevel => prevLevel - 1);
    }
  };

  return (
    <View style={[styles.container, style]}> 
      {updateHearts()}
      <View style={styles.buttonsContainer}>
        <Button
          title="Add Heart"
          onPress={incrementHeart}
          disabled={friendshipLevel >= MAX_FRIENDSHIP}
        />
        <Button
          title="Remove Heart"
          onPress={decrementHeart}
          disabled={friendshipLevel === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure the buttons align nicely with the hearts
  },
  heart: {
    height: 49,
    width: 55,
    margin: 1, // Adds a little space around each heart
    transform: [{ scale: .8 }],
  },
  buttonsContainer: {
    flexDirection: 'column', // Layout the buttons horizontally
    marginLeft: 10, // Space between the hearts and the buttons
    opacity: 0
  },
});

export default FriendshipLevel;
