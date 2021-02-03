var w = 750,
    h = 450;
var nodeDataByCode = {};
var links = [];
var aux = [];
var centroidsData;
var yearsInterval;
var countriesSelected = [];
var pathCountry;
var maxValueFriends;
var arcColor;
var FLAG = false;
//isto cria os polignos que representam os paises
d3.json("world-countries.json", function(data) {
    drawMap(data);
});
var texto = "";
d3.csv ( "ISO_countryName.csv",function(data){
	data.forEach(function(d){
		texto = texto + "<option value="  + "\"" + d.CountryCode + "\"" +">" + d.CountryName + "</option>" + "\n";
	});
});

//cria os circulos corresposndestes as capitais
d3.csv("novosCountries.csv", function(data) {
	centroidsData = data;
	data.forEach(function(node) {
      node.coords = nodeCoords(node);
      node.projection = node.coords ? projection(node.coords) : undefined;
      nodeDataByCode[node.CountryCode] = node;
    });
    function nodeCoords(node) {
      var lon = parseFloat(node.CapitalLongitude), lat = parseFloat(node.CapitalLatitude);
      if (isNaN(lon) || isNaN(lat)) return null;
        return [lon, lat]; 
      };
    drawCentroids(data);

});

  //cria os links entre cada pais
d3.csv ( "country_years_nFriends.csv",function(data){
  data.forEach(function(flow) {
      var o = nodeDataByCode[flow.loccountrycode_a]; 
      var d = nodeDataByCode[flow.loccountrycode_b];
      var y = flow.years;
      if(o != undefined && d != undefined) {
        var co = o.coords, po = o.projection;
        var cd = d.coords, pd = d.projection;
        //--------Problema 2------
        var magnitude = parseFloat(flow.n_friends);
        //------------------------
        if (co  &&  cd  &&  !isNaN(magnitude)) {
          links.push({
            source: co, target: cd,
            magnitude: magnitude,
            origin:o, dest:d,
            originp: po, destp:pd, years: y 
          });
        }
      }
      
    });
    //valor maximo dos amigos
    maxValueFriends = d3.max(data,function(d){
      return parseFloat(d.n_friends);});
    drawRandomLines(centroidsData);
});


var svg = d3.select("#chart").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate(" + 10 + "," + 80 + ")");
var zoom = svg
                .call(d3.zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", zoomed))
                .append("g");
var countries = zoom.append("g").attr("id", "countries");
var centroids = zoom.append("g").attr("id", "centroids");
var arcs = zoom.append("g").attr("id", "arcs");

var projection = d3.geoMercator()
  .center([0, 20]);

var path = d3.geoPath()
    .projection(projection);

// slide bar
var slideContainer = d3.select("body").append("div")
	.attr("id","slider-container");
slideContainer.append("div")
	.attr("id","range-label")
	.style("text-align","center")
	.style("width", 500 + "px")
  .style("color", "#aaa")
  .style("font-size", "9pt")
  .style("font-family", "sans-serif");
var slider = createD3RangeSlider(2008,2013,"#slider-container");
slider.onChange(function(newRange){
	yearsInterval = newRange;
	d3.select("#range-label").text(newRange.begin + " - " + newRange.end)
  ;
	updateMap();
});

slider.range(2008,2013);
// legenda map
//cor das ligacoes 
arcColor = d3.scaleQuantize(d3.schemeCategory10)
					.domain([0, 5000])
					.range(['#ffe4c4','#ffd7a3','#ffc985','#ffba65','#ffab48','#ff9b2e','#ff8a17','#ff7706','#ff6100','#ff4500']);
//o numero de cores no range influencia esta shit. 10 cores = 10 ticks
var legend = svg.selectAll(".legend")
			//grandes hacks nesta shitty cor
			.data(arcColor.ticks(10).filter(a => a <= 4500))
			.enter().append("g")
			.attr("class", "legend");

	legend.append("rect")
			.attr("x", function(d,i){

				return w / 15 * i;
			})
			.attr("y",function(d,i){
				return h - 15;
			})
			.attr("width", w/15)
			.attr("height", 15)
			.style("fill", function(d,i){
				return arcColor(d);
			});
	legend.append("text")
			.attr("class","mono1")
			.text(function(d){
				return "> " + d;
			})
			.attr("x",function(d,i){
				return w / 15 * i + 5;
			})
			.attr("y", h)
      .attr("fill", "black");


function drawMap(data){
	countries.selectAll("path")
      .data(data.features)
      .enter().append("path")
      .attr("d", path)
      .style("fill", "#cccccc")
      .style("stroke", "#666666");
};

function drawCentroids(data){
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

	centroids.selectAll("circle")
      .data(data.filter(function(node) { return node.projection ? true : false }))
      .enter().append("circle")
      .attr("id", function(d) { return "circle" + d.CountryCode; })
      .attr("cx", function(d) { return d.projection[0] } )
      .attr("cy", function(d) { return d.projection[1] } )
      .attr("r", 2)
      .attr("fill", "#A52A2A")
      .attr("opacity", 1)
      .on("click", function(d,i){
      	//se os ligaçoes nao estiverem desenhadas ele desenha
      	if(d3.selectAll("#" + d.CountryCode)._groups[0].length == 0 ){
  			drawLines(d);
  			d3.select("#circle" + d.CountryCode)
  			.transition()
  			.duration(1000)
  			.attr("r", 4);
  			countriesSelected.push(d);

  			//dropdown selection
  			for(i = 0; i < d3.selectAll("input")._groups[0].length; i++){
  				if(d3.selectAll("input")._groups[0][i].attributes[2] != undefined && d3.selectAll("input")._groups[0][i].attributes[2].value == d.CountryCode){
  					d3.selectAll("input")._groups[0][i].checked = "true";
  				}	
  			}
        //pinta no scater
  		  draw_from_map(d,0);
      	}
      	// se ja estiverem desenhadas mas clica-se outra vez ele apaga
      	else{
      			d3.selectAll("#" + d.CountryCode)
      			.transition()
      			.duration(1000)
      			.style("opacity",0)
      			.remove();
      			var resultado = aux.filter(a => a.origin.CountryCode != d.CountryCode);
      			aux = resultado;
      			var cSelec = countriesSelected.filter(a => a.CountryCode != d.CountryCode);
      			countriesSelected = cSelec;
      			d3.select("#circle" + d.CountryCode)
      			.transition()
      			.duration(1000)
      			.attr("r", 2);
      		// unchecks boxes from dropdown
  				for(i = 0; i < d3.selectAll("input")._groups[0].length; i++){
  					if(d3.selectAll("input")._groups[0][i].attributes[2] != undefined && d3.selectAll("input")._groups[0][i].attributes[2].value == d.CountryCode){
  						d3.selectAll("input")._groups[0][i].checked = "";
  					}
  				}
  				//quando é feito unselect de qualquer um pais entao meter a false o Selected All
  				d3.selectAll("input")._groups[0][0].checked = "";
          //despinta do scater
          draw_from_map(d,1);
      		}
      })
      .on("mouseover", function(d){
      	div.transition()
         .duration(200)
         .style("opacity", .9);
      	div.html("Country Name: " + d.CountryName)
	      	.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY) + "px");
      	})
      .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });
}

