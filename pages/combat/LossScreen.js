import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity } from 'react-native';
import Duck from '../../modules/CharDuck';
import { ReferenceDataContext } from '../../components/ReferenceDataContext';
import HealthBar from '../../modules/HealthBar';
import { getSpriteFrames } from '../../modules/CharDuck';
import SpriteAnimation from '../../modules/SpriteAnimation'; 
import { Audio } from 'expo-av';

const window = Dimensions.get('window');
const backgroundImage = require('../../images/Backgrounds/background.gif');
const defeatBanner = require('../../images/CombatScreen/defeatBanner.png');

const LossScreen = ({ navigation }) => {
  const { selectedDuck, playerHealth } = useContext(ReferenceDataContext);
  const healthBarRef = useRef(null);
  this.soundObject = new Audio.Sound();

  useEffect(() => {
    handlePlay(); // Call handlePlay when component mounts
    return () => {
      // Clean up function to unload sound when component unmounts
      soundObject.unloadAsync();
    };
  }, []);


  handlePlay = async () => {
    if (this.soundObject._loaded) {
      try {
        // If loaded, play the sound
        await this.soundObject.replayAsync();
      } catch (error) {
        console.error('Error replaying the sound:', error);
      }
    } else {
      // If not loaded, load and play the sound
      try {
        await this.soundObject.loadAsync(require('../../assets/sfx/defeat.wav'));
        await this.soundObject.playAsync();
      } catch (error) {
        console.error('Error loading or playing the sound:', error);
      }
    }
  }

  useEffect(() => {
    if (healthBarRef.current) {
      healthBarRef.current.setCurrentHealth(playerHealth);
    }
  }, [playerHealth]);

  let duckContent;

  const spriteFrames = getSpriteFrames(selectedDuck);

  if (selectedDuck === 5 || selectedDuck === 6) {
    duckContent = (
      <SpriteAnimation
        idleFrames={spriteFrames.idleFrames}
        walkFrames={spriteFrames.walkFrames}
        celebrateFrames={spriteFrames.celebrateFrames}
        deadFrames={spriteFrames.deadFrames}
        playDead={true} 
      />
    );
  } else {
    duckContent = (
      <Duck duckType={selectedDuck} />
    );
  }

  return (
    <View>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.bannerContainer}>
          <Image source={defeatBanner} style={styles.banner} />
        </View>
        {duckContent}
        <View style={styles.healthBarContainer}>
          <HealthBar ref={healthBarRef} currentHealthProp={playerHealth} barName="PlayerHealth" />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('CombatModeScreen')}
        >
          <Text style={styles.buttonText}>Back To Menu</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LossScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    width: window.width * 0.7,
    height: window.height * 0.1,
    backgroundColor: '#FF4242',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: window.height * 0.05,
  },
  buttonText: {
    fontFamily: 'NiceTango-K7XYo',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontSize: window.width * 0.075,
    color: 'white',
  },
  bannerContainer: {
    width: window.width * 0.7,
    aspectRatio: 702 / 614, 
    marginTop: window.height * 0.04,
    marginBottom: window.height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: window.width * 0.11,
    fontFamily: 'NiceTango-K7XYo',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: window.height * 0.06,
  },
  healthBarContainer: {
    left: window.width * 0.1,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
