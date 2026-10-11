import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import Pad from './components/view/pad.js';
import { Slider } from '@rneui/themed';

//import Slider from '@react-native-community/slider';

export default function App() {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [color, setColor] = useState('#a4c739');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const padRef = useRef(null);

  const [mode, setMode] = useState('pen');

  const[val, setVal] = useState(1);


  const [nPressed, setNPressed] = useState(3);

  const Item = ({item, onPress, backgroundColor, press}) => (
    
  
    <TouchableOpacity 
    onPress={onPress} 
    style={[styles.colorBut, {backgroundColor}, {
    backgroundColor,
    borderWidth: press ? bd/38 : 0,
  },]}
    >
    </TouchableOpacity>
);
  const colors = [
  {
    id: '1',
    color: 'white',
   
  },
  {
    id: '2',
    color: 'black',
    
  },
  {
    id: '3',
    color: '#a4c739',
   
  },
  {
    id: '4',
    color: 'lightblue',
    
  },
  {
    id: '5',
    color: 'pink',
   
  },
  {
    id: '6',
    color: 'red',
   
  },
  {
    id: '7',
    color: 'purple',
    
  },
  {
    id: '8',
    color: 'brown',
  },
   {
    id: '9',
    color: 'orange',
  }, 
  {
    id: '10',
    color: 'yellow',
  }, 
  {
    id: '11',
    color: 'blue',
  }, 
  {
    id: '12',
    color: 'magenta',
  },
  
];

const update = (item) =>{

  setColor(item.color);

  setNPressed(item.id);
  

}


const renderItem = ({item}) => {
    const backgroundColor = item.color;
    
    const p = nPressed == item.id ? true : false ;



    return (
      <Item
        item={item}
        onPress = {() => update(item)}
        backgroundColor={backgroundColor}
        press = {p}
      />
    );
  };

  return (
      <View style={styles.container}>
       <View style = {styles.top}>
        <TouchableOpacity 
            style = {styles.oBut}
            onPress={() => padRef.current?.rewind()}> 
             <Image style={styles.showI} source={require('./assets/icons8-undo-50.png')}/>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style = {styles.oBut}
            onPress={() => padRef.current?.clear()}> 
            <Image style={styles.showI} source={require('./assets/icons8-restart-50.png')}/>
          </TouchableOpacity>

       </View>


        <Pad
          mode={mode}
          color={color}
          ref={padRef}
          strokeWidth={strokeWidth}>
        </Pad>



        <View style = {styles.bot}>

        <View style={styles.centeredView}>

         <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}>
          
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.butT}>
            stroke size: {(strokeWidth)/2}

            </Text>
            
              <Slider
                style={styles.slideView}
                minimumValue={1}
                maximumValue={6}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="darkgrey"
                //thumbSize={bd/2}
                thumbTintColor={'aliceblue'}
                //renderStepNumber={true}
                value = {(strokeWidth/2)-1}
                step = {1}
                onValueChange = {(value) =>  setStrokeWidth((value+1)*2)
}
                onSlidingComplete = {() =>  setModalVisible1(false)}

              />
              <TouchableOpacity
                style={[styles.minBut, styles.buttonClose]}
                onPress={() => setModalVisible1(!modalVisible1)}>
                <Text style={styles.butT}>hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        </View>

          <TouchableOpacity//size 
            style = {styles.oBut}
            onPress={() => setModalVisible1(true)}> 
            <Image style={styles.showI} source={require('./assets/strokeWidth.png')}/>
           
             
          </TouchableOpacity>

          <TouchableOpacity 
            style = {[styles.oBut, {backgroundColor: mode === 'rect' ? 'lightyellow' : 'lightgrey'} ]}
            onPress={() =>
              setMode(mode === 'pen' || mode === 'circ' ? 'rect' : 'pen') }
              > 
             <Image style={styles.showI} source={require('./assets/icons8-basic-64.png')}/>
          </TouchableOpacity>

          <TouchableOpacity 
            style = {[styles.oBut, {backgroundColor: mode === 'circ' ? 'lightyellow' : 'lightgrey'} ]}
            onPress={() =>
              setMode(mode === 'pen' || mode === 'rect' ? 'circ' : 'pen') }
              > 
             <Image style={styles.showI} source={require('./assets/icons8-circle-50.png')}/>
          </TouchableOpacity>

          <TouchableOpacity
            style = {styles.oBut}
            onPress={() => setModalVisible2(true)}> 
            <Image style={styles.showI} source={require('./assets/colorWheel.png')}/>
          </TouchableOpacity>

          <View style={styles.centeredView}>

         <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}>
          
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
             <FlatList
                data={colors}
                renderItem={renderItem}
                
                numColumns={6}
                showsHorizontalScrollIndicator={false}
                //extraData={selectedId}
        />
              <TouchableOpacity
                style={[styles.minBut, styles.buttonClose]}
                onPress={() => setModalVisible2(!modalVisible2)}>
                <Text style={styles.butT}>hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
          
          </View>
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
let bkgd = 'lightgrey';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
    //paddingTop: Constants.statusBarHeight,
    //paddingBottom: Constants.statusBarHeight,
    //padding: 10,
  },
   bot:{
   // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bkgd,
    margin:marg,
     flexDirection: 'row',
     borderRadius: bh/2,
     borderWidth: bd/38,

  },
  top:{
   // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
     //paddingTop: Constants.statusBarHeight,
    backgroundColor: bkgd,
    margin:marg,
    flexDirection: 'row',
    borderRadius: bh/2,
    borderWidth: bd/38,
    borderColor: 'black',

  },
   oBut:{
     margin: marg/2,

    justifyContent: 'center',
    alignItems: 'center',
    padding: marg*2,
    
    backgroundColor: bkgd,

    //borderWidth: 3,
    width: bh/1.8,
    height: bh/2,
    borderRadius: bh/1.3,
    //borderWidth: 2,
    //borderColor: 'black',
    
  },
  
  colorBut:{
     //margin: marg/2,

    justifyContent: 'center',
    alignItems: 'center',

    //borderWidth: 3,
    marginVertical: marg/4,
    marginHorizontal: marg/4,
    width: bw/10,
    height: bw/10,
    flexDirection: 'row',
    textAlign: 'center',
    margin: marg,
    borderRadius: bd/3.5,
     //borderWidth: bd/38,
    borderColor: 'black',

  },
  
  butT:{
    fontSize: font*0.3,
    fontWeight: 'light',
    textAlign: 'center',
    //justifyContent: 'center',
    //color: 'darkgrey',
    

  },

  minBut:{
     margin: marg/2,

    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'grey',

    //borderWidth: 3,
    width: bw/6,
    height: bh/5,
    borderRadius: bd,
    //borderWidth: 2,
    borderColor: 'black',

  },
  showI:{

    width:bw/7,
    height: bh/1.1,

    resizeMode: "contain",

  },
  modalView: {
    
    backgroundColor: 'lightgrey',
    borderRadius: bd/4,
    borderColor: 'black',
    
    alignItems: 'center',
    width: bw/1.3,
    height: bh*1.5,
    justifyContent: 'center',
   
    
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slideView:{
    height: bh/1.7,
    width: bw/1.5,

  },
});