function drawRandomLines(dados)
{
  var random;
  for(var k = 0; k < 10; k++){
    random = Math.floor(Math.random() * 231);
    drawLines(dados[random]);
    d3.select("#circle" + dados[random].CountryCode)
    .transition()
    .duration(1000)
    .attr("r", 4);
    countriesSelected.push(dados[random]);


    //dropdown selection
    for(i = 0; i < d3.selectAll("input")._groups[0].length; i++){
      if(d3.selectAll("input")._groups[0][i].attributes[2] != undefined && d3.selectAll("input")._groups[0][i].attributes[2].value == dados[random].CountryCode){
        d3.selectAll("input")._groups[0][i].checked = "true";
      } 
    }
    //pinta no scater
    draw_from_map(dados[random],0);
  }
}

//desenhas as linhas para diferentes paises
function drawLines(data){
	var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
	var arcNodes = arcs.selectAll("path")
        .data(function(){
        	for(var i = 0; i < links.length; i++){
        		if(data.CountryCode == links[i].origin.CountryCode){
        			aux.push(links[i]);
        		}
        	}
        	return aux;
        })
        .enter().append("path")
          //.attr("visibility", function(d) { return d.magnitude > 500 ? "visible" : "hidden"})
          .attr("stroke", function(d){  
          					return arcColor(d.magnitude);})
          //.attr("stroke", "red")
          .attr("opacity", function(d) { return 0})
          //.attr("stroke", strokeFun)
          .attr("stroke-linecap", "round")
          .attr("stroke-width", function(d) { return 2; })
          .attr("id", data.CountryCode)
          .attr("d", function(d,i) { 
            /*if (useGreatCircles)
              return splitPath(path(arc(d)));
            else */
            	if(aux[i].source != aux[i].target){
            		return path({
        			type: "LineString",
        			coordinates: [aux[i].source, aux[i].target]
      				});
            	}
            	else{
            		/*
            		tem que se gerar pelo menos mais 4 pontos para se conseguir fazer o shitty 
            		var lineGenerator = d3.line()
  						.curve(d3.curveCardinal);
  					http://bl.ocks.org/d3indepth/raw/b6d4845973089bc1012dec1674d3aff8/
  					*/
            	}
    		 


             
          })
          .on("mouseover", function(d) {
          	var paths = path({
        			type: "LineString",
        			coordinates: [d.source, d.target]
      				});
          		// mete a cor certa e aumenta o tamanho da linha 
          		for(i = 0; i < aux.length; i++){
          			//todas as linhas ficam mais transparentes
          			d3.selectAll("#" + aux[i].origin.CountryCode)
							.transition()
							.duration(1000)
							.style("opacity", 0.10);
					//so a linha a faazer hover fica highlited
          			if(paths == d3.select(this)._groups[0][0].attributes[5].nodeValue){
          				d3.select(this)
							.attr("stroke", arcColor(d.magnitude))
							.attr("marker-end", "url(#arrowHead)")
							.transition()
							.duration(1000)
							.style("opacity", 1);
          			}
          		}
				//tooltip
				div.transition()
				.duration(200)
				.style("opacity", .9);
				div.html("Year: " + d.years + "<br/>" + "Friends: " + d.magnitude + "<br/>" +
						 "Origin: " + d.origin.CountryName + "<br/>" + "Destiny: " + d.dest.CountryName)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
        	})
        .on("mouseout", function(d) {
        	for(i = 0; i < aux.length; i++){
          			//todas as linhas voltam a cor original
          			d3.selectAll("#" + aux[i].origin.CountryCode)
      					.attr("marker-end", "none")
						.transition()
						.duration(1000)
						.style("opacity", 0.7);
					// faz a tooltip desaparecer
					div.transition()
					.duration(500)
					.style("opacity", 0);
        	 }})

        .transition()
          .duration(1000)
          .style("opacity","0.7");
        


        //-------alterar isto para por numa tooltip------
       /*arcNodes.append("svg:title")
          .text(function(d) {
            return d.origin.CountryCode+" -> "+d.dest.CountryCode+"\n"+
                   "Nº friends: " +magnitudeFormat(d.magnitude); 
        })
        ;*/
};

