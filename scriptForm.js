const form = document.getElementById("form");
const statusMsg = document.getElementById("status");
const botao = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  botao.disabled = true;
  statusMsg.textContent = "Enviando...";

  try {
    const resposta = await fetch("https://formspree.io/f/xaeelaeq", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!resposta.ok) throw new Error("Falha no envio");

    form.reset();
    statusMsg.textContent = "Mensagem enviada! Responderemos em breve.";
  } catch (erro) {
    statusMsg.textContent =
      "Não foi possível enviar. Fale conosco pelo WhatsApp ou e-mail.";
  } finally {
    botao.disabled = false;
  }
});


