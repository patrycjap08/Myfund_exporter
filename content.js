function showClearMessageOnPage(hasData) {
  const message = document.createElement("div");

  if (hasData) {
    message.textContent = "🗑️ Dane zostały usunięte!";
    Object.assign(message.style, {
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "2px solid #ffeeba"
    });
  } else {
    message.textContent = "ℹ️ Brak danych do usunięcia.";
    Object.assign(message.style, {
      backgroundColor: "#e2e3e5",
      color: "#383d41",
      border: "2px solid #d6d8db"
    });
  }

  Object.assign(message.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "9999",
    padding: "16px 24px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    maxWidth: "90%"
  });

  document.body.appendChild(message);
  setTimeout(() => message.remove(), 3000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPageMessage") {
    showClearMessageOnPage(request.hasData);
  }
});
