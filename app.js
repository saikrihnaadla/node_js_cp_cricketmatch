const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const destructuringObject = (eachObject) => {
  return {
    director_id: eachObject.director_id,
    directorName: eachObject.director_name,
  };
};

// api1 get all movies

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
        SELECT *
        FROM movie;
    `;
  const moviesList = await db.all(getMoviesQuery);

  response.send(moviesList);
});

// post movie api

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMoviesQuery = `
        INSERT INTO
            movie(director_id, movie_name, lead_actor)
        VALUES 
            ('${directorId}',
              '${movieName}',
             '${leadActor}');`;
  const moviesList = await db.run(postMoviesQuery);
  response.send("Movie Successfully Added");
});

// put movie api
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetail = request.body;
  const { directorId, movieName, leadActor } = movieDetail;
  const putQuery = `
        UPDATE
        movie
        SET
            director_id = '${directorId}',
            movie_name = '${movieName}',
            lead_actor= '${leadActor}'
        WHERE
            movie_id ='${movieId}';

        `;
  await db.run(putQuery);
  response.send("Movie Details Updated");
});

// GET MOVIE WITH MOVIE iD

app.get("/movies/:movieID/", async (request, response) => {
  const { movieID } = request.params;
  const getMoviesQuery = `
        SELECT *
        FROM movie
        WHERE 
            movie_id='${movieID}';
    `;
  const moviesList = await db.all(getMoviesQuery);
  response.send(moviesList);
});

// delete movie api
app.delete("/movies/:movieID/", async (request, response) => {
  const { movieID } = request.params;
  const getMoviesQuery = `
        DELETE FROM 
            movie
        WHERE 
            movie_id='${movieID}';
    `;
  const moviesList = await db.all(getMoviesQuery);
  response.send("Movie Removed");
});

// get  directors api

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT *
        FROM director;
    `;
  const directorsList = await db.all(getDirectorsQuery);
  let directorsArray = [];
  for (let eachObject of directorsList) {
    const obj = destructuringObject(eachObject);
    directorsArray.push(obj);
  }
  response.send(directorsArray);
});
