import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState, createContext, useContext, useEffect } from "react";
import { UserContext } from "./App.js";
import { Hub, Logger } from "aws-amplify";

export function Login() {
  const { setToken, token, setArray, email, setUserState } =
    useContext(UserContext);
  useEffect(() => {
    //getIdToken();
    const logger = new Logger("Logger", "INFO");
    const listener = (data) => {
      switch (data.payload.event) {
        case "signIn":
          logger.info("user signed in");
          setUserState(true);
          break;
        case "signUp":
          logger.info("user signed up");
          setUserState(true);
          break;
        case "signOut":
          logger.info("user signed out");
          setUserState(false);
          break;
        case "signIn_failure":
          logger.info("user sign in failed");
          break;
        case "configured":
          logger.info("the Auth module is configured");
          break;
        default:
          logger.error("Something went wrong, look at data object", data);
      }
    };

    Hub.listen("auth", listener);
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <p>Welcome {user.username}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

function testGet(jwtToken, setArray, email) {
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

function updateDB(jwtToken) {
  const lambdaUrl =
    "https://ujh4wq0bwd.execute-api.us-east-1.amazonaws.com/prod";
  const bearerToken = jwtToken; // Replace with your bearer token

  const id = "test"; // The ID value you want to update
  const new_value = "11,78"; // The new value you want to set

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
