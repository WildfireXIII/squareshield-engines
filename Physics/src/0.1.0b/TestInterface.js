//*************************************************************
//  File: TestInterface.js
//  Date created: 5/30/2015
//  Date edited: 6/4/2015
//  Author: Nathan Martindale
//  Copyright � 2015 Digital Warrior Labs
//  Description: Script that controls and runs the physics engine as
//    as an example. THIS FILE IS FOR TESTING AND DEMONSTRATION 
//    PURPOSES ONLY, IT IS NOT A PART OF THE PHYSICS ENGINE
//*************************************************************


//TODO: physics engine is global, you can use this to control speed of simulation perhaps?

window.onload = startup;

var world;
var objectConsole;
var logConsole;

var objects = []; //ASSUMED TO CONTAIN ONLY TestObject INSTANCES

var DEBUG = true; //shows basics: fps, frame, runtime
var DEBUG_ADVANCED = false; //shows all variables for all objects (GREATLY REDUCES PERFORMANCE)

var GAME_PLAYING = true;

//-------TIMING/FRAMES------
var lastFrameTime; //represents the time in milliseconds that the last frame was drawn
var frameNum = 0; //counts up each frame
var fps = 0;
var recordFPS = false; //use this so you don't have to calc FPS every single frame, just every other or something.
var recordFPSCounter = 0; //counts up until hits delay, then sets recordFPS to true
var recordFPSCounterDelay = 25; //represents frames to let pass before recording fps

//NOTE: runtime updates at SAME INTERVAL as fps
var runtime = 0; //ms (keeps adding timedifference for each frame)
var runtimeDisplay = 0; //seconds

var physEngine;

//assign all important parts of web page
function startup()
{
	//get html elements
	world = document.getElementById("World");
	objectConsole = document.getElementById("ObjectConsole");
	logConsole = document.getElementById("LogConsole");

	log("Hello world!");
	
	physEngine = new PhysicsEngine();	
	physEngine.entities = objects;

	//TESTING OBJECTS
	var myTestObject = new TestObject("myTestObject", 10, 10, 40, 40, "#002299");
	var myOtherObject = new TestObject("myOtherObject", 80, 80, 40, 40, "#992200");
	var gravityObject = new TestObject("gravityObject", 130, 20, 40, 40, "#009922");
	var collidingObject = new TestObject("collidingObject", world.width - 50, 200, 50, 50, "#EEEE00");
	objects.push(myTestObject);
	objects.push(myOtherObject);
	objects.push(gravityObject);
	objects.push(collidingObject);

	myTestObject.physics.ay = .00005; //TESTING ONLY
	myOtherObject.physics.ay = .0001; //TESTING ONLY
	
	gravityObject.physics.ay = .00025; //TESTING ONLY
	gravityObject.physics.vx = .1;
	gravityObject.physics.vy = -.1;

	collidingObject.physics.vx = -.3;

	
	lastFrameTime = (new Date()).getTime();
	animate();
}

//send a message to the logconsole
function log(message) { logConsole.value += message + "\n"; logConsole.scrollTop = logConsole.scrollHeight; }
//shows all information about current objects in the objectConsole
function updateObjectLog()
{
	var consoleText = "FRAME " + frameNum + " FPS: " + fps + " RUNTIME: " + runtimeDisplay + " seconds";
	if (DEBUG_ADVANCED)
	{
		for (var i = 0; i < objects.length; i++)
		{
			consoleText += "\n\nObject: " + objects[i].name;
			consoleText += "\nx: " + objects[i].physics.px;
			consoleText += "\ny: " + objects[i].physics.py;
			consoleText += "\nvx: " + objects[i].physics.vx;
			consoleText += "\nvy: " + objects[i].physics.vy;
			consoleText += "\nax: " + objects[i].physics.ax;
			consoleText += "\nay: " + objects[i].physics.ay;
			consoleText += "\nwidth: " + objects[i].physics.width;
			consoleText += "\nheight: " + objects[i].physics.height;
			consoleText += "\ncolor: " + objects[i].color;
		}
	}

	objectConsole.value = consoleText;
}

function toggleAdvancedDebugging()
{
	if (DEBUG_ADVANCED) { DEBUG_ADVANCED = false; }
	else { DEBUG_ADVANCED = true; }
}
function togglePlaying()
{
	if (GAME_PLAYING) { GAME_PLAYING = false; }
	else { lastFrameTime = (new Date()).getTime(); GAME_PLAYING = true; }
}

//recursive animation function that continually updates canvas
function animate()
{
	if (GAME_PLAYING)
	{
		var timeDifference = (new Date()).getTime() - lastFrameTime;
		lastFrameTime = (new Date()).getTime(); //update lastFrameTime to right now, since frame is being drawn

		runtime += timeDifference;
		runtimeDisplay = parseInt(runtime / 1000);

		//fps recording
		recordFPSCounter++;
		if (recordFPS) 
		{ 
			fps = parseInt(1000/timeDifference); 
			recordFPS = false; 
		}
		if (recordFPSCounter > recordFPSCounterDelay) { recordFPS = true; recordFPSCounter = 0; }

		//PHYSICSY STUFF
		
		physEngine.updatePhysics(timeDifference);
		
		//update canvas!
		var worldContext = world.getContext('2d');
		worldContext.clearRect(0, 0, world.width, world.height);
		for (var i = 0; i < objects.length; i++)
		{
			objects[i].renderObject(worldContext);
		}

		frameNum++;
		if (DEBUG) { updateObjectLog(); }
	}

	window.requestAnimationFrame(animate);
}
