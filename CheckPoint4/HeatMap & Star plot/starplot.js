 var margin = {
    top: 10,
    right: 50,
    bottom: 20,
    left: 50
  };
  var width1 = 500 - margin.left - margin.right;
  var height1 = 500 - margin.top - margin.bottom;
  var labelMargin = 8;

  var scale = d3.scale.linear()
  .domain([0, 100])
  .range([0, 100])

var scale1 = d3.scale.linear()
  .domain([0, 400])
  .range([0, 90])
  var scaless = [];


function makeStar(d) {
  d.N_Developers = +d.N_Developers;
  d.N_Publishers = +d.N_Publishers;
  d.price = +d.price;
  d.rating = +d.rating;
  d.Ngames = +d.Ngames;
  d.year = +d.year;

  var star = d3.starPlot()
    .width(width1)
    .properties([
      'N_Publishers',
      'N_Developers',
      'price',
      'rating',
      'Ngames'
    ])
    .scales([scale,scale, scale, scale, scale1])
    .labels([
      'Nº of Publishers',
      'Nº of Developers',
      'Average Price',
      'Average Rating',
      'Nº of Games'
    ])
    .margin(margin)
    .labelMargin(labelMargin)



  
    var wrapper = d3.select('#target').append('div')
          .attr('class', 'wrapper')

        var svg1 = wrapper.append('svg')
          .attr('class', 'chart')
          .attr('width', width1 + margin.left + margin.right)
          .attr('height', height1 + margin.top + margin.bottom)
          

        
        var starG = svg1.append('g')
          .datum(d)
          .call(star)
          .call(star.interaction)


        var interactionLabel = wrapper.append('div')
          .attr('class', 'interaction label')

        var circle = svg1.append('circle')
          .attr('class', 'interaction circle')
          .attr('r', 5)

        var interaction = wrapper.selectAll('.interaction')
          .style('display', 'none');

        svg1.selectAll('.star-interaction')
          .on('mouseover', function(d) {
            svg1.selectAll('.star-label')
              .style('display', 'none')

            interaction
              .style('display', 'block')

            circle
              .attr('cx', d.x)
              .attr('cy', d.y)
              
            $interactionLabel = $(interactionLabel.node());
            interactionLabel
              .text(d.key + ': ' + d.datum[d.key])
              .style('left', d.xExtent - ($interactionLabel.width() / 2))
              .style('top', d.yExtent - ($interactionLabel.height() / 2))
          })
          .on('mouseout', function(d) {
            interaction
              .style('display', 'none')

            svg1.selectAll('.star-label')
              .style('display', 'block')
          })
        }

 
