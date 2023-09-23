import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState, createContext, useContext, useEffect } from "react";
import { UserContext } from "./App.js";

export function Login() {
  const { setToken, token, setArray, email } = useContext(UserContext);
  useEffect(() => {
    getIdToken();
  }, []);
  const getIdToken = async () => {
    try {
      const session = await Auth.currentSession();
      const jwtToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();
      const tokenPayload = JSON.parse(atob(jwtToken.split(".")[1]));
      console.log(tokenPayload);
      console.log(tokenPayload.email);
      console.log("JWT Token:", jwtToken);
      console.log("Access Token:", accessToken);
      testGet(jwtToken, setArray, email);
      updateDB(jwtToken);
      setToken(jwtToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
