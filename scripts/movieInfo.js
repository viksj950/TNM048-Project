//movieInfo.js: Code that fetches clicked data from scatterplot and shows it in infodiv
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

function displayMovieInfo(data) {   //generates movie list when scatterplot is clicked
                
    var n_movies = data.length;
    var list_div = document.getElementById("info"); //get the div which will contain the list
    var listElement = document.createElement('ul'); //creat the ul context
    
    listElement.setAttribute("id","movieList")
    //listElement = document.getElementById("movieList");
    list_div.appendChild(listElement); //add list to div

    for (var i = 0; i < n_movies; i++) {

        //If we have multiple movies show compact info
       // if(n_movies == 1 ) {

            var posterURL = data[i]["Poster_Link"]; //fetches the poster for selected movie object(s)

            var image = new Image(); //create image object
            image.src = posterURL;

            //Create a list item for each movie object
            var listItem = document.createElement('li');

            //Display limited info about each movie
            listItem.innerHTML = data[i]["Series_Title"] + ", " + data[i]["Released_Year"] + ", <b>" +  data[i]["Star1"] + ",</b> Revenue: "+ data[i]["Gross"] + " $ <br><h3><em> " + data[i]["Overview"] + "</em></h3>"; 
            listElement.appendChild(image);             //append movie poster to each object
            listElement.appendChild(listItem);

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