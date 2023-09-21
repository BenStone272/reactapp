import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MovieList } from "./App";

export function Similar(props) {
  const [lst, setLst] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  function getData() {
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
        props.selectedMovie.id +
        "/recommendations?language=en-US&page=1",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results);
        setLst(data.results);
      })
      .catch((err) => console.error(err));
  }
  return (
    <>
      <MovieList lst={lst} SetSelectedMovie={props.SetSelectedMovie} />
    </>
  );
}
