//IN PROGRESS
var dataset;
var old_i = 0;
var counter_id = 0; 
var iBoarder = [];
var length = 0;
var dataStarplot = [-1,-1];
var border = 2.4;
var legDataStarplot = [["",""], ["",""]];

d3v3.csv("dataset.csv", function(data) {
	dataset = data; 
	heatmapChart(dataset, 0);
});

var margin = { top: 95, right: 0, bottom: 70, left: 30 },
    width = 600 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],
	   years = ["05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"],
	   genre = ["Action", "Adventure", "Casual", "Early Access", "Free to play", "Indie", "MMO", "Racing", "RPG", "Simulation", "Sports", "Strategy", "Video Production"]; 

var svg = d3v3.select("#chart2").append("svg")
    .attr("width", 550)
    .attr("height", 415)
    .style("border", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 20 + ")");


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
      .text(function (d) { return d; })
      .attr("x", 90)
      .attr("y", function (d, i) { return i * gridSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });





var heatmapChart = function(dataset, i_selec) {
  var colorScale = d3v3.scale.quantile()
      .domain([0, buckets - 1, d3v3.max(dataset, function (d) { return aux_index(d, i_selec); })])
      .range(choose_color(i_selec));

  var x = -1;
  var div = d3v3.select("body").append("div")	
    .attr("class", "tooltip2")				
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
          var aux_1 = aux_index(d, i_selec);
          var aux = Math.round(aux_1 * 100) / 100;
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div	.html(aux)	
              .style("left", (d3v3.event.pageX) + "px")		
              .style("top", (d3v3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });
      ;


    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(aux_index(d, i_selec)); });

    cards.select("title").text(function(d) { return aux_index(d, i_selec); });
    
    cards.exit().remove();

    function makeBoarder(i_board, d){
    	var id = counter_id % 2;
    	var flag = iBoarder.indexOf(i_board);
      
      //verificar se existe 
    	if(flag == -1) {
    		if(counter_id > 1) {
          //apaga o mais antigo
          if(length == 2) {
            dataStarplot[0] = dataStarplot[1];
            dataStarplot[1] = d;
            legDataStarplot[0] = legDataStarplot[1];
            legDataStarplot[1] = textLeg(i_board);
          }
          else {
            dataStarplot[length] = d;
            legDataStarplot[length] = textLeg(i_board);
            console.log(legDataStarplot);
            length++;
          }
            
       		d3v3.selectAll("g #rect_" + id).remove();
       		iBoarder[id]=i_board;
       		}
       		else {
            dataStarplot[length] = d;
            legDataStarplot[length] = textLeg(i_board);
            length++;
       			iBoarder.push(i_board);
       		}
    		drawBoarder(i_board, id);		 
       	makeStar(dataStarplot);
       	
       		counter_id++;
       	}
    }
    

    function removeBoarder(i,d) {
    	var id = iBoarder.indexOf(i);
    	if(id != -1) {
    		d3v3.selectAll("g #rect_" + id).remove();
    		iBoarder[id] = -1;
        var id_Star = dataStarplot.indexOf(d);
        if(length==2 && id_Star==0) {
          d_aux = dataStarplot[1];
          dataStarplot[0] = d_aux;
          legDataStarplot[0] = legDataStarplot[1];
        }
        length--;
    		if(counter_id % 2 != id) {
    			counter_id--;
    		}
        makeStar(dataStarplot);
    	}
    }



    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) {  return d; });
    console.log("ola");

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i +90; })
      .attr("y", height -10)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) {  return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i +90; })
      .attr("y", height +12);

    legend.exit().remove();
};


function drawBoarder(i_board, id) {
  var borderPath = svg.append("rect")
            .attr("x", (Math.floor(i_board/13))*1.3 * gridSize +90)
            .attr("y", (i_board%13) * gridSize)
            .attr("height", gridSize)
            .attr("width", gridSize)
            .attr("id", "rect_" + id)
            .style("stroke", bordercolor)
            .style("fill", "none")
            .style("stroke-width", border)
            .transition().duration(1000)
            ;
}



function update() {
	var i_selec = document.getElementById("inds").selectedIndex;
	if (old_i != i_selec) {
		//Para não estar sempre a fazer refresh
		old_i = i_selec;
		heatmapChart(dataset, i_selec);
    if(length == 1) {
      i_board = (counter_id - 1) % 2;
      drawBoarder(iBoarder[i_board], i_board);
    }
    else if(length == 2) {
      drawBoarder(iBoarder[0], 0);
      drawBoarder(iBoarder[1], 1);
    }
	}
}


function aux_index(d, i_selec) {
  if(i_selec == 0) {
    return d.Ngames;
  }
  if(i_selec == 1) {
    return d.N_Developers;
  }
  if(i_selec == 2) {
    return d.N_Publishers;
  }
  if(i_selec == 3) {
    return d.price;
  }
  else {
    return d.rating;
  }
}


function choose_color(i_selec) {
    if(i_selec == 0) {
      bordercolor = "black";
      colors = ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"];
      return  ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"];
    }
    if(i_selec == 1) {
      bordercolor = "black";
      colors = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
      return ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
    }
    if(i_selec == 2) {
      colors = ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
      return ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
    }
    if(i_selec == 3) {
      colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
      return ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
    }
    else {
      colors = ["#f7fcfd","#e0ecf4","#bfd3v3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"];
      return ["#f7fcfd","#e0ecf4","#bfd3v3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"];
    }
}


function textLeg(i_board) {
  var leg_aux = [];
  leg_aux.push(genre[(i_board%13)]);
  leg_aux.push(years[(Math.floor(i_board/13))]);
  console.log(leg_aux);
  return leg_aux;
}