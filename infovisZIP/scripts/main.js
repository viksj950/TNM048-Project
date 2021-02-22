//Main.js: Function calls and data reading
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//Array with every index that includes numbers
var floatIndex = [2,4,6,8,14,15];                              //Poster_Link,Series_Title,Released_Year,Certificate,Runtime,Genre,IMDB_Rating,Overview,
                                            //Meta_score,Director,Star1,Star2,Star3,Star4,No_of_Votes,Gross

d3.csv("/archive/imdb_top_1000.csv").then(function(data) { //.then makes the function only excute if the data reading was succesfull
    
    // Parse the numbers to floats
    var parsedData = parseData(data, floatIndex);
    //fillList(parsedData,'#actor_list_search');
    createScatterPlot(parsedData);

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

function moviePosterChange() {

    document.getElementById("moviePoster").src = "must_resist.jpg";
    console.log("Waif");
}

