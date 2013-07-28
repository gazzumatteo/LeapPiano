///------------------------------------------------------\
//| Copyright (C) 2013 DuckMa srl All rights reserved.   |
//\------------------------------------------------------/
var canvas = document.getElementById("leap-overlay");
var debugDiv = document.getElementById("debug");
var debug = true;
// fullscreen
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

// create a rendering context
var ctx = canvas.getContext("2d");
ctx.translate(canvas.width / 2, canvas.height);
ctx.fillStyle = "rgba(255,0,0,0.8)";



var images = [ './imgs/key_white.png', './imgs/key_black.png',
		'./imgs/key_white.png', './imgs/key_black.png', './imgs/key_white.png',
		'./imgs/key_white.png', './imgs/key_black.png', './imgs/key_white.png',
		'./imgs/key_black.png', './imgs/key_white.png', './imgs/key_black.png',
		'./imgs/key_white.png', './imgs/key_white.png', './imgs/key_black.png',
		'./imgs/key_white.png', './imgs/key_black.png', './imgs/key_white.png',
		'./imgs/key_white.png', './imgs/key_black.png', './imgs/key_white.png',
		'./imgs/key_black.png', './imgs/key_white.png', './imgs/key_black.png',
		'./imgs/key_white.png', './imgs/key_white.png', './imgs/key_black.png' ];

var imageObjs = [];
var coordX = [];
for ( var i in images) {
	var tmpImg = new Image();
	var src = images[i];
	tmpImg.src = src;
	// if(src.substring(src.length,(src.length -9) ) == 'black.png'){
	tmpImg.coox = -350 + (i * 26);
	// } else {
	// tmpImg.coox = -350 + (i*33);
	// }
	imageObjs[i] = tmpImg;
}

var width_key = 30;
var v_position = -450;

// render each frame
function draw(frame) {
	// clear last frame
	ctx.clearRect(-canvas.width / 2, -canvas.height, canvas.width,
			canvas.height);

	for ( var i in imageObjs) {
		var image = imageObjs[i];
		var src = image.src;
		if (src.substring(src.length, (src.length - 9)) == 'black.png') {
			ctx.drawImage(image, image.coox, v_position, width_key, 150);
		} else {
			ctx.drawImage(image, image.coox, v_position, width_key, 180);
		}
	}

	// render circles based on pointable positions
	var pointablesMap = frame.pointablesMap;

	for ( var i in pointablesMap) {
		// get the pointable's position
		var pointable = pointablesMap[i];
		var pos = pointable.tipPosition;

		// create a circle for each pointable
		var distance = Math.min(600 / Math.abs(pos[2]), 20);

		var radius = 5;
		var x = pos[0] - radius / 2;
		var y = pos[1] - radius / 2;

		if (distance > 5) {
			ctx.beginPath();
			ctx.arc(x, -y, radius, 0, 2 * Math.PI);
			ctx.fill();
			for ( var i in imageObjs) {
				var image = imageObjs[i];
				if (x > image.coox && x < (image.coox + width_key) && y > 300
						&& y < 400) {
					addKey(i, image);
					
				}
			}
		}
		if (debug == true) {
			debugDiv.innerHTML = "# Fingers: " + frame.fingers.length + "<br/>";
			debugDiv.innerHTML = debugDiv.innerHTML + "<br/>fingerId=" + i
					+ " x:" + (pos[0] - radius / 2) + " y:"
					+ (pos[1] - radius / 2);
		}
	}
};

var pressedTimeout = 0;
var tmp_src = "";
function addKey(n_note, image) {
	if (pressedTimeout != 0) {
		return;
	}
	// fix tones
	n_note = n_note - 12;
	var dataURI = Notes.getDataURI(n_note);
	var sounds = [ new Audio(dataURI), new Audio(dataURI), new Audio(dataURI) ];
	var curSound = 0;
	dataURI = null;

	// sound
	sounds[curSound].pause();
	// try {
	// sounds[curSound].currentTime = 0.001; //HACK - was for mobile safari, but
	// sort of doesn't matter...
	// } catch (x) {
	// console.log(x);
	// }
	sounds[curSound].play();
	curSound = ++curSound % sounds.length;
	pressedTimeout = 1;
	
	
	// visual feedback
	window.clearTimeout(pressedTimeout);
	tmp_src = image.src;
	image.src = './imgs/key_grey.png';
	window.setTimeout(function() {
		pressedTimeout = 0;
		image.src = tmp_src;
	}, 150);

}

var controllerOptions = {
	enableGestures : false
};
// listen to Leap Motion
Leap.loop(controllerOptions, draw);

//Notes:
//0, // c
//1, // c#
//2, // d
//3, // d#
//4, // e
//5, // f
//6, // f#
//7, // g
//8, // g#
//9, // a
//10, // a#
//11, // b
//12, // c
//13, // c#
//14, // d
//15, // d#
//16, // e
//17, // f
//18, // f#
//19 // g
