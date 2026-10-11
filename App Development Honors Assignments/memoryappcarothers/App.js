import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Dimensions, FlatList } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

const imagePairs = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];

const randIndex = (card) =>{

  let r = Math.round(Math.random()*(16-card));

  let ind = imagePairs[r];

  imagePairs.splice(r,1);


  return ind;


}


const cards = [
  {
    id: '1',
    title: 'Card 1',
    imageIndex: randIndex(1),
  },
  {
    id: '2',
    title: 'Card 2',
    imageIndex: randIndex(2),
  },
  {
    id: '3',
    title: 'Card 3',
    imageIndex: randIndex(3),
  },
  {
    id: '4',
    title: 'Card 4',
    imageIndex: randIndex(4),
  },
  {
    id: '5',
    title: 'Card 5',
    imageIndex: randIndex(5),
  },
  {
    id: '6',
    title: 'Card 6',
    imageIndex: randIndex(6),
  },
  {
    id: '7',
    title: 'Card 7',
    imageIndex: randIndex(7),
  },
  {
    id: '8',
    title: 'Card 8',
    imageIndex: randIndex(8),
  },
  {
    id: '9',
    title: 'Card 9',
    imageIndex: randIndex(9),
  },
  {
    id: '10',
    title: 'Card 10',
    imageIndex: randIndex(10),
  },
  {
    id: '11',
    title: 'Card 11',
    imageIndex: randIndex(11),
  },
  {
    id: '12',
    title: 'Card 12',
    imageIndex: randIndex(12),
  },
  {
    id: '13',
    title: 'Card 13',
    imageIndex: randIndex(13),
  },
  {
    id: '14',
    title: 'Card 14',
    imageIndex: randIndex(14),
  },
  {
    id: '15',
    title: 'Card 15',
    imageIndex: randIndex(15),
  },
  {
    id: '16',
    title: 'Card 16',
    imageIndex: randIndex(16),
  },
  
];

const imageListC = [
  require('./assets/cabaret.jpg'),
  require('./assets/iittww.jpg'),
  require('./assets/hamilton.jpg'),
  require('./assets/lesmis.webp'),
  require('./assets/phantom.jpg'),
  require('./assets/ragtime.jpg'),
  require('./assets/soundofmusic.jpg'),
  require('./assets/wicked.jpg'),
  
];

const imageListNG = [ 
  require('./assets/death.webp'),
  require('./assets/gatsby.jpg'),
  require('./assets/hadestown.jpg'),
  require('./assets/happyending.jpg'),
  require('./assets/mormon.jpg'),
  require('./assets/outsiders.jpg'),
  require('./assets/juliet.jpg'),
  require('./assets/mincemeat.jpg'),
];



const Item = ({item, onPress, backgroundColor, flip, setC, texT, dis}) => (
  
  
  <TouchableOpacity 
  onPress={onPress} 
  style={[styles.item, {backgroundColor}]}
  disabled={dis}
  >
  {flip && (
  <Image style={styles.showI} source={setC[item.imageIndex]}/>
  )}

  <Text style = {styles.cardT}>
  {texT}
  </Text>
  
  </TouchableOpacity>
);





function WelcomeScreen() {
  const navigation = useNavigation();
  const back =  require('./assets/curtains.webp');

  return (
    <ImageBackground source={back} style={styles.background}>
      <Text style={styles.heading}>
        Broadway Match!
      </Text>

      <View style={styles.butR}>
        <TouchableOpacity 
          style = {styles.butOpt}
         
          
          onPress={() => { navigation.navigate('Match', {setT: 'classic'})}}> 

          <Text style = {styles.butT}> 
            Classic
          </Text>

        </TouchableOpacity>
        <TouchableOpacity 
          style = {styles.butOpt}
         
          
          onPress={() => { navigation.navigate('Match', {setT: 'new'})}}> 

          <Text style = {styles.butT}> 
            New Gen
          </Text>

        </TouchableOpacity>




      </View>




      
    </ImageBackground>
  );
}






