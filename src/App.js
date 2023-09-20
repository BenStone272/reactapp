import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import FocusMovie from "./FocusMovie";
import { useNavigate } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
export const Context = React.createContext();
let posterSrc = "";

let movieWatchList = [];
//this is used for holdinhg list of all users selected movies
export let array = [11];

function App() {
  const [selectedMovie, SetSelectedMovie] = useState("");
  const [movieObj, SetmovieObj] = useState([]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Movie
              SetSelectedMovie={SetSelectedMovie}
              movieObj={movieObj}
              SetmovieObj={SetmovieObj}
            />
          }
        />
        <Route path="/demo" element={<Demo />} />
        <Route
          path="/watchlist"
          element={<Demo2 SetSelectedMovie={SetSelectedMovie} />}
        />
        <Route path="/focus" element={<FocusMovie obj={selectedMovie} />} />
      </Routes>
    </div>
  );
}

function Movie(props) {
  const [poster, setPoster] = useState(posterSrc);
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  const [release_date, setRelease_date] = useState("");

  function MovieButton() {
    function handleClick() {
      console.log("clicked movie button");
      let element = document.getElementById("term");
      console.log(element.value);
      searchMovie(element.value, ShowPoster, props.SetmovieObj);
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
        <h1>Movie Search</h1>
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
      <MovieList
        lst={props.movieObj}
        ShowPoster={ShowPoster}
        SetSelectedMovie={props.SetSelectedMovie}
      />
    </div>
  );
}

export default App;

function searchMovie(title, showPoster, SetmovieObj) {
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
      //showPoster(data.results[0]);
      //movieObj = data.results;
      SetmovieObj(data.results);
    })
    .catch((err) => console.error(err));
}

function MovieList(obj) {
  const navigate = useNavigate();
  const tst = obj.lst;
  const [numbers, setNumbers] = useState(tst);
  function handleClick(obj2) {
    console.log("clicked movie " + obj2.original_title);
    obj.SetSelectedMovie(obj2);
    navigate("/focus");
  }

  function Checkbox(props) {
    const [check, setCheck] = useState(false);
    useEffect(() => {
      if (array.includes(props.movie.id)) {
        setCheck(true);
      }
    }, []);
    const handleChange = (event) => {
      let movieId = Number(event.target.id);
      console.log(event.target.checked);
      if (event.target.checked) {
        if (!array.includes(movieId)) {
          array.push(movieId);
          console.log("✅ Added to list");
          console.log(array);
          setCheck(true);
        }
      } else {
        console.log("⛔️ Removed from list");
        const index = array.indexOf(movieId);
        if (index > -1) {
          // only splice array when item is found
          array.splice(index, 1); // 2nd parameter means remove one item only
          console.log(array);
          setCheck(false);
        }
      }
    };

    return (
      <label>
        <input
          type="checkbox"
          value={false}
          onChange={handleChange}
          id={props.movie.id}
          name="subscribe"
          checked={check}
        />
        Add to Watchlist
      </label>
    );
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
        <Checkbox movie={numbers} />

        <br></br>
      </div>
    </li>
  ));
  console.log(listItems);
  return <ul>{listItems}</ul>;
}

function Demo() {
  return <h1>This is the demo page</h1>;
}

function Demo2(props) {
  return (
    <Watchlist lst={movieWatchList} SetSelectedMovie={props.SetSelectedMovie} />
  );
}

function Watchlist(props) {
  const [lst, setLst] = useState([1]);
  //this only runs once when Watchlist is made not on rerenders
  useEffect(() => {
    console.log("this should only log once");
    getLst(setLst);
  }, []);

  return (
    <>
      <MovieList
        lst={movieWatchList}
        SetSelectedMovie={props.SetSelectedMovie}
      />
    </>
  );
}

async function getLst(setLst) {
  const lst = array; //[78, 11791, 11801, 11826, 348350]; // would call api to get users watchlist here
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
