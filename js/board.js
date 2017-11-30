
Board.templates = [
    [
		{ x1 : 10, y1 : 10, x2 : 20,  y2 : 20,  hardness : -1, color : "grey"},
		{ x1 : 20, y1 : 20, x2 : 40,  y2 : 40,  hardness : 3,  color : ""},
		{ x1 : 50, y1 : 15, x2 : 80,  y2 : 25,  hardness : 10, color : "grey"},
		{ x1 : 80, y1 : 80, x2 : 100, y2 : 100, hardness : 10, color : "blue"}
	]
];

function Board() {
	this.background_image = null;
	this.obstacles_map    = [];
}

Board.prototype.parse = function( template_number ) {
	var loop;
	
	for( loop in Board.templates[ template_number ]) {
		new obstacle( Board.templates[ template_number ][ loop ].x1,
		              Board.templates[ template_number ][ loop ].y1,
		              Board.templates[ template_number ][ loop ].x2,
		              Board.templates[ template_number ][ loop ].y2,
					  Board.templates[ template_number ][ loop ].hardness,
					  Board.templates[ template_number ][ loop ].color );
	}
}
