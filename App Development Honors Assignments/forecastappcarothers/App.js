import { StyleSheet, Text,Dimensions, Modal, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState, useEffect} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

// You can import supported modules from npm
import { Card } from 'react-native-paper';

// or any files within the Snack
import AssetExample from './components/AssetExample';
//my api key: 105a7ed18950912271aa58098e9f497f

// lat: 40.84
//long: -74.58

//plain api call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

//filled in api: https://api.openweathermap.org/data/2.5/forecast?lat=20&lon=-40&appid=105a7ed18950912271aa58098e9f497f&units=imperial


function WelcomeScreen() {
  const navigation = useNavigation();

  const[la, setLa] = useState();
  const[lon, setLon] = useState();

  


  return (

    <View style = {styles.container}>

      <View style = {styles.headBox}>
      
        <Text style ={styles.heading}>
          What's the forecast?

        </Text>
      </View>


      <View style = {styles.inBox}>

      <Text style = {styles.inText}>
      Latitude:

      </Text>
      <TextInput 
              style={styles.inputBox1}
              onChangeText={(enteredText) => setLa(enteredText)}
              value = {la}
              
          ></TextInput>

      </View>
      <View style = {styles.inBox}>

      <Text style = {styles.inText}>
      Longitude:

      </Text>
      <TextInput 
              style={styles.inputBox1}
              onChangeText={(enteredText) => setLon(enteredText)}
              value = {lon}
              
          ></TextInput>

      </View>


      <View style = {styles.inBox}>
      <TouchableOpacity 
          style = {styles.butS}
         
          
          onPress={() => { navigation.navigate('Weather', {lat: la, long: lon})}}> 

          <Text style = {styles.butT}> 
                Weather Here!
          </Text>

        </TouchableOpacity>


      </View>

    

    



    

    </View>


      
     
      
      
    
  );
}
function weatherScreen({route}) {
  const navigation = useNavigation();
  const { lat } = route.params || {};
  const { long } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);



  const [loc, setLoc] = useState();
  



  const[temp, setTemp] = useState("error: please enter valid coordinates");
  const[hio, setHio] = useState("");
  const[lowo, setLowo] = useState("");
  const[cond, setCond] = useState("");
  const[wind, setWind] = useState();
  const[fivD, setFivD] = useState([]);
  const[fivT, setFivT] = useState([]);

  const[icon, setIcon] = useState("");

  const five = (resp) =>{

    let d = (resp.list[0].dt_txt).substring(8,10);
    

    let i = 0;
    let k = 0;
    let j = 0;
    let t = 0;

    

    while(i <= 5){
      
      j ++;
      //console.log(t);
      t += resp.list[k].main.temp;
      //console.log('t' + t);
    
      if(d != resp.list[k].dt_txt.substring(8,10)){
        d = (resp.list[k].dt_txt).substring(8,10);

        fivD[i] = resp.list[k].dt_txt.substring(5,10);
        //console.log('day ' + resp.list[k].dt_txt.substring(5,10));
        //console.log('j ' + j );

        let temp = (t/j);
        fivT[i] = temp.toFixed(2) + '°';

        t = 0;
        j = 0;
        i++;

      }



      

      k++;
      //console.log('fivD: ' + fivD);
      //console.log('fivT: ' + fivT);
    }




  

  }

  

    

    const avgs = (resp) =>{

      let d = (resp.list[0].dt_txt).substring(8,10);
      //console.log(d);

      let h = -100;
      let l = 200;

      for(let i = 0; i < 10; i ++){
        let d2 = (resp.list[i].dt_txt).substring(8,10);
        //console.log(i);

        if( d2 == d ){
          //console.log(d2 + " " + i);
          //console.log(resp.list[i].main.temp);
          if(resp.list[i].main.temp > h){
            
            h = resp.list[i].main.temp;
          }
          if(resp.list[i].main.temp < l){
            
            l = resp.list[i].main.temp;
          }
        }
      }

      //console.log("h: " + h);
      //console.log('l' + l);
      setHio('high: ' + h + '°');
      setLowo('low: ' + l + '°');


    }


  const make = (resp) =>{

    let t  = resp.list[0].main.temp;
    //console.log(t);
    setTemp(t + '° F');

    let c = resp.list[0].weather[0].description;
    //console.log(c);
    setCond(c);

    let lc = resp.city.name;
    //console.log(lc);
    setLoc(lc);

    let w = resp.list[0].wind.speed;
    setWind('wind speed: ' + w);


    let ic = resp.list[0].weather[0].icon;
    //console.log(ic);
    setIcon("https://openweathermap.org/img/wn/" + ic + "@2x.png");

    
    avgs(resp);
    five(resp);



  }



  useEffect(() =>{


    

    let link = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=105a7ed18950912271aa58098e9f497f&units=imperial";
    fetch (link)
    .then(response => response.json())
    .then(json => make(json));

    //console.log(link)

}, [])




 



   

  


  return (
    

    <View style = {styles.container}>

    <View style = {styles.headBox}>
      <Text style = {styles.heading}>

      {temp}

      </Text>

  

      <Text style = {styles.hlText}>
      {loc}

      </Text>

    </View>

    <View style = {styles.imBox}>


    <Image
        source={{ uri: icon }}
        style={styles.icon}
        resizeMode="contain"
        onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
      />


    </View>

    <View style ={styles.descBox}>

      <Text style = {styles.descT}>

      {cond}

      </Text>

    </View>

    <View style = {styles.hlBox}>
      <Text style = {styles.hlText}>
      
      {hio}

      </Text>
    </View>
    <View style = {styles.hlBox}>

      <Text style = {styles.hlText}>
      {lowo}

      </Text>

    </View>
    <View style = {styles.hlBox}>

      <Text style = {styles.hlText}>
      {wind}

      </Text>

    </View>
    



    <View style = {styles.inMView}>

    <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            //Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>

          <View style ={styles.inMView}>

          <View style={styles.modalView}>

            <View style={styles.modRow}>

              <Text style={styles.modTH}>
                {fivD[0]}{"\n"}
              </Text>

              <View style={styles.modInside}>
              <Text style={styles.modT}>
                {fivT[0]}
              </Text>
              </View>
          

            </View>



             <View style={styles.modRow}>
              <Text style={styles.modTH}>
                  {fivD[1]}{"\n"}
                </Text>
              <View style={styles.modInside}>
                <Text style={styles.modT}>
                {fivT[1]}
                </Text>
              </View>
             </View>


             <View style={styles.modRow}>
              <Text style={styles.modTH}>
                  {fivD[2]}{"\n"}
                  
                </Text>
                <View style={styles.modInside}>
                <Text style={styles.modT}>
                  {fivT[2]}
                </Text>

                <TouchableOpacity 
                  style = {styles.hideBut}
          
            
                  onPress={() => setModalVisible(!modalVisible)}> 

                  <Text style = {styles.modT}> 
                      hide
                  </Text>
                </TouchableOpacity>
                </View>

                


             </View>
             <View style={styles.modRow}>
             <Text style={styles.modTH}>
                {fivD[3]}{"\n"}
              </Text>
              <View style={styles.modInside}>
              <Text style={styles.modT}>
                {fivT[3]}
              </Text>
              </View>


             </View>
             <View style={styles.modRow}>
             <Text style={styles.modTH}>
                {fivD[4]}{"\n"}
                
              </Text>
              <View style={styles.modInside}>
              <Text style={styles.modT}>
                {fivT[4]}
              </Text>
              </View>


             </View>

             
             

             
           
            




              

          
           

          

        

          </View>
        
        </View>



    </Modal>

    <TouchableOpacity 
          style = {styles.butS}
         
          
          onPress={() => setModalVisible(true)}> 

          <Text style = {styles.butT}> 
               5 day forecast
          </Text>

        </TouchableOpacity>

    

    </View>





    

    </View>


      
     
      
      
    
  );
}






