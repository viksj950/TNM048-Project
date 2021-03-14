//populationPyramid.js: Code that creates a population pyramid that compares the rating systems of IMDB and Metascore for each selected movie
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren


//Written by us
//Help from multiple sources, primary source: http://jsfiddle.net/toq1yLks/
function populationPyramid(data) {

    var margin = { top: 40, right: 20, bottom: 20, left: 20, middle: 0 }, //middle handles two sides
        height = 400 - margin.top - margin.bottom,
        width = 450 - margin.left - margin.right,
        regionWidth = width / 2 - margin.middle; // Determines each side size (width)

    var regionLeft = regionWidth,
        regionRight = width - regionWidth;

    //svg
    var svg = d3.select('#pyramid').append('svg') //selecting the small quadrant on the page
        .attr('width', margin.left + width + margin.right)
        .attr('height', margin.top + height + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Spacing between the two sides

    var tooltip = d3.select("#pyramid")
        .append("div")
        .attr("class", "pyramidTooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var mouseover = function (d) {
        tooltip.style("opacity", 1) //set to full visibility
    }

    var mousemoveLeft = function (d) { //, overlappingMovies

        var toolTipText = "IMDB-rating: " + d.IMDB_Rating + ", Metascore: " + d.Meta_Score;

        tooltip.html(toolTipText)
            .style("left", (-d3.mouse(d3.event.currentTarget)[0] + 1160) + "px") //d3.mouse(this) does not work, because "this" is an instance
            .style("top", (d3.mouse(d3.event.currentTarget)[1] + 10) + "px")
        d3.select(d3.event.currentTarget).attr('r', 10);
    }

    var mousemoveRight = function (d) { //, overlappingMovies

        var toolTipText = "IMDB-rating: " + d.IMDB_Rating + ", Metascore: " + d.Meta_Score;

        tooltip.html(toolTipText)
            .style("left", (d3.mouse(d3.event.currentTarget)[0] + 1160) + "px") //d3.mouse(this) does not work, because "this" is an instance
            .style("top", (d3.mouse(d3.event.currentTarget)[1] + 10) + "px")
        d3.select(d3.event.currentTarget).attr('r', 10);
    }

    var mouseleave = function (d) {
        tooltip.html("")
        d3.select(d3.event.currentTarget).attr('r', 5)
        tooltip.style("opacity", 0) //make invisible
    }

    var minMaxRatingIMDB = findMinMax(data, "IMDB_Rating"); //to find the scaling for the left x axis
    var minMaxRatingMeta = findMinMax(data, "Meta_Score");  //to find the scaling for the right x axis

    //---------- Scales for the plot for the axis ----------

    var xScaleLeft = d3.scaleLinear()
        .domain([0, 10])
        .range([regionWidth, 0]); //reverse order for left

    var xScaleRight = d3.scaleLinear()
        .domain([0, 100])
        .range([0, regionWidth]);

    var movieNames = getMovieNames(data);

    var yScale = d3.scaleBand()
        .domain(movieNames)
        .range([0, 15 * data.length]);          // Change des?

    //---------- Setting up the axis ----------

    var xAxisLeft = d3.axisBottom(xScaleLeft)
        //.range([regionLeft, 0])// REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        // .scale(xScaleLeft.copy().range([regionLeft, 0]))
        // .orient('bottom')
        .ticks(5)

    var xAxisRight = d3.axisBottom(xScaleRight)
        .ticks(5);

    var yAxisLeft = d3.axisLeft(yScale)
        .tickSize(4, 0) //adjusts left and right margin
        .tickPadding(margin.middle - 4); //adjusts left and right margin

    var yAxisRight = d3.axisRight(yScale)
        .tickSize(4, 0) //adjusts left and right margin
        .tickFormat('');

    //---------- Grouping the two sides of the plot ----------
    var leftBarGroup = svg.append('g')
        .attr("transform", "translate(" + regionLeft + "," + 0 + ")" + "scale(-1,1)"); // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
    var rightBarGroup = svg.append('g')
        .attr("transform", "translate(" + regionRight + "," + 0 + ")");

    //---------- Applying description text to the plot ----------
    // Left plot text
    svg.append("svg:text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -10)
        .text("IMDB Rating")
        .style("font-size", "12px")
        .style("fill", "white");

    // Right plot text
    svg.append("svg:text")
        .attr("class", "title")
        .attr("x", width - 60)
        .attr("y", -10)
        .text("Meta Score")
        .style("font-size", "12px")
        .style("fill", "white");

    //Y-axis text
    svg.append("svg:text")
        .attr("class", "title")
        .attr("x", width / 2 - 15)
        .attr("y", -10)
        .text("Movie")
        .style("font-size", "12px")
        .style("fill", "white");

    //--------- Draw axes ---------

    svg.append('g')
        .attr('class', 'left x-axis')
        .attr("transform", "translate(" + 0 + "," + (data.length * 15) + ")")
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'right x-axis')
        .attr("transform", "translate(" + regionRight + "," + (data.length * 15) + ")")
        .call(xAxisRight);

    svg.append('g')
        .attr('class', 'left y-axis')
        .attr("transform", "translate(" + regionLeft + "," + 0 + ")")
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    svg.append('g')
        .attr('class', 'right y-axis')
        .attr("transform", "translate(" + regionRight + ", " + 0 + ")")
        .call(yAxisRight);

    //---------- Draw bars ----------

    leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function (d) { return yScale(d.Series_Title); })
        .attr('width', function (d) { return xScaleLeft(10 - d.IMDB_Rating); }) //"10-" is for the IMBD_Rating system to invert scale after reversing the x-axis
        .attr('height', yScale.bandwidth())
        .on("mouseover", mouseover) //{ overlappingMovies = mouseover(d, data); return overlappingMovies}
        .on("mousemove", mousemoveLeft)
        .on("mouseleave", mouseleave);

    rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function (d) { return yScale(d.Series_Title); })
        .attr('width', function (d) { return xScaleRight(d.Meta_Score); })
        .attr('height', yScale.bandwidth())
        .on("mouseover", mouseover) //{ overlappingMovies = mouseover(d, data); return overlappingMovies}
        .on("mousemove", mousemoveRight)
        .on("mouseleave", mouseleave);

}

//Fetches movie names from the selected data 
function getMovieNames(data) {

    var movieTitles = [];

    for (var i = 0; i < data.length; i++) {
        movieTitles[i] = data[i]["Series_Title"];
    }
    return movieTitles;
}