let reviews = [];
let currentUserName = "";

// Busca todas as avaliações do servidor
async function fetchReviews() {
  try {
    const res = await fetch("http://localhost:3000/reviews");
    reviews = await res.json();
    updateReviewsList();
  } catch (err) {
    console.error("Erro ao buscar avaliações:", err);
    alert("Erro ao carregar avaliações. Verifique o servidor.");
  }
}

// Envia uma nova avaliação para o servidor
async function postReview(review) {
  try {
    const res = await fetch("http://localhost:3000/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    });

    if (!res.ok) throw new Error("Erro ao salvar no servidor.");

    const newReview = await res.json();
    reviews.push(newReview);
    updateReviewsList();

    alert("Avaliação enviada com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar avaliação:", err);
    alert("Erro ao enviar avaliação. Verifique o console e o JSON Server.");
  }
}

// Atualiza a lista de avaliações na tela
function updateReviewsList() {
  const list = document.getElementById("reviews-list");
  list.innerHTML = "";

  if (reviews.length === 0) {
    list.innerHTML = "<p>Nenhuma avaliação ainda.</p>";
    return;
  }

  reviews.slice().reverse().forEach((r) => {
    const div = document.createElement("div");
    div.className = "review-item";

    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

    div.innerHTML = `
      <div class="review-stars">${stars}</div>
      <div class="review-name">@${r.name}</div>
      <div class="review-comment">${r.comment}</div>
      <div class="review-date">${new Date(r.date).toLocaleDateString()}</div>
    `;

    list.appendChild(div);
  });
}

// Submete uma nova avaliação
function submitReview(event) {
  event.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const comment = document.getElementById("reviewComment").value.trim();
  const ratingAttr = document.getElementById("starRating").getAttribute("data-rating");
  const rating = ratingAttr ? parseInt(ratingAttr) : NaN;

  if (!name || !comment || isNaN(rating)) {
    alert("Por favor, selecione uma nota e preencha todos os campos.");
    return;
  }

  const newReview = {
    name,
    comment,
    rating,
    date: new Date().toISOString()
  };

  currentUserName = name;
  postReview(newReview);

  document.getElementById("reviewName").value = "";
  document.getElementById("reviewComment").value = "";
  clearStars();
}

// Configuração das estrelas de avaliação
const stars = document.querySelectorAll(".star");

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    document.getElementById("starRating").setAttribute("data-rating", index + 1);
    highlightStars(index + 1);
  });

  star.addEventListener("mouseover", () => highlightStars(index + 1));
  star.addEventListener("mouseout", () => {
    const current = document.getElementById("starRating").getAttribute("data-rating") || 0;
    highlightStars(parseInt(current));
  });
});

function highlightStars(rating) {
  stars.forEach((s, idx) => {
    s.classList.toggle("active", idx < rating);
  });
}

function clearStars() {
  stars.forEach(s => s.classList.remove("active"));
  document.getElementById("starRating").removeAttribute("data-rating");
}

// Inicialização
fetchReviews();
document.getElementById("reviewForm").addEventListener("submit", submitReview);