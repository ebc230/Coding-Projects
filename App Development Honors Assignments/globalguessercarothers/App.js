import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import MapView, { Marker, Polyline } from "react-native-maps";
import { getDistance } from "geolib";

import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imgs = [
  {
    id: 1,
    title: 'Shakespeares Globe Theater',
    imageR: require('./assets/-theatre-shakespeares-globe.webp'),
    lat:51.508106,
    long:-0.097300,
  },
  {

    id: 2,
    title: 'Düsseldorfer Schauspielhaus Theater',
    imageR: require('./assets/Dusseldorfer_theater.jpg'),
    lat: 51.227863,
    long: 6.783275,
  },
  {
    id: 3,
    title: 'Balboa Theatre',
    imageR: require('./assets/Balboa_Theatre,_San_Diego.jpg'),
    lat:32.714296,
    long:-117.161363,
  },
  {
    id: 4,
    title: 'National Noh Theater',
    imageR: require('./assets/national_noh_theater'),
    lat: 35.680279,
    //24.961035,
    long: 139.708145,
    //121.549245,
  },
  {
    id: 5,
    title: 'Minack Theatre',
    imageR: require('./assets/theatre_minack.webp'),
    lat: 50.041084,
    long: -5.651484,

  },
  {
    id: 6,
    title: 'Teatro Manoel',
    imageR: require('./assets/teatro-manoel.jpg'),
    lat: 35.899758,
    long: 14.512574,
  },
  {
    id: 7,
    title: 'The Elgin and Winter Garden Theater',
    imageR: require('./assets/elgin_and_winter_theater.jpg'),
    lat:43.653031,
    long:-79.379291,
  },
  {
    id: 8,
    title: 'Palais Garnier Theater',
    imageR: require('./assets/palais-garnier.webp'),
    lat:48.870902,
    long: 2.332151,
  },
  {
    id: 9,
    title: 'Teatro Amazonas',
    imageR: require('./assets/140415132015-theatre-amazonas.webp'),
    lat: -3.130397,
    long: -60.023329,
  },

  {
    id: 10,
    title: 'La Scala Theater',
    imageR: require('./la_scala.jpg'),
    lat:45.467440,
    long:9.189394,

  }
  
];



export default function App() {
   const [guess, setGuess] = useState(null);
   const[placesD, setPlacesD] = useState([]);
   const[guessed, setGuessed] = useState(false);
   const[newG, setNewG] = useState(false);
   const[currPlace, setCurrPlace] = useState( 0 );

   const[distance, setDistance] = useState();
   const[nextBT, setNextBT] = useState('Next');
   const[color, setColor] = useState('darkgrey');



    const mapRef = useRef(null);


    const[highScore, setHighScore] = useState(null);
    const[currScore, setCurrScore] = useState(0);


    const saveScore = async (t) => {
      try {
        
        const stored = await AsyncStorage.getItem('highScore');
        const current = stored !== null ? Number(stored) : null;

        if (current === null || t > current) {
            await AsyncStorage.setItem('highScore', t.toString());
            setHighScore(t);
        }


      
      } catch (error) {
        console.log('Error saving score:', error);
      }


    
  
};

   useEffect(() => {

     setPlacesD([currPlace]);





      const loadScore = async () => {
        try {
          const value = await AsyncStorage.getItem('highScore');
          

        if (value !== null) {
          setHighScore(Number(value));
      } else {
        setHighScore(null); // nothing saved yet
      }

        } catch (error) {
          console.error('Error reading value:', error);
        }
    };

    loadScore();




     }, []);


   const nextB = () => {

     setGuess(null);


     //console.log("num places guessed: " + placesD.length );


  let r = currPlace + 1;
     
     

     let t = true;

     if(placesD.length !== 10){
       setGuessed(false);
        setNewG(true);


      
       

       setCurrPlace(r);
     
      setPlacesD((prev) => [...prev, r]);
      if(placesD.length === 9){
        setNextBT('Restart');
        setColor('red');

      }
      
     

     
     }
     else if (placesD.length === 10){

       //console.log("all done");
       saveScore(currScore);
       restart();


       

     }
     

     
     

   };

 



   const guessB = () =>{

     if(guess){

     setGuessed(true);

      mapRef.current.fitToCoordinates(
        [guess, placeCoord],
        {
          animated: true,
        }
      );

      setTimeout(() => {
      mapRef.current.animateToRegion({

        latitude: placeCoord.latitude,
        longitude: placeCoord.longitude,
        latitudeDelta: distance/700,
        longitudeDelta: distance/700,
      }, 800);
    }, 1500);

    calcScore();

     }





   };

   const calcScore = () => {

     let s = 0;

     if(distance <= 10){
       s = 10000;
     }

     else if(distance <= 50){
       s = 7000;
     }

     else if(distance <= 100){
       s = 5000;
     }
     else if(distance <= 500 ){
       s = 4500;

     }
     else if(distance <= 1500 ){
       s = 4000;

     }
     else if(distance <= 2500 ){
       s = 3000;

     }
     else if(distance <= 4500 ){
       s = 2000;

     }
     else if(distance <= 5000 ){
       s = 1500;

     }
     else if(distance <= 7000 ){
       s = 1000;

     }
     else if(distance <= 10000 ){
       s = 500;

     }
     else if(distance <= 15000 ){
       s = 250;

     }
     else if(distance <= 20000 ){
       s = 50;

     }


    setCurrScore(currScore + s);

   };

    //console.log("currPlace: " + currPlace);
    //console.log("lat: " + imgs[currPlace].lat);
    //console.log("long: " + imgs[currPlace].long);
  

  const placeCoord = {

    latitude: (imgs[currPlace].lat),
    longitude: (imgs[currPlace].long),
  };



  const handleMapPress = (e) => {

 

    setNewG(false);

    if(!guessed)
    {
      const coords = e.nativeEvent.coordinate;
      setGuess(coords);

      let d = (getDistance(coords, placeCoord))/ 1609.344; //convert to miles
      setDistance(d);
      console.log("Distance (miles):", d);

    }
    
  };


    const restart = () => {

      setCurrScore(0);
      setNextBT('Next');
      setCurrPlace(0);
      setGuess(null);
      setPlacesD([0]);
      setGuessed(false);
      setNewG(false);
      setColor('darkgrey');
  

   };


  






  return (
    <View style={styles.container}>
      <View style={styles.topAbot}>
        <View style={styles.scoreB}>
          <Text style={styles.scT}>
          Score: {currScore}
          </Text>
        </View>
        <View style={styles.scoreB}>
          <Text style={styles.scT}>
            High Score: {highScore}
          </Text>
        </View>
      
      </View>


     <MapView style={styles.map} 
     onPress={handleMapPress}
     ref={mapRef}
     >

     console.log(guess);
      {!newG && guess &&
      <Marker 
      coordinate={guess} 
      identifier="guess"
      pinColor="purple"
      title="Your Guess"
      />}

      {guessed && (
          <>
            <Marker
              coordinate={placeCoord}
              identifier="real"
              title="Real Location"
              pinColor="green"
            />
            <Polyline
              coordinates={[guess, placeCoord]}
              strokeColor="black"
              strokeWidth={3}
            />
          </>
        )}

     </MapView>

     <View style={styles.picS}>
      <Image style={styles.showI} source={imgs[currPlace].imageR}/>
  )}

     </View>

     <View style={styles.topAbot}>

     <TouchableOpacity 
        style = {styles.gBut}
        disabled= {guessed}
        

        onPress={() => guessB()}> 
        
