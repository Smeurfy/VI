var margin = { top: 10, right: 300, bottom: 50, left: 60 },
    outerWidth = 1050,
    outerHeight = 500,
    width = 625,
    height = 370;

var x = d3v3.scale.linear()
    .range([0, width]).nice();

var y = d3v3.scale.linear()
    .range([height, 0]).nice();

var xCat = "n_friends",
    yCat = "obesity",
    rCat = "individuals",
    colorCat = "years";

var descriptionY = "Individuals with net";
var descriptionX = "Nº Friends";

var ano2008 = [];
var ano2009 = [];
var ano2010 = [];
var ano2011 = [];
var ano2012 = [];
var ano2013 = [];
var yearsRange = ["2012","2013"];

var old_x = 0;
var old_y = 0;

var selectedCountries = [];

d3v3.csv("nusers_nfriends.csv", function(data) {
    data.forEach(function(d) {
        if (d.years == "2008") {
            ano2008.push(d) ;
        }
        if (d.years == "2009") {
            ano2009.push(d) ;
        }
        if (d.years == "2010") {
            ano2010.push(d) ;
        }
        if (d.years == "2011") {
            ano2011.push(d) ;
        }
        if (d.years == "2012") {
            ano2012.push(d) ;
        }
        if (d.years == "2013") {
            ano2013.push(d) ;
        }
        d.obesity = +d.obesity;
        d.individuals = +d.individuals;
        d.homicide = +d.homicide;
        d.deppression = +d.deppression;
        d.n_friends = +d.n_friends;
    });

    var xMax = d3v3.max(data, function(d) { return d[xCat]; }) * 1.05,
        xMin = d3v3.min(data, function(d) { return d[xCat]; }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3v3.max(data, function(d) { return d[yCat]; }) * 1.05,
        yMin = d3v3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3v3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3v3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    var color = d3.scaleOrdinal().domain(["2008","2009", "2010", "2011", "2012", "2013"])
                            .range(["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"]);

    var tip = d3v3.select("body").append("div") 
        .attr("class", "tooltip3")              
        .style("opacity", 0);
    var zoomBeh = d3v3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0, 500])
        .on("zoom", zoom);

    var svg = d3v3.select("#scatter")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .attr("transform", "translate(" + 760 + "," + -540 + ")")
        .style("border", "none")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    //svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .style("fill", "#aaa")
        .style("font-size", "9pt")
        .style("font-family", "sans-serif")
        .text(descriptionX)
        ;

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .style("fill", "#aaa")
        .style("font-size", "9pt")
        .style("font-family", "sans-serif")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(descriptionY)
        
        .style("fill", "#aaa")
        .style("font-size", "9pt")
        .style("font-family", "sans-serif");

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")")
        .style("stroke", "#aaa");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .attr("stroke", "#aaa");

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr("id", function(d) { return "a" + d.iso; })
        .attr("r", /*function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); }*/4)
        .attr("transform", transform)
        .style("fill", function(d) { 
            return color(d[colorCat]); })
        .on("mouseover", function(d) { 
            var index_rem = selectedCountries.indexOf(d.iso);
            if (index_rem > -1) {
                tip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tip.html("Country Name: " + d.iso + "<br/>" + descriptionY + ": " + d[yCat]
                   + "<br/>" + descriptionX + ": " + d[xCat] )
            .style("left", (d3v3.event.pageX) + "px")
            .style("top", (d3v3.event.pageY) + "px");
            }
            }
        )
        .on("mouseout", function(d) {tip.transition()
         .duration(500)
         .style("opacity", 0);});

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .classed("legend", true)
        .attr("transform", function(d, i) { 
            return "translate(0," + i * 20 + ")"; });

    legend.append("circle")
        .attr("r", 3.5)
        .attr("cx", width + 20)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width + 26)
        .attr("dy", ".35em")
        .text(function(d) { return d; })
        .style("fill", "#aaa")
        .style("font-size", "9pt")
        .style("font-family", "sans-serif");

    //d3.select("input").on("click", change);
    d3v3.select("#inds_y_sct").on("change", changeY);
    d3v3.select("#inds_x_sct").on("change", changeX);

    function changeY() {
        var y_selec = document.getElementById("inds_y_sct").selectedIndex;

        //Para não estar sempre a fazer refresh
        if (old_y != y_selec) {
            old_y = y_selec;
            switch (old_y) {
                case 0:
                    yCat = "obesity";
                    descriptionY = "Obesity";
                    break;
                case 1:
                    yCat = "individuals";
                    descriptionY = "Individuals with net";
                    break;
                case 2:
                    yCat = "homicide";
                     descriptionY = "Homicide";
                    break;
                case 3:
                    yCat = "deppression";
                     descriptionY = "Individuals with net";
                    break;
                default :
                    yCat = "individuals";
                     descriptionY = "Individuals with net";
                    break;
            }
            yMax = d3v3.max(data, function(d) { return d[yCat]; });
            yMin = d3v3.min(data, function(d) { return d[yCat]; });

            xMax = d3v3.max(data, function(d) { return d[xCat]; });
            xMin = d3v3.min(data, function(d) { return d[xCat]; });

            zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

            var svg = d3v3.select("#scatter").transition();

            svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(descriptionY);
            svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(descriptionX);
            objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
        }
    }

    function changeX() {
        var x_selec = document.getElementById("inds_x_sct").selectedIndex;

        //Para não estar sempre a fazer refresh
        if (old_x != x_selec) {
            old_x = x_selec;
            switch (old_x) {
                case 0:
                    xCat = "n_friends";
                    descriptionX = "Nº Friends";
                    break;
                case 1:
                    xCat = "n_users";
                    descriptionX = "Nº Users";
                    break;
                default :
                    xCat = "n_friends";
                    descriptionX = "Nº Friends";
                    break;
            }

            xMax = d3v3.max(data, function(d) { return d[xCat]; });
            xMin = d3v3.min(data, function(d) { return d[xCat]; });

            yMax = d3v3.max(data, function(d) { return d[yCat]; });
            yMin = d3v3.min(data, function(d) { return d[yCat]; });

            zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

            var svg = d3v3.select("#scatter").transition();

            svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(descriptionX);
            svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(descriptionY);

            objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
        }
    }

    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    function transform(d) {
        /*console.log(d);
        console.log(xCat);
        console.log(d[xCat]);
        console.log(x(d[xCat]));*/

        return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
    }
});

function draw_from_map(d, variavel){
    console.log(d);
    if(variavel == 0){
        console.log( d3v3.selectAll("#a" + d.CountryCode))
       d3v3.selectAll("#a" + d.CountryCode).transition()
            .duration(1000)
            .style("opacity", 1);
        selectedCountries.push(d.CountryCode);
    }
    if(variavel == 1)
    {
        d3v3.selectAll("#a" + d.CountryCode).transition()
            .duration(1000)
            .style("opacity", 0);
        var index_rem = selectedCountries.indexOf(d.CountryCode);
        if (index > -1) {
            selectedCountries.splice(0, index_rem);
        }
    }
    if(variavel == 2){
       d3v3.selectAll("#a" + d.value).transition()
            .duration(1000)
            .style("opacity", 1);
        selectedCountries.push(d.CountryCode);
    }
    if(variavel == 3)
    {
        d3v3.selectAll("#a" + d.value).transition()
            .duration(1000)
            .style("opacity", 0);

        var index_rem = selectedCountries.indexOf(d.CountryCode);
        if (index_rem > -1) {
            selectedCountries.splice(0, index_rem);
        }
    }

}



