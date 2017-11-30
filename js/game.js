// Inicjuję grę dopiero po załadowaniu całej strony
window.onload = function(){
	Game.init();
}
// Obiekt, w którym będą przechowywane „podręczne” wartości
var VAR = {
	fps        : 60,
	W          : 0,
	H          : 0,
	lastTime   : 0,
	lastUpdate : -1,
	rand : function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	},
	calcXY : function( x, y, alpha, radius ) {
	    var real_x = ( Math.sin( Math.PI / 180 * alpha ) * radius * VAR.d ) + x;
	    var real_y = ( -Math.cos( Math.PI / 180 * alpha ) * radius * VAR.d ) + y;
	    return { x : real_x, y : real_y };
    },
	calcRA : function( x, y, this_x, this_y ) {
		var alpha  = 0;
		var radius = Math.sqrt( x * x, y * y ) / VAR.d;
		x -= this_x;
		y -= this_y;
		y *= -1;
		if( y > 0 ) {
			if( x >= 0 ) {
				alpha = Math.atan( x / y ) * 180 / Math.PI;
			} else {
				alpha = 360 + Math.atan( x / y ) * 180 / Math.PI;
			}
		} else if( y < 0 ) {
			alpha = 180 + Math.atan( x / y ) * 180 / Math.PI;
		} else {
		    if( x > 0 ) {
		        alpha = 90;
		    } else {
			    alpha = 270;
		    }
	    }
	    return { r : radius, a : alpha };
    },
	// f-cja sprawdza czy dwa kwadraty [(x0,y0),(x2,y2)] i [(x0',y0'),(x2',y2')] nachodzą na siebie
	hit_test : function( points1, points2 ) {
		var result        = false;
		var square1       = this.get_square( points1 );
		var square2       = this.get_square( points2 );
		var common_points = [];
		var result        = false;
		var one_point;
		
		for( one_point in points1 ) {
			if( this.hit_test_small( square2, points1[ one_point ])) {
				//result = true;
				common_points.push( points1[ one_point ]);
				var dipX = Math.min( square2.x2 - points1[ one_point ].x, points1[ one_point ].x - square2.x0 ); 
				var dipY = Math.min( square2.y2 - points1[ one_point ].y, points1[ one_point ].y - square2.y0 );
				if( dipX < dipY ) {
					common_points.push({ x : points1[ one_point ].x, y : square2.y0 });
					common_points.push({ x : points1[ one_point ].x, y : square2.y2 });
				} else {
					common_points.push({ x : square2.x0, y : points1[ one_point ].y });
					common_points.push({ x : square2.x2, y : points1[ one_point ].y });
				}
			}
		}
		for( one_point in points2 ) {
			if( this.hit_test_small( square1, points2[ one_point ])) {
				//result = true;
				common_points.push( points2[ one_point ]);
				var dipX = Math.min( square1.x2 - points2[ one_point ].x, points2[ one_point ].x - square1.x0 );
				var dipY = Math.min( square1.y2 - points2[ one_point ].y, points2[ one_point ].y - square1.y0 );
				if( dipX < dipY ) {
					common_points.push({ x : points2[ one_point ].x, y : square1.y0 });
					common_points.push({ x : points2[ one_point ].x, y : square1.y2 });
				} else {
					common_points.push({ x : square1.x0, y : points2[ one_point ].y });
					common_points.push({ x : square1.x2, y : points2[ one_point ].y });
				}
			}
		}
		//
		if( common_points.length > 0 ) {
			var tmp_square = this.get_square( common_points );
			Game.hit_ctx.beginPath();
			for( one_point in points1 ) {
				if( one_point == 0 ) {
					Game.hit_ctx.moveTo( points1[ one_point ].x, points1[ one_point ].y );
				} else {
					Game.hit_ctx.lineTo( points1[ one_point ].x, points1[ one_point ].y );
				}
			}
			Game.hit_ctx.lineTo( points1[ 0 ].x, points1[ 0 ].y );
			Game.hit_ctx.closePath();
			Game.hit_ctx.fillStyle = "red";
			Game.hit_ctx.strokeStyle = "red";
			Game.hit_ctx.stroke();
			Game.hit_ctx.fill();
			
			Game.hit_ctx.beginPath();
			for( one_point in points2 ) {
				if( one_point == 0 ) {
					Game.hit_ctx.moveTo( points2[ one_point ].x, points2[ one_point ].y );
				} else {
					Game.hit_ctx.lineTo( points2[ one_point ].x, points2[ one_point ].y );
				}
			}
			Game.hit_ctx.lineTo( points2[ 0 ].x, points2[ 0 ].y );
			Game.hit_ctx.closePath();
			Game.hit_ctx.fillStyle = 'rgba( 0, 255, 0, 0.5 )';
			Game.hit_ctx.strokeStyle = 'rgba( 0, 255, 0, 0.5 )';
			Game.hit_ctx.stroke();
			Game.hit_ctx.fill();
			
			var width = tmp_square.x2 - tmp_square.x0;
			width = width <= 0 ? 1 : width;
			var height = tmp_square.y2 - tmp_square.y0;
			height = height <= 0 ? 1 : height;
			var img_data = Game.hit_ctx.getImageData( tmp_square.x0, tmp_square.y0, width, height );
			//Game.ctx.putImageData( img_data, tmp_square.x0, tmp_square.y0 );
			for( var loop = 0; loop < img_data.data.length; loop += 4 ) {
				if( (img_data.data[ loop ] > 0) && (img_data.data[ loop ] < 255)) {
					result = true;
					break;
				}
			}
		}
		return result;
		//return common_points.length > 1;
	},
	hit_test_small : function( square, point ) {
		var x_condition = (point.x >= square.x0) && (point.x <= square.x2);
		var y_condition = (point.y >= square.y0) && (point.y <= square.y2);
		return x_condition && y_condition;
	},
	// f-cja zamienia punkty krańcowe objektu w 2 punkty definjujące prostokąt
	get_square : function( _points ) {
	    var minXY = { x : _points[ 0 ].x, y : _points[ 0 ].y };
	    var maxXY = { x : 0, y : 0 };

        for( var loop in _points ) {
		    if( minXY.x > _points[ loop ].x ) minXY.x = _points[ loop ].x;
		    if( minXY.y > _points[ loop ].y ) minXY.y = _points[ loop ].y;
		    if( maxXY.x < _points[ loop ].x ) maxXY.x = _points[ loop ].x;
		    if( maxXY.y < _points[ loop ].y ) maxXY.y = _points[ loop ].y;
	    }
		if( (maxXY.x == minXY.x) && (maxXY.y == minXY.y)) {
			maxXY.x++;
			maxXY.y++;
		}
	    return { x0 : minXY.x, y0 : minXY.y, x2 : maxXY.x, y2 : maxXY.y };
    }
}
// Obiekt zawierający bazowe funckje związane z grą.
// Game nie ma konstruktora, jest jedynie obiektem grupującym funkcje.
var Game = {
	// init zostanie odpalone raz po załadowaniu strony.
	init : function() {
		// Tworzę canvas
		Game.canvas = document.createElement( 'canvas' );
		// Przypisuję kontekst 2D do zmiennej ctx, która jest właściwością obiektu Game
		Game.ctx = Game.canvas.getContext( '2d' );
		// odpalam metodę obiektu Game
		// Oraz canvas, które nigdy nie będzie dodane dodomu, na którym będą testowane kolizje kamieni z pociskami i statkiem
		Game.hit_canvas = document.createElement('canvas');
		// oraz kontekst 2D hit_canvas
		Game.hit_ctx = Game.hit_canvas.getContext( '2d' );
		Game.layout();
		// metoda layout odpali się przy każdej zmianie wielkości okna
		window.addEventListener( 'resize', Game.layout, false );
		// Canvas zostaje dodany do DOM
		document.body.appendChild( Game.canvas );
		//document.body.appendChild( Game.hit_canvas );
		// Inicjowanie czołgu
		Game.tank = new Tank();
		//
		Game.board = new Board();
		Game.board.parse( 0 );
		// 
		// Dodanie reakcji na guziki
		window.addEventListener('keydown', Game.onKey, false);
		window.addEventListener('keyup', Game.onKey, false);
		// 
		// rozpoczęcie pętli gry
		Game.animationLoop();
	},
	// 
	// Reakcje na naciskanie guzików 
	onKey : function( ev ) {
		// reaguj tylko jeśli zostały wciśnięte strzałka w lewo, do góry, w prawo lub spacja lub w dół
		if(ev.keyCode==37 || ev.keyCode==39 || ev.keyCode==38 || ev.keyCode==32 || ev.keyCode==40){
			// Jeśli guzik został wciśnięty i jednocześnie nie był on wciśnięty wcześniej (w obiekcie Game zapisujemy jaki guzik jest wciśnięty, zabezpieczamy się w ten sposób przed systemowym auto-powtarzaniem wciskania guzika)
			// Zamiast notacji kropkowej (np.: Game.key_39) stosuję nawiasy kwadratowe, dzięki temu nie muszę pisać długiej ifki i sprawdzać po kolei każdej możliwości
			if(ev.type=='keydown' && !Game['key_'+ev.keyCode]){
				Game['key_'+ev.keyCode] = true;
				// Jeśli została wciśnięta strzałka w lewo lub w prawo należy wyłączyć strzałkę w przeciwną stronę
				if(ev.keyCode==37){
					Game.key_39 = false;
				}else if(ev.keyCode==39){
					Game.key_37 = false;
				}else if(ev.keyCode==32){ // jeśli została wciśnięta spacja dodaj nowy pocisk
					//new Bullet();
					Game.tank.shot();
				}
			}else if(ev.type=='keyup'){// w przypadku gdy guzik został zwolniony przypisz odpowiedniej właściwości obiektu Game false
				Game['key_'+ev.keyCode] = false;
			}

		}
	},
	// Ta metoda będzie odpalana przy każdej zmianie wielkości okna
	layout : function( ev ) {
		// Dla łatwiejszego pisania wielkość okna zostaje przypisana do właściwości W i H obiektu VAR
		VAR.W = window.innerWidth;
		VAR.H = window.innerHeight;
		// Wiele wielkości będzie bazowało na krótszym boku wielkości okna, dlatego można od razu przypisać go do właściwości obiektu VAR
		VAR.d      = Math.min(VAR.W, VAR.H);
		VAR.scale  = VAR.d / 100;
		VAR.scaleX = VAR.W / 100;
		VAR.scaleY = VAR.H / 100;
		// Update wielkości canvas
		Game.canvas.width = VAR.W;
		Game.canvas.height = VAR.H;
		// Hit canvas
		Game.hit_canvas.width = VAR.W;
		Game.hit_canvas.height = VAR.H;
		// Wypełnienie kamieni na hit_canvas (do testów kolizji)
		Game.hit_ctx.fillStyle = '#000000';
		//
		// Po zmianie wilekości canvas resetują się kolory i grubości linii, dlatego to właśnie tutaj trzeba je zawsze na nowo definiować
		Game.ctx.fillStyle = 'white'
		Game.ctx.strokeStyle = 'white'
		Game.ctx.lineWidth = 3
		Game.ctx.lineJoin = 'round'
	},
	// Funkcja, która odpala się 60 razy na sekundę
	animationLoop : function( time ) {
		requestAnimationFrame( Game.animationLoop );
		// ograniczenie do ilości klatek zdefiniowanych w właściwości obiektu VAR (nie więcej niż VAR.fps)
		if(time-VAR.lastTime>=1000/VAR.fps){
			VAR.lastTime = time;
			//
			// oczyszczenie canvas
			Game.ctx.clearRect( 0, 0, VAR.W, VAR.H );
			// Tymczasowe oczyszczanie całej hit canvas
			Game.hit_ctx.clearRect( 0, 0, VAR.W, VAR.H );
			// Rysowanie przeszkód
			obstacle.draw();
			// Rysowanie statku
			Game.tank.draw();
			// Rysowanie pocisków
			Bullet.draw();
			// Rysowanie kropek
			Dot.draw();
		}
	}
}
