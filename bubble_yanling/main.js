
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

window.onload = function(){
	var from = draw_from();
	var to = draw_to(from);
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
	image_from.src = "/03.jpg";
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
	var cur_points = new Array()
	var cur_speed_vecs = new Array()
	for (i = 0; i < TOTAL_NUM; i++) {
		cur_points.push([Math.random() * BOUNDING_BOX_X, Math.random() * BOUNDING_BOX_Y])
		cur_speed_vecs.push([1*Math.random(),-2*Math.random()]);
	}
	var cur_speed_vec_change = [0.6,1];
	var cur_speed = 1;
	var color;

	var line_width;
	var windChillSlider = document.getElementById('wind_chill')
	var windDirectionSlider = document.getElementById('wind_direction')
	var windSpeedSlider = document.getElementById('wind_speed')
	var atmosHumiditySlider = document.getElementById('atmos_humidity')
	var atmosVisibilitySlider = document.getElementById('atmos_visibility')
	var atmosPressureSlider = document.getElementById('atmos_pressure')
	var atmosRisingSlider = document.getElementById('atmos_rising')
	var codeSlider = document.getElementById('code')
	var tempSlider = document.getElementById('temp')
	var daySlider = document.getElementById('day')
	var timeSlider = document.getElementById('time')

	var windChill = windChillSlider.value;
	var windDirection = windDirectionSlider.value;
	var windSpeed = windSpeedSlider.value;
	var atmosHumidity = atmosHumiditySlider.value;
	var atmosVisibility = atmosVisibilitySlider.value;
	var atmosPressure = atmosPressureSlider.value;
	var atmosRising = atmosRisingSlider.value;
	var code = codeSlider.value;
	var temp = tempSlider.value;
	var day = daySlider.value;
	var time = timeSlider.value;
	var angle = windDirection / 360.0 * Math.PI; 

	windChillSlider.oninput = function() { windChill = this.value; }
    windDirectionSlider.oninput = function() { windDirection = this.value 
    angle = windDirection / 360.0 * Math.PI; }
    windSpeedSlider.oninput = function() { windSpeed = this.value }
    atmosHumiditySlider.oninput = function() { atmosHumidity = this.value }
    atmosVisibilitySlider.oninput = function() { atmosVisibility = this.value }
    atmosPressureSlider.oninput = function() { atmosPressure = this.value }
    atmosRisingSlider.oninput = function() { atmosRising = this.value }
    codeSlider.oninput = function() { code = this.value }
    tempSlider.oninput = function() { temp = this.value }
    daySlider.oninput = function() { day = this.value }
    timeSlider.oninput = function() { time = this.value }

    var count = 0;
	setInterval(function(){
		// pick color
		// brush color
		count++
			random0 = Math.random() * 100 + 50;
			random1 = Math.random() * 5;
		for (i in context_to.curves) {
			color = context_from.getImageData(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, 1, 1).data;
			context_to.curves[i].brush.stroke(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, "colored", color, 1, 1.0, 500);
			context_to.curves[i].path.update("random", 100, meter.volume);
		}
	},1000/30)

}



