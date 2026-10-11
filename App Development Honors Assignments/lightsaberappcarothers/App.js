import { StyleSheet, Text, Platform, View, TouchableOpacity,Image, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import {useState, useEffect, useRef} from 'react';
import { useAudioPlayer } from 'expo-audio';


export default function App() {
   const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

   const [mag, setMag] = useState(0);
   const [lastMag, setLastMag] = useState(0);
   const [sw, setSW] = useState(false);
   const [system, setSystem] = useState();
   

  const sounds = 
  [require('./assets/saber_on.mp3'), //on 0
  require('./assets/saber_off.mp3'), //off 1
  require('./assets/saber_swing.mp3'), //swing 2
  require('./assets/saber_crash.mp3') ]; // crash 3


  const player = useAudioPlayer();
  
  const [start, setStart] = useState(false);
  
  const [oo, setoo] = useState('On');// 'oo' means on/off in my head

   const [subscription, setSubscription] = useState(null);
  
 

  useEffect(() => {
    setSystem(Platform.OS);
    setSubscription(Accelerometer.addListener(setData));
    Accelerometer.setUpdateInterval(200);
  }, []);

  useEffect(() => {

    let m = mag;
    setLastMag(m);
    setMag(Math.sqrt( x*x + y*y + z*z ));

     }, [x,y,z]);

  const onB = () => {
//console.log('x: ' + x);
//console.log('y: ' + y);
let top = 0;
let bot = 0;
if(system == "ios"){
  top = -0.8;
  bot = -1.2;

}
else{
    top = 1.2;
    bot = 0.8;


}

    if( (x > -0.2 && x < 0.2 ) && (y > bot && y < top )  ){
      player.replace(sounds[0]);
      player.play();
      setStart(true);
      setoo('Off');
      //console.log('on');
    }

  };

  const offB =() => {
    let top = 0;
let bot = 0;
    if(system == "ios"){
  top = 1.2;
  bot = 0.8;

}
else{
    top = -0.8;
    bot = -1.2;


}
    if((x > -0.2 && x < 0.2 ) && (y > bot && y < top )){
      player.replace(sounds[1]);
      player.play();
      setStart(false);
      setoo('On');
     // console.log('off');

    }
    

  };


//swipe
//for test 1.4 ish cuz ipad, for real 1.9 ish
  if( start && mag > 1.4){
    player.replace(sounds[2]);
    player.play();
    if(!sw){
      setSW(true);
    }
    
    console.log('mag: ' + mag.toFixed(3));
    //set swipe var to true to use for crash, only work if swiped?
  }

  //crash
  //if there was a swing and the last mag was less than current mag to prove big deacceleration
  //(lastMag - mag > 2)
// if there is more than 70% difference in accerleration, better if swing is not large so it still detects crash
  if(sw && ((lastMag/10)*4 > mag) ){
    player.replace(sounds[3]);
    player.play();
    setSW(false);
    //console.log('crash');
    //console.log('diff:' + lastMag + '-' + mag + "=" + (lastMag - mag).toFixed(3));
    //let m = (lastMag/10)*4 > mag;
    //console.log ('m: ' + (lastMag/10)*3);

  }
  




  return (
    <View style={styles.container}>

     <View style={styles.top}>
        <Image style={[styles.showL,
        { opacity: start ? 1 : 0 }
      ]} source={require('./assets/lightsaber_LIGHT.png')}/>
    
    <Image style={styles.showH} source={require('./assets/lightsaber_HANDLE.png')}/>
   
    </View>


      <View style={styles.bot}>
      <TouchableOpacity 
        style = {[styles.oBut, {backgroundColor: !start ? 'mediumseagreen' : 'indianred'}]}
        onPress={start ? offB : onB}> 
          <Text style = {[styles.butT, {color: 'white'}]}> 
            {oo}
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
let bkgd = 'lightskyblue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bkgd,
    padding: 8,
  },

  bot:{
   // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bkgd,
    margin:marg,

  },
    top:{
    //flex: 0.1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bkgd,
     //borderColor: 'black',
    //margin:marg,

  },

  oBut:{
     //margin:marg,

    justifyContent: 'center',
    alignItems: 'center',

    //borderWidth: 3,
    width: bh/1.2,
    height: bh/2,
    borderRadius: bd,
    borderWidth: 2,
    borderColor: 'black',
   

  },
  butT:{
    fontSize: font*0.6,
    fontWeight: 'normal',
    textAlign: 'center',
    //color: 'darkgrey',

  },
  showH:{
     width:bw*1.5,
   height: bh*1.5,
    //padding: 0,
    resizeMode: "contain",
  

  },
    showL:{
     width:bw*3.5,
    height: bh*3.5,
    resizeMode: "contain",
  

  },
});
