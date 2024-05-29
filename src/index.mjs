import express from "express";

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
  console.log(req.query);

  const {
    query: { filter, value },
  } = req;

  if (!filter && !value) return res.send(mockUsers);
  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers.length + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  console.log(req.params);
  const parseId = parseInt(req.params.id);
  console.log(parseId);

  if (isNaN(parseId)) {
    return res.status(400).send({ msg: "Bad request. Invalid ID" });
  }
  const findUser = mockUsers.find((user) => user.id === parseId);

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
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.status(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
