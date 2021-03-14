//lolliPop.js: Code that creates a lollipop graph
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//Originally copied from: https://www.d3-graph-gallery.com/graph/lollipop_basic.html
//However since then changed and modified and built upon to work for our data and goals.
function createLollipop(data) { 

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 10, bottom: 200, left: 100 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#lolli")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "lollipop")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tooltip = d3.select("#lolli")
    .append("div")
    .attr("class", "lolliTooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var mouseover = function (d) {
    tooltip.style("opacity", 1) //set to full visibility
  }

  var mousemove = function (d) { //, overlappingMovies

    var toolTipText = "Gross ($): " + d.Gross;

    tooltip.html(toolTipText)
      .style("left", (d3.mouse(d3.event.currentTarget)[0] + 100) + "px") //d3.mouse(this) does not work, because "this" is an instance
      .style("top", (d3.mouse(d3.event.currentTarget)[1]) + "px")
    d3.select(d3.event.currentTarget).attr('r', 10);
  }

  var mouseleave = function (d) {
    tooltip.html("")
    d3.select(d3.event.currentTarget).attr('r', 5)
    tooltip.style("opacity", 0) //make invisible
  }

  // Add x axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(function (d) { return d.Series_Title; }))
    .padding(1);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(0,0)rotate(-20)")
    .style("text-anchor", "end");

  // Add y axis
  var minMaxGross = findMinMax(data, "Gross"); //to find the scaling for the y axis

  var y = d3.scaleLinear()
    .domain([0, minMaxGross[1]])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Gross ($)");

  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) { return x(d.Series_Title); }) //Need to spawn x values to spawn each line in the correct position
    .attr("x2", function (d) { return x(d.Series_Title); })
    .attr("y1", function (d) { return y(d.Gross); })
    .attr("y2", y(0))
    .attr("stroke", "steelblue")

  // Circles
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Series_Title); })
    .attr("cy", function (d) { return y(d.Gross); })
    .attr("r", "5")
    .attr("stroke", "black")
    .style("fill", "#ca3e47")
    .on("mouseover", mouseover) //{ overlappingMovies = mouseover(d, data); return overlappingMovies}
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

