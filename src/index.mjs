import express from "express";
import { query, validationResult, body, matchedData } from "express-validator";

const app = express();

// parse json information
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};
app.use(loggingMiddleware);

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

app.get("/", loggingMiddleware, (req, res) => {
  res.status(200).send({ msg: "Hello World" });
});

// Middleware para resolver el id
const resolveIndexByUserId = (req, res, next) => {
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
  req.findUserIndex = findUserIndex;
  next();
};

//Validation
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must no be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3 and 10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

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
  }
);

app.post(
  "/api/users",
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 5, max: 32 })
    .withMessage("Username must be at least 5 characters with a max of 32 characters")
    .isString()
    .withMessage("Username must be a string"),
  body("displayname").notEmpty(),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);

    console.log(data);

    const { body } = req;
    const newUser = { id: mockUsers.length + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

app.get("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 123, name: "Product 1" },
    { id: 456, name: "Product 2" },
  ]);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  // descompone el request para obtener el body y el id
  const { body, findUserIndex } = req;
  // actualiza el usuario
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  // devuelvo el usuario actualizado
  return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  // descompone el request para obtener el id
  const { findUserIndex } = req;

  // elimina el usuario de la lista
  mockUsers.splice(findUserIndex, 1);
  // devuelvo el usuario actualizado
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
