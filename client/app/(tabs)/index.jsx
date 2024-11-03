import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { getUserData } from '@/hooks/userContext';

const HomeTab = () => {
  const { setUserId } = getUserData();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log('params', id);
    if (id) {
      setUserId(id);
    }
  }, [id]);

  return (
    <View>
      <Text>Homepage</Text>
    </View>
  );
};

export default HomeTab;
