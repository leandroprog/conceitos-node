const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Validations
function validateRepositoryId(req, res, next){
  const { id } = req.params;
  if(!isUuid(id)) return res.status(400).json({error: 'invalid Repositpry ID.'})
  return next();
}
function findRepositoryById(req, res, next){
  const { id } = req.params;
  const respositoryIndex = repositories.findIndex( item => item.id === id);
  
  if(respositoryIndex < 0) return res.status(400).json({ error: 'Repository not found by ID.'});
  req["respositoryIndex"] = respositoryIndex;
  return next();
}

// middlewares
app.use('/repositories/:id',validateRepositoryId, findRepositoryById)
app.use('/repositories/:id/like',validateRepositoryId, findRepositoryById)

app.get("/repositories", (req, res) => {
  return res.status(200).json(repositories);
});

app.post("/repositories", (req, res) => {
  const {title, url, techs} = req.body;
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);

  return res.status(200).json(repository);

});

app.put("/repositories/:id", (req, res) => {
  const { respositoryIndex } = req;
  const { title, url, techs} = req.body;
  const repository = repositories[respositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return res.status(200).json(repository);

});

app.delete("/repositories/:id", (req, res) => {
  const { respositoryIndex } = req;
  repositories.splice(respositoryIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { respositoryIndex } = req;
  const repository = repositories[respositoryIndex];

  repository.likes += 1;

  return res.status(200).json(repository);
});

module.exports = app;
