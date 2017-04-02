let source = document.querySelector("#tiymdb-nowplaying-template").innerHTML;
let template = Handlebars.compile(source);
let source2 = document.querySelector("#tiymdb-actors-template").innerHTML;
let template2 = Handlebars.compile(source2);
let baseImageUrl = "https://image.tmdb.org/t/p/w500";
let nowPlayingArrayCombined = [];
let actorsArrayCombined = [];
let actorBioAndFilmInfo = [];

function placeInActorsTemplate(){
  console.log(actorBioAndFilmInfo)
  //let html = actorBioAndFilmInfo.map(actors => template2(actors)).join('');
  let html = template2(actorBioAndFilmInfo);
  let destination = document.querySelector('.tiymdb-actors');
  destination.innerHTML = html;
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
function getActorInfo(event){
  //console.log(event)
  let actorPressed = event.target.dataset.actorid;
  //console.log(actorPressed);
  fetch("https://api.themoviedb.org/3/person/"+actorPressed+"?api_key="+api_key+"&language=en-US&page=1")
    .then(actorInfo => actorInfo.json())
    .then(combineActorInfo)

  fetch("https://api.themoviedb.org/3/person/"+actorPressed+"/movie_credits?api_key="+api_key+"&language=en-US&page=1")
    .then(actorInfo => actorInfo.json())
    //.then(combineActorInfo)
    .then(object => console.log(object))
}
function getNowPlaying(){
  return fetch("https://api.themoviedb.org/3/movie/now_playing?api_key="+api_key+"&language=en-US&page=1")
  .then(nowPlayingInfo => nowPlayingInfo.json());
}
function addNowPlayingMovies(movieObject){
  //console.log(movieObject)
  nowPlayingArrayCombined.push({
    title: movieObject.title,
    posterPic: baseImageUrl+movieObject.poster_path,
    overview: movieObject.overview,
    rating: movieObject.vote_average,
    releaseDate: movieObject.release_date,
    runtime: movieObject.runtime,
    genre: movieObject.genres
  })
  //console.log(nowPlayingArrayCombined)
}
function combineActors(castObject){
  actorsArrayCombined.push({cast: castObject.cast, crew: castObject.crew})
  //console.log(actorsArrayCombined)
  addActors(actorsArrayCombined)
}
function addActors(actorsObject){
  //console.log(castObject.cast)
  //console.log(actorsObject)
  //console.log(castObject.length)
  for (i=0; i<actorsObject.length; i++){
    nowPlayingArrayCombined[i].cast = actorsObject[i]
  }
  //console.log(nowPlayingArrayCombined)
}
//function placeInNowPlayingTemplate(nowPlayingMovies){
function placeInNowPlayingTemplate(){
  //console.log(nowPlayingMovies)
  //let html = nowPlayingMovies.results.map(movie => template(movie)).join('');
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

function getInfo(url, params){
  //Get Movie Info
  //fetch("https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+movieTitle)
  //console.log(url.id)
  return fetch("https://api.themoviedb.org/3/"+url+"?api_key="+api_key+"&"+params)
  .then(movieInfo => movieInfo.json());
}
function getMovieInfo(movieObject){
  //console.log(movieObject);
  return getInfo("movie/"+movieObject.id);
  //return getInfo(movieObject);
}
function getMovieCredits(movieObject){
  //console.log(movieObject);
  return getInfo("movie/"+movieObject.id+"/credits");
  //return getInfo(movieObject);
}
//getNowPlaying()
  //.then(object => object.results.map(addNowPlayingMovies))
  //.then(placeInNowPlayingTemplate)
getNowPlaying()
  .then(object => object.results.map(getMovieInfo))
  .then(moviePromises => Promise.all(moviePromises))
  .then(object => object.map(addNowPlayingMovies))
  //.then(object => console.log(object))
getNowPlaying()
  .then(object => object.results.map(getMovieCredits))
  .then(moviePromises => Promise.all(moviePromises))
  .then(object => object.map(combineActors))
  .then(placeInNowPlayingTemplate)
  //.then(object => console.log(object))
  //.then(placeInNowPlayingTemplate)
/*getNowPlaying()
  .then(object => object.results.map(getMovieInfo))
  .then(moviePromises => Promise.all(moviePromises))
  .then(object => object.map(placeInActorsTemplate))
  //.then(object => console.log(object))
*/
