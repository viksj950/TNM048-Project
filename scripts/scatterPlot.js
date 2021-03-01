//scatterPlot.js: Code that handles the data and plots it on a scatterplot + brushable
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

function createScatterPlot(data) {
    //Steps to follow:

    //Aidas nightmare global variables:
    var xAxisMargin = 1;
    var yAxisMargin = 0.1;

    //Some components copied, but most inspired from https://rajvansia.com/scatterplotbrush-d3-v4.html and Lab 1 and mainly our own wits (or rather lack thereof)
    var focusMargin = { top: 20, right: 20, bottom: 110, left: 50 }, //{top: 60, right: 60, bottom: 200, left: 80},
        contextMargin = { top: 430, right: 30, bottom: 30, left: 50 }, //{top: 350, right: 60, bottom: 60, left: 80},
        width = 1200 - focusMargin.left - focusMargin.right,
        focusHeight = 500 - focusMargin.top - focusMargin.bottom,
        contextHeight = 500 - contextMargin.top - contextMargin.bottom;

    //Copied fully from https://rajvansia.com/scatterplotbrush-d3-v4.html
    // var margin = {top: 20, right: 20, bottom: 110, left: 50},
    // margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom,
    // height2 = 500 - margin2.top - margin2.bottom;

    //---------- Crate X-axis for focus + context plots (Year) ----------


    var minMaxYear = findMinMax(data, "Released_Year"); //Fetches the min max value of year for all data

    var xFocusScale = d3.scaleLinear()  //xFocusScale = xScale
        .range([0, width])
        .domain([minMaxYear[0] - xAxisMargin, minMaxYear[1] + xAxisMargin]); //By adding +1/-1 we get a margin between lowest data and highest data points

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
        .extent([[0, 0], [width, contextHeight]]) //min and max values for the brush
        .on("brush end", brushed); //brush end specifies that only when brush is released it updates the scale?


    //---------- Crate Y-axis for focus plot (IMDB-rating) ----------


    var minMaxRating = findMinMax(data, "IMDB_Rating"); //Fetches the min max value of year for all data
    var yFocusScale = d3.scaleLinear()
        .range([focusHeight, 0])
        .domain([minMaxRating[0] - yAxisMargin, minMaxRating[1] + yAxisMargin]); //As for now we add -0.1/ to mimic margins in vertical

    //Y-axis for the focused data of the scatterplot
    var yFocusAxis = d3.axisLeft(yFocusScale);

    //Y-axis for the context data of the scatterplot
    var yContextScale = d3.scaleLinear()
        .range([contextHeight, 0])
        .domain(yFocusScale.domain());

    //Groups objects together
    // svg.append("g")
    //  .call(d3.axisLeft(yFocusAxis));

    // append the svg object to the div #scatterPlot which contains the SP elements of the page
    var svg = d3.select("#SPandSearch").append("svg")
        .attr("position", "relative")
        .attr("width", width + focusMargin.left + focusMargin.right)
        .attr("height", focusHeight + focusMargin.top + focusMargin.bottom);

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

    //---------- Crate tooltip for the scatterplot ----------
    var hoverTooltip = d3.select("#SPandSearch")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var mouseover = function (d, data) {
        hoverTooltip.style("opacity", 1) //set to full visibility
        findOverlappingMovies(data, d.IMDB_Rating, d.Released_Year);
        
    }

    var mousemove = function (d) {
        hoverTooltip.html(d.Series_Title)  //fetches name of movie(s)
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
        d3.select(this).attr('r', 10)
        
    }

    var mouseleave = function (d) {
        hoverTooltip.html("")
        d3.select(this).attr('r', 5)
        hoverTooltip.style("opacity", 0) //make invisible
    }

    //---------- Crate dots from the data ----------

    // Append scatter plot to focus area 
    var focusDots = focus.append("g");
    focusDots.attr("clip-path", "url(#clip)");
    focusDots.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr("r", 5)
        .style("opacity", .25)
        .attr("cx", function (d) { return xFocusScale(d.Released_Year); })
        .attr("cy", function (d) { return yFocusScale(d.IMDB_Rating); })
        .on("mouseover", function (d) { return mouseover(d, data);})
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    focus.append("g") 
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + focusHeight + ")")
        .call(xFocusAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yFocusAxis);

    focus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - focusMargin.left)
        .attr("x", 0 - (focusHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("IMDB-Rating");

    svg.append("text")
        .attr("transform",
            "translate(" + ((width + focusMargin.right + focusMargin.left) / 2) + " ," +
            (focusHeight + focusMargin.top + focusMargin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    //Append scatter plot to the brush context area 

    var contextDots = context.append("g");
    contextDots.attr("clip-path", "url(#clip)"); //from lab
    contextDots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dotContext')
        .attr("r", 3)
        .style("opacity", .5)
        .attr("cx", function (d) { return xContextScale(d.Released_Year); })
        .attr("cy", function (d) { return yContextScale(d.IMDB_Rating); })

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + contextHeight + ")")
        .call(xContextAxis);

    //Brushfunctions
    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xFocusScale.range())

    //Brush function for filtering through the data. Redraws scatter plot each time brush is used
    function brushed() {

        var s = d3.event.selection; // add "|| xContextScale.range()" ?

        xFocusScale.domain(s.map(xContextScale.invert, xContextScale));

        focus.selectAll(".dot")
            .attr("cx", function (d) { return xFocusScale(d.Released_Year); })
            .attr("cy", function (d) { return yFocusScale(d.IMDB_Rating); });
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
//Function that returns all the movies corresponding to the same year and same rating
function findOverlappingMovies(data, rating, year) { 
    var it1 = 0;
    var it2 = 0;
    for(var i = 0; i < data.length; i++) {
        it2++;
        if(data[i].IMDB_Rating == rating && data[i].Released_Year == year) {
            it1++;
            console.log("Movie title = " + data[i].Series_Title);
        }
    }
    console.log("Mutiple movies = " + it1);
}