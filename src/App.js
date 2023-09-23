import React from "react";
import { useState, createContext, useContext } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import FocusMovie from "./FocusMovie";
import { useNavigate } from "react-router-dom";
import { Similar } from "./Similar";
import "@aws-amplify/ui-react/styles.css";
import { Login } from "./Login";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";

const root = ReactDOM.createRoot(document.getElementById("root"));
export const UserContext = createContext();
let posterSrc = "";

let movieWatchList = [];
//this is used for holdinhg list of all users selected movies
//export let array = [11];
async function getIdToken(setToken, setEmail, setArray, email, token) {
  try {
    const session = await Auth.currentSession();
    const jwtToken = session.getIdToken().getJwtToken();
    const accessToken = session.getAccessToken().getJwtToken();
    const tokenPayload = JSON.parse(atob(jwtToken.split(".")[1]));
    console.log(tokenPayload);
    console.log("JWT Token:", jwtToken);
    console.log("Access Token:", accessToken);
    setEmail(tokenPayload.email);
    console.log(tokenPayload.email);
    console.log(email);
    setToken(jwtToken);
    getList(jwtToken, setArray, tokenPayload.email);
  } catch (error) {
    console.error("Error:", error);
  }
}
function App() {
  const [selectedMovie, SetSelectedMovie] = useState("");
  const [movieObj, SetmovieObj] = useState([]);
  const [token, setToken] = useState("1");
  const [array, setArray] = useState([]);
  const [email, setEmail] = useState("");
  console.log(token);

  useEffect(() => {
    getIdToken(setToken, setEmail, setArray, email, token);
  }, []);
  function updateDB(jwtToken, myArray, email) {
    const lambdaUrl =
      "https://ujh4wq0bwd.execute-api.us-east-1.amazonaws.com/prod";
    const bearerToken = jwtToken; // Replace with your bearer token

    const id = email; // The ID value you want to update
    const new_value = myArray.toString(); // The new value you want to set

    fetch(lambdaUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the request header
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: id,
        new_value: new_value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Update successful");
        } else {
          console.error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return (
    <UserContext.Provider
      value={{ setToken, token, array, setArray, updateDB, email }}>
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
          <Route path="/login" element={<Login />} />
          <Route
            path="/watchlist"
            element={<Demo2 SetSelectedMovie={SetSelectedMovie} />}
          />
          <Route
            path="/similar"
            element={
              <>
                <Similar
                  SetSelectedMovie={SetSelectedMovie}
                  selectedMovie={selectedMovie}
                />
              </>
            }
          />
          <Route
            path="/focus"
            element={
              <FocusMovie
                obj={selectedMovie}
                SetSelectedMovie={SetSelectedMovie}
              />
            }
          />
        </Routes>
      </div>
    </UserContext.Provider>
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

export function MovieList(obj) {
  const navigate = useNavigate();
  const tst = obj.lst;
  console.log(tst);
  const [numbers, setNumbers] = useState(tst);
  function handleClick(obj2) {
    console.log("clicked movie " + obj2.original_title);
    obj.SetSelectedMovie(obj2);
    navigate("/focus");
  }

  function Checkbox(props) {
    const { token, array, setArray, updateDB, email } = useContext(UserContext);
    let tmpArray = array;
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
        if (!tmpArray.includes(movieId)) {
          tmpArray.push(movieId);
          console.log("✅ Added to list");
          console.log(tmpArray);
          setArray(tmpArray);
          setCheck(true);
          updateDB(token, tmpArray, email);
        }
      } else {
        console.log("⛔️ Removed from list");
        const index = tmpArray.indexOf(movieId);
        if (index > -1) {
          // only splice array when item is found
          tmpArray.splice(index, 1); // 2nd parameter means remove one item only
          console.log(tmpArray);
          setArray(tmpArray);
          setCheck(false);
          updateDB(token, tmpArray, email);
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

function Demo2(props) {
  return (
    <Watchlist lst={movieWatchList} SetSelectedMovie={props.SetSelectedMovie} />
  );
}
function Watchlist(props) {
  const [lst, setLst] = useState([1]);
  const { array, setArray } = useContext(UserContext);
  //this only runs once when Watchlist is made not on rerenders
  useEffect(() => {
    console.log("this should only log once");
    getLst(setLst, array);
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

async function getLst(setLst, array) {
  const lst = array; //[78, 11791, 11801, 11826, 348350]; // would call api to get users watchlist here
  console.log(lst);
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

function getList(jwtToken, setArray, email) {
  console.log(email);
  console.log("testing hereeeeeeeeeeeeee");
  let url =
    "https://ujh4wq0bwd.execute-api.us-east-1.amazonaws.com/prod?date=&uid=" +
    email;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: jwtToken,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      //transform list into list of numbers
      const myArray = data.body.split(",");
      for (let i = 0; i < myArray.length; i++) {
        myArray[i] = Number(myArray[i]);
      }
      console.log(myArray); // Process the response data
      setArray(myArray);
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
    });
}
