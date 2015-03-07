function BRUSH( context ){
	this.init( context );
}

BRUSH.prototype ={
	context: null,
	prevMouseX: null, prevMouseY: null,
	points: null, count: null,

	init: function( context ){
		this.context = context;
		this.points = new Array();
		this.context.globalCompositeOperation = 'source-over'; //https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html			
		this.count = 0;
	},

	destroy: function(){
	},

	strokeStart: function( mouseX, mouseY ){
		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;

	},

	stroke: function( mouseX, mouseY, brush, color, line_width, opacity, connection_distance){
		var i, dx, dy, d, speed, push_point;
		speed = Math.abs(mouseX - this.prevMouseX) + Math.abs(mouseY - this.prevMouseY);
		brush = brush || "fur";
		// if(Math.random()>0.5){
		// 	this.points.push( [ mouseX, mouseY ] );
		// 	push_point = true;
		// }
		this.points.push( [ mouseX, mouseY ] );

		switch (brush) {
			case "fur":
				connection_distance = connection_distance || 2000;
				this.context.lineWidth = line_width || 3;
				this.context.strokeStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + (opacity || 0.2) + ")";
				this.context.beginPath();
				this.context.moveTo(this.prevMouseX, this.prevMouseY);
				this.context.lineTo(mouseX, mouseY);
				this.context.stroke();
				for (i = 0; i < this.points.length; i++){
					dx = this.points[i][0] - this.points[this.count][0];
					dy = this.points[i][1] - this.points[this.count][1];
					d = dx * dx + dy * dy;

					if (d < connection_distance && Math.random() > d / connection_distance){
						this.context.beginPath();
						this.context.moveTo( mouseX + (dx * 0.5), mouseY + (dy * 0.5));
						this.context.lineTo( mouseX - (dx * 0.5), mouseY - (dy * 0.5));
						this.context.stroke();
					}
				}
				break;
			case "shaded":
				connection_distance = connection_distance || 1000;
				this.context.lineWidth = line_width || 3;
				for (i = 0; i < this.points.length; i++){
					dx = this.points[i][0] - this.points[this.count][0];
					dy = this.points[i][1] - this.points[this.count][1];
					d = dx * dx + dy * dy;
					if (d < connection_distance){
						this.context.strokeStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + ((1 - (d / connection_distance)) * 2 * (opacity || 0.2)) + " )";
						this.context.beginPath();
						this.context.moveTo( this.points[this.count][0], this.points[this.count][1]);
						this.context.lineTo( this.points[i][0], this.points[i][1]);
						this.context.stroke();
					}
				}
				break;
			case "colored":
				var random = 1; //Math.random()
				this.context.lineWidth = line_width || 3;
				this.context.strokeStyle = "rgba(" + Math.ceil(color[0]*random) + ", " + Math.ceil(color[1]*random) + ", " + Math.ceil(color[2]*random) + ", " + (opacity || 0.9) + ")";
				this.context.beginPath();
				this.context.moveTo(this.prevMouseX, this.prevMouseY);
				this.context.lineTo(mouseX, mouseY);
				this.context.stroke();
				break;
		}

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;
		this.count ++;
	},

	strokeEnd: function(){
		
	}
}