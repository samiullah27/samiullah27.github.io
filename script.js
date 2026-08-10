const buttons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;
    cards.forEach((card) => {
      if (selected === "all") {
        card.classList.remove("is-hidden");
        return;
      }

      const tags = card.dataset.tags || "";
      const show = tags.split(" ").includes(selected);
      card.classList.toggle("is-hidden", !show);
    });
  });
});
