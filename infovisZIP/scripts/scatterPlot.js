//scatterPlot.js: Code that handles the data and plots it on a scatterplot
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

function createScatterPlot(data) {

    //Steps to ollow:

    //Some components copied, and also inspired from https://www.d3-graph-gallery.com/graph/scatter_basic.html + Lab 1 and mainly our own wits (or rather lack thereof)
    var focusMargin = { top: 20, right: 30, bottom: 30, left: 50 },
        focusHeight = 350 - focusMargin.top - focusMargin.bottom,
        contextMargin = { top: 20, right: 30, bottom: 30, left: 50 },
        contextHeight = 100 - contextMargin.top - contextMargin.bottom,
        width = 1200 - focusMargin.left - focusMargin.right;

    // append the svg object to the body of the page
    var svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("position", "relative")
        .attr("width", width + focusMargin.left + focusMargin.right)
        .attr("height", focusHeight + focusMargin.top + focusMargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + focusMargin.left + "," + focusMargin.top + ")");
    
    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + focusMargin.left + "," + focusMargin.top + ")");
    
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + contextMargin.left + "," + contextMargin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", focusHeight);

    //---------- Crate X-axis for focus + context plots (Year) ----------


    var minMaxYear = findMinMax(data, "Released_Year"); //Fetches the min max value of year for all data

    var xFocusScale = d3.scaleLinear()  //xFocusScale = xScale
        .range([0, width])
        .domain([minMaxYear[0], minMaxYear[1]]);

    //X-axis for the focused data of the scatterplot
    var xFocusAxis = d3.axisBottom(xFocusScale); //xFocusAxis = xAxis

    //X-axis for the context data of the scatterplot
    var xContextScale = d3.scaleLinear()
        .range([0, width])
        .domain(xFocusScale.domain());

    var xContextAxis = d3.axisBottom(xContextScale);

    // //Groups objects together
    // svg.append("g") //'g' element is defined for graphical objects
    //     .attr("transform", "translate(0 , " + focusHeight + ")") //Not sure if we need this
    //     .call(d3.axisBottom(xFocusAxis));

    var brush = d3.brushX()
        .extent([[0, 0], [width, contextHeight]]) //min and max intervalls for the brush
        .on("brush end", brushed);
        

    //---------- Crate Y-axis for focus plot (IMDB-rating) ----------

    
    var minMaxRating = findMinMax(data, "IMDB_Rating"); //Fetches the min max value of year for all data

    var yFocusScale = d3.scaleLinear()
        .range([0, focusHeight])
        .domain([minMaxRating[0], minMaxRating[1]]);

    //Y-axis for the focused data of the scatterplot
    var yFocusAxis = d3.axisLeft(yFocusScale);

    //Y-axis for the context data of the scatterplot
    var yContextScale = d3.scaleLinear()
        .range([contextHeight, 0])
        .domain(yFocusScale.domain());

    //Groups objects together
    // svg.append("g")
    //     .call(d3.axisLeft(yFocusAxis));


   //---------- Crate dots from the data ----------

   
    // Append scatter plot to focus area 
    var dots = focus.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dot')
        .attr("r",5)
        .style("opacity", .5)
        .attr("cx", function(d) { return xFocusScale(d.Released_Year); })
        .attr("cy", function(d) { return yFocusScale(d.IMDB_Rating); })

    // //Basically copied
    // svg.append('g')
    //     .selectAll("dot") //Idk how it knows what dot is
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function (d) { return xContextAxis(d.Released_Year); })
    //     .attr("cy", function (d) { return yContextAxis(d.IMDB_Rating); })
    //     .attr("r", 3)
    //     .attr("style", "opacity:0.9;")
    //     .style("fill", "#FF5733");

    // svg.append("text")
    //     .attr("x", (width/2))
    //     .attr("text-anchor", "middle")
    //     .style("font-size","20px")
    //     .text("Bajsmän")

    // svg.append("text")         //label for x axis 
    //     .attr("transform",
    //         "translate(" + (width / 2) + " ," +
    //         (focusHeight + focusMargin.top + 10) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Year");

    // svg.append("text")      //label for y axis
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - focusMargin.left)
    //     .attr("x", 0 - (focusHeight / 2))
    //     .attr("dy", "1em")            //dy = shift along the y-axis, 1em = default font size
    //     .style("text-anchor", "middle")
    //     .text("Rating");

    //Append scatter plot to the brush context area 

    var dots = context.append("g");
     dots.attr("clip-path", "url(#clip)");
     dots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dotContext')
        .attr("r",3)
        .style("opacity", .5)
        .attr("cx", function(d) { return xContextScale(d.Released_Year); })
        .attr("cy", function(d) { return yContextScale(d.IMDB_Rating); })
        
    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + focusHeight + ")")
        .call(xFocusAxis); 

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yFocusAxis);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + focusHeight + ")")
        .call(xContextAxis); 

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xFocusScale.range())

    //Brush function for filtering through the data. Redraws scatter plot each time brush is used
    function brushed() {
        var selection = d3.event.selection || xContextScale.range();

        xFocusScale.domain(selection.map(xContextScale.invert, xContextScale));
        
        focus.selectAll(".dot")
            .attr("cx", function(d) { return xFocusScale(d.Released_Year); })
            .attr("cy", function(d) { return yFocusScale(d.IMDB_Rating); });
        focus.select(".axis--x").call(xFocusAxis);
    }
}

function findMinMax(data, column_name) {

    var max = data[0][column_name];
    var min = data[0][column_name];

    for (i = 0; i < data.length; i++) {
        if (max < data[i][column_name]) {
            max = data[i][column_name];
        }

        if (min > data[i][column_name]) {
            min = data[i][column_name];
        }
    }
    var temp = [];
    temp[0] = min;
    temp[1] = max;

    return temp;
}

    // var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#scatterPlot")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");