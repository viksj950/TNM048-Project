//movieInfo.js: Code that fetches clicked data from scatterplot and shows it in infodiv
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

//Written by us
function displayMovieInfo(data) {   //generates movie list when scatterplot is clicked

    var n_movies = data.length;
    var list_div = document.getElementById("info"); //get the div which will contain the list
    var listElement = document.createElement('ul'); //creat the ul context

    listElement.setAttribute("id", "movieList")
    //listElement = document.getElementById("movieList");
    list_div.appendChild(listElement); //add list to div

    var movieName = "";

    for (var i = 0; i < n_movies; i++) {

        //If we have multiple movies show compact info
        // if(n_movies == 1 ) {
        movieName = data[i]["Series_Title"]; //used for the remove option

        var posterURL = data[i]["Poster_Link"]; //fetches the poster for selected movie object(s)

        var image = new Image(); //create image object
        image.src = posterURL; ///attach to URL link

        //Create a list item for each movie object
        var listItem = document.createElement('li');

        //Display limited info about each movie and also check if data is missing from Gross so that it is visible to the user

        if (isNaN(data[i]["Meta_Score"]) && isNaN(data[i]["Gross"])) {
            console.log("both")

            listItem.innerHTML = "<b>" + data[i]["Series_Title"] + "</b>, " + data[i]["Released_Year"] + ", " + data[i]["Star1"] + ", " + data[i]["Star2"] + ", " + data[i]["Star3"]
                + ", " + data[i]["Star4"] + "<br> IMDB-Rating: " + data[i]["IMDB_Rating"] + "<br> Meta Score: " + "<span id='nodataMeta'> NO DATA </span> " + "<br> Revenue: <span id='nodataGross'> NO DATA </span>" + " <h3> " + data[i]["Overview"] + "</h3>";
            listElement.appendChild(image);             //append movie poster to each object
            listElement.appendChild(listItem);

            //Reset plots and info div on click
            image.addEventListener("click", function () { deselectMovie(this.src, data) });
        }
        else if (isNaN(data[i]["Gross"])) {
            console.log("gross")
            listItem.innerHTML = "<b>" + data[i]["Series_Title"] + "</b>, " + data[i]["Released_Year"] + ", " + data[i]["Star1"] + ", " + data[i]["Star2"] + ", " + data[i]["Star3"]
                + ", " + data[i]["Star4"] + "<br> IMDB-Rating: " + data[i]["IMDB_Rating"] + "<br> Meta Score: " + data[i]["Meta_Score"] + " <br> Revenue: <span id='nodataGross'> NO DATA </span>" + " <h3> " + data[i]["Overview"] + "</h3>";
            listElement.appendChild(image);             //append movie poster to each object
            listElement.appendChild(listItem);

            //Reset plots and info div on click
            image.addEventListener("click", function () { deselectMovie(this.src, data) });
        }
        else {
            console.log("fine")
            listItem.innerHTML = "<b>" + data[i]["Series_Title"] + "</b>, " + data[i]["Released_Year"] + ", " + data[i]["Star1"] + ", " + data[i]["Star2"] + ", " + data[i]["Star3"]
                + ", " + data[i]["Star4"] + "<br> IMDB-Rating: " + data[i]["IMDB_Rating"] + "<br> Meta Score: " + data[i]["Meta_Score"] + "<br> Revenue: $" + data[i]["Gross"] + " <br><h3> "
                + data[i]["Overview"] + "</h3>";
            
            listElement.appendChild(image);             //append movie poster to each object
            listElement.appendChild(listItem);

            //Reset plots and info div on click
            image.addEventListener("click", function () { deselectMovie(this.src, data) });
            //this.b
        }

        //    }
        //If we only have one movie show full information
        // else {

        // var posterURL = data[i]["Poster_Link"]; //fetches the poster for selected movie object(s)

        // var image = new Image(); //create image object
        // image.src = posterURL;

        // //Create a list item for each movie object
        // var listItem = document.createElement('li');

        // //Display full info about each movie
        // listItem.innerHTML = data[i]["Series_Title"];
        // listElement.appendChild(image);             //append movie poster to each object
        // listElement.appendChild(listItem);


        // }

    }
}

function updateMovieCounter() {

    // listElement = document.createElement('ul');
    // listElement.setAttribute("id", "actorList");

    document.getElementById("movieCount").innerHTML = "<h4 id = 'counter'> Selected movies: " + selectedDataIndex + "</h4>";   //Movie count

}