function zoomed() {
  zoom.attr("transform", d3.event.transform);
};

function betweenYears(value){

	if(value.years >= yearsInterval.begin && value.years <= yearsInterval.end)
		return true;
	else
		return false;

}

function updateMap(){
	var nos = [];
	if(countriesSelected.length != 0){
		for(i = 0; i < countriesSelected.length;i++){
			pathCountry = d3.selectAll("#" + countriesSelected[i].CountryCode).style("display","none")._groups[0];
			for(k = 0; k < pathCountry.length; k++){
				nos.push(pathCountry[k]);
			}
		}
	}
	if(aux.length != 0){
		var hmm = aux.filter(betweenYears);
		for(i = 0; i < hmm.length; i++){
			var paths = path({
        			type: "LineString",
        			coordinates: [hmm[i].source, hmm[i].target]
      				});
			for(j = 0; j < nos.length; j++){
				if(paths == nos[j].attributes[5].nodeValue){
					if(nos[j].attributes[6].name == "style"){
						nos[j].attributes[6].nodeValue = "display: block;";
						d3.select(nos[j])
						.transition()
						.duration(1000)
						.style("opacity","1");
					}
					else{
						nos[j].attributes[7].nodeValue = "display: block;";
						d3.select(nos[j])
						.transition()
						.duration(1000)
						.style("opacity","1");
					}
				}
			}
		}
	}
}

function drawFromSelection(selected){
	//pais que é selecionada sao lhe desenhadas as linhas
	if(selected.checked == true){
		for(i = 0; i < centroidsData.length; i++){
			if(selected.value == centroidsData[i].CountryCode){
				countriesSelected.push(centroidsData[i]);
				drawLines(centroidsData[i]);
				d3.select("#circle" + selected.value)
					.transition()
					.duration(1000)
					.attr("r", 4);

			}
		}
    draw_from_map(selected,2);
	}
	else{
		// quando é unselected apaga as linhas
		d3.selectAll("#" + selected.value)
      			.transition()
      			.duration(1000)
      			.style("opacity",0)
      			.remove();
      			var resultado = aux.filter(a => a.origin.CountryCode != selected.value);
      			aux = resultado;
      			var cSelec = countriesSelected.filter(a => a.CountryCode != selected.value);
      			countriesSelected = cSelec;
      			d3.select("#circle" + selected.value)
      			.transition()
      			.duration(1000)
      			.attr("r", 2);
    draw_from_map(selected,3);
	}
};

function drawAllFromSelection(){
	for(b = 1; b < d3.selectAll("input")._groups[0].length; b++){
		drawFromSelection(d3.selectAll("input")._groups[0][b]);
	}
};


//as setas
var defs = svg.append("svg:defs");

        // see http://apike.ca/prog_svg_patterns.html
        defs.append("marker")
          .attr("id", "arrowHead")
          .attr("viewBox", "0 0 10 10")
          .attr("refX", 10)
          .attr("refY", 5)
          .attr("orient", "auto")
          //.attr("markerUnits", "strokeWidth")
          .attr("markerUnits", "userSpaceOnUse")
          .attr("markerWidth", 4*2)
          .attr("markerHeight", 3*2)
        .append("polyline")
          .attr("points", "0,0 10,5 0,10 1,5")
          .attr("fill", maxColor)
          //.attr("opacity", 0.5)
          ;
