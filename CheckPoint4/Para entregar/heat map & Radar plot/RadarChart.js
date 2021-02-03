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
     color: d3.scaleOrdinal().range(["#5CACEE", "#63B8FF"])
    };
	
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    
    cfg.maxValue = 100;
    
    var allAxis = ['Nº Publishers', 'Nº Developers', 'Avg Price', 'Avg Rating', 'Nº Games'];
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

		var tooltip;
	
    //Circular segments
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
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

    for( var index = 0; index < length; index++) {
      d = dataStarplot[index];
      
      
        dataValues = [];
       
          console.log(d.N_Developers);
          var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.sin(0*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.cos(0*cfg.radians/total))
          ]);
            var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.sin(1*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.cos(1*cfg.radians/total))
          ]);
        
            var scale = d3.scale.linear()
            .domain([0, 50])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.sin(2*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.cos(2*cfg.radians/total))
          ]);
          
            var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.sin(3*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.cos(3*cfg.radians/total))
          ]);
          
            var scale = d3.scale.linear()
            .domain([0, 300])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.sin(4*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.cos(4*cfg.radians/total))
          ]);
          
         g.selectAll(".nodes")
        .data(dataValues);
        
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
               .data([dataValues])
               .enter()
               .append("polygon")
               .attr("class", "radar-chart-serie"+series)
               .style("stroke-width", "2px")
               .style("stroke", cfg.color(series))
               .attr("points",function(d) {
                 var str="";
                 for(var pti=0;pti<d.length;pti++){

                   str=str+d[pti][0]+","+d[pti][1]+" ";
                   
                 }
                 return str;
                })
               .style("fill", function(j, i){return cfg.color(series)})
               .style("fill-opacity", cfg.opacityArea)
               .on('mouseover', function (d){
                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                         .transition(200)
                         .style("fill-opacity", .7);
                        })
               .on('mouseout', function(){
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
               });
        series++;
      
      series=0;



      
      var tooltip = d3.select("body").append("div").attr("class", "toolTip1");
      g.selectAll(".nodes")
      .data(dataStarplot[index]).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr('r', cfg.radius)
      .attr("alt", function(d, i){ if(i==0) { return Math.max(d.N_Developers, 0);} 
          if(i==1) { return Math.max(d.N_Publishers, 0);} 
          if(i==2) { return Math.max(d.price, 0);} 
          if(i==3) { return Math.max(d.rating, 0);} 
          else { return Math.max(d.Ngames, 0); }
      })
      .attr("cx", function(d, i){
        if(i==0) {
          var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.sin(0*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.cos(0*cfg.radians/total))
          ]);
          return  cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.sin(0*cfg.radians/total));
        }
         
         if(i==1) {
            var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.sin(1*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.cos(1*cfg.radians/total))
          ]);
             return cfg.w/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.sin(1*cfg.radians/total));
         } 

         if(i==2){
            var scale = d3.scale.linear()
            .domain([0, 50])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.sin(2*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.cos(2*cfg.radians/total))
          ]);
            return cfg.w/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.sin(2*cfg.radians/total));
         } 
          
          if(i==3){ var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.sin(3*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.cos(3*cfg.radians/total))
          ]); 
            return cfg.w/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.sin(3*cfg.radians/total));
            }
          
          else{
            var scale = d3.scale.linear()
            .domain([0, 300])
            .range([0, 100])
            dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.sin(4*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.cos(4*cfg.radians/total))
          ]);
            return cfg.w/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.sin(3*cfg.radians/total));
          }}
        )
      .attr("cy", function(j, i){
        if(i==0) {
          var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
          return  cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Developers), 0))/cfg.maxValue)*cfg.factor*Math.cos(0*cfg.radians/total));
        }
         
         if(i==1) {
            var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
             return cfg.h/2*(1-(parseFloat(Math.max(scale(d.N_Publishers), 0))/cfg.maxValue)*cfg.factor*Math.cos(1*cfg.radians/total));
         } 

         if(i==2){
            var scale = d3.scale.linear()
            .domain([0, 50])
            .range([0, 100])
            return cfg.h/2*(1-(parseFloat(Math.max(scale(d.price), 0))/cfg.maxValue)*cfg.factor*Math.cos(2*cfg.radians/total))
         } 
          
          if(i==3){ var scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 100])
            return cfg.h/2*(1-(parseFloat(Math.max(scale(d.rating), 0))/cfg.maxValue)*cfg.factor*Math.cos(3*cfg.radians/total));
            }
          
          else{
            var scale = d3.scale.linear()
            .domain([0, 300])
            .range([0, 100])
            return cfg.h/2*(1-(parseFloat(Math.max(scale(d.Ngames), 0))/cfg.maxValue)*cfg.factor*Math.cos(4*cfg.radians/total));
          }})
      .attr("data-id", function(d, i){return allAxis[i];})
      .style("fill", "#fff")
      .style("stroke-width", "2px")
      .style("stroke", cfg.color(series)).style("fill-opacity", .9)
      .on('mouseover', function (d, i){
        console.log(d.area)
        if(i==0) { var x = ("Nº Developers<br><span>" + (d.N_Developers) + "</span>"); }
        if(i==1) { var x = ("Nº Publishers<br><span>" + (d.N_Publishers) + "</span>"); }
        if(i==2) { var x = ("Avg Price<br><span>" + (d.price) + "</span>"); }
        if(i==3) { var x = ("Avg Rating<br><span>" + (d.rating) + "</span>"); }
        else { 
            var x = ("Games<br><span>" + (d.Ngames) + "</span>");
        }
            tooltip
              .style("left", d3.event.pageX - 40 + "px")
              .style("top", d3.event.pageY - 80 + "px")
              .style("display", "inline-block")
              .html( x);
            })
        .on("mouseout", function(d){ tooltip.style("display", "none");});




    }

    



    }
};