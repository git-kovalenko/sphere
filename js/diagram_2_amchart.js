function amdiagram(data_array){
	document.getElementById("title_amchart").innerHTML = 'График распределения освещенности после '+ n +' отражений';

var jsonArray = []
for (var i in data_array){
	jsonArray.push({"angle": data_array[i][0], "E":Math.round(data_array[i][1]*100)/100, "Ecp":Math.round(data_array[i][2]*100)/100})
}


	// SERIAL CHART
	chart = new AmCharts.AmSerialChart();
	chart.pathToImages = "amcharts/images/";
	chart.dataProvider = jsonArray;
	chart.marginLeft = 10;
	chart.categoryField = "angle";
	//	chart.dataDateFormat = "YYYY";
	//chart.addTitle("Распределение освещенности после "+ n +" отражений", 15);
	
	
	// listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
//	chart.addListener("dataUpdated", zoomChart);

	// AXES
	// category
	var categoryAxis = chart.categoryAxis;
//	categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
//	categoryAxis.minPeriod = "YYYY"; // our data is yearly, so we set minPeriod to YYYY
	categoryAxis.dashLength = 3;
	categoryAxis.minorGridEnabled = true;
	categoryAxis.minorGridAlpha = 0.1;

	// value
	var valueAxis = new AmCharts.ValueAxis();
	valueAxis.axisAlpha = 0;
	valueAxis.inside = true;
	valueAxis.dashLength = 3;
	chart.addValueAxis(valueAxis);

	// GRAPH
	graph = new AmCharts.AmGraph();
	//	graph.type = "smoothedLine"; // this line makes the graph smoothed line.
	graph.lineColor = "blue";
	graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
	/*graph.bullet = "round";
	graph.bulletSize = 8;
	graph.bulletBorderColor = "#FFFFFF";
	graph.bulletBorderAlpha = 1;
	graph.bulletBorderThickness = 2;
	*/graph.lineThickness = 1;
	graph.valueField = "E";
	graph.showBalloon = false;
//	graph.balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>";
	chart.addGraph(graph);
// GRAPH_2
	graph2 = new AmCharts.AmGraph();
//	graph2.type = "smoothedLine"; // this line makes the graph smoothed line.
	graph2.lineColor = "#d1655d";
	graph2.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
	/*graph2.bullet = "round";
	graph2.bulletSize = 8;
	graph2.bulletBorderColor = "#FFFFFF";
	graph2.bulletBorderAlpha = 1;
	graph2.bulletBorderThickness = 2;
	*/graph2.lineThickness = 2;
	graph2.valueField = "Ecp";
	graph2.balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>";
	chart.addGraph(graph2);

	// CURSOR
	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.cursorAlpha = 0;
	chartCursor.cursorPosition = "mouse";
//	chartCursor.categoryBalloonDateFormat = "YYYY";
	chart.addChartCursor(chartCursor);

	// SCROLLBAR
	var chartScrollbar = new AmCharts.ChartScrollbar();
	chart.addChartScrollbar(chartScrollbar);

	chart.creditsPosition = "bottom-right";

	// WRITE
	chart.write("chart_div_amchart");
}

 function zoomChart() {
	// different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
	//chart.zoomToDates(new Date(1972, 0), new Date(1984, 0));
}
