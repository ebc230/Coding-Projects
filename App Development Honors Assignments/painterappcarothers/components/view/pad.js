import React from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';
import Pen from '../tools/pen';
import Point from '../tools/point';
import Constants from 'expo-constants';

export default class Pad extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tracker: 0,
      currentPoints: [],
      //previousStrokes: [],
      pen: new Pen(),

      currentRect: null,

      totalShapes: [],
      rectangles: [],

      circles: [],
      currentCirc: null,
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs),
    });
    const rewind = props.rewind || function () {};
    const clear = props.clear || function () {};
    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
    };
  }

  componentDidMount() {
    if (this.props.strokes) this.setState({ strokes: this.props.strokes });
  }



  componentDidUpdate() {
    if (
      this.props.enabled == false &&
      this.props.strokes !== undefined &&
      this.props.strokes.length !== this.state.totalShapes.length
    )
      this.setState({
        totalShapes: this.props.strokes || this.state.totalShapes,
      });
  }




  rewind = () => {


  if (this.state.totalShapes.length < 1) return;

  let totalShapes = [...this.state.totalShapes];

  totalShapes.pop();

  this.setState({
    totalShapes: totalShapes,
  });

  this._onChangeStrokes(totalShapes);
};



  clear = () => {
    this.setState({
      
      currentPoints: [],
      tracker: 0,
      totalShapes: [],
    });
    this.state.pen.clear();
    this._onChangeStrokes([]);
  };



  onTouch(evt) {
    if (this.props.enabled == false) return;
    
    let x, y, timestamp;
    [x, y, timestamp] = [
      evt.nativeEvent.locationX,
      evt.nativeEvent.locationY,
      evt.nativeEvent.timestamp,
    ];

    const newCurrentPoints = [
  ...this.state.currentPoints,
  new Point(x, y, timestamp),
];

this.setState({
  currentPoints: newCurrentPoints,
});

    this.setState({
      totalShapes: this.state.totalShapes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker,
    });
  }



  onResponderGrant(evt) {
    const { locationX, locationY } = evt.nativeEvent;
    if(this.props.mode === 'rect'){
    

    this.setState({
      currentRect: {
        x1: locationX,
        y1: locationY,
        x2: locationX,
        y2: locationY,
      },
    });
  } else if (this.props.mode === 'circ'){
    this.setState({
      currentCirc: {
        cx: locationX,
        cy: locationY,
        r:1,
        
      },
    });

  }
  else if (this.props.mode === 'pen') {
    this.onTouch(evt); 
  }

  
  }

  onResponderMove(evt) {
    const { locationX, locationY } = evt.nativeEvent;
    if (this.props.mode === 'rect') {
    if (!this.state.currentRect) return;

    this.setState(prev => ({
      currentRect: {
        ...prev.currentRect,
        x2: locationX,
        y2: locationY,
      },
    }));
  } 
else if (this.props.mode === 'circ') {

  if (!this.state.currentCirc) return;

  const { cx, cy } = this.state.currentCirc;

  const dx = locationX - cx;
  const dy = locationY - cy;

  const r = Math.sqrt(dx * dx + dy * dy);

  this.setState({
    currentCirc: {
      cx,
      cy,
      r: r,
    },
  });

}
  
  else if (this.props.mode === 'pen')  {
    this.onTouch(evt);
  }
  }

  onResponderRelease() {
     if (this.props.mode === 'rect') {
    if (!this.state.currentRect) return;

    this.setState({
  totalShapes: [
    ...this.state.totalShapes,
    {
      type: 'rect',
      ...this.state.currentRect,
      color: this.props.color,
    },
  ],
  currentRect: null,
});

    return;
  }

  else if (this.props.mode === 'pen') {
    let strokes = this.state.totalShapes;
    if (this.state.currentPoints.length < 1) return;

    var points = [...this.state.currentPoints];
    const strColor = this.props.color || '#000000';

    this.state.pen.addStroke(this.state.currentPoints);
    
    const newStroke = {
      pts: points,
      w: this.props.strokeWidth,
      color: strColor,

    }

    this.setState({
      totalShapes: [
  ...this.state.totalShapes,
  {
    type: 'pen',
    pts: points,
    w: this.props.strokeWidth,
    color: this.props.color,
  },
],
      strokes: [],
      currentPoints: [],
      tracker: this.state.tracker + 1,
    });
    this._onChangeStrokes([
      ...strokes, newStroke
    ]);

     
  }

  else if (this.props.mode === 'circ') {

  if (!this.state.currentCirc) return;

  this.setState({
    totalShapes: [
      ...this.state.totalShapes,
      {
        type: 'circ',
        ...this.state.currentCirc,
        color: this.props.color,
      },
    ],
    currentCirc: null,
  });

}


  }




  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  };

  _onChangeStrokes = (strokes) => {
    if (this.props.onChangeStrokes){
      this.props.onChangeStrokes(strokes);
       
      

    } 
  };

  render() {
    var props =
      this.props.enabled != false ? this._panResponder.panHandlers : {};

    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[styles.drawContainer, this.props.containerStyle]}>
        <View style={styles.svgContainer} {...props}>
          <Svg
            width="100%"
            height="100%"
            style={StyleSheet.absoluteFill}
          >
            <G>
            {this.state.totalShapes.map((totalShapes, i) => {
  
                  if (totalShapes.type === 'pen') {
                    var points = [];

                    for (var j in totalShapes.pts) {
                      let newPoint = new Point(
                        totalShapes.pts[j].x,
                        totalShapes.pts[j].y,
                        totalShapes.pts[j].timestamp
                      );

                      points.push(newPoint);
                    }

                    return (
                      <Path
                        key={i}
                        d={this.state.pen.pointsToSvg(points)}
                        stroke={totalShapes.color || '#000'}
                        strokeWidth={totalShapes.w || 4}
                        fill="none"
                      />
                    );
                  }

                  
                  if (totalShapes.type === 'rect') {

                    const x = Math.min(totalShapes.x1, totalShapes.x2);
                    const y = Math.min(totalShapes.y1, totalShapes.y2);
                    const width = Math.abs(totalShapes.x2 - totalShapes.x1);
                    const height = Math.abs(totalShapes.y2 - totalShapes.y1);

                    return (
                      <Rect
                        key={i}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        stroke={totalShapes.color || '#000'}
                        strokeWidth={2}
                        fill= {totalShapes.color}
                      />
                    );
                  }

                  if (totalShapes.type === 'circ') {

                    return (
                      <Circle
                        key={i}
                        cx={totalShapes.cx}
                        cy={totalShapes.cy}
                        r={totalShapes.r}
                        stroke={totalShapes.color}
                        strokeWidth={2}
                        fill={totalShapes.color}
                      />
                    );
                  }

                })}

                {this.state.currentRect && (() => {

                const r = this.state.currentRect;

                const x = Math.min(r.x1, r.x2);
                const y = Math.min(r.y1, r.y2);
                const width = Math.abs(r.x2 - r.x1);
                const height = Math.abs(r.y2 - r.y1);

                return (
                  <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    stroke={this.props.color || '#000'}
                    strokeWidth={2}
                    fill={this.props.color}
                  />
                );

              })()}

              {this.state.currentCirc && (
                <Circle
                  cx={this.state.currentCirc.cx}
                  cy={this.state.currentCirc.cy}
                  r={this.state.currentCirc.r}
                  stroke={this.props.color}
                  strokeWidth={2}
                  fill={this.props.color}
                />
              )}
              {this.props.mode === 'pen' && (
                <Path
                  d={this.state.pen.pointsToSvg(this.state.currentPoints)}
                  stroke={this.props.color || '#000'}
                  strokeWidth={this.props.strokeWidth || 4}
                  fill="none"
                />
              )}
              </G>
          </Svg>

          
        </View>
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',
    //backgroundColor: 'green',
  },
  svgContainer: {
  flex: 1,
  position: 'relative',
},
  drawSurface: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
  taskBar: {
    height: 0.05 * windowHeight,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    height: 0.8 * 0.05 * windowHeight,
    width: 0.8 * 0.05 * windowHeight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    height: windowHeight * 0.05 * 0.7,
    width: windowHeight * 0.05 * 0.7,
  },
});