function MatchScreen({route}) {
  const navigation = useNavigation();
  const { setT } = route.params || {};
  const[turns, setTurns] = useState(0);
  const[highScore, setHighScore] = useState(null);
  const[fullTurn, setFullTurn] = useState(0);
  



  const [selectedId, setSelectedId] = useState();

  const[fin, setFin] = useState(false);


  const[flipped, setFlipped] = useState([]);
  const[match, setMatched] = useState([]);


  const[pics, setPics] = useState([]);


  const saveScore = async (t) => {
    try {
      
  const stored = await AsyncStorage.getItem('hiScore');
  const current = stored !== null ? Number(stored) : null;

  if (current === null || t < current) {
      await AsyncStorage.setItem('hiScore', t.toString());
      setHighScore(t);
    }


     
    } catch (error) {
      console.log('Error saving score:', error);
    }



    
  
};


   useEffect(() => {
    const loadScore = async () => {
      try {
        const value = await AsyncStorage.getItem('hiScore');
        

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
 


  const update = ( item ) =>{

    setFullTurn(fullTurn +1);
    

    if(setT == "classic"){

       setPics(imageListC);

     }
     else{
       setPics(imageListNG);
     }


    console.log((flipped.length-match.length))

    if(flipped.includes(item.id) || match.includes(item.id) || (flipped.length-match.length) === 2){
      
      return;

    }

    const newFlip = [...flipped, item.id];
    
  
    setFlipped(newFlip);


    if(newFlip.length - match.length === 2){

      //console.log('nf - m' + (newFlip.length-match.length))

      

      const firstI = cards.find((i) => (i.id === (newFlip[newFlip.length - 2])));
      const secondI = cards.find((i) => (i.id === (newFlip[newFlip.length - 1])));


      const t1 = firstI.imageIndex;
      const t2 = secondI.imageIndex;

    

      console.log("1:" + t1);
      
      console.log ("2:" + t2);

      if(t1 == t2){
         setTurns(turns+1);
         setFullTurn(-1);

        
        setMatched((prev) => [...prev, firstI.id, secondI.id]);
        //setFlipped([]);
        console.log('match after found: ' + match);

      }

    }




  };

  const renderItem = ({item}) => {
    const backgroundColor = flipped.includes(item.id) ||  match.includes(item.id) ? 'brown' : 'pink';
    

    const text = flipped.includes(item.id) ||  match.includes(item.id) ? '' : '???';
    
    //const flipped = (item.id === selectedId) ? true : false;
    //console.log(match.includes(item.id));

    //console.log("m" + match);

    const isFlipped =  flipped.includes(item.id) ||  match.includes(item.id);


    console.log('length :' + match.length)
    

    //console.log('f' + isFlipped);

    //const imC = ()

    return (
      <Item
        item={item}
        onPress={() => update(item)}
        backgroundColor={backgroundColor}
        flip={isFlipped}
        setC={pics}
        texT={text}
        dis={fin}
      />
    );
  };

const flip = () => {

  //upSc();
  console.log(flipped);
  console.log(match);
  //console.log(match.includes(flipped[0]));
   console.log('t ' + fullTurn);
  
  let r;

  r = [...match];

  
  let n = fullTurn;
  
  
  if(fullTurn === 2){
    setTurns(turns +1);
    n = 0;
    //setFullTurn(false);
  }
  else if(fullTurn === -1){
    n = 0;

  }
  

  
  else{
    //setTurns(turns+1);
    //n = 0;
  }
 
    //n += 1;

    setFullTurn(n);

    console.log("n " + n);

  



  console.log('r: ' + r);

  setFlipped(r);
  


  
}




const finished = () => {

  if(match.length === 16){
    console.log(turns);

    setTurns(-1);

  saveScore(turns);
  setMatched([]);

  setFlipped([]);
  //update high score
  setTurns(0);
  randIndex();
  setFin(true)

      
    }
  


}


  

  
 
  return (
    <View style={styles.container}>



      <View style={styles.topR}>
        <View style ={styles.tBox}>

          <Text style={styles.smText}>
            Turns Taken: {"\n"}{turns}
          </Text>

        </View>

        <View style ={styles.tBox}>

          <Text style={styles.smText}>
            High Score: {"\n"}{highScore ?? '0'} Turns
          </Text>

        </View>
      </View>


        <View style={styles.matchR}>

        <FlatList
          data={cards}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          //horizontal
          numColumns={4}
          showsHorizontalScrollIndicator={false}
          extraData={selectedId}
        />

        </View>

        <View style={styles.butR}>
        <TouchableOpacity 
          style = {styles.butOpt}
          onPress={() => flip()}> 

          <Text style = {styles.butT}> 
            Flip
          </Text>

        </TouchableOpacity>

        <TouchableOpacity 
          style = {styles.butOpt}
          onPress={() => finished()}> 

          <Text style = {styles.butT}> 
            Finished
          </Text>

        </TouchableOpacity>



        </View>

    
      




      
    </View>
  );
}

const MyStack = createNativeStackNavigator({
  screens: {
    Welcome: WelcomeScreen,
    Match: MatchScreen,
  },
});

const Navigation = createStaticNavigation(MyStack);

export default function App() {

   
  return <Navigation />;
  
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
    justifyContent: 'center',
    backgroundColor: 'maroon',
    padding: 8,
  },
  heading: {
    margin: marg,
    fontSize: font*1.2,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  butR:{
    flexDirection: 'row',
    flex: 0.2,
    justifyContent: 'center',
    //backgroundColor: 'maroon',

  },

  butOpt:{
    margin:marg,

    justifyContent: 'center',

    //borderWidth: 3,
    width: bw/2.5,
    height: bh/2,
    borderRadius: bd,
    backgroundColor: "lightyellow"

  },
  background: {
    
    flex: 1, // Ensures the background covers the whole screen
    resizeMode: 'cover', // Or 'contain', 'stretch', etc.
    justifyContent: 'center', // Centers children vertically
    alignItems: 'center', // Centers children horizontally
    padding: 8,
  },

  butT:{
    //margin: marg,
    fontSize: font*0.5,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'grey',

  },

  topR:{
    flexDirection: 'row',
    flex: 0.25,
    justifyContent: 'center',
    backgroundColor: 'maroon',

  },

  matchR:{
    flexDirection: 'row',
    flex: 0.9,
    //justifyContent: 'center',
    backgroundColor: 'brown',

  },

  tBox:{
    margin: marg,
    justifyContent: 'center',
    backgroundColor: 'lightpink',
    //borderWidth: 3,
    width: bw/2.4,
    height: bh/1.3,
    borderRadius: bd/2.8,


  },

  smText:{
    //margin: marg,
    fontSize: font*0.37,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',

  },
   item: {
    //padding: 20,
    marginVertical: marg/2,
    marginHorizontal: marg/2,
    width: bw/5,
    height: bh/1.1,
    flexDirection: 'row',
    textAlign: 'center',
    margin: marg,
    justifyContent: 'center',

  },

  

  showI:{

    width:bw/5,
    height: bh/1.1,

    resizeMode: "contain",

  },

  cardT:{
    //fontSize: font*0.37,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    //margin: marg,
    //padding: marg,
    fontSize: font*0.5,
    //fontWeight: 'normal',
    //textAlign: 'center',
    //color: 'grey',

  }




});
