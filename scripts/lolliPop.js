//lolliPop.js: Code that creates a lollipop graph
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//COPIED STRAIGHT, slight modification 
function createLollipop(data) { //nNot finished will be for top 10 actors in the topp 100 set

  // set the dimensions and margins of the graph
  var loliMargin = { top: 30, right: 10, bottom: 200, left: 80 },
    width = 900 - loliMargin.left - loliMargin.right,
    height = 500 - loliMargin.top - loliMargin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#lolli")
    .append("svg")
    .attr("width", width + loliMargin.left + loliMargin.right)
    .attr("height", height + loliMargin.top + loliMargin.bottom)
    .attr("id", "lollipop")
    .append("g")
    .attr("transform", "translate(" + loliMargin.left + "," + loliMargin.top + ")");

  var lolliHoverTooltip = d3.select("#lolli")
    .append("div")
    .attr("class", "lolliTooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var mouseover = function (d) {
    lolliHoverTooltip.style("opacity", 1) //set to full visibility
  }

  var mousemove = function (d) { //, overlappingMovies

    var toolTipText = "Gross: " + d.Gross;

    lolliHoverTooltip.html(toolTipText)
      .style("left", (d3.mouse(d3.event.currentTarget)[0] + 100) + "px") //d3.mouse(this) does not work, because "this" is an instance
      .style("top", (d3.mouse(d3.event.currentTarget)[1]) + "px")
    d3.select(d3.event.currentTarget).attr('r', 10);
  }

  var mouseleave = function (d) {
    lolliHoverTooltip.html("")
    d3.select(d3.event.currentTarget).attr('r', 5)
    lolliHoverTooltip.style("opacity", 0) //make invisible
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

  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) { return x(d.Series_Title); }) //Need to spawn x values to spawn each line in the correct position
    .attr("x2", function (d) { return x(d.Series_Title); })
    .attr("y1", function (d) { return y(d.Gross); })
    .attr("y2", y(0))
    .attr("stroke", "green") //Maskros

  // Circles
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Series_Title); })
    .attr("cy", function (d) { return y(d.Gross); })
    .attr("r", "5")
    .attr("stroke", "black")
    .style("fill", "#FFD488")
    .on("mouseover", mouseover) //{ overlappingMovies = mouseover(d, data); return overlappingMovies}
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

