

function fillList(data, list_id){       //function to fill searchlist with actor names in the html
    var stars = ["Star1", "Star2", "Star3","Star4"];
    var temp_actor;

    for(var i = 0; i < data.length; i++){ //lopp through all 1000 movies

        for(var j = 0; j < stars.length; j++){                             //loop through all stars -> Star1->Star2->Star3->Star4
            temp_actor = data.length[i][temp_actor];

            createListElement(temp_actor,list_id);




        }



    }


}

function createListElement(actor,list_id){

    var el = $('<li></li>').html(actor)
    el.appendTo(list_id);
}