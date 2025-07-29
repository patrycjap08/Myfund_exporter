document.addEventListener("DOMContentLoaded", async () => {
    const infoContainer = document.getElementById("info");
    const exportBtn = document.getElementById("exportBtn");
    const actionContainer = document.getElementById("actionContainer");
    const messageContainer = document.getElementById("message");
    const warningContainer = document.getElementById("warning");
  
    // Pobieramy aktywną zakładkę
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabUrl = tab.url;
  
  
  
// 📤 Wklejanie transakcji Finax do formularza MyFund

    function insertTransactions(csvContent) {
        const select = document.querySelector('select#bank');
        if (select) {
            select.value = 'finaxXls';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const file = new File([csvBlob], "finax_transakcje.csv", { type: "text/csv" });
    
        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }
    
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    
        // 🔽 Kliknięcie "Pobierz z pliku" po 300ms
        setTimeout(() => {
            const submitButton = document.querySelector('#submit1');
            if (submitButton) {
                submitButton.click();
            } else {
                alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
            }
        }, 300);
    }
    
    
// 📤 Wklejanie operacji Finax do formularza MyFund


    function insertOperations(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'finaxXls';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "finax_operacje.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    
    

// 📤 Wklejanie transakcji mBank SFI do formularza MyFund


    function insertTransactions_mbank(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'mBankSFI';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 🔄 Tworzymy plik CSV
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "mbank_export.csv", { type: "text/csv" });

      // 🔍 Szukamy pola pliku
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }

      // 🧙‍♂️ Podmieniamy plik w input[type=file]
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));

      // ⏳ Klikamy przycisk "Pobierz z pliku"
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300);
    }
  
// 📤 Wklejanie operacji Paribas do formularza MyFund


    function insertTransactions_paribas(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'BNPParibas';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "paribas_export.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    

// 📤 Wklejanie operacji Milenium do formularza MyFund


    function insertTransactions_milenium(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'MillenniumPPK';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "milenium_export.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    
    
    
// 📤 Wklejanie operacji Investors do formularza MyFund


    function insertTransactions_investors(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'INVESTORSPPK';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "investors_export.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    
    
// 📤 Wklejanie operacji santander do formularza MyFund


    function insertTransactions_santander(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'SantanderPPK2';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "santander_export.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    
// 📤 Wklejanie operacji Noble do formularza MyFund


    function insertTransactions_noble(csvContent) {
      const select = document.querySelector('select#bank');
      if (select) {
        select.value = 'Noble';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    
      const csvBlob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([csvBlob], "noble_export.csv", { type: "text/csv" });
    
      const input = document.querySelector('input[type="file"]#imagefile');
      if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
      }
    
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    
      // 🔁 Próbujemy kliknąć przycisk "Pobierz z pliku" wielokrotnie (w razie opóźnienia ładowania)
      const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
          submitButton.click();
        } else {
          // Spróbuj ponownie po 200ms, max 5 razy
          if (tryClick.attempts < 5) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
          } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
          }
        }
      };
      tryClick.attempts = 0;
      setTimeout(tryClick, 300); // pierwszy strzał
    }
    

