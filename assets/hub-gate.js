(() => {
  "use strict";

  const ACCESS_KEY = "co-market-desk-access";
  const PASSWORD_HASH = "a096b50a34622f75864dd94f503829bf32ac8de180f89222bd8a99ad6c34cb1b";
  const dialog = document.getElementById("market-gate");
  const form = document.getElementById("market-gate-form");
  const password = document.getElementById("market-gate-password");
  const status = document.getElementById("market-gate-status");
  const closeButton = dialog.querySelector(".market-gate-close");
  const cancelButton = dialog.querySelector(".market-gate-cancel");
  let destination = "";

  const hash = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const close = () => {
    dialog.close();
    form.reset();
    status.textContent = "";
    destination = "";
  };

  document.querySelectorAll("[data-market-desk-gate]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (sessionStorage.getItem(ACCESS_KEY) === PASSWORD_HASH) {
        return;
      }
      event.preventDefault();
      destination = link.href;
      dialog.showModal();
      requestAnimationFrame(() => password.focus());
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidate = await hash(password.value);
    if (candidate !== PASSWORD_HASH) {
      status.textContent = "Incorrect password.";
      password.select();
      return;
    }
    sessionStorage.setItem(ACCESS_KEY, PASSWORD_HASH);
    window.location.assign(destination);
  });

  closeButton.addEventListener("click", close);
  cancelButton.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      close();
    }
  });
})();
