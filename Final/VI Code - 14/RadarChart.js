var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 5,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     color_0: d3.scaleOrdinal().range(["#5CACEE", "#63B8FF"]),
     color_1: d3.scaleOrdinal().range(["#ff7400", "#ff4d00"])
    };
  
    if('undefined' !== typeof options){
      for(var i in options) {
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }
    
    cfg.maxValue = 100;
    
    var allAxis = ['Nº Developers', 'Nº Publishers', 'Avg Price', 'Avg Rating', 'Nº Games'];
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3v3.format('%');
    d3v3.select(id).select("svg").remove();

    var g = d3v3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .style("border", "none")
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    
    
//--------------------------------------------Esqueleto----------------------------------------------
    for(var j=0; j<cfg.levels; j++){

      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
      .style("fill", "#aaa");
//-----------------------------------------------------------------------------------------------------------------------------------
    color_vec = [];
    color_vec = choose_color_radar();

//------------------------------------------------------------Áreas------------------------------------------------------------------
    //Scale
    var cenas = [];
    var maxScale = 0;
    for (var index = 0; index <length; index++) {
      var auxScale = dataStarplot[index];
      if(maxScale < (Math.round(auxScale.N_Developers * 100) / 100)) { maxScale = auxScale.N_Developers; }
      if(maxScale < (Math.round(auxScale.N_Publishers * 100) / 100)) { maxScale = auxScale.N_Publishers; }
      if(maxScale < (Math.round(auxScale.price * 100) / 100)) { maxScale = auxScale.price; }
      if(maxScale < (Math.round(auxScale.rating * 100) / 100)) { maxScale = auxScale.rating; }
      if(maxScale < (Math.round(auxScale.Ngames * 100) / 100)) { maxScale = auxScale.Ngames; }
        cenas.push(parseInt(dataStarplot[index].N_Developers));
        cenas.push(parseInt(dataStarplot[index].N_Publishers));
        cenas.push(parseInt(dataStarplot[index].price));
        cenas.push(parseInt(dataStarplot[index].rating));
        cenas.push(parseInt(dataStarplot[index].Ngames));
    }


    var legend = [];
    for( var index = 0; index < length; index++) {
      d = dataStarplot[index];
      var scale = d3v3.scale.linear()
          .domain([0, maxScale])
          .range([0, 100])
      
        dataValues = [];
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.sin(0*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.cos(0*cfg.radians/total))
        ]);    
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.sin(1*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.cos(1*cfg.radians/total))
        ]);
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.sin(2*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.cos(2*cfg.radians/total))
        ]);
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.sin(3*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.cos(3*cfg.radians/total))
        ]);
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.sin(4*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.cos(4*cfg.radians/total))
        ]);
        
        var color = color_vec[index];
          
        g.selectAll(".nodes")
          .data(dataValues);
        
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
          .data([dataValues])
          .enter()
          .append("polygon")
          .attr("class", "radar-chart-serie"+series)
          .style("stroke-width", "2px")
          .style("stroke", function(j, i){return color(series);})
          .style("stroke-opacity", 0)
          .attr("points",function(d) {
              var str="";
              for(var pti=0;pti<d.length;pti++){
                str=str+d[pti][0]+","+d[pti][1]+" ";
              }
              return str;
            })
          .style("fill", function(j, i){return color(series);})
          .style("fill-opacity", function(d,i) {
              return 0;
          })
          .on('mouseover', function (d){
              z = "polygon."+d3v3.select(this).attr("class");
              g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1); 
              g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .6);
              })
          .on('mouseout', function(){
                      if(index == 0) {
                opacity = cfg.opacityArea;
              }  
              else {
                opacity = 0.2;
                 }
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", opacity);})
          .transition().duration(1000).style("fill-opacity", function(d,i) {
            if(index == 0) {
                return cfg.opacityArea;
              }  
              else {
                return 0.2;
              }
          })
          .style("stroke-opacity", 1)
          ;


        series++;
      

         var cenas_aux = legDataStarplot[index][0] + " - " + legDataStarplot[index][1];
         legend.push(cenas_aux);   
        

    }
    var color = choose_color_radar_circles();

  //-----------------------------------------------------------------------Tooltip and circles------------------------------------------------------    
    var tooltip = d3v3.select("body").append("div").attr("class", "toolTip1");
        var circles = g.selectAll("circle")
                    .data(cenas)
                    .enter()
                    ;
        var circleAttributes = circles
                            .append("circle")
                            .attr("class", function(d,i) { return "radar-chart-" + i;})
                            .attr("cx", function(d,i) {
                                          return cfg.w/2*(1-(parseFloat(Math.max(scale(d), 0))/cfg.maxValue)*cfg.factor*Math.sin((i%5)*cfg.radians/total)); })
                            .attr("cy", function(d,i) { 
                                          return cfg.h/2*(1-(parseFloat(Math.max(scale(d), 0))/cfg.maxValue)*cfg.factor*Math.cos((i%5)*cfg.radians/total)); })
                            .attr("r", cfg.radius)
                            .attr("data-id", function(d,i){return allAxis[i];})
                            .style("fill", function(d,i) {return color[Math.floor(i/5)]; })
                            .style("stroke-width", "2px")
                            .style("stroke", function(d,i) {return color[Math.floor(i/5)]; })
                            .attr("opacity", 0)
                            .on('mouseover', function (d){
                                  tooltip
                                    .style("left", d3v3.event.pageX - 40 + "px")
                                    .style("top", d3v3.event.pageY - 60 + "px")
                                    .style("display", "inline-block")
                                    .html("<span>" + (d) + "</span>");
                                  })
                              .on("mouseout", function(d){ tooltip.style("display", "none"); })
                              .transition().duration(1000).style("opacity", 1);

    
     var color_aux = choose_color_radar_leg();              

    //--------------------------------------------------------------Legend------------------------------------------------------------------                                                     
    var legenda  = g.selectAll(".legenda")
                                  .data(legend)
                                  .enter();

    //Create colour squares
    legenda.append("rect")
            .attr("x", cfg.w - 65)
            .attr("y", function(d, i){ return i * 20;})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d, i){ return color_aux[i%5];});
    
    //Create text next to squares
    legenda.append("text")
            .attr("x", cfg.w - 52)
            .attr("y", function(d, i){ return i * 20 + 9;})
            .attr("fill", "#ffffff")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .text(function(d) { console.log(d); return d; });



    }
};


