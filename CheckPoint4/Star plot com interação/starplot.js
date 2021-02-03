 var margin = {
    top: 302,
    right: 50,
    bottom: 20,
    left: 50
  };
  var width = 340 - margin.left - margin.right;
  var height = 340 - margin.top - margin.bottom;
  var labelMargin = 8;

  var scale = d3.scale.linear()
  .domain([0, 100])
  .range([0, 100])

var scale1 = d3.scale.linear()
  .domain([0, 400])
  .range([0, 90])
  var scaless = [];
  d3.csv('dataset.csv')
    .row(function(d) {
        d.N_Developers = +d.N_Developers;
        d.N_Publishers = +d.N_Publishers;
        d.price = +d.price;
        d.rating = +d.rating;
        d.Ngames = +d.Ngames;
        d.year = +d.year;
        scaless = [scale,scale, scale, scale, scale1]
        return d;
    })
    .get(function(error, rows) {
      var star = d3.starPlot()
        .width(width)
        .properties([
          'N_Publishers',
          'N_Developers',
          'price',
          'rating',
          'Ngames'
        ])
        .scales(scaless)
        .labels([
          'Nº of Publishers',
          'Nº of Developers',
          'Average Price',
          'Average Rating',
          'Nº of Games'
        ])
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        star.includeLabels(i % 4 === 0 ? true : false);
        if(i==100) {
          console.log(d);
          var wrapper = d3.select('#target').append('div')
          .attr('class', 'wrapper')

        var svg = wrapper.append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)

        var starG = svg.append('g')
          .datum(d)
          .call(star)
          .call(star.interaction)

        var interactionLabel = wrapper.append('div')
          .attr('class', 'interaction label')

        var circle = svg.append('circle')
          .attr('class', 'interaction circle')
          .attr('r', 5)

        var interaction = wrapper.selectAll('.interaction')
          .style('display', 'none');

        svg.selectAll('.star-interaction')
          .on('mouseover', function(d) {
            svg.selectAll('.star-label')
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

            svg.selectAll('.star-label')
              .style('display', 'block')
          })
        }
        
      });
    });