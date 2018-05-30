$(".movie-info").hide();

//Local storage
if(typeof(Storage) !== "undefined") {
    if(localStorage.mov){
        var retrievedData = localStorage.mov;
        //back to object format
        movies = JSON.parse(retrievedData);
    }
    else{
        var movies=["13 Reasons why","Love Actually","Wall-E","Breaking Bad","Better Call Saul","A Walk to Remember","Life is Beautiful","Friends","How I met your mother"];
        // convert to string
        localStorage.setItem("mov", JSON.stringify(movies));
    }
}

var lowercaseMovie =[];
var fav =[];

function convertToLowerCase(){
    movies.forEach(function(element,i){
        lowercaseMovie[i]=element.toLowerCase();
    })
}

function renderMovieButtons(){
    $("#buttons-view").empty();
    for(var i = 0; i < movies.length; i++){
        btn = $("<button>");
        btn.addClass("movie-btn btn btn-success");
        btn.text(movies[i]);
        btn.attr("data-movie", movies[i]);
        $("#buttons-view").append(btn);

    }
}

function displayGif(){
   
    // active button
    $(".movie-btn").removeClass("color-change");
    $("#movies-view").empty();
    $(".gif-header").empty();
    $(this).addClass("color-change");

    // 1st API: OMDP API FOR MOVIE INFO
    var movie = $(this).attr("data-movie");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(data) {
        //Error handling if movie not found
        if(data.Response==="False"){
            $(".movie-info").hide();
            var div = $("<div class='alert alert-danger'>").html("<strong>"+data.Error+"</strong>");
            $("#movies-view").html(div);
        }
        else{
            var title = data.Title;
            var poster = data.Poster;
            var actors = data.Actors;
            var plot = data.Plot;
            var genre = data.Genre;
            var imdbRating = data.imdbRating;
            var released = data.Released;
            // console.log(title,poster,actors,plot,imdbRating,released);
            $("#title").html('"'+title+'"');
            if(poster==="N/A"){
                var cardPoster = $("<img>").attr("src","assets/images/na.jpeg");
            }
            else{
                var cardPoster = $("<img>").attr("src",poster);
            }
            $("#poster").html(cardPoster);
            $("#actors").html("<span>Actors:</span> "+actors);
            $("#genre").html("<span>Genre:</span> "+genre);
            $("#released").html("<span>Release Date:</span> "+released);
            $("#imdbRating").html("<span>IMDB Rating:</span> "+imdbRating);
            $("#plot").html("<span>Plot:</span> "+plot);
            $(".movie-info").show();


            //2nd API: GIPHY API
            var apiKey = "ahF05f6KjoiQhSOZtwg8yCLLjNtuRdun";
            var limit = 10;
            var queryURL = "https://api.giphy.com/v1/gifs/search?q="+movie+"&api_key="+apiKey+"&limit="+limit;
            console.log(queryURL);

                $.ajax({
                url:queryURL,
                method:"GET"
                }).then(function(response){
                    //if GIF found
                    if(response.data.length>0){
                        var gifHeader = $("<div class='alert alert-info text-center'>").html("GIFs for Search Term : "+movie);
                        $(".gif-header").append(gifHeader);

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
                            var hFav = $("<i>").addClass("far fa-heart favorite");
                            hFav.attr("data-fav", "no");
                            hCaption.append(hRate,hFav);   
                            movieDiv.append(hImageStill,hCaption);
                            $("#movies-view").append(movieDiv);
                        }
                    }
                    //else show error message
                    else{
                        var gifHeader = $("<div class='alert alert-danger text-center'>").html("<strong>No Gifs found! :( </strong>");
                        $(".gif-header").html(gifHeader);
                    }
                });  
            }
        });
}


renderMovieButtons();

//display gif on movie-button click
$("#buttons-view").on("click",".movie-btn",displayGif);
//display gif on "My favorite GIFs" button click
$(".fav-btn").on("click",displayFavGif);

function displayFavGif(){
    $(".movie-btn").removeClass("color-change");
    //clear view
    $("#movies-view").empty();
      //remove movie info
    $(".movie-info").hide();
    //show a header
    var favHeader = $("<div class='alert alert-info text-center'>");
    if(fav.length === 0){
        favHeader.html("<strong>No favorites to display</strong>");
    }
    else{
        favHeader.html("<strong>My Favorite GIFs </strong>");
        //loop through favorite array
        for(var i=fav.length-1;i>=0;i--){
            console.log(i);
            $("#movies-view").append(fav[i]);
        }
    }
    $(".gif-header").html(favHeader);
}


//add movie buttons
$("#add-movie").on("click",function(event){
    event.preventDefault();
    convertToLowerCase();
    var movie = $("#movie-input").val().trim();
    //exclude empty strings and duplicates
    if(movie!=='' && lowercaseMovie.indexOf(movie.toLowerCase())===-1){
        movies.push(movie);
        localStorage.setItem("mov", JSON.stringify(movies));
        renderMovieButtons();
    }   
})

//animate and pause on mouseenter
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

//modal on click with exapanded view
$("#movies-view").on("click", ".gif", function() {
    //pause all gifs when expanded
    $(".gif").each(function() {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    });

    var imgLarge = $("<img>").attr("src",$(this).attr("data-large"));
    imgLarge.addClass("gifLarge");
    $(".modal-body").html(imgLarge);
    $(".modal-title").html($(this).attr("data-title"));
});


//add or remove from favorites
$("#movies-view").on("click", ".favorite", function() {
    var state = $(this).attr("data-fav");
    var div = $(this).parent().parent();
    //add to favorite
    if(state === "no"){
        $(this).removeClass("far").addClass("fas");
        fav.push(div);
        $(this).attr("data-fav", "yes");
    }
    //remove from favorite
    else{
        $(this).removeClass("fas").addClass("far");
        $(this).attr("data-fav", "no");
        var index = fav.indexOf(div);
        fav.splice(index,1);
    }
 
});

