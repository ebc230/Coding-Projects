
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  StyleSheet,
} from "react-native";





import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const BALL_RADIUS = 18;

function Ball({ body, radius }) {
  const x = body.position.x - radius;
  const y = body.position.y - radius;

  return (
    <Image
      source={require("./dolphin.png")}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: radius * 2,
        height: radius * 2,
      }}
      resizeMode="contain"
    />
  );
}

function Platforms({ body, size }) {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size[0],
        height: size[1],
        backgroundColor: "#333",
      }}
    />
  );
}

function createGame(onWin, tiltRef) {
  const engine = Matter.Engine.create({
    enableSleeping: false,
  });

  const world = engine.world;

  world.gravity.y = 1;

  const ball = Matter.Bodies.circle(
    width / 2,
    50,
    BALL_RADIUS,
    {
      restitution: 0.25,
      frictionAir: 0.01,
    }
  );

  const PLATFORM_HEIGHT = 20;
const PLATFORM_COUNT = 8;

const ledges = [];

for (let i = 0; i < PLATFORM_COUNT; i++) {
 const y =
  height * (0.20 + (i * 0.75) / PLATFORM_COUNT);

  const platformWidth =
    width * (0.3 + Math.random() * 0.20);

  const x =
    platformWidth / 2 +
    Math.random() * (width - platformWidth);

  ledges.push(
    Matter.Bodies.rectangle(
      x,
      y,
      platformWidth,
      PLATFORM_HEIGHT,
      {
        isStatic: true,
      }
    )
  );
}

  const leftWall = Matter.Bodies.rectangle(
    -25,
    height / 2,
    50,
    height * 2,
    { isStatic: true }
  );

  const rightWall = Matter.Bodies.rectangle(
    width + 25,
    height / 2,
    50,
    height * 2,
    { isStatic: true }
  );

  Matter.World.add(world, [
    ball,
    leftWall,
    rightWall,
    ...ledges,
  ]);

  const Physics = (entities, { time }) => {
    const ballBody = entities.ball.body;

    Matter.Body.setVelocity(ballBody, {
      x: tiltRef.current * 8,
      y: ballBody.velocity.y,
    });

    Matter.Engine.update(engine, time.delta);

    if (ballBody.position.y >= height - BALL_RADIUS - 10) {
      onWin();
    }

    return entities;
  };

  const entities = {
    physics: {
      engine,
      world,
    },

    ball: {
      body: ball,
      radius: BALL_RADIUS,
      renderer: Ball,
    },
  };

  ledges.forEach((ledge, index) => {
    entities[`ledge${index}`] = {
      body: ledge,
      size: [ledge.bounds.max.x - ledge.bounds.min.x, 20],
      renderer: Platforms,
    };
  });

  return {
    entities,
    systems: [Physics],
  };
}

function HomeScreen({ bestTime, onStart }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Save the Dolphin!</Text>

      <Text style={styles.rules}>
        Objective: Tilt device back and forth to move the dolphin to get him back in the blue water at the bottom as fast as possible!
      </Text>

      <Text style={styles.best}>
        Best Time:
      </Text>

      <Text style={styles.bestValue}>
        {bestTime
          ? `${Number(bestTime).toFixed(2)}s`
          : "No score yet"}
      </Text>

      

      <TouchableOpacity
        style={styles.button}
        onPress={onStart}
      >
        <Text style={styles.buttonText}>
          Start Game
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function GameScreen({ onExit }) {
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const TILT_DIRECTION = 
  Platform.OS === "android"
    ? -1
    : 1;

  const [newHighScore, setNewHighScore] = useState(false);

  const startTime = useRef(Date.now());

  const tiltRef = useRef(0);

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const sub = Accelerometer.addListener(({ x }) => {
  tiltRef.current = x * TILT_DIRECTION;
});

    Accelerometer.setUpdateInterval(16);

    return () => sub.remove();
  }, []);

//setNewHighScore(true);
//console.log("NEW HIGH SCORE");
  

  useEffect(() => {
  if (!running) return;

  const timer = setInterval(() => {
    setElapsed(
      (Date.now() - startTime.current) / 1000
    );
  }, 50);

  return () => clearInterval(timer);
}, [running]);

  useEffect(() => {
    const setup = createGame(async () => {
      if (!running) return;

      setRunning(false);

      const finalTime =
        (Date.now() - startTime.current) / 1000;

      const stored =
        await AsyncStorage.getItem("BEST_TIME");

      const best =
        stored == null
          ? null
          : Number(stored);

      if (
  best === null ||
  finalTime < best
) {
  setNewHighScore(true);

  await AsyncStorage.setItem(
    "BEST_TIME",
    String(finalTime)
  );

      }

      setTimeout(() => {
        onExit();
      }, 1500);
    }, tiltRef);

    setGameData(setup);
  }, []);

  if (!gameData) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.timer}>
        {elapsed.toFixed(2)}s
      </Text>
      {newHighScore && (
  <View
    style={{
      position: "absolute",
      top: 120,
      width: "100%",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
        color: "gold",
      }}
    >
      NEW HIGH SCORE!
    </Text>
  </View>
)}

      <GameEngine
        style={{ flex: 1 }}
        systems={gameData.systems}
        entities={gameData.entities}
        running={running}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: 10,
          width: "100%",
          backgroundColor: "blue",
        }}
      />
    </View>
  );
}

export default function App() {
  const [screen, setScreen] =
    useState("home");

  const [bestTime, setBestTime] =
    useState(null);

  const loadBestTime = async () => {
    const value =
      await AsyncStorage.getItem(
        "BEST_TIME"
      );

    setBestTime(value);
  };

  useEffect(() => {
    loadBestTime();
  }, []);

  if (screen === "home") {
    return (
      <HomeScreen
        bestTime={bestTime}
        onStart={() =>
          setScreen("game")
        }
      />
    );
  }

  return (
    <GameScreen
      onExit={async () => {
        await loadBestTime();
        setScreen("home");
      }}
    />
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "aliceblue",
    textAlign: 'center',
    //margin:marg,
  },

  title: {
    fontSize: font/1.5,
    fontWeight: "bold",
    marginBottom: 20,
  },

  rules: {
    fontSize: font/3,
    margin:marg,
    //textAlign: 'center',
  },
    best: {
      fontSize: font/2,
      
  },

  bestValue: {
    fontSize: 26,
    marginBottom: 40,
  },

  button: {
    backgroundColor: "dodgerblue",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  timer: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 100,
    fontSize: 24,
    fontWeight: "bold",
  },
});




