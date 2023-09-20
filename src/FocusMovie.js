import React, { useEffect } from "react";
import { useState } from "react";
import { selectedMovie } from "./App";

export default function FocusMovie(props) {
  const [focus, setFocus] = useState({});
  useEffect(() => {
    console.log("this should only log once");
  }, []);
  return (
    <div>
      <h1>{selectedMovie.original_title}</h1>;
      <img
        src={
          "http://image.tmdb.org/t/p/w500/" + selectedMovie.poster_path
        }></img>
    </div>
  );
}
