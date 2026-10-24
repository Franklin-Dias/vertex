const form = document.getElementById("form");
const status = document.getElementById("status");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = new FormData(form);

  const mensagem =
    `Nome: ${dados.get("name")}\n` +
    `E-mail: ${dados.get("email")}\n\n` +
    `WhatsApp: ${dados.get("whatsApp")}\n\n` +
    `Mensagem:\n${dados.get("mensagem")}`;

  const assunto = encodeURIComponent(dados.get("assunto"));
  const corpo = encodeURIComponent(mensagem);

  window.location.href = `mailto:frankdias06@gmail.com?subject=${assunto}&body=${corpo}`;

  status.textContent = "Finalize o envio no aplicativo de e-mail que abrir.";
});
