import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import storyModeLogo from '../../images/Logos/StoryModeLogo.png';
import swipeLeft from '../../images/TinderPage/cancel.png';
import swipeRight from '../../images/TinderPage/green-heart-button.png';
import briefCase from '../../images/TinderPage/briefcase.png';
import profileIcon from '../../images/ChatBotIcons/profileIcon.png';
import iButton from '../../images/TinderPage/i-button.png';
import BackArrow from '../../modules/BackArrow';
import verify from '../../images/TinderPage/verify.png';
import CircleImageGallery from '../../components/story_logic/CircleImageGallery';
import { playSFX } from '../../modules/playSFX';

const window = Dimensions.get('window');


const profiles = [
  { id: 1, name: 'Quaxly', age: 25, occupation: 'Professional Sleeper', bio: 'Are you a 2 cuz that\'s a 10 in binary', image: require('../../images/Backgrounds/forest_pfp.jpg'), animalType: require('../../images/PlayableAnimals/duckRizz.gif'), personality: 'Sporty', verified: false },
  { id: 2, name: 'Waddles', age: 21, occupation: 'Pond Ambassador', bio: 'Seeking someone for pond soirées', image: require('../../images/Backgrounds/duckPond.png'), animalType: require('../../images/PlayableAnimals/combatDuck.gif'), personality: 'Grumpy', verified: true },
  { id: 3, name: 'Floppers', age: 19, occupation: 'Divorce Attorney', bio: 'Willing to share my bread crumbs', image: require('../../images/Backgrounds/livingRoom.jpg'), animalType: require('../../images/PlayableAnimals/combatDuck2.gif'), personality: 'Smug', verified: true },
  // Add more profiles as needed...
];

const TinderSwipePage = ({ navigation }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const translateX = new Animated.Value(0);
  const [swipedProfiles, setSwipedProfiles] = useState([]);

  const onSwipeEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );
  const onSwipeRelease = (event) => {
    const { translationX, velocityX } = event.nativeEvent;

    if (Math.abs(translationX) > 50) {
      if (translationX > 0 && velocityX > 0.5) {
        animateSwipe('right');
      } else if (translationX < 0 && velocityX < -0.5) {
        animateSwipe('left');
      }
    } else {
      resetPosition();
    }
  };

  const animateSwipe = (direction) => {
    if (direction === 'left') {
      playSFX(require('../../assets/sfx/ac/ac-resignation.mp3'));
      Animated.timing(translateX, {
        toValue: -window.width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
        translateX.setValue(0);
      });
    } else if (direction === 'right') {
        playSFX(require('../../assets/sfx/ac/ac-amazed.mp3'));
        const currentProfile = profiles[currentProfileIndex];
        setSwipedProfiles([...swipedProfiles, currentProfile]);
        navigation.navigate('ChatBotScreen', { currentProfile });

        console.log(currentProfile.personality);
        console.log(currentProfile.name);
    }
  };

  const setAnimalProfileOnSwipe = () => {

  }

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      speed: 15,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const renderCurrentProfile = () => {
    const currentProfile = profiles[currentProfileIndex];

    return (
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
            {/* <TouchableOpacity
              onPress={() => navigation.goBack()} // Use navigation.goBack() to go back
            >
              <BackArrow />
            </TouchableOpacity> */}
      
          {/* <Image source={storyModeLogo} style={styles.imageLogo} /> */}
        </View>

        <CircleImageGallery/>
       
        <PanGestureHandler
          onGestureEvent={onSwipeEvent}
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === State.END) {
              onSwipeRelease(event);
            }
          }}
        >
          <Animated.View style={[styles.swipeContainer, { transform: [{ translateX }] }]}>
            <View style={styles.profileContainer}>
               <Image source={currentProfile.image} style={styles.pfpBackground} />
            
              <Image source={currentProfile.animalType} style={styles.duckContainer} />
              <View style = {styles.buttonContainer}>
                <TouchableOpacity onPress={() => animateSwipe('left')}>
                    <Image source={swipeLeft} style={styles.swipeLeftButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => animateSwipe('right')}>
                    <Image source={swipeRight} style={styles.swipeRightButton} />
                </TouchableOpacity>
              </View>

              <View style={styles.textContainer}>
              <View style={styles.nameContainer}>
                <View style={styles.nameInfoContainer}>
                  <Text style={styles.animalName}>{`${currentProfile.name}, ${currentProfile.age}`}</Text>
                  {currentProfile.verified && <Image source={verify} style={styles.verifyIcon} />}
                </View>
                <TouchableOpacity style={styles.informationButtonContainer}>
                  <Image source={iButton} style={styles.informationButton} />
                </TouchableOpacity>
              </View>

              <View style={styles.occPersonalityContainer}>
                <View style={styles.occupationContainer}>
                  <Image source={briefCase} style={styles.briefCase} />
                  <Text style={styles.occText}>{currentProfile.occupation}</Text>
                </View>
                
                <View style={styles.personalityContainer}>
                  <Image source={profileIcon} style={styles.profileIcon} />
                  <Text style={styles.occText}>{currentProfile.personality}</Text>
                </View>
              </View>
              <View style={styles.bioContainer}>
                <Text style={styles.bioText}>{currentProfile.bio}</Text>
              </View>

            </View>

            </View>
            
              
  

          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  };

  return renderCurrentProfile();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalName: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 5
  },
  swipeLeftButton: {
    width: 80,
    height: 80,
    left: -110,
    top: -30
    // marginBottom: 15,
  },
  swipeRightButton: {
    width: 80,
    height: 80,
    right: -110,
    top: -30
  },
  occText: {
    fontSize: 20
  },
  bioText: {
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: window.width * 0.1,
  },
  textContainer: {
    padding: 8,
    backgroundColor: 'white', // Grey with 50% opacity
    width: window.width,
    // position: 'absolute'
  },
  informationButton: {
    width: 30,
    height: 30,
    marginLeft: window.width * 0.35
  },
  verifyIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    marginLeft: 8
  },
  buttonContainer: {
    flexDirection: 'row', // Set items horizontally
    zIndex: 1, // Ensure Buttons are on top
    top: 20,
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  occupationContainer: {
    flexDirection: 'row', // Set items horizontally
    alignItems: 'center',
  },
  personalityContainer: {
    left: 15,
    flexDirection: 'row',
    alignItems: 'center,'
  },
  duckContainer: {
    // position: 'absolute',
    // justifyContent: 'center',
    // alignItems: 'center',
    // zIndex: 1,
    top: 90,
    width: 400,
    height: 400,
  },
  nameContainer: {
    flexDirection: 'row', // Set items horizontally
    alignItems: 'center',
  },
  image: {
    width: 200, // adjust the width as needed
    height: 200, // adjust the height as needed
  },
  imageLogo: {
    width: 220,
    height: 60
  },
  briefCase: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  profileIcon: {
    width: 20,
    height: 25,
    left: 3,
    marginRight: 10
  },
  pfpBackground:
  {
    height: window.height * 0.67,
    width: window.width,
    position: 'absolute', // Position it absolutely relative to its container
    
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  informationButtonContainer: {
    position: 'absolute',
    right: 10, // Adjust as needed
  },
  informationButton: {
    width: 30,
    height: 30,
  },
  occPersonalityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bioContainer: {
    marginTop: 5
    // left: 15
  }
});

export default TinderSwipePage;