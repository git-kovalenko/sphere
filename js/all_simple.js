$(document).ready(function(){
	
	setup();
	sphere_drow();

});

function setup() {

	R = 500;
	lightpoint = {r:500, angle:45}
	lightpoint.x = polarToXY(lightpoint.r, lightpoint.angle).x;
	lightpoint.y = polarToXY(lightpoint.r, lightpoint.angle).y;

	wall_1 = new Wall({h:400, beta: 60, ang_norm: -30});
	
	/*wall_1 = new Wall({ x1:polarToXY(R,60).x, y1: polarToXY(R,60).y, x2: 1, y2: 1});*/
	canvas1 = document.getElementById("canvas1");
	
	var sds = $('.left-sidebar span');
	$.each(sds, function(){
		this.textContent =  $(this).prev().val();
	}) 
	
	document.getElementById('reflects').onchange = function(){
		settings['n'] = this.value;	 
		document.getElementById('reflects_span').textContent = this.value;
	}
	document.getElementById('discretisation').onchange = function(){	
		settings['discret'] = this.value;	
		document.getElementById('discretisation_span').textContent = this.value;
	}
	document.getElementById('reflectance').onchange = function(){	
		settings['reflectance'] = this.value;
		document.getElementById('reflectance_span').textContent = this.value;
	}
	document.getElementById('source_angle').onchange = function(){	
		settings['source_angle'] = this.value;	
		document.getElementById('source_angle_span').textContent = this.value;
	}
		
	$('.left-sidebar button').click( function(){
		sphere_drow();	
	});
	
	document.getElementById('canvas1').onmousemove = function(event){
		wall_move(event);
	};
	
};


function wall_move(e){
 var x = (e.offsetX == undefined ? e.layerX:e.offsetX) - R;
  var y = R - (e.offsetY == undefined ? e.layerY:e.offsetY);
	
	var buttonON = e.which;
	
	if (!e.offsetX){
		x -= canvas1.offsetLeft;
		y += canvas1.offsetTop;
		var buttonON = e.buttons;
	}

	var sense = 40;
	if (x){
		if ((y > wall_1.y1 - sense) && (y < wall_1.y1 + sense) && (x > wall_1.x1 - sense) && (x < wall_1.x1 + sense)) {
			document.body.style.cursor = 'crosshair';
			var point = 1;
		} else 

		if ((y > wall_1.y2 - sense) && (y < wall_1.y2 + sense) && (x > wall_1.x2 - sense) && (x < wall_1.x2 + sense)) {
			document.body.style.cursor = 'crosshair';
			var point = 2;
			
		} else {
			document.body.style.cursor = 'default';
		}
	}
	
	if ( buttonON && point) {
		
		if (point == 1) { 
			
			wall_1 = new Wall({x1: x, y1: y, x2: wall_1.x2, y2: wall_1.y2});
		} else{ 
			wall_1 = new Wall({x1: wall_1.x1, y1: wall_1.y1, x2:x, y2: y});
		}
			
	wall_1.drowfast();
	}
	
};


