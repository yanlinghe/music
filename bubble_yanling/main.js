
var UP_SAMPLING_RATIO = 1.5;
var BOUNDING_BOX_X = window.innerWidth;
var BOUNDING_BOX_Y = window.innerHeight;
var FROM_OPACITY = 0.9;
var TO_OPACITY = 1.0;
var TOTAL_NUM = 8;
var MAX_SPEED_CHANGE = 1;
var MAX_SPEED = 10;
var audioContext = null;
var meter = null;
var rafID = null;

var to;

window.onload = function(){
	var from = draw_from();
    to = draw_to(from);
	ibrush = create_brush(BRUSH, to)
	for (i = 0; i < TOTAL_NUM; i++) {
		to.curves.push({brush: ibrush, path: create_path(PATH, to, "random")})
	}
	to.brush_enabled = true;
	setTimeout(function(){
		start_tracing(to,from);
	});

	window.addEventListener("keydown", function(e){
	    if(e.keyCode === 72) {
	        load_image("/"+Math.floor(Math.random()*17)+".jpg",from)
	    }
	});

	// monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

}

function load_image(src,context_from){
	var image_from = new Image();
	image_from.onload = function() {
	  context_from.drawImage(this, 0, 0, document.getElementById('from').width, document.getElementById('from').height);
	};
	console.log(src);
	image_from.src = src;
}

function create_brush(brush,context){
	return new brush(context);
}

function create_path(path,context,showType){
	return new path(context,showType);
}

function draw_from(){
	var canvas_from = document.getElementById('from');
	canvas_from.style.opacity = FROM_OPACITY;
	// canvas_from.height = BOUNDING_BOX;
	// canvas_from.width = BOUNDING_BOX;
	canvas_from.height = window.innerHeight;
	canvas_from.width = window.innerWidth; 
	canvas_from.style.height = canvas_from.height;
	canvas_from.style.width = canvas_from.width;
	canvas_from.style.opacity = 0.;
	var context_from = canvas_from.getContext('2d');
	var image_from = new Image();
	image_from.onload = function() {
	  context_from.drawImage(this, 0, 0, canvas_from.width, canvas_from.height);
	};
	image_from.src = "/39.jpg";
	return context_from;
}

function draw_to(source_context){
	var canvas_to = document.getElementById('to');
	canvas_to.style.opacity = TO_OPACITY;
	canvas_to.height = window.innerHeight;
	canvas_to.width = window.innerWidth; 
	canvas_to.style.height = canvas_to.height;
	canvas_to.style.width = canvas_to.width;
	// canvas_to.fillstyle = "#FFFF00";
	var context_to = canvas_to.getContext('2d');
	context_to.curves = new Array()
	var pos_x, pos_y, color;

	canvas_to.onmousemove = function(event){
		pos_x = (event.pageX - canvas_to.offsetLeft) * UP_SAMPLING_RATIO;
		pos_y = (event.pageY - canvas_to.offsetTop) * UP_SAMPLING_RATIO;
		color = source_context.getImageData(pos_x, pos_y, 1, 1).data;
		if(context_to.brush_enabled){
			if(!context_to.stroke_started){
				// for (i in context_to.brushes) {
				// 	context_to.brushes[i].strokeStart(pos_x + Math.random() * BOUNDING_BOX,pos_y + Math.random() * BOUNDING_BOX);
				// }
				context_to.strok_started = true;
			}
			// for (i in context_to.brushes) {
			// 	context_to.brushes[i].stroke(pos_x + Math.random() * BOUNDING_BOX,pos_y + Math.random() * BOUNDING_BOX,"shaded",color);
			// }
		}
	};
	return context_to;
}

// Beat detection
var BEAT_HOLD_FRAMES = 15;
var BEAT_THRESHOLD = 0.04 * 1000;
var BEAT_DECAY_RATE = 0.88;

var beatCutoff = 0;
var framesSinceLastbeat = 0;

function isBeat(level) {
    level = level*1000;

    if(level > beatCutoff && level > BEAT_THRESHOLD){
        beatCutoff = level * 1.1;
        framesSinceLastbeat = 0;
        return true;
    }
        
    else {
        if (framesSinceLastbeat <= BEAT_HOLD_FRAMES) {
            framesSinceLastbeat += 1;
        }
        else
            beatCutoff *= BEAT_DECAY_RATE;
            beatCutoff = Math.max(beatCutoff, BEAT_THRESHOLD)
    }
    return false;
}

// different brush

// base shape (dot, shape, texture (transparency))
// base color fn(origin canvas) +fn(shiting)
// relationship with previous path 
// brush speed factor, inertia 
// parallel drawing

// genelized and parameterized brush
// dedicated options (toggle)

// Temperature: calm (blurry) <> energetic (clarity)
// Wind: still (clear) <> chill <> moving <> blast (noisy, distorted)
// Humidity: dry (clear like) <> moist <>raining (old film , low contrast like)
// Sun: night (lack of color and tone) <> dawn <> noon <> bright <> sunset (more colorful vibrant)
// Cloud: clear (high contrast) <> cloudy <> blocked (low contrast)
// Season and time:  cold (low color temperature, winter) <> warm (high color temperature, spring)

// tracing pattern

function start_tracing(context_to,context_from){
	var color;

    var count = 0;
	setInterval(function(){
        console.log(isBeat(meter.volume));

		// pick color
		// brush color
		count++
			random0 = Math.random() * 100 + 50;
			random1 = Math.random() * 5;
		for (i in context_to.curves) {
			color = context_from.getImageData(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, 1, 1).data;
			context_to.curves[i].brush.stroke(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, "colored", color, 10, 1.0, 500);
			context_to.curves[i].path.update("random", 100, meter.volume);
		}
        if (!isBeat(meter.volume)) {
            clear()
        }
	},1000/30)

}
	function clear() {
		to.clearRect ( 0 , 0 , BOUNDING_BOX_X, BOUNDING_BOX_Y );
	}