function choose_color_radar(){
  var i_selec = document.getElementById("inds").selectedIndex;
  var color_radar = [];
  if(i_selec == 0) {
    color_radar.push(d3.scaleOrdinal().range(["#d94801", "#a63603"])); 
    color_radar.push(d3.scaleOrdinal().range(["#FFA833", "#FF9302"]));
           
      return  color_radar;
    }
    if(i_selec == 1) {
       color_radar.push(d3.scaleOrdinal().range(["#2171b5", "#08519c"]));
      color_radar.push(d3.scaleOrdinal().range(["#80e5ff", "#00ccff"]));      
      return  color_radar;
      //colors = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
    }
    if(i_selec == 2) {
      //colors = ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
       color_radar.push(d3.scaleOrdinal().range(["#238b45", "#006d2c"]));
      color_radar.push(d3.scaleOrdinal().range(["#70db70", "#47d147"]));      
      return  color_radar; 
    }
    if(i_selec == 3) {
      //colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
       color_radar.push(d3.scaleOrdinal().range(["#cb181d", "#a50f15"]));
      color_radar.push(d3.scaleOrdinal().range(["#ff6666", "#ff4d4d"]));      
      return  color_radar;
    }
    else {
      //colors = ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"];
       color_radar.push(d3.scaleOrdinal().range(["#88419d", "#810f7c"]));
      color_radar.push(d3.scaleOrdinal().range(["#df9fbf", "#cc6699"]));      
      return  color_radar;
    }
}


function choose_color_radar_leg() {
  var i_selec = document.getElementById("inds").selectedIndex;
  var color_radar = [];
  if(i_selec == 0) {
      color_radar.push("#d94801");   
      color_radar.push("#FFA833");
      return  color_radar;
    }
    if(i_selec == 1) {
      color_radar.push("#2171b5");
      color_radar.push("#80e5ff");  
      return  color_radar;
      //colors = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
    } 
    if(i_selec == 2) {
      //colors = ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
      color_radar.push("#238b45");
      color_radar.push("#70db70");      
      return  color_radar; 
    }
    if(i_selec == 3) {
      //colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
      color_radar.push("#cb181d");
      color_radar.push("#ff6666");     
      return  color_radar;
    }
    else {
      //colors = ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"];
      color_radar.push("#88419d");
      color_radar.push("#df9fbf");  
      return  color_radar;
    }
} 




function choose_color_radar_circles() {
  var i_selec = document.getElementById("inds").selectedIndex;
  var color_radar = [];
  if(i_selec == 0) {
      color_radar.push("#a63603");   
      color_radar.push("#FF9302");
      return  color_radar;
    }
    if(i_selec == 1) {
      color_radar.push("#2171b5");
      color_radar.push("#00ccff");  
      return  color_radar;
      //colors = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
    }
    if(i_selec == 2) {
      //colors = ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
      color_radar.push("#006d2c");
      color_radar.push("#47d147");      
      return  color_radar; 
    }
    if(i_selec == 3) {
      //colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
      color_radar.push("#a50f15");
      color_radar.push("#ff4d4d");     
      return  color_radar;
    }
    else {
      //colors = ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"];
      color_radar.push("#810f7c");
      color_radar.push("#cc6699");  
      return  color_radar;
    }
} 