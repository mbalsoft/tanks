// statyczne właściwości klasy Bullet
// Obiekt ze wszystkimi pociskami.
Bullet.all = {};
// Liczy pociski (dzięki temu każdy ma unikatowe id)
Bullet.count = 0;
// Względna prędkość pocisku
Bullet.speed = 0.015;
// Ile klatek animacji pocisk utrzymuje się na ekranie (potem jest usuwany, bo inaczej leciałby i leciał)
Bullet.life = 35;
//kaliber caliber
Bullet.caliber = 0.006;
// konstruktor pocisku
function Bullet( shot_point ){ 
	// zwiększa ilość wszystkich wystrzelonych pocisków
	Bullet.count++;
	// id pocisku to jego numer zamieniony na łańcuch znaków (musi być unikatowy)
	this.id = Bullet.count.toString();
	// Pocisk jest wstawiany do obiektu ze wszystkimi aktywnymi pociskami
	Bullet.all[this.id] = this;
	// aktualny stan życia pocisku (pocisk ma ograniczony zasięg ilością klatek zapisaną)
	this.life = 0;
	// kąt lotu, taki jak kąt statku w chwili wystrzału
	this.a = Game.tank.a;
	// pozycja taka jak pozycja pierwszego punktu statku (tam gdzie dziób statku)
	this.x = shot_point.x;
	this.y = shot_point.y;
	
	this.points = [{}, {}, {}, {}];
};
// statyczna metoda obiektu Bullet (nie metoda każdej instancji Bullet)
Bullet.draw = function() {
	// pętla for in przeszukuje wszystki pociski przechowywane w Bullet.all
	for(var b in Bullet.all){
		var bullet_radius = Bullet.caliber * VAR.d;
		Bullet.all[b].points[ 0 ] = { x : Bullet.all[b].x - bullet_radius, y : Bullet.all[b].y - bullet_radius };
		Bullet.all[b].points[ 1 ] = { x : Bullet.all[b].x - bullet_radius, y : Bullet.all[b].y + bullet_radius };
		Bullet.all[b].points[ 2 ] = { x : Bullet.all[b].x + bullet_radius, y : Bullet.all[b].y + bullet_radius };
		Bullet.all[b].points[ 3 ] = { x : Bullet.all[b].x + bullet_radius, y : Bullet.all[b].y - bullet_radius };
		//czy trafienie w obiekt
		var goal = Bullet.all[ b ].hit_test();
		// czy jeszcze żyje
		if(Bullet.all[b].life>Bullet.life || Bullet.all[b].x<0 || Bullet.all[b].x>VAR.W || Bullet.all[b].y<0 || Bullet.all[b].y>VAR.H || goal ){
			if( goal ) Dot.add( Bullet.all[ b ].x, Bullet.all[ b ].y );
			// usuń pocisk z Bullet.all
			delete Bullet.all[ b ];
		} else {
			// starzeje się
			Bullet.all[b].life++;
			// leci pocisk (znowu trygonometria)
			Bullet.all[b].x += Math.sin(Math.PI/180*Bullet.all[b].a)*Bullet.speed*VAR.d;
			Bullet.all[b].y -= Math.cos(Math.PI/180*Bullet.all[b].a)*Bullet.speed*VAR.d;
			// rysuj kulkę
			Game.ctx.beginPath();
			Game.ctx.arc( Bullet.all[b].x, Bullet.all[b].y, Bullet.caliber * VAR.d, 0, 2 * Math.PI );
			Game.ctx.closePath();
			Game.ctx.fillStyle = "black";
			Game.ctx.fill();
		}
	}
};

Bullet.prototype.hit_test = function() {
	for( var o in obstacle.all ) {
		if( VAR.hit_test( obstacle.all[ o ].points, this.points )) {
			obstacle.all[ o ].decrement_ttl();
			if( obstacle.all[ o ].time_to_live == 0 ) {
				obstacle.all[ o ].remove();
			}
			return true;
		}
	}
	/* if( VAR.hit_test( VAR.get_square( Game.tank ), VAR.get_square( this ))) {
		return true;
	} */
	/* if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
		object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) {
		// The objects are touching
		}
		*/
	return false;
};

