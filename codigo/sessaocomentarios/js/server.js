const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Configurar caminhos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Ler banco de dados
function readDB() {
  const data = fs.readFileSync(path.join(__dirname, "db", "db.json"));
  return JSON.parse(data);
}

// Escrever banco de dados
function writeDB(data) {
  fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(data, null, 2));
}

// Cadastro
app.post("/reviews", (req, res) => {
  const newReview = {
    ...req.body,
    date: new Date().toISOString()
  };

  const dbPath = path.join(__dirname, "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath));

  data.reviews.push(newReview);

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  res.status(201).json(newReview);
});


// Login
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;
  const db = readDB();
  const usuario = db.find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    return res.status(400).json({ msg: "Credenciais inválidas." });
  }

  res.json(usuario);
});

// Página inicial
app.get("/reviews", (req, res) => {
  const dbPath = path.join(__dirname, "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath));
  res.json(data.reviews || []);
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});