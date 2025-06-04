// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão localizados no arquivo db.json que acompanha este projeto.
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 09/09/2024
//
// Código LoginApp  


let tipoUsuario = null;

const filtrosData = {
  "filtros": {
    "tags": [
      {
        "categoria": "Artes Visuais",
        "subtags": ["Desenhista", "Artista Digital", "Pintor", "Escultor", "Ilustrador"]
      },
      {
        "categoria": "Audiovisual",
        "subtags": ["Videomaker", "Fotógrafo", "Cineasta", "Diretor de Fotografia"]
      },
      {
        "categoria": "Artes Performáticas",
        "subtags": ["Ator", "Bailarino", "Músico (Instrumentista, Vocalista)", "DJ"]
      },
      {
        "categoria": "Outras Áreas Criativas",
        "subtags": ["Designer Gráfico", "Web Designer", "Arquiteto", "Escritor"]
      }
    ]
  }
};

function mostrarLogin() {
  esconderTodas();
  document.getElementById("login").classList.remove("hidden");
}

function mostrarCadastro() {
  esconderTodas();
  document.getElementById("tipo-cadastro").classList.remove("hidden");
}

function selecionarTipo(tipo) {
  tipoUsuario = tipo;

  // Limpa campos anteriores
  const container = document.getElementById("campos-artflow");
  container.innerHTML = "";

  if (tipo === "cliente") {
    esconderTodas();
    document.getElementById("form-cadastro").classList.remove("hidden");
    return;
  }

  // Campos extras para artista
  const inputIdade = document.createElement("input");
  inputIdade.type = "number";
  inputIdade.id = "idade";
  inputIdade.placeholder = "Idade";
  inputIdade.required = true;
  container.appendChild(inputIdade);

  const labelProfissao = document.createElement("label");
  labelProfissao.textContent = "Selecione sua profissão:";
  container.appendChild(labelProfissao);

  const selectProfissao = document.createElement("select");
  selectProfissao.id = "profissao";
  selectProfissao.required = true;

  filtrosData.filtros.tags.forEach(categoria => {
    categoria.subtags.forEach(subtag => {
      const option = document.createElement("option");
      option.value = subtag;
      option.textContent = subtag;
      selectProfissao.appendChild(option);
    });
  });

  container.appendChild(selectProfissao);

  esconderTodas();
  document.getElementById("form-cadastro").classList.remove("hidden");
}

async function criarConta() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const idade = tipoUsuario === "artflow" ? parseInt(document.getElementById("idade").value) : undefined;
  const profissao = tipoUsuario === "artflow" ? document.getElementById("profissao").value : undefined;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, idade, tipo: tipoUsuario, profissao })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("usuario", JSON.stringify({ nome, tipo: tipoUsuario }));
    window.location.href = "/";
  } else {
    alert(data.msg);
  }
}

async function fazerLogin() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("usuario", JSON.stringify(data));
    window.location.href = "/";
  } else {
    alert(data.msg);
  }
}

function esconderTodas() {
  document.getElementById("inicio").classList.add("hidden");
  document.getElementById("login").classList.add("hidden");
  document.getElementById("tipo-cadastro").classList.add("hidden");
  document.getElementById("form-cadastro").classList.add("hidden");
}