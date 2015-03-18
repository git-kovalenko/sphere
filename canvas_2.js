function graph_drow(n){	
	garph_width = 2*R;
	garph_height = R;
	
	canvas2 = document.getElementById("canvas2");
	context2 = canvas2.getContext("2d");
	canvas2.width = garph_width;
	canvas2.height = garph_height;
	
	context2.strokeStyle = "#000";
	context2.fillStyle = "#fc0";
	context2.lineWidth = 1;
	context2.lineCap = "round";
	
	context2.translate(0, garph_height);
	context2.scale(1, -1);
	
	context2.beginPath();
	context2.moveTo(0, garph_height);
	context2.lineTo(0, 0);
	context2.lineTo(garph_width, 0);
	context2.stroke();
	
	context2.stroke();
	var x_scale = garph_width/360
	context2.beginPath();
	context2.arc(lightpoint.angle*x_scale, 0, 10, 0, 2*Math.PI, true);
	context2.fill();
	context2.stroke();
	
	var ampl = 200;
	
	for (var i = 0; i <= n; i++ ){
		var lines_count = diflines[i].length;
		for (var j = 0; j < lines_count; j++ ){
			var angle = XYtoPolar(diflines[i][j].x2, diflines[i][j].y2)
			var angle = angle.ang * x_scale;
			

			context2.beginPath();
			context2.moveTo(angle, 0);
			context2.lineTo(angle, ampl);
			context2.stroke();
			
		}
		
	}
	
	
	
};