// 🧩 Aktualizacja przycisków akcji w popupie na podstawie zapisanych danych


    function updateActionButtons() {
      chrome.storage.local.get(["finax_transakcje.csv", "finax_operacje.csv", "mbank_export.csv", "paribas_export.csv", 
                                "milenium_export.csv", "investors_export.csv", "santander_export.csv", "noble_export.csv"], (data) => {
        actionContainer.innerHTML = "";
        if (tabUrl.includes("myfund.pl")) {
          warningContainer.textContent = "Upewnij się, że jesteś na właściwym portfelu!";
          warningContainer.style.display = "block";
        }
        if (data["mbank_export.csv"] && !tabUrl.includes("sourcePlugin=mBankSFI")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=mBankSFI", "_blank");
          actionContainer.appendChild(btn);
        }
        if (data["paribas_export.csv"] && !tabUrl.includes("&sourcePlugin=PNPParibas")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=PNPParibas", "_blank");
          actionContainer.appendChild(btn);
        }
        if (data["milenium_export.csv"] && !tabUrl.includes("&sourcePlugin=MillenniumPPK")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=MillenniumPPK", "_blank");
          actionContainer.appendChild(btn);
        }
        if (data["investors_export.csv"] && !tabUrl.includes("&sourcePlugin=INVESTORSPPK")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=INVESTORSPPK", "_blank");
          actionContainer.appendChild(btn);
        }
        if (data["santander_export.csv"] && !tabUrl.includes("&sourcePlugin=SantanderPPK2")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=SantanderPPK2", "_blank");
          actionContainer.appendChild(btn);
        }
        if (data["noble_export.csv"] && !tabUrl.includes("&sourcePlugin=Noble")) {
          const btn = document.createElement("button");
          btn.className = "BUTTON";
          btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
          btn.style.display = "block"
          btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Noble", "_blank");
          actionContainer.appendChild(btn);
        }
        if (tabUrl.includes("sourcePlugin=mBankSFI")){
          if (data["mbank_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_mbank,
                args: [data["mbank_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
        }
        if (tabUrl.includes("sourcePlugin=Noble")){
          if (data["noble_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_noble,
                args: [data["noble_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
        }
        if (tabUrl.includes("raport=ImportOperacjiPPK")){
          if (data["paribas_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_paribas,
                args: [data["paribas_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
          if (data["milenium_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_milenium,
                args: [data["milenium_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
          if (data["investors_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_investors,
                args: [data["investors_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
          if (data["santander_export.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions_santander,
                args: [data["santander_export.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
        }
        if (tabUrl.includes("raport=ImportOperacji")) {
          if (data["finax_transakcje.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane transakcje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertTransactions,
                args: [data["finax_transakcje.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
          if (data["finax_operacje.csv"]) {
            const btn = document.createElement("button");
            btn.className = "BUTTON";
            btn.textContent = "Przejdź do myfund, aby dodać zapisane operacje";
            btn.style.display = "block"
            btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=284&sourcePlugin=Finax", "_blank");
            actionContainer.appendChild(btn);
          }
        } else if (tabUrl.includes("raport=ImportPrzeplywow")) {
          if (data["finax_operacje.csv"]) {
            const pasteBtn = document.createElement("button");
            pasteBtn.className = "BUTTON";
            pasteBtn.style.display = "block"
            pasteBtn.textContent = "Wklej pobrane operacje";
            pasteBtn.onclick = () => {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: insertOperations,
                args: [data["finax_operacje.csv"]]
              });
            };
            actionContainer.appendChild(pasteBtn);
          }
          if (data["finax_transakcje.csv"]) {
            const btn = document.createElement("button");
            btn.className = "BUTTON";
            btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
            btn.style.display = "block"
            btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Finax", "_blank");
            actionContainer.appendChild(btn);
          }
        } else {
          if (data["finax_transakcje.csv"]) {
            const btn = document.createElement("button");
            btn.className = "BUTTON";
            btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
            btn.style.display = "block"
            btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Finax", "_blank");
            actionContainer.appendChild(btn);
          }
          if (data["finax_operacje.csv"]) {
            const btn = document.createElement("button");
            btn.className = "BUTTON";
            btn.textContent = "Przejdź do myfund, aby dodać zapisane operacje";
            btn.style.display = "block"
            btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=284&sourcePlugin=Finax", "_blank");
            actionContainer.appendChild(btn);
          }
        }
      });
    }
    

// ✅ Wyświetlenie komunikatu o powodzeniu na stronie


    function showSuccessMessageOnPage() {
      const message = document.createElement("div");
      message.textContent = "✅ Dane zostały pomyślnie pobrane!";
      Object.assign(message.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        backgroundColor: "#d4edda",
        color: "#155724",
        padding: "16px 24px",
        border: "2px solid #c3e6cb",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "16px",
        textAlign: "center",
        maxWidth: "90%"
      });
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    }
    
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

  
    if (!tabUrl.includes("finax.eu") && !tabUrl.includes("myfund.pl") && !tabUrl.includes("mbank.pl") && !tabUrl.includes("tfi.bnpparibas.pl") 
    && !tabUrl.includes("millenniumtfi.sti24") && !tabUrl.includes("24.investors.pl") && !tabUrl.includes('online.santander-ppk') && !tabUrl.includes('mynsapp.noblesecurities')) {
      const box = document.getElementById("instructionsBoxa");
      box.innerHTML = `Na ten moment wtyczka obsługuje eksport danych wyłącznie ze stron: 
        <a href="https://finax.eu" target="_blank"><b>Finax.eu</b></a>,
        <a href="https://mbank.pl" target="_blank"><b>Mbank.pl</b></a>,
        <a href="https://mynsapp.noblesecurities.pl/" target="_blank"><b>Noblesecurities.pl</b></a>,
        a także danych PPK z banków:
        <a href="https://sti24.tfi.bnpparibas.pl" target="_blank"><b>BNP Paribas</b></a>, 
        <a href="https://millenniumtfi.sti24.pl" target="_blank"><b>Millenium</b></a>,
        <a href="https://online24.investors.pl" target="_blank"><b>Investors</b></a> i 
        <a href="https://online.santander-ppk.pl" target="_blank"><b>Santander</b></a> `;
      box.style.display = "block";
      exportBtn.style.display = "none";
      return;
    }
  
    if (tabUrl.includes("finax.eu") && !tabUrl.includes("transactions")) {
      document.getElementById("grayBoxa").style.display = "block";
      exportBtn.style.display = "none";
      return;
    }
  
    if (tabUrl.includes("finax.eu")) {
      document.getElementById("instructionsBoxb").style.display = "block";
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "block";
    }
  
    if (tabUrl.includes("mbank.pl") && !tabUrl.includes("wallet/sfi/history")) {
      document.getElementById("grayBoxb").style.display = "block";
      exportBtn.style.display = "none";
      return;
    }
    if (tabUrl.includes("mbank.pl")) {
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "block";
    }
    if ( (tabUrl.includes("tfi.bnpparibas.pl") && !tabUrl.includes("/transaction/history") ) || 
         (tabUrl.includes("millenniumtfi.sti24") && !tabUrl.includes("/transaction/history") ) || 
         (tabUrl.includes("24.investors.pl") && !tabUrl.includes("/transaction/history") ) || 
         (tabUrl.includes('online.santander-ppk') && !tabUrl.includes("/transaction/history") )){
      document.getElementById("PPKWarningBox").style.display = "block";
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "none";
    }
    if ((tabUrl.includes("tfi.bnpparibas.pl") || tabUrl.includes("millenniumtfi.sti24") || tabUrl.includes("24.investors.pl") || 
        tabUrl.includes('online.santander-ppk') ) && (tabUrl.includes(":transaction:history") || tabUrl.includes("/transaction/history")) ){
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "block";
    }
    if  (tabUrl.includes("mynsapp.noblesecurities.pl") && !(tabUrl.includes("/history/investment") || tabUrl.includes(":history:investment"))){
      document.getElementById("NobleWarningBox").style.display = "block";
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "none";
    }
    if (tabUrl.includes("mynsapp.noblesecurities.pl") && (tabUrl.includes("/history/investment") || tabUrl.includes(":history:investment"))) {
      document.getElementById("dateWarningBox").style.display = "block";
      exportBtn.style.display = "block";
    }
    updateActionButtons();
  
  
// ⬇️ Przycisk pobierania zapisanego pliku z pamięci Chrome (tylko do testów)
/*
  
    const downloadStoredBtn = document.getElementById("downloadStoredBtn");

    chrome.storage.local.get(["finax_transakcje.csv", "finax_operacje.csv", "mbank_export.csv", "paribas_export.csv", 
                            "milenium_export.csv", "investors_export.csv", "santander_export.csv", "noble_export.csv"], (data) => {
      let found = null;
      let filename = null;

      if (data["finax_transakcje.csv"]) {
        found = data["finax_transakcje.csv"];
        filename = "finax_transakcje.csv";
      } else if (data["finax_operacje.csv"]) {
        found = data["finax_operacje.csv"];
        filename = "finax_operacje.csv";
      } else if (data["mbank_export.csv"]) {
        found = data["mbank_export.csv"];
        filename = "mbank_export.csv";
      } else if (data["paribas_export.csv"]) {
        found = data["paribas_export.csv"];
        filename = "paribas_export.csv";
      } else if (data["milenium_export.csv"]) {
        found = data["milenium_export.csv"];
        filename = "milenium_export.csv";
      } else if (data["investors_export.csv"]) {
        found = data["investors_export.csv"];
        filename = "investors_export.csv";
      } else if (data["santander_export.csv"]) {
        found = data["santander_export.csv"];
        filename = "santander_export.csv";
      } else if (data["noble_export.csv"]) {
        found = data["noble_export.csv"];
        filename = "noble_export.csv";
      }

      if (found) {
        downloadStoredBtn.style.display = "block";
        downloadStoredBtn.onclick = () => {
          const blob = new Blob([found], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        };
      }
    });

*/


// 🟢 Obsługa kliknięcia przycisku eksportu - wybór odpowiedniej funkcji w zależności od strony


    exportBtn.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabUrl = tab.url;
    
      let funcToRun = null;
    
      if (tabUrl.includes("finax")) {
        funcToRun = extractAndSaveTable;
      } else if (tabUrl.includes("mbank")) {
        funcToRun = extractAndSaveTable_mbank;
      } else if (tabUrl.includes("paribas")) {
        funcToRun = extractAndSaveTable_paribas;
      } else if (tabUrl.includes("millenniumtfi")) {
        funcToRun = extractAndSaveTable_milenium;
      } else if (tabUrl.includes("investors")) {
        funcToRun = extractAndSaveTable_investors;
      } else if (tabUrl.includes("santander")) {
        funcToRun = extractAndSaveTable_santander;
      } else if (tabUrl.includes("noblesecurities")) {
        funcToRun = extractAndSaveTable_noble;
      }
    
      if (funcToRun) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: funcToRun
        });
      } else {
        alert("Nieobsługiwana strona.");
      }
    });

// 🔔 Po zapisaniu danych: pokaż komunikat i odśwież przyciski

    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "dataSaved") {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: showSuccessMessageOnPage
        });
    
        // 🔁 Odświeżenie widoku z małym opóźnieniem
        setTimeout(updateActionButtons, 200); // <--- TO DODAJ
      }
    });
    

  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkStorage") {
    checkStoredData();
  }
});

  
// 📋 Wyciągnięcie danych z tabeli mBank i zapisanie jako CSV


  async function extractAndSaveTable_mbank() {
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    const rows = Array.from(document.querySelectorAll('[data-component="TableBodyRow"]'));
    const results = [];
  
    for (const row of rows) {
      row.click();
      await delay(300); // czekamy na szczegóły
  
      const parent = row.closest('tbody');
      const details = parent.querySelector('[data-component="DesktopBodyRowDetails"]');
      if (!details) continue;
  
      const transactionType = row.querySelector('td:nth-child(3) span')?.textContent.trim().toLowerCase();
      const valueRaw = row.querySelector('[data-test-id$=Value] span[data-component="Amount"]')?.textContent.trim();
      const value = Math.abs(parseFloat(valueRaw?.replace(/[^\d,.-]/g, '').replaceAll('\u00a0', '').replace(',', '.'))).toFixed(2);
  
      const taxRaw = details.querySelector('[data-test-id$=Tax] span')?.textContent.trim();
      const tax = taxRaw?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0.00';
      const valuationDate = details.querySelector('[data-test-id$=ValuationDate] span')?.textContent.trim() || '';
  
      if (transactionType === 'konwersja') {
        const names = details.querySelectorAll('[data-test-id*=":Name"] span');
        const units = Array.from(details.querySelectorAll('div')).filter(div => 
          div.previousElementSibling?.textContent?.trim() === 'Liczba jednostek'
        );
  
        const fromName = names[0]?.textContent.trim() || '';
        const toName = names[1]?.textContent.trim() || '';
        const fromUnits = units[0]?.querySelector('span')?.textContent.trim() || '';
        const toUnits = units[1]?.querySelector('span')?.textContent.trim() || '';
  
        results.push(['Konwersja umorzenie', fromName, fromUnits, valuationDate, value, tax].join(';'));
        results.push(['Konwersja nabycie', toName, toUnits, valuationDate, value, tax].join(';'));
      } else if (transactionType === 'nabycie' || transactionType === 'odkupienie') {
        const operation = transactionType === 'odkupienie' ? 'Sprzedaż' : 'Kupno';
        const fundName = details.querySelector('[data-test-id$=Name] span')?.textContent.trim() || '';
        const units = details.querySelector('[data-test-id$=Units] span')?.textContent.trim() || '';
  
        results.push([operation, fundName, units, valuationDate, value, tax].join(';'));
      }
  
      // Zwijanie szczegółów po kliknięciu
      const closeBtn = parent.querySelector('[data-test-id$=CloseButton]');
      if (closeBtn) {
        closeBtn.click();
        await delay(100);
      }
    }
  
    if (results.length === 0) {
      alert('Brak danych do eksportu.');
      return;
    }
  
    const filename = "mbank_export.csv";
    const headers = ["Rodzaj", "Fundusz", "Ilość jednostek", "Data wyceny", "Wartość", "Podatek"];
    const allRows = [headers, ...results.map(r => r.split(';'))];
    const csvContent = allRows.map(row => row.join(";")).join("\n");
  
    chrome.storage.local.remove(["finax_transakcje.csv", "finax_operacje.csv", "mbank_export.csv", "paribas_export.csv", 
                                "milenium_export.csv", "investors_export.csv", "santander_export.csv", "noble_export.csv"], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }
  
  
// 📋 Wyciągnięcie danych z tabeli paribas i zapisanie jako CSV


function extractAndSaveTable_paribas() {
  const filename = "paribas_export.csv";
  const headers = [
    "Data wyceny",
    "Fundusz docelowy",
    "Typ transakcji",
    "Typ oświadczenia/dyspozycji",
    "Liczba jednostek transakcji",
    "WANJU dla transakcji"
  ];
  const rows = [headers];

  const transactions = Array.from(document.querySelectorAll("tr.nx-table-row.table__tr"));

// 1. Klikamy tylko, jeśli szczegóły nie są jeszcze widoczne
transactions.forEach(tr => {
  const toggleBtn = tr.querySelector("a.nx-button");
  const nextRow = tr.nextElementSibling;
  const detailsAreVisible = nextRow?.classList.contains("nx-table-row__details");

  if (toggleBtn && !detailsAreVisible) {
    toggleBtn.click();
  } else if (!toggleBtn && !detailsAreVisible) {
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});

  // 2. Poczekaj, aż wszystkie szczegóły się pojawią
  setTimeout(() => {
    transactions.forEach(tr => {
      const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

      const detailsTr = tr.nextElementSibling;
      if (!detailsTr || !detailsTr.querySelector("app-transaction-details")) return;

      const getValue = (label) => {
        const labels = detailsTr.querySelectorAll("span.label");
        for (const span of labels) {
          if (span.textContent.trim() === label) {
            const h4 = span.closest(".nx-grid__row")?.querySelector("h4.ng-star-inserted");
            return h4?.textContent.trim().replace(/\s+/g, " ") || "";
          }
        }
        return "";
      };

      const dataWyceny = getValue("Data wyceny");
      const fundusz = getValue("Fundusz docelowy");
      const typTransakcji = getValue("Typ transakcji");

      const liczbaJUraw = getValue("Liczba jednostek transakcji");
      const wanjuRaw = getValue("WANJU dla transakcji");

      const liczbaJU = liczbaJUraw
      .replace(",", ".")
      .match(/[\d.]+/)?.[0] || "";
      const wanju = wanjuRaw
      .replace(",", ".")
      .match(/[\d.]+/)?.[0] || "";

      rows.push([
        `"${dataWyceny}"`,
        `"${fundusz}"`,
        `"${typTransakcji}"`,
        `"${typOswiadczenia}"`,
        liczbaJU,
        wanju
      ]);
    });

    if (rows.length <= 1) return alert("Brak danych do eksportu.");

    const csvContent = rows.map(row => row.join(";")).join("\n");

    chrome.storage.local.remove([
      "finax_transakcje.csv",
      "finax_operacje.csv",
      "mbank_export.csv",
      "paribas_export.csv",
      "milenium_export.csv",
      "investors_export.csv",
      "santander_export.csv",
      "noble_export.csv"
    ], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}


// 📋 Wyciągnięcie danych z tabeli investors i zapisanie jako CSV


function extractAndSaveTable_investors() {
  const filename = "investors_export.csv";
  const headers = [
    "Data wyceny",
    "Fundusz docelowy",
    "Typ transakcji",
    "Typ oświadczenia/dyspozycji",
    "Liczba jednostek transakcji",
    "WANJU dla transakcji"
  ];
  const rows = [headers];

  const transactions = Array.from(document.querySelectorAll("tr.nx-table-row.table__tr"));

// 1. Klikamy tylko, jeśli szczegóły nie są jeszcze widoczne
transactions.forEach(tr => {
  const toggleBtn = tr.querySelector("a.nx-button");
  const nextRow = tr.nextElementSibling;
  const detailsAreVisible = nextRow?.classList.contains("nx-table-row__details");

  if (toggleBtn && !detailsAreVisible) {
    toggleBtn.click();
  } else if (!toggleBtn && !detailsAreVisible) {
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});

  // 2. Poczekaj, aż wszystkie szczegóły się pojawią
  setTimeout(() => {
    transactions.forEach(tr => {
      const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

      const detailsTr = tr.nextElementSibling;
      if (!detailsTr || !detailsTr.querySelector("app-transaction-details")) return;

      const getValue = (label) => {
        const labels = detailsTr.querySelectorAll("span.label");
        for (const span of labels) {
          if (span.textContent.trim() === label) {
            const h4 = span.closest(".nx-grid__row")?.querySelector("h4.ng-star-inserted");
            return h4?.textContent.trim().replace(/\s+/g, " ") || "";
          }
        }
        return "";
      };

      const dataWyceny = getValue("Data wyceny");
      const fundusz = getValue("Fundusz docelowy");
      const typTransakcji = getValue("Typ transakcji");

      const liczbaJUraw = getValue("Liczba jednostek transakcji");
      const wanjuRaw = getValue("WANJU dla transakcji");

      const liczbaJU = liczbaJUraw
      .replace(",", ".")
      .match(/[\d.]+/)?.[0] || "";
      const wanju = wanjuRaw
      .replace(",", ".")
      .match(/[\d.]+/)?.[0] || "";

      rows.push([
        `"${dataWyceny}"`,
        `"${fundusz}"`,
        `"${typTransakcji}"`,
        `"${typOswiadczenia}"`,
        liczbaJU,
        wanju
      ]);
    });

    if (rows.length <= 1) return alert("Brak danych do eksportu.");

    const csvContent = rows.map(row => row.join(";")).join("\n");

    chrome.storage.local.remove([
      "finax_transakcje.csv",
      "finax_operacje.csv",
      "mbank_export.csv",
      "paribas_export.csv",
      "milenium_export.csv",
      "investors_export.csv",
      "santander_export.csv",
      "noble_export.csv"
    ], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}


// 📋 Wyciągnięcie danych z tabeli santander i zapisanie jako CSV


function extractAndSaveTable_santander() {
  const filename = "santander_export.csv";
  const headers = [
    "Data wyceny",
    "Fundusz docelowy",
    "Typ transakcji",
    "Typ oświadczenia/dyspozycji",
    "Liczba jednostek transakcji",
    "WANJU dla transakcji"
  ];
  const rows = [headers];

  const transactions = Array.from(document.querySelectorAll("tr.nx-table-row.table__tr"));

// 1. Klikamy tylko, jeśli szczegóły nie są jeszcze widoczne
transactions.forEach(tr => {
  const toggleBtn = tr.querySelector("a.nx-button");
  const nextRow = tr.nextElementSibling;
  const detailsAreVisible = nextRow?.classList.contains("nx-table-row__details");

  if (toggleBtn && !detailsAreVisible) {
    toggleBtn.click();
  } else if (!toggleBtn && !detailsAreVisible) {
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});

  // 2. Poczekaj, aż wszystkie szczegóły się pojawią
  setTimeout(() => {
    transactions.forEach(tr => {
      const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

      const detailsTr = tr.nextElementSibling;
      if (!detailsTr || !detailsTr.querySelector("app-transaction-details")) return;

      const getValue = (label) => {
        const labels = detailsTr.querySelectorAll("span.label");
        for (const span of labels) {
          if (span.textContent.trim() === label) {
            const h4 = span.closest(".nx-grid__row")?.querySelector("h4.ng-star-inserted");
            return h4?.textContent.trim().replace(/\s+/g, " ") || "";
          }
        }
        return "";
      };

      const dataWyceny = getValue("Data wyceny");
      const fundusz = getValue("Fundusz docelowy");
      const typTransakcji = getValue("Typ transakcji");

      const liczbaJUraw = getValue("Liczba jednostek transakcji");
      const wanjuRaw = getValue("WANJU dla transakcji");


      
      const cleanValue = (raw) =>
        raw.replace(/\s/g, "").replace(",", ".").match(/[\d.]+/)?.[0] || "";

      const liczbaJU = cleanValue(liczbaJUraw);
      const wanju = cleanValue(wanjuRaw);

      rows.push([
        `"${dataWyceny}"`,
        `"${fundusz}"`,
        `"${typTransakcji}"`,
        `"${typOswiadczenia}"`,
        liczbaJU,
        wanju
      ]);
    });

    if (rows.length <= 1) return alert("Brak danych do eksportu.");

    const csvContent = rows.map(row => row.join(";")).join("\n");

    chrome.storage.local.remove([
      "finax_transakcje.csv",
      "finax_operacje.csv",
      "mbank_export.csv",
      "paribas_export.csv",
      "milenium_export.csv",
      "investors_export.csv",
      "santander_export.csv",
      "noble_export.csv"
    ], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}


// 📋 Wyciągnięcie danych z tabeli milenium i zapisanie jako CSV


function extractAndSaveTable_milenium() {
  const filename = "milenium_export.csv";
  const headers = [
    "Data wyceny",
    "Fundusz docelowy",
    "Typ transakcji",
    "Typ oświadczenia/dyspozycji",
    "Liczba jednostek transakcji",
    "WANJU dla transakcji"
  ];
  const rows = [headers];

  const transactions = Array.from(document.querySelectorAll("tr.nx-table-row.table__tr"));

// 1. Klikamy tylko, jeśli szczegóły nie są jeszcze widoczne
transactions.forEach(tr => {
  const toggleBtn = tr.querySelector("a.nx-button");
  const nextRow = tr.nextElementSibling;
  const detailsAreVisible = nextRow?.classList.contains("nx-table-row__details");

  if (toggleBtn && !detailsAreVisible) {
    toggleBtn.click();
  } else if (!toggleBtn && !detailsAreVisible) {
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});

  // 2. Poczekaj, aż wszystkie szczegóły się pojawią
  setTimeout(() => {
    transactions.forEach(tr => {
      const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

      const detailsTr = tr.nextElementSibling;
      if (!detailsTr || !detailsTr.querySelector("app-transaction-details")) return;

      const getValue = (label) => {
        const labels = detailsTr.querySelectorAll("span.label");
        for (const span of labels) {
          if (span.textContent.trim() === label) {
            const h4 = span.closest(".nx-grid__row")?.querySelector("h4.ng-star-inserted");
            return h4?.textContent.trim().replace(/\s+/g, " ") || "";
          }
        }
        return "";
      };

      const dataWyceny = getValue("Data wyceny");
      const fundusz = getValue("Fundusz docelowy");
      const typTransakcji = getValue("Typ transakcji");

      const liczbaJUraw = getValue("Liczba jednostek transakcji");
      const wanjuRaw = getValue("WANJU dla transakcji");

      const liczbaJU = liczbaJUraw.replace(",", ".").replace(/[^\d.]/g, "");
      const wanju = wanjuRaw.replace(",", ".").replace(/[^\d.]/g, "");

      rows.push([
        `"${dataWyceny}"`,
        `"${fundusz}"`,
        `"${typTransakcji}"`,
        `"${typOswiadczenia}"`,
        liczbaJU,
        wanju
      ]);
    });

    if (rows.length <= 1) return alert("Brak danych do eksportu.");

    const csvContent = rows.map(row => row.join(";")).join("\n");

    chrome.storage.local.remove([
      "finax_transakcje.csv",
      "finax_operacje.csv",
      "mbank_export.csv",
      "paribas_export.csv",
      "milenium_export.csv",
      "investors_export.csv",
      "santander_export.csv",
      "noble_export.csv"
    ], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}


// 📋 Wyciągnięcie danych z tabel Finax i zapisanie jako CSV


  function extractAndSaveTable() {
    let table = null;
    let headers = [];
    let rows = [];
    let filename = "";
    let isTransakcje = false;
  
    const tablesR = document.querySelectorAll("table.group-R");
    tablesR.forEach(t => {
      if (getComputedStyle(t).display !== "none") table = t;
    });
  
    if (table) {
      isTransakcje = true;
      filename = "finax_transakcje.csv";
      headers = ["Data", "Typ transakcji", "Ilość sztuk", "Cena za sztukę (€)", "Wartość transakcji (€)", "Ticker"];
      rows.push(headers);
  
      const trs = table.querySelectorAll("tbody tr.show");
      trs.forEach(tr => {
        const tds = tr.querySelectorAll("td");
        if (tds.length >= headers.length) {
          let rowData = [];
          for (let i = 1; i < headers.length + 1; i++) {
            let value = tds[i]?.textContent.trim().replace(",", ".").replace("€", "").trim() || "";
            rowData.push(value);
          }
          rows.push(rowData);
        }
      });
    } else {
      const tablesF = document.querySelectorAll("table.group-F");
      tablesF.forEach(t => {
        if (!t.closest("#summaryTableContainer")) table = t;
      });
  
      if (!table) return alert("Nie znaleziono danych do eksportu.");
  
      filename = "finax_operacje.csv";
      headers = ["", "Data", "Rodzaj", "Uwaga", "Kwota"];
      rows.push(headers);
  
      const trs = table.querySelectorAll("tbody tr.show");
      trs.forEach(tr => {
        const tds = tr.querySelectorAll("td");
        if (tds.length >= 5) {
          const data = tds[1]?.textContent.trim() || "";
          const rodzaj = tds[2]?.textContent.trim() || "";
          const uwaga = tds[3]?.textContent.trim() || "";
          const kwota = tds[4]?.textContent.trim() || "";
  
          rows.push([
            "",
            data,
            rodzaj,
            uwaga,
            kwota
          ]);
  
          const extra = tds[5]?.textContent.trim().replace(/\s+/g, " ") || "";
          if (extra) {
            rows.push(["", "", "", "", extra]);
          }
        }
      });
    }
  
    if (rows.length === 1) return alert("Brak danych do eksportu.");
  
    const csvContent = filename === "finax_operacje.csv"
      ? rows.map(row => row.map(cell => `"${cell}"`).join(";")).join("\n")
      : rows.map(row => row.join(";")).join("\n");
  
    // 🧹 Usuwamy oba pliki – żeby był tylko jeden
    chrome.storage.local.remove(["finax_transakcje.csv", "finax_operacje.csv", "mbank_export.csv", "paribas_export.csv", 
                                "milenium_export.csv", "investors_export.csv", "santander_export.csv", "noble_export.csv"], () => {
      // 📝 Zapisujemy tylko ten aktualny
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });
  }
  

// 📋 Wyciągnięcie danych z tabel Noble i zapisanie jako CSV

function extractAndSaveTable_noble() {
  const filename = "noble_export.csv";
  const headers = [
    "Data",
    "Papier",
    "Rodzaj operacji",
    "Liczba",
    "Kurs/Cena",
    "Prowizja DM"
  ];
  const rows = [headers];

  // Funkcja do parsowania liczb
  const parseNumber = (text) => {
    if (!text) return "";
    const cleaned = text.trim()
      .replace(/\u00a0/g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? "" : num;
  };

  // 1. Klikamy wszystkie przyciski rozwijania (pomijamy "Zamknij")
  const buttons = Array.from(document.querySelectorAll("td.col-show-instrument-history button"));
  buttons.forEach(btn => {
    if (btn.textContent.trim() !== "Zamknij") btn.click();
  });

  // 2. Czekamy aż dane się pojawią
  setTimeout(() => {
    const mainRows = Array.from(document.querySelectorAll("tbody.ui-table-tbody > tr"));

    for (let i = 0; i < mainRows.length; i++) {
      const mainRow = mainRows[i];
      const nextRow = mainRow.nextElementSibling;

      const papier = mainRow.querySelector(".col-instrument label")?.textContent.trim() || "";

      // Szukamy tabeli ze szczegółami operacji (następny wiersz z <td colspan>)
      const tbody = nextRow?.querySelector("table .ui-table-tbody");
      if (!tbody) continue;

      const detailsRows = Array.from(tbody.querySelectorAll("tr"));
      for (const row of detailsRows) {
        const data = row.querySelector(".col-operation-date")?.textContent.trim() || "";
        const rodzaj = row.querySelector(".col-operation-type")?.textContent.trim() || "";
        const liczba = parseNumber(row.querySelector(".col-amount")?.textContent);
        const cena = parseNumber(row.querySelector(".col-price")?.textContent);
        const prowizja = parseNumber(row.querySelector(".col-commission")?.textContent);

        rows.push([
          data,
          papier,
          rodzaj,
          liczba,
          cena,
          prowizja
        ]);
      }
    }

    if (rows.length === 1) return alert("Brak danych do eksportu.");

const csvContent = rows.map((row, rowIndex) =>
  row.map((cell, colIndex) => {
    // Dla nagłówka: zawsze w cudzysłowach
    if (rowIndex === 0) return `"${cell}"`;
    // Dla kolumn tekstowych (0: Data, 1: Papier, 2: Rodzaj operacji)
    if (colIndex <= 2) return `"${cell}"`;
    // Dla liczb – bez cudzysłowu
    return cell;
  }).join(";")
).join("\n");

    chrome.storage.local.remove([
      "finax_transakcje.csv", "finax_operacje.csv", "mbank_export.csv",
      "paribas_export.csv", "milenium_export.csv", "investors_export.csv",
      "santander_export.csv", "noble_export.csv"
    ], () => {
      chrome.storage.local.set({ [filename]: csvContent }, () => {
        if (!chrome.runtime.lastError) {
          chrome.runtime.sendMessage({ action: "dataSaved" });
    chrome.runtime.sendMessage({ action: "checkStorage" });
        }
      });
    });

  }, 1000); // możesz zmienić timeout jeśli potrzeba
}

// 🎯 Pokaż ikonę Finax/mBank w zależności od aktywnej zakładki

  
  function updateVisibleIcon() {
    const finaxIcon = document.getElementById("finaxIcon");
    const mbankIcon = document.getElementById("mbankIcon");
    const paribasIcon = document.getElementById("paribasIcon");
    const mileniumIcon = document.getElementById("mileniumIcon");
    const investorsIcon = document.getElementById("investorsIcon");
    const santanderIcon = document.getElementById("santanderIcon");
    const nobleIcon = document.getElementById("nobleIcon");
  
    // Domyślnie ukryj obie
    finaxIcon.style.display = "none";
    mbankIcon.style.display = "none";
    paribasIcon.style.display = "none";
    mileniumIcon.style.display = "none";
    investorsIcon.style.display = "none";
    santanderIcon.style.display = "none";
    nobleIcon.style.display = "none";
  
    // Sprawdź aktywną zakładkę
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "";
  
      if (url.includes("finax")) {
        finaxIcon.style.display = "inline-block";
      } if (url.includes("mbank")) {
        mbankIcon.style.display = "inline-block";
      } if (url.includes("paribas")) {
        paribasIcon.style.display = "inline-block"
      } if (url.includes("millennium")) {
        mileniumIcon.style.display = "inline-block"
      } if (url.includes("investors")) {
        investorsIcon.style.display = "inline-block"
      } if (url.includes("santander")) {
        santanderIcon.style.display = "inline-block"
      } else if (url.includes("noble")) {
        nobleIcon.style.display = "inline-block"
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", updateVisibleIcon);
  
  
// 🌐 Obsługa kliknięć w ikonki na dole popupu


  document.getElementById("finaxIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://finax.eu" });
  });
  document.getElementById("myfundIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://myfund.pl" });
  });
  document.getElementById("mbankIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.mbank.pl" });
  });
  document.getElementById("paribasIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://sti24.tfi.bnpparibas.pl/" });
  });
  document.getElementById("mileniumIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://millenniumtfi.sti24.pl/" });
  });
  document.getElementById("investorsIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://online24.investors.pl/" });
  });
  document.getElementById("santanderIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://online.santander-ppk.pl/" });
  });
  document.getElementById("nobleIcon").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://mynsapp.noblesecurities.pl/" });
  });
  


const clearDataIcon = document.getElementById("clearDataIcon");
clearDataIcon.addEventListener("click", () => {
  if (clearDataIcon.dataset.hasData === "true") {
    chrome.storage.local.remove(allKeys, () => {
      if (!chrome.runtime.lastError) {
        checkStoredData();               // 🔄 Aktualizacja ikony kosza
        actionContainer.innerHTML = "";  // 🧹 Ukryj przyciski natychmiast
        updateActionButtons();           // 🔁 Odśwież listę przycisków
        sendMessageToPage("🗑️ Dane zostały usunięte!");
      }
    });
  }
});

const allKeys = [
  "finax_transakcje.csv", "finax_operacje.csv",
  "mbank_export.csv", "paribas_export.csv",
  "milenium_export.csv", "investors_export.csv",
  "santander_export.csv", "noble_export.csv"
];

function checkStoredData() {
  chrome.storage.local.get(allKeys, (items) => {
    const hasData = Object.values(items).some(val => !!val);
    clearDataIcon.src = hasData ? "trash_dark.svg" : "trash_light.svg";
    clearDataIcon.dataset.hasData = hasData;

    // Ukryj lub pokaż przycisk "Wklej dane"
    const pasteBtn = document.getElementById("downloadStoredBtn");
    if (pasteBtn) {
      pasteBtn.style.display = hasData ? "block" : "none";
    }
  });
}

checkStoredData();

clearDataIcon.addEventListener("click", () => {
  const hasData = clearDataIcon.dataset.hasData === "true";
  if (hasData) {
    chrome.storage.local.remove(allKeys, () => {
      if (!chrome.runtime.lastError) {
        checkStoredData();
        actionContainer.innerHTML = "";
        updateActionButtons();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "showPageMessage",
            hasData: true
          });
        });
      }
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showPageMessage",
        hasData: false
      });
    });
  }
});





