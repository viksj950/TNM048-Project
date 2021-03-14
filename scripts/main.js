//Main.js: Function calls and data reading
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//Written by us
//Array with every index that includes numbers
var floatIndex = [2, 4, 6, 8, 14, 15];                              //Poster_Link,Series_Title,Released_Year,Certificate,Runtime,Genre,IMDB_Rating,Overview,var parsedData;                                           //Meta_score,Director,Star1,Star2,Star3,Star4,No_of_Votes,Gross
var selectedData = [];
var selectedDataIndex = 0;

d3.csv("/archive/imdb_top_1000.csv").then(function (data) { //.then makes the function only excute if the data reading was succesful

    // Parse the numbers to floats
    var parsedData = parseData(data, floatIndex);
    var top20Data = findTop10Actors(data);
    fillList(parsedData);
    createScatterPlot(parsedData);
    createLollipop(top20Data);
    var resetButton = document.getElementById("restore");

    //Reset plots and info div on click
    resetButton.addEventListener("click", function () { reset(parsedData) });

    var genres = getGenres(parsedData);
    // console.log(genres);

    document.getElementById("info").innerHTML = "<h1 id='infoPlaceholder'>Select movies to view info</h1>";
    document.getElementById("lolli").innerHTML = "<h1 id='lolliPlaceholder'>Select movies for revenue comparison</h1>";
    document.getElementById("pyramid").innerHTML = "<h1 id='pyramidPlaceholder'>Select movies for rating comparison</h1>";

    var emergencyButton = document.getElementById("emergency");
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
    document.getElementById("scatterTitle").innerHTML = "Selected actor: " + actor;
    var barValue = document.getElementById("search_input"); //Change input of search bar when clicking an actor in list
    barValue.value = actor;

}

//Function that resets html elements and resets the plots to default
function reset(data) {

    selectedData = [];
    selectedDataIndex = 0;
    updateMovieCounter();

    d3.select("svg").remove();
    d3.select("#lollipop").remove();
    d3.select("#populationPyramid").remove();
    document.getElementById("info").innerHTML = "<h1 id='infoPlaceholder'>Select movies to view info</h1>";
    document.getElementById("lolli").innerHTML = "<h1 id='lolliPlaceholder'>Select movies for revenue comparison</h1>";
    document.getElementById("pyramid").innerHTML = "<h1 id='lolliPlaceholder'>Select movies for rating comparison</h1>";
    createScatterPlot(data);
}

//Extracts data for the lollipop plot
function addSelectedData(data) {

    for (var i = 0; i < data.length; i++) {
        selectedData[selectedDataIndex] = data[i];
        selectedDataIndex += 1;
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
//To removed (randomizes sound)
function emergencyPtr() {

    var hmm = (Math.floor(Math.random() * 8));
    console.log(hmm);
    if (hmm === 3 || hmm === 4 || hmm === 5) {
        var succ = new Audio("images/succ.mp3");
        succ.play();
    }
    else if (hmm === 0 || hmm === 1 || hmm === 2) {
        var succ = new Audio("images/movie_1.mp3");
        succ.play();
    }
    else if (hmm == 6 || hmm == 7) { //Bad luck m8
        var succ = new Audio("images/fish.mp3");
        succ.play();

        document.getElementById('xd').src = "images/parrot.gif";
        document.getElementById('xd').style.width = "1000px"
        document.getElementById('xd').style.height = "1000px"
        document.getElementById('xd').style.position = "relative";
        document.getElementById('xd').style.zIndex = 5;
    }
}

function deselectMovie(url, data) {

    var newData = [];
    var newDataIndex = 0;

    for (var i = 0; i < selectedData.length; i++) {
        if (!(selectedData[i].Poster_Link === url)) {
            newData[newDataIndex] = selectedData[i];
            newDataIndex++;
        }
    }

    selectedData = newData;
    selectedDataIndex = newDataIndex;

    if (selectedData.length == 0) {
        reset(data);
    }
    else {

        d3.select("#lollipop").remove();
        d3.select("#populationPyramid").remove();
        
        document.getElementById("pyramid").innerHTML = "";
        document.getElementById("info").innerHTML = "";
        document.getElementById("info").innerHTML = "<h1 id='infoPlaceholder'></h1>";

        console.dir(selectedData)
        displayMovieInfo(selectedData);
        createLollipop(selectedData);
        populationPyramid(selectedData);
        updateMovieCounter();
    }
}