function sphere_drow(){	
	settings = {}
	settings.n = document.getElementById("reflects").value;
	settings.discret = document.getElementById("discretisation").value;
	settings.reflectance = document.getElementById("reflectance").value/100;
	settings.source_angle = document.getElementById("source_angle").value;
	
	lightsource_discrete = settings.discret;
	discret = lightsource_discrete;
	lightsource_apperture = settings.source_angle;	
	lightsource_stepangle = lightsource_apperture/lightsource_discrete;
	stepangle = 180/discret;
	reflectance = settings.reflectance;

	canvas1 = document.getElementById("canvas1");
	context1 = canvas1.getContext("2d");
	canvas1.width = 2*R;
	canvas1.height = 2*R;
	
	context1.strokeStyle = "#000";
	context1.fillStyle = "#fc0";
	context1.lineWidth = 1;
	context1.lineCap = "round";
	
	context1.translate(R,R);
	context1.scale(1, -1);
	
	context1.beginPath();
	context1.arc(0, 0, R, 0, 2*Math.PI, true);
	context1.stroke();
	context1.beginPath();
	context1.arc(0, 0, 0.005*R, 0, 2*Math.PI, true);
	context1.stroke();
	
	context1.beginPath();
	context1.arc(lightpoint.x,lightpoint.y, 10, 0, 2*Math.PI, true);
	context1.fill();
	context1.stroke();
	
	wall_1.drow();

	
	var I_0 = 100;
	var M = 5;	
	
	var lightsource_rays = [];
	for (var i = 0; i < lightsource_discrete; i++ ){
		new_ray = new Line({x1:lightpoint.x, y1:lightpoint.y, alfa: (lightsource_apperture/2+lightsource_stepangle/2-((i+1) * lightsource_stepangle))})
		last_energy = I_0 * Math.pow(Math.cos(new_ray.alfa * Math.PI/180), M);
		
		
		int_point = {}
		int_point = checkIntersection(new_ray, wall_1) || false;
		if (int_point != false){
			new_ray.x2 = int_point.x;
			new_ray.y2 = int_point.y;
			
			new_ray.drowColor("green");
			var dd = (new_ray.x1 - wall_1.x1) * (wall_1.y2 - wall_1.y1) - (new_ray.y1 - wall_1.y1) * (wall_1.x2 - wall_1.x1);
			
			for (var m = 0; m < discret; m++){	
				var step = ((stepangle/2-((m+1) * stepangle)))*Math.PI/180;
				var ang_to_norm = 90 - (Math.abs(step)*180/Math.PI);
				if (dd > 0) {step = - step}
				var step_x = int_point.x + (wall_1.x1-int_point.x) * Math.cos(step) - (wall_1.y1-int_point.y) * Math.sin(step);
				var step_y = int_point.y + (wall_1.y1-int_point.y) * Math.cos(step) + (wall_1.x1-int_point.x) * Math.sin(step);
				
				new_ray = new Line({x1:int_point.x, y1:int_point.y, x2:step_x, y2:step_y })
				new_ray.energy = last_energy * reflectance * Math.cos(ang_to_norm * Math.PI/180);
				
				new_ray.drowColor("red");
				lightsource_rays.push(new_ray);
			}			
		
		}else{
				new_ray.energy = last_energy;
				new_ray.drow();
				lightsource_rays.push(new_ray);
		}

	}
		
	document.body.style.cursor = 'progress';
	diflines = [];
	diflines[0] = lightsource_rays;
	n = 0;
	while (n < settings.n){
		nextdiffuse (n);
		wall_1.drowColor("#6699FF")
		n++;
	}
	document.body.style.cursor = 'default';
	data_prepare(n)
	
	delete diflines;

	
	var maxval = 0;
	for (var i in energy_distribution){
		if (maxval < energy_distribution[i][2]) {
			maxval = energy_distribution[i][2];
		}
	}
	
	context1.beginPath();
	var lw = context1.lineWidth,
		lc = context1.strokeStyle;
	context1.strokeStyle = "#FFFF00";
	context1.lineWidth = 4;
	var radius = [];
	for (var i in energy_distribution){
		radius[i] =R - (0.5*R/maxval) * energy_distribution[i][2]; 
		var	angle = energy_distribution[i][0];
		context1.lineTo(polarToXY(radius[i], angle).x,  polarToXY(radius[i], angle).y);
	}
	context1.stroke();
	context1.lineWidth = lw;
	context1.strokeStyle = lc;
	
	
};


