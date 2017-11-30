
obstacle.all = {};

obstacle.count = 0;

function obstacle( x1, y1, x2, y2, hardness, color ) {
	if( (x1 == undefined) || (y1 == undefined) || (x2 == undefined) || (y2 == undefined)) return;
	// rośnie count o jeden
	obstacle.count++;
	// id oraz wrzucenie all
	this.id = obstacle.count;
	obstacle.all[ this.id ] = this;
	
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.points = [{}, {}, {}, {}];
	this.time_to_live = hardness ? hardness : 10;
	this.color = color;
}

obstacle.prototype.draw = function() {
	var new_r = this.r; //Math.sqrt( 2 * this.r * this.r );
	Game.ctx.beginPath();
	this.points[ 0 ] = { x : this.x1 * VAR.scaleX, y : this.y1 * VAR.scaleY };
	Game.ctx.moveTo( this.points[ 0 ].x, this.points[ 0 ].y );
	this.points[ 1 ] = { x : this.x2 * VAR.scaleX, y : this.y1 * VAR.scaleY };
	Game.ctx.lineTo( this.points[ 1 ].x, this.points[ 1 ].y );
	this.points[ 2 ] = { x : this.x2 * VAR.scaleX, y : this.y2 * VAR.scaleY };
	Game.ctx.lineTo( this.points[ 2 ].x, this.points[ 2 ].y );
	this.points[ 3 ] = { x : this.x1 * VAR.scaleX, y : this.y2 * VAR.scaleY };
	Game.ctx.lineTo( this.points[ 3 ].x, this.points[ 3 ].y );
	Game.ctx.closePath();
	Game.ctx.fillStyle = this.color ? this.color : "rgba( 0, 0, 0, 0.1 )"; //#244515
	//Game.ctx.fillStyle = "rgba( 0, 0, 0, 0.1 )";
	Game.ctx.fill();
}

obstacle.draw = function(){
	for(var o in obstacle.all) {
		// rysuj tą konkretną przeszkodę
		obstacle.all[ o ].draw();
	}
};

obstacle.prototype.decrement_ttl = function() {
	if( this.time_to_live > 0 ) {
		this.time_to_live--;
	}
};

obstacle.prototype.remove = function() {
	delete obstacle.all[ this.id ];
	//obstacle.count--;
}