const MyStack = createNativeStackNavigator({
  screens: {
    Welcome: WelcomeScreen,
    Weather: weatherScreen,
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
    flexDirection: 'center',
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'cornflowerblue',
    padding: 8,
  },

  headBox:{
    flexDirection: 'center',
    //flex: 0.24,
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
    padding: 8,
    margin: marg,

  },
  imBox:{
    flexDirection: 'center',
    alignItems: 'center',
    flex: 0.8,
    justifyContent: 'center',
    backgroundColor: 'lightsteelblue',
    //padding: 8,
    //margin: marg*4,
    width: bw/1.7,
    height: bh/5,
    borderWidth: bw/50,
    borderRadius: bd/5,

  },

   inBox:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    //margin: marg,

  },


  inText:{
    //margin: 2,
    fontSize: 30,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',

  },

  inputBox1:{
    fontSize: font*0.4,
    height: '60%',
    width: '20%',
    borderWidth: 1,
    margin: marg,
    flexDirection: 'right',
    
    //margin: 5,
    //padding: 5,

  },

  hlBox:{
    flexDirection: 'row',
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
    //padding: marg,
    //margin: marg/2.4,

  },

  descBox:{
    flexDirection: 'center',
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
    margin: marg,

  },

  descT:{
    //margin: marg*2,
    fontSize: font/1.8,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'gainsboro',

  },

  
  heading: {
    margin: 2,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  hlText:{
    margin: 2,
    fontSize: font/1.8,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',

  },

butS:{
    margin:marg,

    justifyContent: 'center',

    borderWidth: 3,
    width: bw/1.4,
    height: bh/1.6,
    borderRadius: bd,
    backgroundColor: "darkblue"

  },

  butT:{
    //margin:marg,
    fontSize: font/1.5,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',

  },

  modalView: {
    //margin: marg/2.8,
    backgroundColor: 'lightgrey',
    borderRadius: 40,
    //padding: 35,
    //justifyContent: 'space-evenly',
    flexDirection: 'row',
    //alignItems: 'center',
    width: bw/1.05,
    height: bh*1.1,
    
  },


  modRow:{
    //justifyContent: 'center',
    //height: bh/5,
    width: bw/6,
    //flexDirection: 'row',
    alignItems: 'center',
    margin:marg/5,
    padding: marg/3,

  },


  modInside:{
    justifyContent: 'space-evenly',
    margin:marg/10,
    //padding: marg/0.5,


  },



  inMView:{
      flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },

  hideBut:{
    //borderWidth: bw/80,
    width: bw/6,
    height: bh/4,
    borderRadius: bd,
    textAlign: 'center',
    backgroundColor: "darkblue",
    justifyContent:'center',
    //padding: marg/2,

  },

  modT:{
    fontSize: font/3.5,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'white',

  },
    modTH:{
    fontSize: font/3.3,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',

  },

  icon: {
    width: bw/1.8,  // Icon width
    height: bw/1.8, // Icon height
  },
  






  
});
