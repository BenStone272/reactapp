import React, { useEffect } from "react";
import { useState } from "react";
import { MovieList } from "./App";
import { useNavigate } from "react-router-dom";

export default function FocusMovie(props) {
  const [similarMovies, SetsimilarMovies] = useState([]);
  const [focus, setFocus] = useState(props.obj);
  const navigate = useNavigate();

  console.log(props);
  useEffect(() => {
    console.log("this should only log once");
    getDetails();
  }, []);

  function getDetails() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWFiMTViNWE0ZTFjZTYxMTY5ZGE1ZTc3Zjk3MjQ4NiIsInN1YiI6IjY0ZmZiMDMxZGI0ZWQ2MTAzMmE3MDViYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CF_vamypSa0m8oF06Hh1JSO7ajPkYf96sWHND_j-SFc",
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/" + props.obj.id + "?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setFocus(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }
  function handleClick() {
    navigate("/similar");
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWFiMTViNWE0ZTFjZTYxMTY5ZGE1ZTc3Zjk3MjQ4NiIsInN1YiI6IjY0ZmZiMDMxZGI0ZWQ2MTAzMmE3MDViYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CF_vamypSa0m8oF06Hh1JSO7ajPkYf96sWHND_j-SFc",
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/" +
        props.obj.id +
        "/recommendations?language=en-US&page=1",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results);
        SetsimilarMovies(data.results);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1>{focus.original_title}</h1>
      <h3>{"Released " + focus.release_date.slice(0, 4)}</h3>
      <img src={"http://image.tmdb.org/t/p/w500/" + focus.poster_path}></img>
      <h3>{focus.tagline}</h3>
      <p>{focus.overview}</p>
      <button onClick={handleClick}>Similar Movies</button>
      <MovieList
        lst={similarMovies}
        SetSelectedMovie={props.SetSelectedMovie}
      />
    </div>
  );
}