``  
          <Text style = {[styles.butT, {color: 'darkgrey'}]}> 
            Guess
          </Text>

      </TouchableOpacity>
      <TouchableOpacity 
        style = {styles.nBut}
        disabled = {!guessed}
        onPress={() => nextB()}> 

          <Text style = {[styles.butT, {color}]}> 
            {nextBT}
          </Text>

      </TouchableOpacity>
      
      </View>
    </View>
  );
}

const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;
let font = wW*0.15;
let bw = (wW/50)*50;
let bh = (wH/2)*0.3;
let bd = bw*0.2;
let marg = wW*0.04;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'center',
    justifyContent: 'center',
    backgroundColor: 'lavender',
    padding: 8,
  },
  map: {
    flex: 0.5,
    width: '100%',
    height: '70%',
     borderWidth: 5,
     borderColor: 'darkgrey'
  },

  topAbot:{
    margin: marg,
    flexDirection: 'row',
    flex: 0.16,
    justifyContent: 'center',
    backgroundColor: 'lavender',

  },

    picS:{
    margin: marg/1.5,
    flexDirection: 'row',
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: 'lavender',

  },

  gBut:{
     margin:marg,

    justifyContent: 'center',

    //borderWidth: 3,
    width: bw/2.3,
    height: bh/1.5,
    borderRadius: bd,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: "lavenderblush"

  },

  nBut:{
    margin:marg,

    justifyContent: 'center',

    //borderWidth: 3,
    width: bw/2.3,
    height: bh/1.5,
    borderRadius: bd,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: "lemonchiffon"
    
    

  },

  butT:{
    fontSize: font*0.7,
    fontWeight: 'bold',
    textAlign: 'center',
    //color: 'darkgrey',

  },

  scoreB:{
    margin: marg,
    justifyContent: 'center',
    backgroundColor: 'honeydew',
    borderWidth: 2,
    width: bw/2.4,
    height: bh/1.3,
    borderRadius: bd/2.8,
    borderColor: 'black',

  },

  scT:{
    fontSize: font*0.4,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'darkgrey',

  },

  showI:{
     width:bw*2,
    height: bh*1.5,
    //justifyContent: 'center',
    //margin: marg,

    //borderWidth: 4,
    

    resizeMode: "contain",
  

  },
});