/*///////////////////////////////////////////////////////////////////////////////////////////*/
function nextdiffuse (n){
	var lines_count = diflines[n].length;
	//alert("n = " + n + "\n lines - " + lines_count)
	
	var step_rays = []; 
		
	for (var i = 0; i < lines_count; i++ ){
		
			for (var j = 0; j < discret; j++ ){
				var new_ray =  new Line({x1:diflines[n][i].x2, y1:diflines[n][i].y2, alfa: (90+stepangle/2-((j+1) * stepangle))})
				new_ray.energy = diflines[n][i].energy * reflectance * Math.cos(Math.abs(new_ray.alfa) * Math.PI/180);
				var last_energy = new_ray.energy

				int_point = {}
				int_point = checkIntersection(new_ray, wall_1) || false;
				if (int_point != false){
					new_ray.x2 = int_point.x;
					new_ray.y2 = int_point.y;
					new_ray.drowColor("green");
					var dd = (new_ray.x1 - wall_1.x1) * (wall_1.y2 - wall_1.y1) - (new_ray.y1 - wall_1.y1) * (wall_1.x2 - wall_1.x1);
					
					for (var m = 0; m < discret; m++){	
						var step = ((stepangle/2-((m+1) * stepangle)))*Math.PI/180;
						var ang_to_norm = 90 - (Math.abs(step)*180/Math.PI);
						if (dd > 0) {step = - step}
						var step_x = int_point.x + (wall_1.x1-int_point.x) * Math.cos(step) - (wall_1.y1-int_point.y) * Math.sin(step);
						var step_y = int_point.y + (wall_1.y1-int_point.y) * Math.cos(step) + (wall_1.x1-int_point.x) * Math.sin(step);
						
						new_ray = new Line({x1:int_point.x, y1:int_point.y, x2:step_x, y2:step_y })
						new_ray.energy = last_energy * reflectance * Math.cos(ang_to_norm * Math.PI/180);
						
						new_ray.drowColor("red");
						step_rays.push(new_ray)
					}
				} else {
					new_ray.drow();
					step_rays.push(new_ray);
				}
				
			}
	}	
	
	diflines[n+1] = step_rays;
	
	//diflines[2].drow();
	
}

/*///////////////////////////////////////////////////////////////////////////////////////////*/
function nextStep (){
	int_point = {}
	int_point = checkIntersection(lastline, wall_1) || false;
	if (int_point != false){
		lastline.x2 = int_point.x;
		lastline.y2 = int_point.y;
		lastline.drow();
		lastline = new Line({x1:int_point.x, y1:int_point.y, x2: checkIntersection.mirror.x, y2: checkIntersection.mirror.y})
		lastalfa = -lastline.alfa;
		lastline.drow();
		rayEnergy = rayEnergy * reflectance * reflectance;
		steps += 2;
	} else {
	lastline.drow();
	lastalfa = lastline.alfa;
	rayEnergy = rayEnergy * reflectance;
	steps ++;
	}
	
	lastline = new Line({x1:lastline.x2, y1:lastline.y2, alfa: lastalfa})
	
	return (rayEnergy);
}

function checkIntersection(line1, line2){
	var a1 = line1.y1 - line1.y2,
		b1 = line1.x2 - line1.x1,
		c1 = line1.x1*line1.y2 - line1.x2*line1.y1,
		a2 = line2.y1 - line2.y2,
		b2 = line2.x2 - line2.x1,
		c2 = line2.x1*line2.y2 - line2.x2*line2.y1,
		k1 = -a1/b1,
		k2 = -a2/b2;
		
	if (k1 == k2){
		return(false);
	}
	var x = (b1*c2-b2*c1)/(a1*b2-a2*b1),
		y = (c1*a2-c2*a1)/(a1*b2 - a2*b1);
	var v1 = (line2.x2-line2.x1)*(line1.y1-line2.y1)-(line2.y2-line2.y1)*(line1.x1-line2.x1),
		v2 = (line2.x2-line2.x1)*(line1.y2-line2.y1)-(line2.y2-line2.y1)*(line1.x2-line2.x1),
		v3 = (line1.x2-line1.x1)*(line2.y1-line1.y1)-(line1.y2-line1.y1)*(line2.x1-line1.x1),
		v4 = (line1.x2-line1.x1)*(line2.y2-line1.y1)-(line1.y2-line1.y1)*(line2.x2-line1.x1);
	if (v1*v2 > 0 || v3*v4 > 0){
		return(false);
	}	
	checkIntersection.angle = intersect_angle();	

/* second point of mirror line*/
	mirror_ang = - (2*(90 - checkIntersection.angle)) *Math.PI/180 ;
	mirror =  {};
	mirror.x = x + (line1.x1-x) * Math.cos(mirror_ang) - (line1.y1-y) * Math.sin(mirror_ang);
	mirror.y = y + (line1.y1-y) * Math.cos(mirror_ang) + (line1.x1-x) * Math.sin(mirror_ang);
	mirror.angle = mirror_ang;
	
	checkIntersection.mirror = mirror;


	
	IntersectPoint = {x:x, y:y};
	return(IntersectPoint);
	
	/*angle between line and radius*/
	function intersect_angle() {
		var x1r = line1.x1,
			y1r = line1.y1,
			x2r = line1.x2,
			y2r = line1.y2;
		var ar = y1r - y2r,
			br = x2r - x1r,
			cr = x1r*y2r - x2r*y1r;
		var alfa = Math.atan((line2.a*br - ar*line2.b)/(line2.a*ar+line2.b*br))*180/Math.PI;
		return (-alfa);
	}
	
}

