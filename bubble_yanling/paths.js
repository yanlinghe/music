MAX_VEL = 100
MIN_VEL = -100

function PATH( context, showType ){
	this.init( context, showType );
}

PATH.prototype ={
	context: null,

	init: function( context, showType ){
		
		this.topLeft = new Victor(0, 0);
		this.bottomRight = new Victor(BOUNDING_BOX_X, BOUNDING_BOX_Y);
		this.context = context;
		this.updateCount = 0;
		this.delta_t = 1;
		this.showType = showType || "random";

		this.initPosition( this.showType )
	},

	destroy: function(){
	},

	initPosition: function( showType ){
		switch ( showType ) {
			case "up":
				this.cur_pos = new Victor(Math.random()*this.bottomRight.x, 0);
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "down":
				this.cur_pos = new Victor(Math.random()*this.bottomRight.x, this.bottomRight.y);
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "left":
				this.cur_pos = new Victor(0, Math.random()*this.bottomRight.y);
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "right":
				this.cur_pos = new Victor(this.bottomRight.x, Math.random()*this.bottomRight.y);
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "center":
				this.cur_pos = new Victor(this.bottomRight.x/2, this.bottomRight.y/2);
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "corner":
				corner = Math.floor(Math.random() * 4)
				if (corner == 0) {
					this.cur_pos = new Victor(0, 0);
				} else if (corner == 1) {
					this.cur_pos = new Victor(0, this.bottomRight.y);
				} else if (corner == 2) {
					this.cur_pos = new Victor(this.bottomRight.x, 0);
				} else if (corner == 3) {
					this.cur_pos = new Victor(this.bottomRight.x, this.bottomRight.y);
				}
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "random":
				this.cur_pos = new Victor( Math.random()*this.bottomRight.x, Math.random()*this.bottomRight.y );
				this.cur_vel = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				this.cur_acc = new Victor( Math.random()*2 - 1, Math.random()*2 - 1 );
				break;
			case "invertX":
				this.cur_vel.invertX();
				break;
			case "invertY":
				this.cur_vel.invertY();
				break;
		}
	},

	update: function( path, updateCount, volumn ){
		path = path || "random";

		if (this.updateCount == updateCount) {
			this.updateCount = 0;
		}

		// console.log(volumn)
		this.delta_t = volumn*3;

		switch (path) {
			case "angular":
				if (this.updateCount == 0) {
					dir = Math.floor(Math.random() * 4)
					if (dir == 0) {
						this.cur_vel = new Victor(0, 1);
					} else if (dir == 1) {
						this.cur_vel = new Victor(0, -1);
					} else if (dir == 2) {
						this.cur_vel = new Victor(1, 0);
					} else if (dir == 3) {
						this.cur_vel = new Victor(-1, 0);
					}
				}

				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
				if( (new_pos.x < this.bottomRight.x && new_pos.x > this.topLeft.x ) && (new_pos.y < this.bottomRight.y && new_pos.y > this.topLeft.y ) ) {
					delta_pos = new Victor(this.cur_vel.x * this.delta_t, this.cur_vel.y * this.delta_t)
					this.cur_pos.add( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invert");
					} else {
						this.initPosition( this.showType ); 
					}
				}
				this.updateCount++;
				break;
			case "wave":
				// this.cur_vel = new Victor( 2, 2 );
				// new_pos = new Victor(this.cur_pos.x + this.cur_vel.x, Math.sin(this.cur_pos.x) * this.bottomRight.y/3)
				// if( (new_pos.x < this.bottomRight.x && new_pos.x > this.topLeft.x ) && (new_pos.y < this.bottomRight.y && new_pos.y > this.topLeft.y ) ) {
				// 	this.cur_pos = new_pos;
				// } else {
				// 	if (this.showType == "random") {
				// 		this.initPosition("invert");
				// 	} else {
				// 		this.initPosition( this.showType ); 
				// 	}
				// }
				// console.log(this.cur_pos.x)
				// this.cur_pos.x += 3
				// this.cur_pos.y =  Math.sin(this.cur_pos.x) * this.bottomRight.y;
				// this.updateCount++;
				break;
			case "gradient":
				break;
			case "spiral":
				// if (count == 10) {
				// 	prev_cur_speed_vecs0 = cur_speed_vecs[i][0]
				// 	prev_cur_speed_vecs1 = cur_speed_vecs[i][1]
				// 	cur_speed_vecs[i][0] = prev_cur_speed_vecs0 * Math.cos(angle) - prev_cur_speed_vecs1 * Math.sin(angle) + cur_speed_vec_change[0];
				// 	cur_speed_vecs[i][1] = prev_cur_speed_vecs0 * Math.sin(angle) + prev_cur_speed_vecs1 * Math.cos(angle) + cur_speed_vec_change[1];
				// }
				// if(this.cur_pos[0] + cur_speed_vecs[i][0] * cur_speed < MAX_POS_X && this.cur_pos[0] + cur_speed_vecs[i][0] * cur_speed > 0){
				// 	this.cur_pos[0] += cur_speed_vecs[i][0] * cur_speed;
				// } else {
				// 	this.cur_vel_dir[0] = -this.cur_vel_dir[0];
				// }

				// if(this.cur_pos[1] + cur_speed_vecs[i][1] * cur_speed < MAX_POS_Y && this.cur_pos[1] + cur_speed_vecs[i][1] * cur_speed > 0){
				// 	this.cur_pos[1] += cur_speed_vecs[i][1] * cur_speed;
				// } else {
				// 	cur_speed_vecs[i][1] = -cur_speed_vecs[i][1];
				// }
			case "bounce":
				radius = Math.PI / 36;
				if (this.updateCount == 0) {
					console.log("update=0")
					prev_vel = new Victor(this.cur_vel.x, this.cur_vel.y)
					this.cur_vel.x = prev_vel.x * Math.cos(radius) - prev_vel.y * Math.sin(radius) + this.cur_acc.x * Math.random();
					this.cur_vel.y = prev_vel.x * Math.sin(radius) + prev_vel.y * Math.cos(radius) + this.cur_acc.y * Math.random();
				}

				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
				delta_pos = new Victor(this.cur_vel.x * this.delta_t, this.cur_vel.y * this.delta_t)
				if( new_pos.x < this.bottomRight.x && new_pos.x > this.topLeft.x ) {
					this.cur_pos.addX( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invertX");
					} else {
						this.initPosition( this.showType ); 
					}
				}
				if( new_pos.y < this.bottomRight.y && new_pos.y > this.topLeft.y ) {
					this.cur_pos.addY( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invertY");
					} else {
						this.initPosition( this.showType ); 
					}
				}
				this.updateCount++;
				break;
			case "random":
				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
				delta_pos = new Victor(this.cur_vel.x * this.delta_t, this.cur_vel.y * this.delta_t)
				if( new_pos.x < this.bottomRight.x && new_pos.x > this.topLeft.x ) {
					this.cur_pos.addX( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invertX");
					} else {
						this.initPosition( this.showType ); 
					}
				}
				if( new_pos.y < this.bottomRight.y && new_pos.y > this.topLeft.y ) {
					this.cur_pos.addY( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invertY");
					} else {
						this.initPosition( this.showType ); 
					}
				}

				this.cur_acc = new Victor(Math.random() * 6 - 3, Math.random() * 6 - 3)
				new_vel = new Victor(this.cur_vel.x + this.cur_acc.x * this.delta_t, this.cur_vel.y + this.cur_acc.y * this.delta_t)
				if( new_vel.length() < MAX_VEL && new_vel.length() > MIN_VEL ){
					delta_vel = new Victor( this.cur_acc.x * this.delta_t, this.cur_acc.y * this.delta_t)
					this.cur_vel.add( delta_vel );
				} else {
					this.cur_acc.invert();
				}
				this.updateCount++;
				break;
			case "line":
				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
				if( (new_pos.x < this.bottomRight.x && new_pos.x > this.topLeft.x ) && (new_pos.y < this.bottomRight.y && new_pos.y > this.topLeft.y ) ) {
					delta_pos = new Victor(this.cur_vel.x * this.delta_t, this.cur_vel.y * this.delta_t)
					this.cur_pos.add( delta_pos );
				} else {
					if (this.showType == "random") {
						this.initPosition("invert");
					} else {
						this.initPosition( this.showType ); 
					}
				}

				new_vel = new Victor(this.cur_vel.x + this.cur_acc.x * this.delta_t, this.cur_vel.y + this.cur_acc.y * this.delta_t)
				if( new_vel.length() < MAX_VEL && new_vel.length() > MIN_VEL ){
					delta_vel = new Victor( this.cur_acc.x * this.delta_t, this.cur_acc.y * this.delta_t)
					this.cur_vel.add( delta_vel );
				} else {
					this.cur_acc.invert();
				}
				this.updateCount++;
				break;
		}
	}
}