//lolliPop.js: Code that creates a lollipop graph
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//COPIED STRAIGHT, slight modification 
function createLollipop(data) { //nNot finished will be for top 10 actors in the topp 100 set

// set the dimensions and margins of the graph
var loliMargin = {top: 10, right: 10, bottom: 90, left: 80},
    width = 1860 - loliMargin.left - loliMargin.right,
    height = 500 - loliMargin.top - loliMargin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#lolli")
  .append("svg")
    .attr("width", width + loliMargin.left + loliMargin.right)
    .attr("height", height + loliMargin.top + loliMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + loliMargin.left + "," + loliMargin.top + ")");


// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Star1; }))
  .padding(1);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");


// Add Y axis

var minMaxGross = findMinMax(data, "Gross");

var y = d3.scaleLinear()
  .domain([0, minMaxGross[1]])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Lines
svg.selectAll("myline")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return x(d.Director); })
    .attr("x2", function(d) { return x(d.IMDB_Rating); })
    .attr("y1", function(d) { return y(d.Gross); })
    .attr("y2", y(0))
    .attr("stroke", "grey")

// Circles
svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.Star1); })
    .attr("cy", function(d) { return y(d.Gross); })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
}