/*class Wall*/
function Wall(param){	
	var h = param.h,
		beta = param.beta,
		ang_norm = param.ang_norm,
		x1 = param.x1,
		x2 = param.x2,
		y1 = param.y1,
		y2 = param.y2;
	
	if (h !== undefined) {
		this.h = h;								/* h = height of wall*/ 
	} else {
		this.h = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
	}
	
	if (beta !== undefined) {
		this.beta = beta;						/* beta = polar angle from 0 degree*/
	} else {
		this.beta = XYtoPolar(x1, y1).ang;
	}
	
	if (ang_norm !== undefined) {
		this.ang_norm = ang_norm;				/* angle between Wall and radius of sphere */
	} else {
		var x1r = x2,
			y1r = y2,
			x2r = 0,
			y2r = 0,
			ar = y1r - y2r,
			br = x2r - x1r,
			cr = x1r*y2r - x2r*y1r,
			alfa = -Math.atan((a*br - ar*b)/(a*ar+b*br))*180/Math.PI;
		this.ang_norm = alfa;
	}
	
	x1 = x1 || polarToXY(R, beta).x;
	y1 = y1 || polarToXY(R, beta).y;
	var	r = Math.sqrt(R*R + h*h - 2*R*h * Math.cos(ang_norm * Math.PI / 180) ),
		centr_ang = Math.acos( (R*R + r*r - h*h) / (2*r*R) )*180/Math.PI;
	
	if (ang_norm < 0){
		centr_ang = - centr_ang;
	}			
	
	x2 = x2 || polarToXY(r, beta - centr_ang).x;
	y2 = y2 || polarToXY(r, beta - centr_ang).y;

	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.coords = {x1:x1, y1:y1, x2:x2, y2:y2};
	
	/*line equation parameters ax + by + c*/
	var a = y1 - y2,
		b = x2 - x1,
		c = x1*y2 - x2*y1;
	this.a = a;
	this.b = b;
	this.c = c;
	this.k = -a/b;	
	
};
Wall.prototype.drow = function(){
	context1.beginPath();
	var lw = context1.lineWidth,
		lc = context1.strokeStyle;
	context1.strokeStyle = "red";
	context1.lineWidth = 4;
	context1.moveTo(this.x1, this.y1);
	context1.lineTo(this.x2, this.y2);
	context1.stroke();
	context1.lineWidth = lw;
	context1.strokeStyle = lc;
};
Wall.prototype.drowfast = function(){
	context1.beginPath();
	context1.moveTo(this.x1, this.y1);
	context1.lineTo(this.x2, this.y2);
	context1.stroke();

};
Wall.prototype.drowColor = function(color){
	var oldstyle = context1.strokeStyle,
		lw = context1.lineWidth;
	
	context1.lineWidth = 2;
	context1.strokeStyle = color;
	context1.beginPath();
	context1.moveTo(this.x1, this.y1);
	context1.lineTo(this.x2, this.y2);
	context1.stroke();
	context1.strokeStyle = oldstyle;
	context1.lineWidth = lw;
};

