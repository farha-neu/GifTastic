var movies=["Wall-E","Inception","Friends","How I met your mother","Breaking Bad", "A Walk to Remember","Life is Beautiful"];
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

  
    var movie = $(this).attr("data-movie");
    // var qURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
   
    // $.ajax({
    //     url:qURL,
    //     method:"GET"
    // }).then(function(data){
    //     $("#movies-view").empty();  
    //     console.log(data);
    //     var mDiv = $("<div>");
    //     mDiv.addClass("movieOMBD");
    //     var poster = data.Poster;
    //     var actors = data.Actors;
    //     var plot = data.Plot;
    //     console.log(poster,actors,plot);
    //     var hPoster = $("<img>").attr("src",poster);
    //     var hActors = $("<p>").text(actors);
    //     var hPlot = $("<p>").text(plot);
    //     if(poster!=='N/A'){
    //         mDiv.append(hPoster);
    //     }
    //     mDiv.append(hActors,hPlot);
    //     $("#movies-view").append(mDiv);

        var apiKey = "gSO37gi7qmY9JPzPea7Z67N6B0d7CzjS";
        var limit = 10;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+movie+"&api_key="+apiKey+"&limit="+limit;

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
                    var imageLargeStill = response.data[i].images.downsized_still.url;
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
                    var hCaption = $("<div>").addClass("caption");
                    var hRating = $("<p class='text-center'>").text("Rating: ");
                    var hRate = $("<span>").text(rating);
                    hRating.append(hRate);
                    hCaption.append(hRating);
                    
                    movieDiv.append(hImageStill,hCaption);
                    $("#movies-view").append(movieDiv);
                }
            });
    //  });  
}


renderMovieButtons();


$(document).on("click",".movie-btn",displayGif);

$("#add-movie").on("click",function(event){
    event.preventDefault();
    convertToLowerCase();
    var movie = $("#movie-input").val().trim();
    if(movie!=='' && genericMovie.indexOf(movie.toLowerCase())===-1){
        movies.push(movie);
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
