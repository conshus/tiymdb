//Initialize variables
let source = document.querySelector("#tiymdb-nowplaying-template").innerHTML;
let template = Handlebars.compile(source);
let source2 = document.querySelector("#tiymdb-actors-template").innerHTML;
let template2 = Handlebars.compile(source2);
let baseImageUrl = "https://image.tmdb.org/t/p/w500";
let nowPlayingArrayCombined = [];
let actorsArrayCombined = [];
let actorBioAndFilmInfo = [];

//Start
getNowPlaying()
  .then(object => object.results.map(getMovieInfo))
  .then(moviePromises => Promise.all(moviePromises))
  .then(object => object.map(addNowPlayingMovies))
getNowPlaying()
  .then(object => object.results.map(getMovieCredits))
  .then(moviePromises => Promise.all(moviePromises))
  .then(object => object.map(combineActors))
  .then(placeInNowPlayingTemplate)

//Section for adding Actor Info
function placeInActorsTemplate(){
  console.log(actorBioAndFilmInfo)
  //let html = actorBioAndFilmInfo.map(actors => template2(actors)).join('');
  let html = template2(actorBioAndFilmInfo);
  let destination = document.querySelector('.tiymdb-actors');
  destination.innerHTML = html;
  let closeToggle = document.querySelector("#close");
  closeToggle.addEventListener("click", toggleSlider);
}
function combineActorInfo(actorInfo){
  console.log(actorInfo)
  actorBioAndFilmInfo = ({
    name: actorInfo.name,
    picture: baseImageUrl+actorInfo.profile_path,
    bio: actorInfo.biography,
    birthday: actorInfo.birthday,
    birthplace: actorInfo.place_of_birth
  })
  placeInActorsTemplate();
}
function combineActorMovies(moviesInfo){
  console.log(moviesInfo)
  actorBioAndFilmInfo.movies = moviesInfo;
  placeInActorsTemplate();
}
function getActorInfo(event){
  let actorPressed = event.target.dataset.actorid;
  fetch("https://api.themoviedb.org/3/person/"+actorPressed+"?api_key="+api_key+"&language=en-US&page=1")
    .then(actorInfo => actorInfo.json())
    .then(combineActorInfo)
  fetch("https://api.themoviedb.org/3/person/"+actorPressed+"/movie_credits?api_key="+api_key+"&language=en-US&page=1")
    .then(actorInfo => actorInfo.json())
    .then(combineActorMovies)
    toggleSlider();
}

//Get the Movies Now Playing
function getNowPlaying(){
  return fetch("https://api.themoviedb.org/3/movie/now_playing?api_key="+api_key+"&language=en-US&page=1")
  .then(nowPlayingInfo => nowPlayingInfo.json());
}

//Add movie info to a single array
function addNowPlayingMovies(movieObject){
  nowPlayingArrayCombined.push({
    title: movieObject.title,
    posterPic: baseImageUrl+movieObject.poster_path,
    overview: movieObject.overview,
    rating: movieObject.vote_average,
    releaseDate: movieObject.release_date,
    runtime: movieObject.runtime,
    genre: movieObject.genres
  })
}
function combineActors(castObject){
  actorsArrayCombined.push({cast: castObject.cast, crew: castObject.crew})
  addActors(actorsArrayCombined)
}
function addActors(actorsObject){
  for (i=0; i<actorsObject.length; i++){
    nowPlayingArrayCombined[i].cast = actorsObject[i]
  }
}
function placeInNowPlayingTemplate(){
  let html = nowPlayingArrayCombined.map(movie => template(movie)).join('');
  let destination = document.querySelector('.tiymdb-nowplaying');
  destination.innerHTML = html;
  //Add event listeners for actor buttons
  let buttons = document.querySelectorAll(".actorButton");
  for (i=0; i<buttons.length; i++){
    let button = buttons[i];
    button.addEventListener("click", getActorInfo);
  }
}

//Get Movie Info
function getInfo(url, params){
  return fetch("https://api.themoviedb.org/3/"+url+"?api_key="+api_key+"&"+params)
  .then(movieInfo => movieInfo.json());
}

//Get Movie Details
function getMovieInfo(movieObject){
  return getInfo("movie/"+movieObject.id);
}

//Get Movie Cast and Crew
function getMovieCredits(movieObject){
  return getInfo("movie/"+movieObject.id+"/credits");
}

//Toggle for Actor Info Slider
function toggleSlider(){
  let slide = document.getElementById("slider").style;
  if (slide.transform == "translateY(0%)"){
    slide.transform = "translateY(100%)";
    slide.display = "none";
  }
  else {
    slide.transform = "translateY(0%)";
    slide.display = "block";
  }
}
