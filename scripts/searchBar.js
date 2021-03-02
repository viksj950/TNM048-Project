//searchBar.js: Code that handles actor search and filters the data
//Authors: Anton Lindskog, William Malteskog, Viktor Sjögren

function fillList(data) {       //function to fill searchlist with actor names in the html
    console.log("Called fillList");
    var stars = ["Star1", "Star2", "Star3", "Star4"];
    var actors = [];
    var actorIndex = 0;
    var contains = false;
    // Make a container element for the list
    listContainer = document.createElement('div');
    listContainer.setAttribute("id", "actorList_div");
    // Make the list
    listElement = document.createElement('ul');
    listElement.setAttribute("id", "actorList");

    document.getElementById("searchBar").appendChild(listContainer);
    listContainer.appendChild(listElement);

    for (var i = 0; i < data.length; i++) { //lopp through all 1000 movies

        for (var j = 0; j < stars.length; j++) {                             //loop through all stars -> Star1->Star2->Star3->Star4
            //ADD SO THAT WE CHECK IF LIST ALREADY CONTAINS THE ACTOR

            if (actors.includes(data[i][stars[j]])) {                               //actors[k].toUpperCase().indexOf(data[i][stars[j]].toUpperCase())
                contains = true;
                //console.log("true: contains the actor");
            }
            else {
                contains = false;
                //console.log("false: do not contain the actor");
            }
            if (contains == false) {
                actors[actorIndex] = data[i][stars[j]];
                actorIndex += 1;
                //console.log(actorIndex);
            }
        }
    }
    for (var i = 0; i < actorIndex; i++) {
        var listItem = document.createElement('li');
        listItem.innerHTML = actors[i];
        listItem.addEventListener("click", function () { redrawPlots(data, this.innerHTML) });
        listElement.appendChild(listItem);
    }
}

function filterByActor(data, actor) { //Returns data with movies only containing actor
    var filteredMovies = [];
    var filterIndex = 0;
    for (var i = 0; i < data.length; i++) {
        if (containsActor(data[i], actor)) {
            filteredMovies[filterIndex] = data[i];
            filterIndex += 1;
            //console.log("filterIndex:" + filterIndex);
        }
    }

    return filteredMovies;
}

//Check if a movie contains an actor
function containsActor(movie, actor) {
    var stars = ["Star1", "Star2", "Star3", "Star4"];
    //console.log(movie);
    //loop through all stars -> Star1->Star2->Star3->Star4
    for (var i = 0; i < stars.length; i++) {
        if (movie[stars[i]] === actor) {
            return true;
        }
    }
    return false;
}

function actorListSearch() {
    var input = document.getElementById("search_input").value;
    var inputUpper = input.toUpperCase();
    var ulElement = document.getElementById("actorList");
    var liElement = ulElement.getElementsByTagName("li");
    var text;


    for (var i = 0; i < liElement.length; i++) {

        var listIndex = liElement[i];
        text = listIndex.textContent;

        if (text.toUpperCase().indexOf(inputUpper) > -1) {

            liElement[i].style.display = "";
        } else {

            liElement[i].style.display = "none";
        }
    }
}