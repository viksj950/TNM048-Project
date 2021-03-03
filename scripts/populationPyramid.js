//populationPyramid.js: Code that creates a population pyramid that compares the rating systems of IMDB and Metascore for each selected movie
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

function populationPyramid(data) {

    var margin = { top: 10, right: 0, bottom: 20, left: 0, middle: 25 },
        height = 350 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right,
        sideWidth = width / 2 - margin.middle; // Determines each side size (width)

    var regionIMDB = sideWidth,
        regionMeta = width - sideWidth;

    //svg
    var svg = d3.select('populationPyramid').append('svg') //selecting the small quadrant on the page
        .attr('width', margin.left + width + margin.right)
        .attr('height', margin.top + height + margin.bottom)
    // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
    //.append('g');
    //.attr('transform', translation(margin.left, margin.top)); //Spacing between the two sides

    var minMaxRatingIMDB = findMinMax(data, "IMDB_Rating"); //to find the scaling for the left x axis
    var minMaxRatingMeta = findMinMax(data, "Meta_Score");  //to find the scaling for the right x axis

    //---------- Scales for the plot for the axis ----------

    var xScaleLeft = d3.scaleLinear()
        .domain([0, minMaxRatingIMDB])
        .range([regionIMDB, 0]); //reverse order for left

    var xScaleRight = d3.scaleLinear()
        .domain([0, minMaxRatingMeta])
        .range([0, regionMeta]);

    var movieNames = getMovieNames(data);

    var yScale = d3.scaleBand()
        .domain(movieNames)
        .range([0, 10 * data.length])          // Change des?

    //---------- Setting up the axis ----------

    var yAxisLeft = d3.svg.axis()
        .scale(yScale)
        .orient('right') //orients to be correct
        .tickSize(4, 0) //adjusts left and right margin
        .tickPadding(margin.middle - 4); //adjusts left and right margin

    var yAxisRight = d3.svg.axis()
        .scale(yScale)
        .orient('left') //orients to be correct for right/left
        .tickSize(4, 0) //adjusts left and right margin
        .tickFormat('');

    var xAxisRight = d3.svg.axis()
        .scale(xScaleRight)
        .orient('bottom')
        .ticks(4)
        .tickFormat(d3.format('%'));

    var xAxisLeft = d3.svg.axis()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        .scale(xScaleLeft.copy().range([pointA, 0]))
        .orient('bottom')
        .ticks(4)
        .tickFormat(d3.format('%'));
}

//Fetches movie names from the selected data 
function getMovieNames(data) {

    var movieTitles = [];

    for (var i = 0; i < data.length; i++) {
        movieTitles[i] = data[i]["Series_Title"];
    }
    return movieTitles;
}