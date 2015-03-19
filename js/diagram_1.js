function data_prepare(n){	
	var garph_width = 1000;
	var x_scale = garph_width/360
		
	energy_distribution	= [];
	for(i = 0; i <= 361; i++){
		energy_distribution.push([i, 0, 0])
	}
		
	for (var i = 0; i <= n; i++ ){
		var lines_count = diflines[i].length;
		for (var j = 0; j < lines_count; j++ ){
			var angle = XYtoPolar(diflines[i][j].x2, diflines[i][j].y2)
			var energy = diflines[i][j].energy;
			var angle = Math.round(angle.ang)
			
			energy_distribution[angle][1] += energy
			
			
			
			//var angle = angle * x_scale;
		}
	}
	energy_distribution[0][1] += energy_distribution[360][1];
	energy_distribution[360][1] = energy_distribution[0][1];
	energy_distribution[361][1] = energy_distribution[0][1];
	
	for(p = 1; p <= 3; p++){
		var coords =[]
		for(var i = 170*(p-1); i <= 170*p; i++) {
			if (i > 361) {
				i = 170*p+1;
				continue;
			}
			coords.push([i, energy_distribution[i][1]]);
		}
		var bezi = new Bezier().prepare(coords);
		var result = [];
		result = bezi.process();
		
		for(var i = 170*(p-1); i < 170*p; i++) {
			if (i > 360) {
				i = 170*p+1;
				continue;
			}
			var ii = i-(170*(p-1));
			energy_distribution[i][2] = result[ii][1]
		};
		//alert(result[19][1])
	};
	energy_distribution.pop()
	
	amdiagram(energy_distribution)
};


function drawChart() {
	$('.add_diagram').click( function(){
		$('#chart_div_google').show();
		var data = new google.visualization.DataTable();
		data.addColumn('number','Polar degree');
		data.addColumn('number', 'E');
		data.addColumn('number', 'E сглаж.');
		data.addRows(energy_distribution);

		var options = {
			title: 'График распределения освещенности после '+ n +' отражений',
			//curveType: 'function',
			chartArea: {left:'5%',top:'5%',width:'93%',height:'85%'},
			explorer: {},
			legend: { position: 'bottom' }
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_div_google'));
		chart.draw(data, options);
	});
}