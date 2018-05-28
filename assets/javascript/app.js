
if(typeof(Storage) !== "undefined") {
    if(localStorage.mov){
        var retrievedData = localStorage.mov;
        //back to object format
        movies = JSON.parse(retrievedData);
    }
    else{
        console.log("not stored");
        var movies=["13 Reasons why","Wall-E","Breaking Bad","A Walk to Remember","Life is Beautiful","Friends","How I met your mother"];
        // convert to string
        localStorage.setItem("mov", JSON.stringify(movies));
    }
}
var genericMovie =[];



function convertToLowerCase(){
    movies.forEach(function(element,i){
       genericMovie[i]=element.toLowerCase();
    })
}

function renderMovieButtons(){
    $("#buttons-view").empty();
    for(var i = 0; i < movies.length; i++){
        var btn = $("<button>");
        btn.addClass("movie-btn btn btn-success");
        btn.text(movies[i]);
        btn.attr("data-movie", movies[i]);
        $("#buttons-view").append(btn);

    }
}

function displayGif(){

    console.log($(this));
    $(".movie-btn").removeClass("color-change");
    $(this).addClass("color-change");
    var movie = $(this).attr("data-movie");
  

    var apiKey = "ahF05f6KjoiQhSOZtwg8yCLLjNtuRdun";
    var limit = 10;
    var queryURL = "https://api.giphy.com/v1/gifs/search?q="+movie+"&api_key="+apiKey+"&limit="+limit;
    console.log(queryURL);

        $.ajax({
        url:queryURL,
        method:"GET"
        }).then(function(response){

            $("#movies-view").empty();
        

            console.log(response);    
            for(var i = 0; i < limit;i++){
                var movieDiv = $("<div>");
                movieDiv.addClass("movie img-thumbnail");
                var imageSmallStill = response.data[i].images.fixed_height_still.url;
                var imageSmall = response.data[i].images.fixed_height.url;
                var imageLarge = response.data[i].images.downsized_large.url;
                var title = response.data[i].title;
                var rating = response.data[i].rating;
                var hTitle = $("<p>").text(title);
                var hImageStill = $("<img>").attr({
                    "src":imageSmallStill,
                    "data-state":"still",
                    "data-animate":imageSmall,
                    "data-still":imageSmallStill,
                    "data-large":imageLarge,
                    "data-title":title,
                    "data-toggle":"modal",
                    "data-target":".exampleGif"
                });
                hImageStill.addClass("gif img-fluid");
                var hCaption = $("<div>").addClass("caption text-center").text("Rating: ");
                var hRate = $("<span>").text(rating);
                hCaption.append(hRate);
                
                movieDiv.append(hImageStill,hCaption);
                $("#movies-view").append(movieDiv);
            }
        });  
}


renderMovieButtons();


$("#buttons-view").on("click",".movie-btn",displayGif);

$("#add-movie").on("click",function(event){
    event.preventDefault();
    convertToLowerCase();
    var movie = $("#movie-input").val().trim();
    if(movie!=='' && genericMovie.indexOf(movie.toLowerCase())===-1){
        movies.push(movie);
        localStorage.setItem("mov", JSON.stringify(movies));
        renderMovieButtons();
    }   
})

$("#movies-view").on("mouseenter", ".gif", function() {
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  });


$("#movies-view").on("click", ".gif", function() {

    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
   
    var imgLarge = $("<img>").attr("src",$(this).attr("data-large"));
    imgLarge.addClass("gifLarge");
    $(".modal-body").html(imgLarge);
    $(".modal-title").html($(this).attr("data-title"));

});
