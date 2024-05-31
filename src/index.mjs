import express, { query } from "express";

const app = express();

// parse json information
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "francisco", displayname: "Francisco" },
  { id: 2, username: "jack", displayname: "Jack" },
  { id: 3, username: "adam", displayname: "Adam" },
  { id: 4, username: "tina", displayname: "Tina" },
  { id: 5, username: "jason", displayname: "Jason" },
  { id: 6, username: "henry", displayname: "Herny" },
  { id: 7, username: "marilyn", displayname: "Marilyn" },
];

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello World" });
});

app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;

  // si no hay filtro y no hay value devuelvo todos los usuarios
  if (!filter && !value) return res.send(mockUsers);

  // si hay un filtro y un valor devuelvo el usuario filtrado
  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  }

  // si solo hay un filtro devuelvo el usuario filtrado
  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers.length + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  // convierte el id a entero
  const parseId = parseInt(req.params.id);

  // si el id no es un numero devuelvo un error
  if (isNaN(parseId)) {
    return res.status(400).send({ msg: "Bad request. Invalid ID" });
  }

  //busca el usuario por el id
  const findUser = mockUsers.find((user) => user.id === parseId);

  // evalúa si el usuario existe para poder devolverlo sino devuelve un error
  if (findUser) {
    return res.send(findUser);
  } else {
    return res.status(404).send({ msg: "User not found" });
  }
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 123, name: "Product 1" },
    { id: 456, name: "Product 2" },
  ]);
});

app.put("/api/users/:id", (req, res) => {
  // descompone el request para obtener el body y el id
  const {
    body,
    params: { id },
  } = req;

  // convierte el id a entero
  const parsedId = parseInt(id);

  // si el id no es un numero devuelvo un error
  if (isNaN(parsedId)) return res.status(400);

  //busca el usuario por el id
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  // evaluar si el usuario existe para poder devolverlo sino devuelve un error
  if (findUserIndex === -1) return res.status(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.patch("/api/users/:id", (req, res) => {
  // descompone el request para obtener el body y el id
  const {
    body,
    params: { id },
  } = req;

  // convierte el id a entero
  const parsedId = parseInt(id);
  // si el id no es un numero devuelvo un error
  if (isNaN(parsedId)) return res.status(400);
  //busca el usuario por el id
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  // evaluar si el usuario existe para poder devolverlo sino devuelve un error
  if (findUserIndex === -1) return res.status(404);
  // actualiza el usuario
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  // devuelvo el usuario actualizado
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