/*class Line*/
function Line(param){
	var x1 = param.x1,
		y1 = param.y1,
		alfa = param.alfa,
		k = param.k,
		x2 = param.x2,
		y2 = param.y2;
		
		if (alfa !== undefined) {
			x2 = -Math.sin(alfa* Math.PI/180)*(0-y1)+Math.cos(alfa* Math.PI/180)*(0-x1)+x1;
			y2 = Math.cos(alfa* Math.PI/180)*(0-y1)+Math.sin(alfa* Math.PI/180)*(0-x1)+y1;
		}
		if (k !== undefined) {
			x2 = x1 + (R-x1) * Math.cos(Math.atan(k)) - (y1-y1) * Math.sin(Math.atan(k));
			y2 = y1 + (y1-y1) * Math.cos(Math.atan(k)) + (R-x1) * Math.sin(Math.atan(k));
		}
		
	/*line equation parameters ax + by + c*/
	var a = y1 - y2,
		b = x2 - x1,
		c = x1*y2 - x2*y1;
	this.a = a;
	this.b = b;
	this.c = c;
	this.k = -a/b;
	
	/*points of intersection with circle*/
	var p = Math.abs(c)/Math.sqrt(a*a + b*b);
	var d = Math.sqrt(R*R - c*c/(a*a + b*b));
	var x0 = - (a*c / (a*a + b*b));
	var y0 = - (b*c / (a*a + b*b));
	var mult = Math.sqrt(d*d / (a*a + b*b));
	var circ = {};
	circ.x1 = x0 - b*mult;
	circ.y1 = y0 + a*mult;
	circ.x2 = x0 + b*mult;
	circ.y2 = y0 - a*mult;
	this.circ = circ;
	
	x2 = circ.x2,
	y2 = circ.y2;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.coords = {x1:x1, y1:y1, x2:x2, y2:y2};
	
	/*angle between line and radius*/
	function angToNorm() {
		var x1r = x2,
			y1r = y2,
			x2r = 0,
			y2r = 0;
		var ar = y1r - y2r,
			br = x2r - x1r,
			cr = x1r*y2r - x2r*y1r;
		var alfa = Math.atan((a*br - ar*b)/(a*ar+b*br))*180/Math.PI;
		return (-alfa);
	}
	alfa = param.alfa || angToNorm();
	this.alfa = alfa;		
};	
Line.prototype.drow = function(){
	context1.beginPath();
	context1.moveTo(this.x1, this.y1);
	context1.lineTo(this.x2, this.y2);
	context1.stroke();
};
Line.prototype.drowColor = function(color){
	var oldstyle = context1.strokeStyle;
	context1.strokeStyle = color;
	
	context1.beginPath();
	context1.moveTo(this.x1, this.y1);
	context1.lineTo(this.x2, this.y2);
	context1.stroke();
	context1.strokeStyle = oldstyle;
};
/*end of class Line*/



function drowLineXY(x1, y1, x2, y2){
	context1.moveTo(x1, y1);
	context1.lineTo(x2, y2);
	context1.stroke();

};

function drowLinePolar(rad1, beta1, rad2, beta2){
	context1.beginPath();
	context1.moveTo(polarToXY(rad1, beta1).x, polarToXY(rad1, beta1).y);
	context1.lineTo(polarToXY(rad2, beta2).x, polarToXY(rad2, beta2).y);
	context1.stroke();
	

};

function XYtoPolar(x, y){
	var rad = Math.sqrt(x*x + y*y);
	
	if ((x>0)&&(y>=0)){
		var ang = Math.atan(y/x)*180/Math.PI;	
	}
	if ((x>0)&&(y<0)){
		var ang = (Math.atan(y/x)+ 2*Math.PI) *180/Math.PI;	
	}
	if (x<0){
		var ang = (Math.atan(y/x)+ Math.PI) *180/Math.PI;	
	}
	if ((x==0)&&(y>0)){
		var ang = 90;	
	}
	if ((x==0)&&(y<0)){
		var ang = 270;	
	}
	if ((x==0)&&(y==0)){
		var ang = 0;	
	}
		
	var coord = {}
	coord.rad = rad
	coord.ang = ang
	return (coord)	
};

function polarToXY(radius, angle){
	var x = radius * Math.cos(angle * Math.PI / 180);
	var y = radius * Math.sin(angle * Math.PI / 180);	
	var coord = {}
	coord.x = x
	coord.y = y
	return (coord)	
};