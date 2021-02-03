var width = 300,
    height = 300;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 300
}


function makeStar(data) {
  RadarChart.draw("#chart1", dataStarplot, config);
}
    

var svg1 = d3.select('body')
  .selectAll('svg')
  .append('svg')
  .attr("width", width)
  .attr("height", height);