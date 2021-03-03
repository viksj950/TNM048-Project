//Main.js: Function calls and data reading
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//Array with every index that includes numbers
var floatIndex = [2, 4, 6, 8, 14, 15];                              //Poster_Link,Series_Title,Released_Year,Certificate,Runtime,Genre,IMDB_Rating,Overview,var parsedData;                                           //Meta_score,Director,Star1,Star2,Star3,Star4,No_of_Votes,Gross
var loliData = [];
var loliIndex = 0;

d3.csv("/archive/imdb_top_1000.csv").then(function (data) { //.then makes the function only excute if the data reading was succesful

    // Parse the numbers to floats
    var parsedData = parseData(data, floatIndex);
    var top10Data = findTop10Actors(data);
    fillList(parsedData);
    createScatterPlot(parsedData);
    createLollipop(top10Data);
    var resetButton = document.getElementById("restore");

    //Reset plots and info div on click
    resetButton.addEventListener("click", function () { reset(parsedData) });

    var genres = getGenres(parsedData);
   // console.log(genres);

    document.getElementById("info").innerHTML = "<h1 id='infoPlaceholder'>Select movies to view info, please note that movies from 2020 and older movies can miss some data that can corrupt the visualization</h1>";
    document.getElementById("lolli").innerHTML = "<h1 id='lolliPlaceholder'>Select movies for comparison</h1>";

    populationPyramid(top10Data);

});

function parseData(data, floatIndex) {

    var array = data; //Big baddie, copy all data just to set format is bad
    var indexIterator = 0; //iterator for the floatIndex

    for (var r = 0; r < data.length; r++) {
        indexIterator = 0;

        for (var i in data[r]) {
            if (floatIndex.includes(indexIterator)) {   //check to only parse the correct columns as floats (gross, rating, meta_score and so on)
                array[r][i] = data[r][i].replaceAll(",", "");
                array[r][i] = parseFloat(array[r][i]);
            }
            indexIterator++;
        }
    }

    return array;
}

//Function thath fethces the top 20 actors starring in top rated movies
function findTop10Actors(data) {

    var array = [];

    for (var i = 0; i < 20; i++) {
        array[i] = data[i];
    }

    return array;
}

//Redraws the scatterplot with specified singular actor
function redrawPlots(data, actor) {

    d3.select("svg").remove();
    var filteredData = filterByActor(data, actor);
    createScatterPlot(filteredData);

    var barValue = document.getElementById("search_input"); //Change input of search bar when clicking an actor in list
    barValue.value = actor;

}

//Function that resets html elements and resets the plots to default
function reset(data) {

    d3.select("svg").remove();
    d3.select("#lollipop").remove();
    document.getElementById("info").innerHTML = "<h1 id='infoPlaceholder'>Select movies to view info</h1>";
    document.getElementById("lolli").innerHTML = "<h1 id='lolliPlaceholder'>Select movies for comparison</h1>";
    createScatterPlot(data);
}

//Extracts data for the lollipop plot
function addLoliData(data) {

    for (var i = 0; i < data.length; i++) {
        loliData[loliIndex] = data[i];
        loliIndex += 1;
    }
}

//Function to extract genres from the data
function getGenres(data) {
    var genres = [];
    var it = 0;

    for (var i = 0; i < data.length; i++) {
        if (!(genres.includes(data[i]["Genre"])))
            genres[it] = data[i].Genre;
        it++;
    }

    return genres;
}