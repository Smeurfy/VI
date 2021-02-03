//IN PROGRESS
var dataset;
var old_i = 0;
var counter_id = 0; 
var iBoarder = [];
var length = 0;
var dataStarplot = [-1,-1];

d3.csv("dataset.csv", function(data) {
	dataset = data; 
	heatmapChart(dataset, 0);
});

var margin = { top: 60, right: 0, bottom: 70, left: 30 },
    width = 550 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
	years = ["05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"],
	genre = ["Action", "Adventure", "Casual", "Early Access", "Free to play", "Indie", "MMO", "Racing", "RPG", "Simulation", "Sports", "Strategy", "Video Production"]; 

var svg = d3.select("#chart").append("svg")
    .attr("width", 500)
    .attr("height", 380)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var yearLabel = svg.selectAll(".yearLabel")
    .data(years)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i*1.3 * gridSize + 90; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });



var genreLabel = svg.selectAll(".genreLabel")
    .data(genre)
    .enter().append("text")
    //No text é necessário fazer o hack para não repetir os anos, pensei em utilizar um array com os anos já utilizados
      .text(function (d) { return d; })
      .attr("x", 90)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });


var heatmapChart = function(dataset, i) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(dataset, function (d) {  
        	if(i == 0) {
        		return d.Ngames;
        	}
        	if(i == 1) {
        		return d.N_Developers;
        	}
        	if(i == 2) {
        		return d.N_Publishers;
        	}
        	if(i == 3) {
        		return d.price;
        	}
        	else {
        		return d.rating;
        	}
        	 })])
        .range(colors);

    var x = -1;
    var border = 2; 
    var bordercolor = '#0048BA';
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


    var cards = svg.selectAll(".genreandyear")
        .data(dataset);

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d,i) { if(i==0) { makeStar(d);} if((i%13) == 0) {x++;} return (x)*1.3 * gridSize + 90; })
        .attr("y", function(d,i) {  return  (i%13) * gridSize; })
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0])
        .on("dblclick", function(d,i) { removeBoarder(i,d); })
        .on("click", function(d,i) {  makeBoarder(i, d); })
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.Ngames)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
        ;


    cards.transition().duration(1000)
        .style("fill", function(d) { 
        	if(i == 0) {
        		return colorScale(d.Ngames);
        	}
        	if(i == 1) {
        		return colorScale(d.N_Developers);
        	}
        	if(i == 2) {
        		return colorScale(d.N_Publishers);
        	}
        	if(i == 3) {
        		return colorScale(d.price);
        	}
        	else {
        		return colorScale(d.rating);
        	}
		 });

    cards.select("title").text(function(d) { 
    		if(i == 0) {
        		return d.Ngames;
        	}
        	if(i == 1) {
        		return d.N_Developers;
        	}
        	if(i == 2) {
        		return d.N_Publishers;
        	}
        	if(i == 3) {
        		return d.price;
        	}
        	else {
        		return d.rating;
        	} });
    
    cards.exit().remove();

    function makeBoarder(i, d){
    	var id = counter_id % 2;
    	var flag = iBoarder.indexOf(i);
       console.log(length);
      //verificar se existe 
    	if(flag == -1) {
    		if(counter_id > 1) {
          //apaga o mais antigo
          if(length == 2) {
            dataStarplot[0] = dataStarplot[1];
            dataStarplot[1] = d;
          }
          else {
            dataStarplot[1] = d;
            length++;
          }
            
       			d3.selectAll("g #rect_" + id).remove();
       			iBoarder[id]=i;
       		}
       		else {
            dataStarplot[length] = d;
            length++;
       			iBoarder.push(i);
       		}
    		var borderPath = svg.append("rect")
       			.attr("x", (Math.floor(i/13))*1.3 * gridSize +90)
       			.attr("y", (i%13) * gridSize)
       			.attr("height", gridSize)
       			.attr("width", gridSize)
       			.attr("id", "rect_" + id)
       			.style("stroke", bordercolor)
       			.style("fill", "none")
       			.style("stroke-width", border);
       			 
       	makeStar(dataStarplot);
       	
       		counter_id++;
       	}
    }
    

    function removeBoarder(i,d) {
    	var id = iBoarder.indexOf(i);
    	if(id != -1) {
    		d3.selectAll("g #rect_" + id).remove();
    		iBoarder[id] = -1;
        var id_Star = dataStarplot.indexOf(d);
        if(length==2 && id_Star==0) {
          d_aux = dataStarplot[1];
          dataStarplot[0] = d_aux;
        }
        length--;
    		if(counter_id % 2 != id) {
    			counter_id--;
    		}
        makeStar(dataStarplot);
    	}
    }


    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i +90; })
      .attr("y", height -10)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i +90; })
      .attr("y", height +12);

    legend.exit().remove();
};

function update() {
	var i = document.getElementById("inds").selectedIndex;
	if (old_i != i) {
		//Para não estar sempre a fazer refresh
		old_i = i;
		heatmapChart(dataset, i);
	}
}
