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
app.post("/api/register", (req, res) => {
  const { nome, email, senha, idade, tipo, profissao } = req.body;
  const db = readDB();

  if (db.find(u => u.email === email)) {
    return res.status(400).json({ msg: "Email já cadastrado." });
  }

  const novoUsuario = {
    id: Date.now(),
    nome,
    email,
    senha,
    tipo,
    ...(tipo === "artflow" && { idade, profissao }),
  };

  db.push(novoUsuario);
  writeDB(db);

  res.json({ msg: "Cadastro realizado!" });
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "modulo", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});