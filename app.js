const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

// Path: `/movies/`

// Method: `GET`

const get_MovieName = (each_movie) => {
  return {
    movieName: each_movie.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
       SELECT 
       *
       FROM 
       movie
       `;
  const dbObject_movies = await db.all(getAllMoviesQuery);
  response.send(dbObject_movies.map((each_movie) => get_MovieName(each_movie)));
});

// API POST A MOVIE_dATA

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const moviePostDbQuery = `
  INSERT INTO movie (director_id,movie_name,lead_actor)
  VALUES ("${directorId}","${movieName}","${leadActor}");`;
  const dbCreateMovie = await db.run(moviePostDbQuery);
  response.send("Movie Successfully Added");
});

// Api GET a  MOVIE BY movie_id
const convertKeysToCamelCase = (dbObject_movie) => {
  return {
    movieId: dbObject_movie.movie_id,
    directorId: dbObject_movie.director_id,
    movieName: dbObject_movie.movie_name,
    leadActor: dbObject_movie.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
       select 
       *
       from
       movie
       where movie_id=${movieId};
       `;
  const dbObject = await db.get(getMovieQuery);
  response.send(convertKeysToCamelCase(dbObject));
});

//api 4 update movie details
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `update movie set director_id = '${directorId}',
  movie_name = '${movieName}', lead_actor = '${leadActor}' where movie_id = ${movieId};`;
  const updateMovieQueryResponse = await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
