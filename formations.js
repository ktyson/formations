function Grid(name, max_x, max_y) {

	this.name = name;
	this.MAX_X = max_x;
	this.MAX_Y = max_y;

	this.draw = function() {
		var c = [];

		c.push("<table>");
		for(var x = 1; x <= this.MAX_X; x++) {
			c.push("<tr>");
			for(var y = 1; y <= this.MAX_Y; y++) {
				c.push("<td><span id='" + x + "_" + y + "'></span>" );
			}
			c.push("</tr>");
		}
		c.push("</table>");

		$("body").append(c.join(''));

	}


	this.clear = function() {
		$("span").text("");
	}
}



function Ont(name, symbol, grid) {

	this.name = name;
	this.symbol = symbol;
	this.grid = grid;
	
	this.x = Math.ceil(Math.random()*grid.MAX_X);
	this.y = Math.ceil(Math.random()*grid.MAX_Y);

	this.MAX_STEPS = 1;
	this.inflections = [];

	this.move = function() {

//console.log("initial", this.x, this.y );
		
		//random move direction
		var changeX = Math.ceil(Math.random()*3);
		if(changeX == 2) this.x = this.x + 1;
		if(changeX == 3) this.x = this.x - 1;

		var changeY = Math.ceil(Math.random()*3);
		if(changeY == 2) this.y = this.y + 1;
		if(changeY == 3) this.y = this.y - 1;


//console.log("randomizer", "x", changeX, "y", changeY, "result", this.x, this.y );

		//apply and move
		if(this.x > grid.MAX_X) {
			this.x = grid.MAX_X;
		}
		if(this.x < 1) {
			this.x = 1;
		}

		if(this.y > grid.MAX_Y) {
			this.y = grid.MAX_Y;
		}
		if(this.y < 1) {
			this.y = 1;
		}
		
//console.log("walk-across", "result", this.x, this.y );

		var cellAddress = this.x + "_" + this.y;
		$("#" + cellAddress).text(this.letter);

	};

} 


function Inflection(grid, ont, direction, type, x, y, pt_strength) {

	this.grid = grid;
	this.ont = ont; 
	this.direction = direction; 
	this.type = type; 
	this.x = x;
	this.y = y; 
	this.pt_strength = pt_strength;  //curr, max, min
	this.field = [];

	this.initialize = function() {
		
		for(var x = 1; x <= this.grid.MAX_X; x++) {
			for (var y = 1; y <= this.grid.MAX_Y; y++) {

				var proximity = Math.abs(this.x - x) + Math.abs(this.y - y);
				var str = this.pt_strength.curr - proximity;
				if(str < 0) str = 0;
				var strVal = {"x":x, "y":y, "str" : str};
				this.field.push(strVal);

			}
		}
	}

	this.draw = function() {

		var maxStr = this.pt_strength.max;
		$.each(this.field, function(idx, val){

//console.log(val.x, val.y, val.str, getHeat(val.str, 10));

			var thisHeat = getHeat(val.str, maxStr);

//$("#" + val.x + "_" + val.y).text(val.str);

			var colorNum = getHeatColor(thisHeat);
//console.log(colorNum);
		
			$("#" + val.x + "_" + val.y).parent().css('background', colorNum);

		});

	}

}



function getHeat(str, max) {

	//translate field strength into heat %

	return Math.floor(255*str/max);


}

function getHeatColor(myHeat) {

	var rgbString = "rgb(" + myHeat + "," + myHeat + "," + myHeat + ")";
	//var rgbString = "rgb(0, 70, 255)"; // get this in whatever way.

//console.log(rgbString);

	var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	// parts now should be ["rgb(0, 70, 255", "0", "70", "255"]

	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
	    parts[i] = parseInt(parts[i]).toString(16);
	    if (parts[i].length == 1) parts[i] = '0' + parts[i];
	} 
	var hexString ='#'+parts.join('').toUpperCase(); // "#0070FF"

	return hexString;

}