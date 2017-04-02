let source = document.querySelector("#tiymdb-nowplaying-template").innerHTML;
let template = Handlebars.compile(source);
let baseImageUrl = "https://image.tmdb.org/t/p/w500";

function getNowPlaying(){
  return fetch("https://api.themoviedb.org/3/movie/now_playing?api_key="+api_key+"&language=en-US&page=1")
  .then(nowPlayingInfo => nowPlayingInfo.json());
}
function placeInNowPlayingTemplate(nowPlayingMovies){
  console.log(nowPlayingMovies)
  let html = nowPlayingMovies.results.map(movie => template(movie)).join('');
  let destination = document.querySelector('.tiymdb-nowplaying');
  destination.innerHTML = html;
}
getNowPlaying()
  .then(placeInNowPlayingTemplate)
  //.then(object => console.log(object))
