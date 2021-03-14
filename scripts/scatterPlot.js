//scatterPlot.js: Code that handles the data and plots it on a scatterplot + brushable
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren


//Written by us
//First iterations was based upon labs + our funcionality
//Final version is a combination of first iteration and help with brush from: https://rajvansia.com/scatterplotbrush-d3-v4.html,
function createScatterPlot(data) {
    //Steps to follow:

    var xAxisMargin = 1;
    var yAxisMargin = 0.1;

    
    var focusMargin = { top: 40, right: 20, bottom: 110, left: 50 },
        contextMargin = { top: 370, right: 30, bottom: 40, left: 50 },
        width = 1400 - focusMargin.left - focusMargin.right,
        focusHeight = 450 - focusMargin.top - focusMargin.bottom,
        contextHeight = 450 - contextMargin.top - contextMargin.bottom;

    //---------- Crate X-axis for focus + context plots (Year) ----------

    var minMaxYear = findMinMax(data, "Released_Year"); //Fetches the min max value of year for all data

    var xFocusScale = d3.scaleLinear()  //xFocusScale = xScale
        .range([0, width])
        .domain([minMaxYear[0] - xAxisMargin, minMaxYear[1] + xAxisMargin]); //By adding +1/-1 we get a margin between lowest data and highest data point

    var xContextScale = d3.scaleLinear()
        .range([0, width])
        .domain(xFocusScale.domain());

    var xFocusAxis = d3.axisBottom(xFocusScale); //xFocusAxis = xAxis

    var xContextAxis = d3.axisBottom(xContextScale);

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

    // append the svg object to the div #scatterPlot which contains the SP elements of the page
    var svg = d3.select("#scatterPlot").append("svg")
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

    //---------- Create tooltip for the scatterplot ----------

    var hoverTooltip = d3.select("#scatterPlot")
        .append("div")
        .attr("class", "scatterTooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var mouseover = function (d, data) {
        hoverTooltip.style("opacity", 1) //set to full visibility

        return findMovies(data, d.IMDB_Rating, d.Released_Year);
    }

    var mousemove = function (d, data) { //, overlappingMovies

        var toolTipText = "";

        if (data.length == 1) {
            toolTipText = data[0].Series_Title;
        }
        else {
            toolTipText = "Movies: " + data.length;
        }

        hoverTooltip.html(toolTipText)  //fetches name of movie(s)
            .style("left", (d3.mouse(d3.event.currentTarget)[0] + 70) + "px") //d3.mouse(this) does not work, because "this" is an instance
            .style("top", (d3.mouse(d3.event.currentTarget)[1]) + "px")
        d3.select(d3.event.currentTarget).attr('r', 10);
    }

    var mouseleave = function (d) {
        hoverTooltip.html("")
        d3.select(d3.event.currentTarget).attr('r', 5)
        hoverTooltip.style("opacity", 0) //make invisible
    }

    var clicked = function (d, data) {
        // Updates displayed movies in info div
        document.getElementById("infoPlaceholder").innerHTML = ""; //Clears placeholder text
        displayMovieInfo(data);

        d3.select("#lollipop").remove();
        document.getElementById("lolli").innerHTML = "";

        d3.select("#populationPyramid").remove();
        document.getElementById("pyramid").innerHTML = "";

        addSelectedData(data);
        createLollipop(selectedData);   //Currently global variables
        populationPyramid(selectedData);
        updateMovieCounter();

        d3.select(d3.event.currentTarget).style("fill", "red")
        //d3.select(d3.event.currentTarget).style("opacity",1)
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
        .style("opacity", .2)
        .style("fill", "white")
        .attr("cx", function (d) { return xFocusScale(d.Released_Year); })
        .attr("cy", function (d) { return yFocusScale(d.IMDB_Rating); })
        .on("mouseover", function (d) { activeMovies = mouseover(d, data); return activeMovies })
        .on("mousemove", function (d) { return mousemove(d, activeMovies); })
        .on("mouseleave", mouseleave)
        .on("click", function (d) { return clicked(d, activeMovies); });

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + focusHeight + ")")
        .call(xFocusAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yFocusAxis);

    focus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5 - focusMargin.left)
        .attr("x", 0 - (focusHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("IMDB-Rating");

    svg.append("text")
        .attr("transform",
            "translate(" + ((width + focusMargin.right + focusMargin.left) / 2) + " ," +
            (focusHeight + focusMargin.top + focusMargin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Year");

    svg.append("text")
        .attr("id", "scatterTitle")
        .attr("transform",
            "translate(" + ((width + focusMargin.right + focusMargin.left) / 2) + " ," + 30 + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("IMDB Top 1000 Movies");

    //Append scatter plot to the brush context area 
    var contextDots = context.append("g");
    contextDots.attr("clip-path", "url(#clip)"); //from lab
    contextDots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dotContext')
        .attr("r", 3)
        .style("opacity", .2)
        .style("fill", "white")
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
function findMovies(data, rating, year) {
    var overlappingMovies = [];
    var it = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i].IMDB_Rating == rating && data[i].Released_Year == year) {
            overlappingMovies[it] = data[i];
            it++;
        }
    }

    return overlappingMovies;
}