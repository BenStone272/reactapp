import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import "./App.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
let posterSrc = "";
let movieObj = [];
let mainMovie = { type: "Fiat", model: "500", color: "white" };
function App() {
  return (
    <div className="App">
      <Movie />
    </div>
  );
}

function Movie() {
  const [poster, setPoster] = useState(posterSrc);
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  Testprops2(setPoster);
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
  }

  function MovieList(obj) {
    console.log(obj);
    const [numbers, setNumbers] = useState(obj.lst);
    function handleClick(obj) {
      console.log("clicked movie " + obj.original_title);
      ShowPoster(obj);
    }

    const listItems = numbers.map((numbers) => (
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
    return <ul>{listItems}</ul>;
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
          <p>{plot}</p>
        </div>
        <div id="plot" />
      </div>
      <MovieList lst={movieObj} />
    </div>
  );
  function ReactTable(obj) {
    const [lst, setLst] = useState(obj.lst);
    console.log("test");
    console.log(obj.lst);

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {lst.map((val, i) => (
              <tr key={i}>
                <td>
                  <img
                    src={
                      "http://image.tmdb.org/t/p/w500/" + val.poster_path
                    }></img>
                </td>
                <td>{val.original_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

function Testprops(props) {
  props.setPoster("https://m.media-amazon.com/images/I/81RZipc6yOL.jpg");
  console.log("prop tests");
  return <p>test</p>;
}

function Testprops2(props) {
  //props("https://m.media-amazon.com/images/I/81RZipc6yOL.jpg");
  console.log("prop tests2");
  console.log(props);
}

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
