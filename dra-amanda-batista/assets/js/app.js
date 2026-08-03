document.addEventListener("DOMContentLoaded", () => {
  // Links de WhatsApp
  const defaultMessage = "Olá! Gostaria de agendar uma consulta com a Dra. Amanda Batista.";
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;
  ["header-whatsapp", "hero-whatsapp", "contact-whatsapp", "footer-whatsapp", "float-whatsapp"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink;
  });

  // Menu mobile
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Formulário de agendamento -> envia via WhatsApp
  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = data.get("nome");
      const telefone = data.get("telefone");
      const servico = data.get("servico");
      const mensagem = data.get("mensagem");

      const text = [
        `Olá! Meu nome é ${nome}.`,
        `Telefone: ${telefone}`,
        `Tenho interesse em: ${servico}`,
        mensagem ? `Mensagem: ${mensagem}` : null,
        "Gostaria de agendar uma consulta com a Dra. Amanda Batista.",
      ]
        .filter(Boolean)
        .join("\n");

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      form.reset();
    });
  }
});
