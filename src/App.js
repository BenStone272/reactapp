import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
let posterSrc = "";
let movieObj = [];
let movieWatchList = [];
let selectedMovie;

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Movie />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/watchlist" element={<Demo2 />} />
        <Route path="/focus" element={<FocusMovie obj={selectedMovie} />} />
      </Routes>
    </div>
  );
}

function Movie() {
  const [poster, setPoster] = useState(posterSrc);
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  const [release_date, setRelease_date] = useState("");
  function MovieButton() {
    const [val, setval] = useState(0);

    function handleClick() {
      console.log("clicked movie button");
      let element = document.getElementById("term");
      console.log(element.value);
      searchMovie(element.value, ShowPoster);
    }

    return <button onClick={handleClick}>Search</button>;
  }

  function ShowPoster(object) {
    console.log("testing");
    posterSrc = "http://image.tmdb.org/t/p/w500/" + object.poster_path;
    setName(object.original_title);
    setPlot(object.overview);
    console.log(posterSrc);
    setPoster(posterSrc);
    setRelease_date("Released " + object.release_date.slice(0, 4));
  }

  return (
    <div className="container">
      <div className="search">
        <h1>Movie Poster Search</h1>
        <div id="fetch">
          <input type="text" placeholder="enter movie title here" id="term" />
          <MovieButton />
        </div>
        <div id="poster">
          <img className="avatar" src={poster} />
          <p>{name}</p>
          <p>{release_date}</p>
          <p>{plot}</p>
        </div>
        <div id="plot" />
      </div>
      <MovieList lst={movieObj} ShowPoster={ShowPoster} />
    </div>
  );
}

export default App;

function searchMovie(title, showPoster) {
  let sParameter = encodeURIComponent(title.trim());
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWFiMTViNWE0ZTFjZTYxMTY5ZGE1ZTc3Zjk3MjQ4NiIsInN1YiI6IjY0ZmZiMDMxZGI0ZWQ2MTAzMmE3MDViYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CF_vamypSa0m8oF06Hh1JSO7ajPkYf96sWHND_j-SFc",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/search/movie?query=" +
      sParameter +
      "&include_adult=false&language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      showPoster(data.results[0]);
      movieObj = data.results;
      console.log(movieObj);
    })
    .catch((err) => console.error(err));
}

function MovieList(obj) {
  const navigate = useNavigate();
  const tst = obj.lst;
  const [numbers, setNumbers] = useState(tst);
  console.log(numbers);
  console.log("ddddddddddddddddddddddddddddddd");
  function handleClick(obj2) {
    console.log("clicked movie " + obj2.original_title);
    obj.ShowPoster(obj2);
    selectedMovie = obj2;
    console.log(selectedMovie);
    navigate("/focus");
  }

  const listItems = obj.lst.map((numbers) => (
    <li key={numbers.id}>
      <div className="movieContainer">
        <p>{numbers.original_title}</p>
        <button onClick={(e) => handleClick(numbers)}>
          <img
            src={"http://image.tmdb.org/t/p/w500/" + numbers.poster_path}
            width="180"
            height="265"></img>
        </button>
      </div>
    </li>
  ));
  console.log(listItems);
  return <ul>{listItems}</ul>;
}

function Demo() {
  return <h1>This is the demo page</h1>;
}

function Demo2() {
  return <Watchlist lst={movieWatchList} />;
}

function Watchlist(obj) {
  const [lst, setLst] = useState([1]);
  if (lst[0] == 1) {
    setLst([2]);
    getLst(setLst);
  }
  function handleClick() {
    //setTimeout(setLst([3]), 3000);
    setLst([2]);
  }

  return (
    <>
      <MovieList lst={movieWatchList} ShowPoster={obj.ShowPoster} />
    </>
  );
}

async function getLst(setLst) {
  const lst = [78, 11791, 11801, 11826, 348350]; // would call api to get users watchlist here
  let movieLst = [];
  for (let i = 0; i < lst.length; i++) {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" + lst[i] + "?language=en-US",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWFiMTViNWE0ZTFjZTYxMTY5ZGE1ZTc3Zjk3MjQ4NiIsInN1YiI6IjY0ZmZiMDMxZGI0ZWQ2MTAzMmE3MDViYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CF_vamypSa0m8oF06Hh1JSO7ajPkYf96sWHND_j-SFc",
        },
      }
    );
    const json = await response.json();
    console.log(json);
    console.log("loop " + i);
    movieLst.push(json);
  }
  console.log(movieLst);
  console.log(movieLst[0]);
  movieWatchList = movieLst;
  setLst([2]);

  //setLst(["it should have chnaged by now"]);
}

function FocusMovie(props) {
  console.log(props);
  console.log(selectedMovie);
  return <h1>{selectedMovie.original_title}</h1>;
}
