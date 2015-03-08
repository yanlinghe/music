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

		this.initPosition( this.showType );

		this.angularDir = 0;

		this.spiralRadiusMin = -Math.PI / 4
		this.spiralRadiusMax = Math.PI / 4
		this.spiralRadius = Math.PI / 4
		this.spiralDir = 0
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
					switch (this.angularDir) {
						case 0:
						this.angularDir = Math.floor(Math.random() * 3)
						if (this.angularDir == 0) {
							this.angularDir = 0;
							this.cur_vel = new Victor(0, 1);
						} else if (this.angularDir == 1) {
							this.angularDir = 2;
							this.cur_vel = new Victor(1, 0);
						} else if (this.angularDir == 2) {
							this.angularDir = 3;
							this.cur_vel = new Victor(-1, 0);
						}
						break;
						case 1:
						this.angularDir = Math.floor(Math.random() * 3)
						if (this.angularDir == 0) {
							this.angularDir = 1;
							this.cur_vel = new Victor(0, -1);
						} else if (this.angularDir == 1) {
							this.angularDir = 2;
							this.cur_vel = new Victor(1, 0);
						} else if (this.angularDir == 2) {
							this.angularDir = 3;
							this.cur_vel = new Victor(-1, 0);
						}
						break;
						case 2:
						this.angularDir = Math.floor(Math.random() * 3)
						if (this.angularDir == 0) {
							this.angularDir = 0;
							this.cur_vel = new Victor(0, 1);
						} else if (this.angularDir == 1) {
							this.angularDir = 1;
							this.cur_vel = new Victor(0, -1);
						} else if (this.angularDir == 2) {
							this.angularDir = 2;
							this.cur_vel = new Victor(1, 0);
						}
						break;
						case 3:
						this.angularDir = Math.floor(Math.random() * 3)
						if (this.angularDir == 0) {
							this.angularDir = 0;
							this.cur_vel = new Victor(0, 1);
						} else if (this.angularDir == 1) {
							this.angularDir = 1;
							this.cur_vel = new Victor(0, -1);
						} else if (this.angularDir == 2) {
							this.angularDir = 3;
							this.cur_vel = new Victor(-1, 0);
						}
						break;
					}
				}
				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * 10 * this.delta_t * (Math.random() + 1), this.cur_pos.y + this.cur_vel.y * 10 * this.delta_t * (Math.random() + 1))
				this.changeVelDir( new_pos )
				break;
			case "wave":
				break;
			case "gradient":
				break;
			case "spiral":
				if (this.spiralDir == 0) {
					this.spiralRadius -= Math.PI / 360
				} else {
					this.spiralRadius += Math.PI / 360
				}
				if (this.spiralRadius > this.spiralRadiusMax) {
					this.spiralDir = 0
				}
				if (this.spiralRadius < this.spiralRadiusMin) {
					this.spiralDir = 1
				}

				if (this.updateCount == 0) {
					prev_vel = new Victor(this.cur_vel.x, this.cur_vel.y);
					this.cur_vel.x = prev_vel.x * Math.cos(this.spiralRadius) - prev_vel.y * Math.sin(this.spiralRadius);
					this.cur_vel.y = prev_vel.x * Math.sin(this.spiralRadius) + prev_vel.y * Math.cos(this.spiralRadius);
				}

				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
				this.changeVelDir( new_pos );
			case "bounce":
				radius = Math.PI / 36;
                    if (this.updateCount == 0) {
                        prev_vel = new Victor(this.cur_vel.x, this.cur_vel.y)
                        this.cur_vel.x = prev_vel.x * Math.cos(radius) - prev_vel.y * Math.sin(radius) + this.cur_acc.x * Math.random();
                        this.cur_vel.y = prev_vel.x * Math.sin(radius) + prev_vel.y * Math.cos(radius) + this.cur_acc.y * Math.random();
                    }
                    
                    new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * 3 * this.delta_t, this.cur_pos.y + this.cur_vel.y * 3 * this.delta_t)
                    this.changeVelDir( new_pos );
				break;
			case "random":
				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * this.delta_t, this.cur_pos.y + this.cur_vel.y * this.delta_t)
                this.changeVelDir( new_pos );
                    
                this.cur_acc = new Victor(acceleration.x, acceleration.y)
                new_vel = new Victor(this.cur_vel.x + this.cur_acc.x * this.delta_t, this.cur_vel.y + this.cur_acc.y * this.delta_t)
                if( new_vel.length() < MAX_VEL && new_vel.length() > MIN_VEL ){
                    delta_vel = new Victor( this.cur_acc.x * this.delta_t, this.cur_acc.y * this.delta_t)
                    this.cur_vel.add( delta_vel );
                } else {
                    this.cur_acc.invert();
                }
				break;
			case "line":
				new_pos = new Victor(this.cur_pos.x + this.cur_vel.x * 10 * this.delta_t, this.cur_pos.y + this.cur_vel.y * 10 * this.delta_t)
                this.changeVelDir( new_pos );
				break;
		}
	},

	changeVelDir: function( new_pos ) {
		delta_pos = new Victor(new_pos.x - this.cur_pos.x, new_pos.y - this.cur_pos.y)
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
	}
}