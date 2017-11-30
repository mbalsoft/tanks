
function Tank() {
	this.r = 0.1;
	this.a = 0;
	this.rear_a = 35;
	this.turret_r = 0.035;
	this.barrel_weight = 2;
	this.clawrels_width = 5;
	this.x = VAR.W/2;
	this.y = VAR.H/2;
	this.points = [{}, {}, {}, {}, {}];
	
	// dochodzi modX i modY aby przechowywać informację o ruchu czołgu
	// w modX i modY wartości będą przechowywane w pixelach
	this.modX = 0;
	this.modY = 0;
	// jaka jest maksymalna prędkość czołgu (zapisana wzgędem wielkości okna)
	this.maxMod = 0.009;
	// acc = acceleration czyli przyspieszenie czołgu (jak zmienia się prędkość w momencie kiedy gracz wiska strzałkę do przodu lub do tyłu)
	// też względem wielkości canvas
	this.acc = 0.0004;
	// czas po którym można znów strzelić [w ramkach]
	this.shot_life = 50;
	this.shot_duration = 0;
}

Tank.prototype.draw = function() {
	var old_a = this.a;
	var old_x = this.x;
	var old_y = this.y;
	var tmp_xy; //zmienna do przenoszenia wartości x i y
	
	// sprawdź czy gracz skręca czołgiem
	if(Game.key_37 || Game.key_39){
		// Dodaję lub odejmuję 2.5 stopni w zależności czy statek skręca w lewo czy w prawo
		this.a=this.a + 2.5 *(Game.key_37 ? -1 : 1);
		//console.log( "key" );
	}
	// Jeśli gracz jedzie czołgiem
	if(Game.key_38 && !Game.key_40) {
		// Znowu pomaga nam trygonometria, do tego nie możemy zejść poniżej minus maksymalna prędkość i powyżej maksymalna prędkość
		this.modX = Math.min( this.maxMod, this.modX += this.acc * VAR.d );
	    this.x+=Math.sin(Math.PI/180*this.a)*this.modX*VAR.d;
	    this.y-=Math.cos(Math.PI/180*this.a)*this.modX*VAR.d;
	} else if(!Game.key_38 && Game.key_40) {
		this.modX = Math.min( this.maxMod, this.modX += this.acc * VAR.d );
	    this.x-=Math.sin(Math.PI/180*this.a)*this.modX*VAR.d;
	    this.y+=Math.cos(Math.PI/180*this.a)*this.modX*VAR.d;
	} else{ // jeśli gracz nie jedzie, czołg się zatrzymuje
		// nowy modX to 70% poprzedniego
		this.modX = this.modX*0.7;
		// jeśli wartość bezwzględna modX jest mniejsza niż 0.0001 niech modX = 0
		this.modX = Math.abs(this.modX)<0.0001 ? 0 : this.modX;
		// to samo dla modY
		this.modY = this.modY*0.7;
		this.modY = Math.abs(this.modY)<0.0001 ? 0 : this.modY;
	}
	
	//hull of the tank kadłub czołgu
	Game.ctx.beginPath();
	this.points[ 0 ] = VAR.calcXY( this.x, this.y, this.a - this.rear_a, this.r );
	Game.ctx.moveTo( this.points[ 0 ].x, this.points[ 0 ].y );
	this.points[ 2 ] = VAR.calcXY( this.x, this.y, this.a + this.rear_a, this.r );
	Game.ctx.lineTo( this.points[ 2 ].x, this.points[ 2 ].y );
	this.points[ 3 ] = VAR.calcXY( this.x, this.y, this.a + 180 - this.rear_a, this.r );
	Game.ctx.lineTo( this.points[ 3 ].x, this.points[ 3 ].y );
	this.points[ 4 ] = VAR.calcXY( this.x, this.y, this.a + 180 + this.rear_a, this.r );
	Game.ctx.lineTo( this.points[ 4 ].x, this.points[ 4 ].y );
	Game.ctx.closePath();
	Game.ctx.strokeStyle = "black";
	Game.ctx.fillStyle = "blue";
	Game.ctx.stroke();
	Game.ctx.fill();
	
	//crawlers gasienice
	this.tmp_r = this.r * 0.85;
	Game.ctx.beginPath();
	tmp_xy = VAR.calcXY( this.x, this.y, this.a - this.rear_a + this.clawrels_width, this.tmp_r );
	Game.ctx.moveTo( tmp_xy.x, tmp_xy.y );
	tmp_xy = VAR.calcXY( this.x, this.y, this.a - 180 + this.rear_a - this.clawrels_width, this.tmp_r );
	Game.ctx.lineTo( tmp_xy.x, tmp_xy.y );
	Game.ctx.stroke();
	Game.ctx.beginPath();
	tmp_xy = VAR.calcXY( this.x, this.y, this.a + this.rear_a - this.clawrels_width, this.tmp_r );
	Game.ctx.moveTo( tmp_xy.x, tmp_xy.y );
	tmp_xy = VAR.calcXY( this.x, this.y, this.a - 180 - this.rear_a + this.clawrels_width, this.tmp_r );
	Game.ctx.lineTo( tmp_xy.x, tmp_xy.y );
	Game.ctx.strokeStyle = "black";
	Game.ctx.stroke();
	
	//turret wiezyczka
	Game.ctx.beginPath();
	Game.ctx.arc( this.x, this.y, this.turret_r * VAR.d, 0, Math.PI/180*360 );
	Game.ctx.strokeStyle = "black";
	Game.ctx.fillStyle = "#000040";
	Game.ctx.stroke();
	Game.ctx.fill();
	
	//barrel lufa
	this.points[ 1 ] = VAR.calcXY( this.x, this.y, this.a, this.r );
	Game.ctx.beginPath();
	tmp_xy = VAR.calcXY( this.x, this.y, this.a - this.barrel_weight, this.r );
	Game.ctx.moveTo( tmp_xy.x, tmp_xy.y );
	tmp_xy = VAR.calcXY( this.x, this.y, this.a - (this.barrel_weight * 3), this.turret_r );
	Game.ctx.lineTo( tmp_xy.x, tmp_xy.y );
	tmp_xy = VAR.calcXY( this.x, this.y, this.a + (this.barrel_weight * 3), this.turret_r );
	Game.ctx.lineTo( tmp_xy.x, tmp_xy.y );
	tmp_xy = VAR.calcXY( this.x, this.y, this.a + this.barrel_weight, this.r );
	Game.ctx.lineTo( tmp_xy.x, tmp_xy.y );
	Game.ctx.closePath();
	Game.ctx.fillStyle = "black";
	Game.ctx.fill(); //.stroke();
	
	// Czy czołg nie wyjechał za ekran
	for( var loop = 0; loop <= 4; loop++ ) {
		if( this.points[ loop ].x < 0 || this.points[ loop ].x > VAR.W || this.points[ loop ].y < 0 || this.points[ loop ].y > VAR.H ) {
			this.a = old_a;
			this.x = old_x;
	        this.y = old_y;
			return;
		}
	}
	// czy czołg nie zderzył się z przeszkodą
	for( var o in obstacle.all ) {
		if( VAR.hit_test( this.points, obstacle.all[ o ].points )) {
			this.a = old_a;
			this.x = old_x;
	        this.y = old_y;
			return;
		}
	}
	// czas kiedy bedzie można znów strzelić
	if( this.shot_duration > 0 ) {
		this.shot_duration--;
	}
};

Tank.prototype.shot = function() {
	if( this.shot_duration <= 0 ) {
		this.shot_duration = this.shot_life;
		new Bullet( this.points[ 1 ]);
	}
}
