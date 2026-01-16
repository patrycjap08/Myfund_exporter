const BYBIT_EXTENDED_FLAG = "bybit_extended_mode"; // "yes" | "no"

// 🗂️ Klucze używane w pamięci przeglądarki
const BYBIT_KEY = "bybit_export.csv";
// 🔑 Uniwersalne zestawy kluczy w pamięci Chrome
const STORAGE_KEYS = {
    ALL: [
        "finax_transakcje.csv",
        "finax_operacje.csv",
        "mbank_export.csv",
        "milenium_export.csv",
        "paribas_export.csv",
        "investors_export.csv",
        "santander_export.csv",
        "noble_export.csv",
        "bybit_export.csv"
    ],
    EXCEPT_BYBIT: [
        "finax_transakcje.csv",
        "finax_operacje.csv",
        "mbank_export.csv",
        "paribas_export.csv",
        "milenium_export.csv",
        "investors_export.csv",
        "santander_export.csv",
        "noble_export.csv"
    ]
};
document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    const url = tab.url || "";

    const body = document.body;

    if (url.includes("bybit")) {
        body.style.height = "700px";
    } else {
        body.style.height = "490px"; // domyślnie
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const infoContainer = document.getElementById("info");
    const exportBtn = document.getElementById("exportBtn");
    const actionContainer = document.getElementById("actionContainer");
    const messageContainer = document.getElementById("message");
    const warningContainer = document.getElementById("warning");
    const bybitInfoBox = document.getElementById("bybitInfoBox");
    const bybitFundingBtn = document.getElementById("bybitFundingBtn");
    const bybitUnifiedBtn = document.getElementById("bybitUnifiedBtn");



    // Pobieramy aktywną zakładkę
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    const tabUrl = tab.url;

    // 📤 Wklejanie transakcji Finax do formularza MyFund

    function insertTransactions(csvContent) {
        const select = document.querySelector('select#bank');
        if (select) {
            select.value = 'finaxXls';
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "finax_transakcje.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "finax_operacje.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
    function insertTransactions_bybit(csvContent) {
        const select = document.querySelector('select#bank');
        if (select) {
            select.value = 'ByBitWtyczka';
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        // 🔄 Tworzymy plik CSV
        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "bybit_export.csv", {
            type: "text/csv"
        });

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
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
    // 📤 Wklejanie transakcji mBank SFI do formularza MyFund

    function insertTransactions_mbank(csvContent) {
        const select = document.querySelector('select#bank');
        if (select) {
            select.value = 'mBankSFI';
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        // 🔄 Tworzymy plik CSV
        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "mbank_export.csv", {
            type: "text/csv"
        });

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
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "paribas_export.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "milenium_export.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "investors_export.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "santander_export.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], "noble_export.csv", {
            type: "text/csv"
        });

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

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
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            const tabUrl = tabs?.[0]?.url || "";

            chrome.storage.local.get([
                "finax_transakcje.csv",
                "finax_operacje.csv",
                "mbank_export.csv",
                "paribas_export.csv",
                "milenium_export.csv",
                "investors_export.csv",
                "santander_export.csv",
                "noble_export.csv",
                "bybit_export.csv"
            ], (data) => {
                actionContainer.innerHTML = "";

                if (tabUrl.includes("myfund.pl")) {
                    warningContainer.textContent = "Upewnij się, że jesteś na właściwym portfelu!";
                    warningContainer.style.display = "block";
                }
                if (tabUrl.includes("bybit") || tabUrl.includes("noble") || tabUrl.includes("santander") || tabUrl.includes("investors") || tabUrl.includes("milenium") || tabUrl.includes("paribas") || tabUrl.includes("mbank") || tabUrl.includes("finax") || tabUrl.includes("myfund")) {
                    if (data["bybit_export.csv"] && !tabUrl.includes("sourcePlugin=ByBitWtyczka")) {
                        const btn = document.createElement("button");
                        btn.className = "BUTTON";
                        btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
                        btn.style.display = "block"
                        btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=167&sourcePlugin=ByBitWtyczka", "_blank");
                        actionContainer.appendChild(btn);
                    }
                    if (data["mbank_export.csv"] && !tabUrl.includes("sourcePlugin=mBankSFI")) {
                        const btn = document.createElement("button");
                        btn.className = "BUTTON";
                        btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
                        btn.style.display = "block"
                        btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=mBankSFI", "_blank");
                        actionContainer.appendChild(btn);
                    }
                    if (data["paribas_export.csv"] && !tabUrl.includes("&sourcePlugin=BNPParibas")) {
                        const btn = document.createElement("button");
                        btn.className = "BUTTON";
                        btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
                        btn.style.display = "block"
                        btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=BNPParibas", "_blank");
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
                    if (data["finax_operacje.csv"] && !tabUrl.includes("raport=ImportPrzeplywowCrypto")) {
                        const btn = document.createElement("button");
                        btn.className = "BUTTON";
                        btn.textContent = "Przejdź do myfund, aby dodać zapisane operacje";
                        btn.style.display = "block"
                        btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=284&sourcePlugin=Finax", "_blank");
                        actionContainer.appendChild(btn);
                    }
                    if (tabUrl.includes("raport=ImportOperacji") && !tabUrl.includes("raport=ImportOperacjiPPK")) {
                        const btn = document.createElement("button");
                        btn.className = "BUTTON";
                        btn.textContent = "Przejdź do myfund, aby dodać zapisane transakcje";
                        btn.style.display = "block"
                        btn.onclick = () => window.open("https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Finax", "_blank");
                        actionContainer.appendChild(btn);
                    }
                    if (tabUrl.includes("raport=ImportPrzeplywowCrypto")) {
                        if (data["bybit_export.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane transakcje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertTransactions_bybit,
                                    args: [data["bybit_export.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }
                    }
                    if (tabUrl.includes("raport=ImportOperacji") && !tabUrl.includes("raport=ImportOperacjiPPK")) {
                        if (data["finax_transakcje.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane transakcje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertTransactions,
                                    args: [data["finax_transakcje.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }
                        if (data["mbank_export.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane transakcje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertTransactions_mbank,
                                    args: [data["mbank_export.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }
                        if (data["noble_export.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane transakcje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertTransactions_noble,
                                    args: [data["noble_export.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }
                    }
                    if (tabUrl.includes("raport=ImportOperacjiPPK")) {
                        if (data["paribas_export.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane transakcje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
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
                                    target: {
                                        tabId: tab.id
                                    },
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
                                    target: {
                                        tabId: tab.id
                                    },
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
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertTransactions_santander,
                                    args: [data["santander_export.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }

                    }
                    if (tabUrl.includes("raport=ImportPrzeplywowCrypto")) {
                        if (data["finax_operacje.csv"]) {
                            const pasteBtn = document.createElement("button");
                            pasteBtn.className = "BUTTON";
                            pasteBtn.style.display = "block"
                            pasteBtn.textContent = "Wklej pobrane operacje";
                            pasteBtn.onclick = () => {
                                chrome.scripting.executeScript({
                                    target: {
                                        tabId: tab.id
                                    },
                                    function: insertOperations,
                                    args: [data["finax_operacje.csv"]]
                                });
                            };
                            actionContainer.appendChild(pasteBtn);
                        }

                    }
                }
            });
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

    if (!tabUrl.includes("finax.eu") && !tabUrl.includes("myfund.pl") && !tabUrl.includes("mbank.pl") && !tabUrl.includes("tfi.bnpparibas.pl") &&
        !tabUrl.includes("millenniumtfi.sti24") && !tabUrl.includes("24.investors.pl") && !tabUrl.includes('online.santander-ppk') && !tabUrl.includes("bybit.com") && !tabUrl.includes('mynsapp.noblesecurities')) {
        const box = document.getElementById("instructionsBoxa");
        box.innerHTML = `Na ten moment wtyczka obsługuje eksport danych wyłącznie ze stron: 
        <a href="https://finax.eu" target="_blank"><b>Finax.eu</b></a>,
        <a href="https://mbank.pl" target="_blank"><b>SFI mBank.pl</b></a>,
    <a href="https://www.bybit.com" target="_blank"><b>Bybit.com</b></a>,
        <a href="https://mynsapp.noblesecurities.pl/" target="_blank"><b>Noblesecurities.pl</b></a>,
        a także danych PPK z banków:
        <a href="https://sti24.tfi.bnpparibas.pl" target="_blank"><b>BNP Paribas</b></a>, 
        <a href="https://millenniumtfi.sti24.pl" target="_blank"><b>Millenium</b></a>,
        <a href="https://online24.investors.pl" target="_blank"><b>Investors</b></a> i 
        <a href="https://online.santander-ppk.pl" target="_blank"><b>Santander</b></a> `;
        box.style.display = "block";
        exportBtn.style.display = "none";
    }
    // BYBIT – informacja + 2 przyciski (aktywny zależnie od URL)
    if (tabUrl.includes("bybit.com")) {
        // referencje
        const bybitExtendedInfo = document.getElementById("bybitExtendedInfo");
        const bybitExtendedBtns = document.getElementById("bybitExtendedBtns");
        const bybitInfoBox = document.getElementById("bybitInfoBox");
        const bybitFundingBtn = document.getElementById("bybitFundingBtn");
        const bybitUnifiedBtn = document.getElementById("bybitUnifiedBtn");

        // ukryj standardowy przycisk
        exportBtn.style.display = "none";

        // ZAWSZE tryb rozszerzony
        switchToExtendedMode(tabUrl);

        function switchToExtendedMode(url) {
            bybitFundingBtn.style.display = "none";
            bybitUnifiedBtn.style.display = "block";

            bybitExtendedInfo.style.display = "block";
            bybitExtendedBtns.style.display = "block";
            bybitInfoBox.style.display = "none";

            const map = [{
                    key: "fiat/depositSpot",
                    btn: "bybitDepositSpotBtn"
                },
                {
                    key: "fiat/withdrawSpot",
                    btn: "bybitWithdrawSpotBtn"
                },
                {
                    key: "fiat/oneClickBuy",
                    btn: "bybitOneClickBuyBtn"
                },
                {
                    key: "fiat/p2p",
                    btn: "bybitP2PBtn"
                },
                {
                    key: "fiat/depositFiat",
                    btn: "bybitDepositFiatBtn"
                },
                {
                    key: "fiat/withdrawFiat",
                    btn: "bybitWithdrawFiatBtn"
                },
            ];

            map.forEach(({
                btn
            }) => {
                const el = document.getElementById(btn);
                el.style.display = "block";
                el.disabled = true;
            });

            const matched = map.find(m => url.includes(m.key));
            if (matched) {
                document.getElementById(matched.btn).disabled = false;
            }

            const isUnified = url.includes("assets/unifiedtranslog");
            bybitUnifiedBtn.disabled = !isUnified;
        }
    }




    if (tabUrl.includes("finax.eu") && !tabUrl.includes("transactions")) {
        document.getElementById("grayBoxa").style.display = "block";
        exportBtn.style.display = "none";
    }

    if (tabUrl.includes("finax.eu")) {
        document.getElementById("instructionsBoxb").style.display = "block";
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }

    if (tabUrl.includes("mbank.pl") && !tabUrl.includes("wallet/sfi/history")) {
        document.getElementById("grayBoxb").style.display = "block";
        exportBtn.style.display = "none";
    }
    if (tabUrl.includes("mbank.pl")) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }
    if ((tabUrl.includes("tfi.bnpparibas.pl") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes("millenniumtfi.sti24") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes("24.investors.pl") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes('online.santander-ppk') && !tabUrl.includes("/transaction/history"))) {
        document.getElementById("PPKWarningBox").style.display = "block";
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "none";
    }
    if ((tabUrl.includes("tfi.bnpparibas.pl") || tabUrl.includes("millenniumtfi.sti24") || tabUrl.includes("24.investors.pl") ||
            tabUrl.includes('online.santander-ppk')) && (tabUrl.includes(":transaction:history") || tabUrl.includes("/transaction/history"))) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }
    if (tabUrl.includes("mynsapp.noblesecurities.pl") && !(tabUrl.includes("/history/investment") || tabUrl.includes(":history:investment"))) {
        document.getElementById("NobleWarningBox").style.display = "block";
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "none";
    }
    if (tabUrl.includes("mynsapp.noblesecurities.pl") && (tabUrl.includes("/history/investment") || tabUrl.includes(":history:investment"))) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }
    updateActionButtons();

    /*
        // ⬇️ Przycisk pobierania zapisanego pliku z pamięci Chrome (tylko do testów)
        
          
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
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
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
                target: {
                    tabId: tab.id
                },
                function: funcToRun,
                args: [STORAGE_KEYS.ALL] // <— przekazujemy listę kluczy
            });

        } else {
            alert("Nieobsługiwana strona.");
        }
    });
    bybitFundingBtn?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: extractAndSaveTable_bybitFunding,
            args: [STORAGE_KEYS.EXCEPT_BYBIT] // <— przekazujemy EXCEPT listę
        });

    });
    // BYBIT – tryb rozszerzony: uruchom placeholdery
    document.getElementById("bybitDepositSpotBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_depositSpot
        });
    });
    document.getElementById("bybitWithdrawSpotBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_withdrawSpot
        });
    });
    document.getElementById("bybitOneClickBuyBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_oneClickBuy
        });
    });
    document.getElementById("bybitP2PBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_p2p
        });
    });
    document.getElementById("bybitDepositFiatBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_depositFiat
        });
    });
    document.getElementById("bybitWithdrawFiatBtn")?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: bybit_extract_withdrawFiat
        });
    });


    bybitUnifiedBtn?.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: extractAndSaveTable_bybitUnified,
            args: [STORAGE_KEYS.EXCEPT_BYBIT]
        });

    });


    // 🔔 Po zapisaniu danych: pokaż komunikat i odśwież przyciski

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "dataSaved") {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                const id = tabs?.[0]?.id;
                if (id) {
                    chrome.scripting.executeScript({
                        target: {
                            tabId: id
                        },
                        function: showSuccessMessageOnPage
                    });
                }
                setTimeout(updateActionButtons, 200);
            });
        }
    });

});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkStorage") {
        checkStoredData();
    }
});

// ===================== BYBIT FUNDING =====================
function extractAndSaveTable_bybitFunding(ALL_KEYS_EXCEPT_BYBIT) {
    const BYBIT_KEY = "bybit_export.csv";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    //
    // 1. Normalizacja daty:
    //    - "2025-10-26 21:59:59"          -> zostaje
    //    - "2025-10-26 21:59"             -> dodajemy :00
    //    - "21.10.2025 21:10"             -> "2025-10-21 21:10:00"
    //    - "21.10.2025 21:10:38"          -> "2025-10-21 21:10:38"
    //
    function normalizeDateTime(raw) {
        if (!raw) return "";
        const cleaned = raw.replace(/\s*[\r\n]+\s*/g, " ").trim();

        // case: 2025-10-26 21:59:59  lub 2025-10-26 21:59
        let m = cleaned.match(
            /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
        );
        if (m) {
            const [, yyyy, mm, dd, HH, MM, SS = "00"] = m;
            return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
        }

        // case: 21.10.2025 21:10(:38)?
        m = cleaned.match(
            /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
        );
        if (m) {
            const [, dd, mm, yyyy, HH = "00", MM = "00", SS = "00"] = m;
            return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")} ${HH}:${MM}:${SS}`;
        }

        return cleaned;
    }

    //
    // 2. Qty -> bez znaku
    //    "+173.1530"  -> "173.1530"
    //    "-633.7400"  -> "633.7400"
    //    "0.00000000" -> "0.00000000"
    //
    function normalizeQtyAbs(raw) {
        if (!raw) return "";
        const m = raw.match(/[+-]?\d+(?:[.,]\d+)?/);
        if (!m) return "";
        return m[0].replace(/^[+-]/, "").replace(",", ".");
    }

    //
    // 3. timestamp w ms do grupowania
    //
    function dateToMs(str) {
        const m = str.match(
            /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/
        );
        if (!m) return NaN;
        const [, yyyy, mm, dd, HH, MM, SS] = m;
        const d = new Date(
            Number(yyyy),
            Number(mm) - 1,
            Number(dd),
            Number(HH),
            Number(MM),
            Number(SS),
            0
        );
        return d.getTime();
    }

    //
    // 4. Parsowanie jednego <tr> funding-records__common-table-row
    //    Struktura kolumn (wg Twojego HTML):
    //    0 Date & Time
    //    1 Coin
    //    2 Qty (+ / - / bez znaku)
    //    3 Type (np. "Fiat", "Withdraw", "Deposit", "Transfer in/out", ...)
    //    4 jakaś liczba/zero (nie używamy teraz jako Fee)
    //    5 Description (np. "Coin Purchase", "P2P Purchase", "Deposit", "Withdrawal", "Sale")
    //
    function parseFundingRow(tr) {
        const tds = tr.querySelectorAll("td.ant-table-cell");
        if (!tds || tds.length < 6) return null;

        const date_time_raw = txt(tds[0]);
        const coin = txt(tds[1]);
        const qty_raw = txt(tds[2]);
        const uiType = txt(tds[3]); // "Fiat", "Withdraw", "Deposit", "Transfer in", ...
        const extraAmount = txt(tds[4]); // np. "263.79793898", "0.0000", "197.7000"
        const businessDesc = txt(tds[5]); // "Coin Purchase", "P2P Purchase", "Deposit", "Withdrawal", "Sale", ...

        const date_time = normalizeDateTime(date_time_raw);
        const qtyAbs = normalizeQtyAbs(qty_raw);
        if (!date_time || !coin || !qtyAbs) return null;

        const tsMs = dateToMs(date_time);

        // zapamiętaj znak, żeby łatwiej dobrać parę fiat/krypto
        const qtySign = (() => {
            const m = qty_raw.match(/^([+-])/);
            return m ? m[1] : "";
        })();

        return {
            date_time, // np. "2025-10-21 21:01:36"
            tsMs, // ms (do grupowania)
            coin, // "USDT", "PLN", "DOGE"
            qtyAbs, // "173.1530" (bez znaku)
            qtySign, // "+", "-", albo ""
            uiType, // "Fiat", "Withdraw", "Deposit", ...
            businessDesc, // "P2P Purchase", "Coin Purchase", ...
            extraAmount // np. "173.1530", "0.0000", itd (na razie nie używamy)
        };
    }

    //
    // 5. Zbieranie wszystkich wierszy z aktualnie załadowanej strony
    //
    function collectRowsFromCurrentPage() {
        const trs = Array.from(
            document.querySelectorAll("tr.funding-records__common-table-row")
        );
        const parsed = [];
        for (const tr of trs) {
            const row = parseFundingRow(tr);
            if (row) parsed.push(row);
        }
        return parsed;
    }

    //
    // 6. Znajduje aktywny Next Page button (taki jaki pokazałeś)
    //
    function findNextButton() {
        const li = document.querySelector(
            'li.ant-pagination-next[aria-disabled="false"]'
        );
        return li?.querySelector("button.ant-pagination-item-link") || null;
    }

    //
    // 7. Pobieramy WSZYSTKIE strony:
    //    - zbieramy rekordy
    //    - klikamy next
    //    - czekamy aż tabela się zmieni (porównujemy pierwszy wiersz z tabeli)
    //
    async function collectAllPagesRows() {
        const all = [];
        let safety = 100; // bezpiecznik żeby nie wpaść w pętlę nieskończoną

        while (safety-- > 0) {
            // zbierz z bieżącej strony
            const pageRows = collectRowsFromCurrentPage();
            all.push(...pageRows);

            // spróbuj znaleźć next
            const nextBtn = findNextButton();
            if (!nextBtn) break; // nie ma więcej stron

            // marker przed kliknięciem (użyjemy tekstu pierwszego <tr>)
            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                )?.textContent || "";

            // klikamy next
            nextBtn.click();

            // czekamy aż tabela przeskoczy / odświeży się
            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                    )?.textContent || "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }

        // posortuj globalnie po czasie rosnąco
        all.sort((a, b) => a.tsMs - b.tsMs);
        return all;
    }

    //
    // 8. Grupowanie rekordów wg okna 10 sekund
    //
    function groupRowsByTime(rows) {
        const groups = [];
        let current = null;

        for (const row of rows) {
            if (!current) {
                current = {
                    startTs: row.tsMs,
                    rows: [row]
                };
                continue;
            }
            const diff = row.tsMs - current.startTs;
            if (diff <= 10_000) {
                current.rows.push(row);
            } else {
                groups.push(current);
                current = {
                    startTs: row.tsMs,
                    rows: [row]
                };
            }
        }
        if (current) groups.push(current);

        // nadaj ID 1..N + posortuj wiersze w grupie (rosnąco po czasie)
        groups.forEach((g, i) => {
            g.id = String(i + 1);
            g.rows.sort((a, b) => a.tsMs - b.tsMs);
        });

        return groups;
    }

    //
    // 9. Helpery do klasyfikacji typu grupy
    //
    function findFirstByBusinessDesc(rows, desc) {
        desc = desc.toLowerCase();
        return rows.find((r) => r.businessDesc.toLowerCase() === desc);
    }

    function findFirstByUiType(rows, type) {
        type = type.toLowerCase();
        return rows.find((r) => r.uiType.toLowerCase() === type);
    }

    // Szukanie pary (fiat vs crypto / druga waluta w tym samym trade)
    function findCounterparty(rows, base) {
        // najpierw spróbuj znaleźć rekord z innym coin i przeciwnym znakiem
        const oppositeSign =
            base.qtySign === "+" ?
            "-" :
            base.qtySign === "-" ?
            "+" :
            null;

        if (oppositeSign) {
            const cand = rows.find(
                (r) =>
                r !== base &&
                r.coin !== base.coin &&
                r.qtySign === oppositeSign
            );
            if (cand) return cand;
        }

        // fallback: weź jakikolwiek inny coin z tej samej grupy
        const anyOther = rows.find(
            (r) => r !== base && r.coin !== base.coin
        );
        return anyOther || base;
    }

    //
    // 10. Budowanie CSV dla jednej grupy (jednego ID)
    //
    function buildCsvRowsForGroup(group) {
        const {
            id,
            rows
        } = group;
        const date_time = rows[0].date_time; // bierzemy timestamp pierwszego wiersza w grupie
        const outLines = [];

        // A. Krypto Deposit
        // warunek: w grupie jest rekord z uiType == "Deposit"
        // -> Funding_Deposit
        const rDepo = findFirstByUiType(rows, "Deposit");
        if (rDepo) {
            outLines.push(
                [
                    id,
                    "Funding_Deposit",
                    date_time,
                    rDepo.coin,
                    rDepo.qtyAbs,
                    "Deposit",
                    "0",
                ].join(";")
            );
            return outLines;
        }

        // B. Krypto Withdraw
        // warunek: rekord z uiType == "Withdraw"
        // -> Funding_Withdraw
        const rWdr = findFirstByUiType(rows, "Withdraw");
        if (rWdr) {
            outLines.push(
                [
                    id,
                    "Funding_Withdraw",
                    date_time,
                    rWdr.coin,
                    rWdr.qtyAbs,
                    "Withdraw",
                    "0",
                ].join(";")
            );
            return outLines;
        }

        // C. One Click Buy
        // warunek: rekord z businessDesc == "Coin Purchase"
        // -> 2 linie:
        //    1) One_Click_fiat_out
        //    2) One_Click_fiat_in
        const oneClick = findFirstByBusinessDesc(rows, "Coin Purchase");
        if (oneClick) {
            const pair = findCounterparty(rows, oneClick);

            outLines.push(
                [
                    id,
                    "Funding_One_Click",
                    date_time,
                    oneClick.coin,
                    oneClick.qtyAbs,
                    "One_Click_fiat_out",
                    "0",
                ].join(";")
            );

            outLines.push(
                [
                    id,
                    "Funding_One_Click",
                    date_time,
                    pair.coin,
                    pair.qtyAbs,
                    "One_Click_fiat_in",
                    "0",
                ].join(";")
            );

            return outLines;
        }

        // D. P2P
        // warunek: rekord z businessDesc == "P2P Purchase"
        // -> 2 linie:
        //    1) P2P_crypto
        //    2) P2P_fiat
        const p2p = findFirstByBusinessDesc(rows, "P2P Purchase");
        if (p2p) {
            const pair = findCounterparty(rows, p2p);

            outLines.push(
                [
                    id,
                    "Funding_P2P",
                    date_time,
                    p2p.coin,
                    p2p.qtyAbs,
                    "P2P_crypto",
                    "0",
                ].join(";")
            );

            outLines.push(
                [
                    id,
                    "Funding_P2P",
                    date_time,
                    pair.coin,
                    pair.qtyAbs,
                    "P2P_fiat",
                    "0",
                ].join(";")
            );

            return outLines;
        }

        // E. Fiat Deposit
        // warunek: rekord z uiType == "Fiat" && businessDesc == "Deposit"
        // -> Funding_Deposit_Fiat
        const fiatDepo = rows.find(
            (r) =>
            r.uiType.toLowerCase() === "fiat" &&
            r.businessDesc.toLowerCase() === "deposit"
        );
        if (fiatDepo) {
            outLines.push(
                [
                    id,
                    "Funding_Deposit_Fiat",
                    date_time,
                    fiatDepo.coin,
                    fiatDepo.qtyAbs,
                    "Deposit_Fiat",
                    "0",
                ].join(";")
            );
            return outLines;
        }

        // F. Fiat Withdraw
        // warunek: rekord z uiType == "Fiat" && businessDesc == "Withdraw"
        // -> Funding_Withdraw_Fiat
        const fiatWdr = rows.find(
            (r) =>
            r.uiType.toLowerCase() === "fiat" &&
            r.businessDesc.toLowerCase() === "withdraw"
        );
        if (fiatWdr) {
            outLines.push(
                [
                    id,
                    "Funding_Withdraw_Fiat",
                    date_time,
                    fiatWdr.coin,
                    fiatWdr.qtyAbs,
                    "Withdraw_Fiat",
                    "0",
                ].join(";")
            );
            return outLines;
        }

        // Jeśli grupa nie pasuje do żadnej kategorii, pomijamy ją.
        return outLines;
    }

    //
    // 11. Budowa wszystkich linii CSV z listy grup
    //
    function buildAllCsvRowsFromGroups(groups) {
        const csvRows = [];
        for (const g of groups) {
            const lines = buildCsvRowsForGroup(g);
            for (const line of lines) {
                if (line && line.trim() !== "") {
                    csvRows.push(line);
                }
            }
        }
        return csvRows;
    }

    //
    // 12. MERGE:
    //     - jeśli pliku nie ma -> HEADER + nowe linie
    //     - jeśli plik jest -> zachowaj wszystko poza rekordami gdzie Source zaczyna się od "Funding_"
    //                          (czyli wywalamy stare Funding_Deposit/Funding_P2P/... i dopisujemy świeże)
    //
    function mergeIntoCsv(existingCsv, newRowsArr) {
        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...newRowsArr].join("\n");
        }

        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");

        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") === HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        const kept = lines.filter((l) => {
            const cols = l.split(";");
            const source = cols[1] || "";
            return !/^Funding_/i.test(source);
        });

        return [header, ...kept, ...newRowsArr].join("\n");
    }

    //
    // 13. Zapis CSV
    //
    function saveCsv(finalRows) {
        chrome.storage.local.remove(ALL_KEYS_EXCEPT_BYBIT, () => {
            chrome.storage.local.get(BYBIT_KEY, (data) => {
                const merged = mergeIntoCsv(data?.[BYBIT_KEY], finalRows);
                chrome.storage.local.set({
                    [BYBIT_KEY]: merged
                }, () => {
                    if (!chrome.runtime.lastError) {
                        chrome.runtime.sendMessage({
                            action: "dataSaved"
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    }
                });
            });
        });
    }

    //
    // 14. Główne wykonanie
    //
    (async () => {
        try {
            // a) zbierz WSZYSTKIE strony funding
            const allRows = await collectAllPagesRows();
            if (!allRows.length) {
                alert("Brak danych do eksportu (Funding).");
                return;
            }

            // b) zgrupuj po czasie z tolerancją 10s
            const groups = groupRowsByTime(allRows);

            // c) zbuduj linie CSV wg logiki operacyjnej
            const finalCsvRows = buildAllCsvRowsFromGroups(groups);

            if (!finalCsvRows.length) {
                alert("Zebrano rekordy Funding, ale żaden nie pasuje do reguł eksportu.");
                return;
            }

            // d) zapisz do chrome.storage.local (czyści stare Funding_* i dopina nowe)
            saveCsv(finalCsvRows);
        } catch (e) {
            console.error("Bybit Funding error:", e);
            alert("Błąd podczas zbierania danych z Funding (zobacz konsolę F12).");
        }
    })();
}



// ===================== BYBIT UNIFIED TRADING ACCOUNT =====================
function extractAndSaveTable_bybitUnified(ALL_KEYS_EXCEPT_BYBIT) {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Unified_Trading_Account";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // Time cell wygląda jak "2024-09-08\n10:55:12" (bo było <br>)
    // Robimy z tego "2024-09-08 10:55:12"
    const normalizeDateTimeCell = (cell) => {
        // weź surowy text z <span>2024-09-08\n10:55:12</span>
        const raw = txt(cell).replace(/\s+/g, " ").trim(); // np. "2024-09-08 10:55:12"
        // teraz spróbujmy dopasować
        const m = raw.match(
            /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/
        );
        if (!m) return raw;
        const date = m[1];
        let time = m[2];
        // jeśli HH:MM bez sekund -> dodaj :00
        if (/^\d{2}:\d{2}$/.test(time)) {
            time = time + ":00";
        }
        return `${date} ${time}`;
    };

    // Kolumna Change ma wartości typu "+0.58241700" / "-75.5335"
    // Chcemy bez znaku, z kropką
    const cleanChange = (cell) => {
        const v = txt(cell); // np. "+0.58241700"
        const m = v.match(/[+-]?\d+(?:[.,]\d+)?/);
        if (!m) return "";
        return m[0].replace(/^[+-]/, "").replace(",", ".");
    };

    function collectPageRows() {
        // Nowy DOM wg zrzutu:
        // <div class="by-table">
        //   <div class="by-table-container">
        //     <div class="by-table-row by-table-row-header">...</div>
        //     <div class="by-table-body">
        //        <div class="by-table-row">
        //          <div class="by-table-cell-group">
        //             <div class="by-table-cell">Time</div>          // index 0
        //             <div class="by-table-cell">Currency</div>      // index 1
        //             <div class="by-table-cell">Contract</div>      // index 2
        //             <div class="by-table-cell">Type</div>          // index 3
        //             <div class="by-table-cell">Direction</div>     // index 4
        //             <div class="by-table-cell">Quantity</div>      // index 5
        //             <div class="by-table-cell">Position</div>      // index 6
        //             <div class="by-table-cell">Filled Price</div>  // index 7
        //             <div class="by-table-cell">Funding</div>       // index 8
        //             <div class="by-table-cell">Fee Paid</div>      // index 9
        //             <div class="by-table-cell">Cash Flow</div>     // index 10
        //             <div class="by-table-cell">Change</div>        // index 11  <-- Qty
        //             <div class="by-table-cell">Wallet Balance</div>// index 12
        //             <div class="by-table-cell">Action</div>        // index 13
        //          </div>
        //        </div>
        //     ...
        //   </div>
        // </div>

        const body =
            document.querySelector(".by-table .by-table-body") ||
            document.querySelector(".by-table-body");

        const rowEls = Array.from(body?.querySelectorAll(".by-table-row") || []);
        const out = [];

        for (const row of rowEls) {
            // pomijamy header
            if (row.classList.contains("by-table-row-header")) continue;

            const cells = row.querySelectorAll(".by-table-cell-group .by-table-cell");
            if (!cells || cells.length < 12) continue; // potrzebujemy przynajmniej do indeksu 11

            const timeCell = cells[0];
            const currencyCell = cells[1];
            const typeCell = cells[3];
            const changeCell = cells[11];

            const dateTime = normalizeDateTimeCell(timeCell); // "2024-09-08 10:55:12"
            const currency = txt(currencyCell); // "SOL", "USDT"
            const type = txt(typeCell); // "Trade", "Transfer in", ...
            const qtyNoSign = cleanChange(changeCell); // "0.58241700", "75.5335", ...

            // żeby nie pakować pustych śmieci
            if (!dateTime || !currency || !qtyNoSign) continue;

            // Kolumna ID mamy pustą, bo Unified tu go nie podaje
            // Fee też zostaje puste, bo w tym eksporcie nie mamy fee specyficznego za tę zmianę
            out.push(
                [
                    "", // ID
                    SOURCE, // Source
                    dateTime, // Date_time
                    currency, // Coin
                    qtyNoSign, // Qty (beż znaku +/-)
                    type, // Type
                    "" // Fee
                ].join(";")
            );
        }

        return out;
    }

    function findNextButton() {
        // Przycisk next to <button class="moly-btn">Next</button> bez disabled
        const btns = Array.from(
            document.querySelectorAll("button.moly-btn:not([disabled])")
        );
        return (
            btns.find(
                (b) => (b.textContent || "").trim().toLowerCase() === "next"
            ) || null
        );
    }

    async function collectAllPages() {
        const out = [];
        let safety = 50;
        while (safety-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            // marker treści, żeby wiedzieć że przeskoczyliśmy stronę
            const markerBefore =
                document.querySelector(
                    ".by-table .by-table-body .by-table-row .by-table-cell-group .by-table-cell"
                )?.textContent || "";

            nextBtn.click();

            for (let i = 0; i < 40; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        ".by-table .by-table-body .by-table-row .by-table-cell-group .by-table-cell"
                    )?.textContent || "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }
        return out;
    }

    function mergeIntoCsv(existingCsv, newRowsArr) {
        // jeśli nie ma jeszcze pliku -> po prostu nagłówek + nowe
        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...newRowsArr].join("\n");
        }

        // rozbij istniejący csv na linie bez pustych
        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");

        // sprawdź nagłówek
        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") ===
            HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // usuń WSZYSTKIE stare rekordy, gdzie kolumna Source == Unified_Trading_Account
        const kept = lines.filter((l) => {
            const cols = l.split(";");
            const sourceCol = cols[1] || "";
            return sourceCol !== SOURCE;
        });

        // dopisz nowe rekordy
        return [header, ...kept, ...newRowsArr].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.remove(ALL_KEYS_EXCEPT_BYBIT, () => {
            chrome.storage.local.get(BYBIT_KEY, (data) => {
                const merged = mergeIntoCsv(data[BYBIT_KEY], rowsArr);
                chrome.storage.local.set({
                        [BYBIT_KEY]: merged
                    },
                    () => {
                        if (!chrome.runtime.lastError) {
                            chrome.runtime.sendMessage({
                                action: "dataSaved"
                            });
                            chrome.runtime.sendMessage({
                                action: "checkStorage"
                            });
                        }
                    }
                );
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert("Brak danych do eksportu (Unified Trading Account).");
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Unified error:", e);
            alert("Błąd podczas zbierania danych z Unified (zobacz konsolę F12).");
        }
    })();
}



// 📋 mBank SFI – preload wszystkich wierszy + solidniejsze rozwijanie detali + podatek tylko przy konwersji
async function extractAndSaveTable_mbank(STORAGE_KEYS_ALL) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    async function waitFor(fn, {
        tries = 60,
        interval = 150
    } = {}) {
        for (let i = 0; i < tries; i++) {
            const v = fn();
            if (v) return v;
            await sleep(interval);
        }
        return null;
    }
    const parseNum = (txt) => {
        if (!txt) return null;
        const cleaned = String(txt)
            .replace(/\u00a0/g, "")
            .replace(/\s+/g, "")
            .replace(/[^\d,.\-]/g, "")
            .replace(/,/g, ".");
        const m = cleaned.match(/-?\d+(\.\d+)?/);
        return m ? Number(m[0]) : null;
    };

    // Znajdź najbliższy scrollowalny kontener (lista historii SFI zwykle w środku panelu)
    const getScrollParent = (el) => {
        let node = el?.parentElement;
        while (node) {
            const style = getComputedStyle(node);
            const canScroll = /(auto|scroll)/.test(style.overflowY || style.overflow);
            if (canScroll && node.scrollHeight > node.clientHeight) return node;
            node = node.parentElement;
        }
        return document.scrollingElement || document.documentElement || document.body;
    };

    // Najpierw znajdź JAKIKOLWIEK wiersz, by odnaleźć kontener
    const anyRow = document.querySelector(
        'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:SourceFund"],' +
        'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:DestinationFund"]'
    );
    if (!anyRow) {
        alert("Nie znaleziono wierszy FundsHistory:SourceFund*/DestinationFund*.");
        return;
    }

    const scroller = getScrollParent(anyRow);

    // ⬇️ Preload wszystkich wierszy – przewijaj do dołu dopóki przybywa
    async function preloadAllRows(maxRounds = 20) {
        let lastCount = 0;
        for (let round = 0; round < maxRounds; round++) {
            const currRows = document.querySelectorAll(
                'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:SourceFund"],' +
                'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:DestinationFund"]'
            );
            const count = currRows.length;
            // scrolluj do dołu, by wywołać doładowanie
            scroller.scrollTop = scroller.scrollHeight;
            await sleep(400);
            if (count === lastCount) {
                // spróbuj jeszcze raz dociągnąć — małe potrząśnięcie
                scroller.scrollTop = scroller.scrollHeight;
                await sleep(400);
                const newCount = document.querySelectorAll(
                    'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:SourceFund"],' +
                    'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:DestinationFund"]'
                ).length;
                if (newCount === count) break; // nic już nie przybywa
                lastCount = newCount;
            } else {
                lastCount = count;
            }
        }
    }

    await preloadAllRows();

    // Teraz pobierz pełną listę
    const rows = Array.from(document.querySelectorAll(
        'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:SourceFund"],' +
        'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:DestinationFund"]'
    ));
    if (!rows.length) {
        alert("Po preloadzie nadal brak wierszy.");
        return;
    }

    const results = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
            // Przy wirtualizacji warto dopilnować widoczności przed kliknięciem
            row.scrollIntoView({
                block: "center"
            });
            await sleep(120);

            // Indeks z SourceFundX / DestinationFundX
            const dtid = row.getAttribute("data-test-id") || "";
            const m = dtid.match(/(?:SourceFund|DestinationFund)(\d+)/);
            const idx = m ? m[1] : "0";

            // Typ operacji (kolumna 3 zwykle – ale dajmy fallback)
            let typeText = (row.querySelector('td:nth-child(3) span')?.textContent || "").trim().toLowerCase();
            if (!typeText) {
                typeText = (row.querySelector('td:nth-child(3)')?.textContent || "").trim().toLowerCase();
            }

            // Kwota z listy (działa nawet bez detali)
            const valueRaw = row.querySelector('[data-test-id$=":Value"] [data-component="Amount"]')?.textContent ||
                row.querySelector('[data-component="Amount"]')?.textContent ||
                "";
            const valueAbs = Math.abs(parseNum(valueRaw) ?? 0);

            // Otwórz szczegóły — najpierw klik w wiersz…
            if (row.getAttribute("aria-expanded") !== "true") row.click();
            // …fallback: spróbuj kliknąć dowolny przycisk w wierszu
            if (row.getAttribute("aria-expanded") !== "true") {
                row.querySelector('button, [role="button"]')?.click();
            }
            // ⏳ daj UI 500 ms na rozwinięcie szczegółów
            await sleep(500);

            // Czekaj aż pokaże się sąsiadujący TR z detalami
            const detailsRow = await waitFor(() => {
                const next = row.nextElementSibling;
                return (next &&
                    next.getAttribute("data-component") === "DesktopBodyRowDetails" &&
                    next.getAttribute("aria-hidden") === "false") ? next : null;
            });
            if (!detailsRow) {
                // Nie udało się rozwinąć – zanotuj minimalne info (wartość + typ), żeby czegoś nie zgubić
                const minimal = (['operacja', ''].includes(typeText) ? 'Operacja' :
                    typeText.includes('odkup') ? 'Sprzedaż' :
                    typeText.includes('nabycie') ? 'Kupno' :
                    typeText.includes('konwersja') ? 'Konwersja' : typeText);
                results.push([minimal, "", "", "", valueAbs.toFixed(2), ""].join(";"));
                continue;
            }

            // Szybkie query po HistoryDetails
            const q = (name) => detailsRow.querySelector(`[data-test-id="HistoryDetails${idx}:${name}"] span`)?.textContent?.trim() || "";
            const qAny = (name) => detailsRow.querySelector(`[data-test-id^="HistoryDetails"][data-test-id$=":${name}"] span`)?.textContent?.trim() || "";

            // Pary LabelData (fallbacki pod różne „modele” UI)
            const labelPairs = Array.from(detailsRow.querySelectorAll('[data-test-id="LabelData:label"]')).map(lbl => {
                const label = lbl.textContent.trim().toLowerCase();
                const dataEl = lbl.closest('[data-component="Box"]')?.querySelector('[data-test-id="LabelData:data"]');
                const val = dataEl ? (dataEl.querySelector('span, [data-component="Amount"]')?.textContent?.trim() || "") : "";
                return {
                    label,
                    val
                };
            });
            const getLabel = (needle) => labelPairs.find(p => p.label.includes(needle))?.val || "";

            const valuationDate = q("ValuationDate") || qAny("ValuationDate") || getLabel("data wyceny");

            // Prosty przypadek — pojedynczy fundusz/jednostki
            let singleName = q("Name") || qAny("Name") || getLabel("nazwa funduszu") || "";
            const singleUnitsT = q("Units") || qAny("Units") || getLabel("liczba jednostek") || "";
            const singleUnits = (parseNum(singleUnitsT)?.toString()) ?? (singleUnitsT || "");

            let rodzaj;
            if (typeText.includes("odkup")) rodzaj = "Sprzedaż";
            else if (typeText.includes("nabycie")) rodzaj = "Kupno";
            else if (typeText.includes("konwersja")) rodzaj = "Konwersja";
            else rodzaj = (typeText || "Operacja").replace(/\s+/g, " ");

            if (rodzaj === "Konwersja") {
                // Podatek tylko dla konwersji
                let taxTxt = q("Tax") || qAny("Tax") || getLabel("podatek");
                const taxStr = ((parseNum(taxTxt) ?? 0).toFixed(2));

                // Wyciągnij 2 nazwy i 2 liczby jednostek (from/to)
                const nameNodes = Array.from(detailsRow.querySelectorAll('[data-test-id^="HistoryDetails"][data-test-id$=":Name"] span'));
                const unitNodes = Array.from(detailsRow.querySelectorAll('[data-test-id^="HistoryDetails"][data-test-id$=":Units"] span'));

                let fromName, toName, fromUnits, toUnits;

                if (nameNodes.length >= 2 && unitNodes.length >= 2) {
                    fromName = nameNodes[0]?.textContent?.trim() || "";
                    toName = nameNodes[1]?.textContent?.trim() || "";
                    fromUnits = parseNum(unitNodes[0]?.textContent || "") ?? (unitNodes[0]?.textContent?.trim() || "");
                    toUnits = parseNum(unitNodes[1]?.textContent || "") ?? (unitNodes[1]?.textContent?.trim() || "");
                } else {
                    const names = labelPairs.filter(p => p.label.includes("nazwa funduszu")).map(p => p.val);
                    const unitsArr = labelPairs.filter(p => p.label.includes("liczba jednostek")).map(p => p.val);
                    if (names.length >= 2 && unitsArr.length >= 2) {
                        fromName = names[0] || "";
                        toName = names[1] || "";
                        fromUnits = parseNum(unitsArr[0]) ?? (unitsArr[0] || "");
                        toUnits = parseNum(unitsArr[1]) ?? (unitsArr[1] || "");
                    }
                }

                // Dodatkowy fallback: nazwy z wiersza listy (Source/Destination)
                if ((fromName === undefined || toName === undefined)) {
                    const srcFund = row.querySelector(`[data-test-id$="SourceFund${idx}:Fund"]`)?.textContent?.trim();
                    const dstFund = row.querySelector(`[data-test-id$="DestinationFund${idx}:Fund"]`)?.textContent?.trim();
                    if (srcFund && dstFund) {
                        fromName = fromName ?? srcFund;
                        toName = toName ?? dstFund;
                    }
                }

                if (fromName !== undefined && toName !== undefined) {
                    results.push(['Konwersja umorzenie', fromName, fromUnits ?? "", valuationDate, valueAbs.toFixed(2), taxStr].join(';'));
                    results.push(['Konwersja nabycie', toName, toUnits ?? "", valuationDate, valueAbs.toFixed(2), taxStr].join(';'));
                } else {
                    // ostateczny fallback — jeden wiersz, by nic nie zgubić
                    if (!singleName) {
                        singleName = row.querySelector(`[data-test-id$="SourceFund${idx}:Fund"]`)?.textContent?.trim() ||
                            row.querySelector(`[data-test-id$="DestinationFund${idx}:Fund"]`)?.textContent?.trim() ||
                            "";
                    }
                    results.push(['Konwersja', singleName, singleUnits, valuationDate, valueAbs.toFixed(2), taxStr].join(";"));
                }

            } else {
                // Kupno / Sprzedaż / Operacja – podatek pusty
                const emptyTax = "";
                results.push([rodzaj, singleName, singleUnits, valuationDate, valueAbs.toFixed(2), emptyTax].join(";"));
            }

            // Zamknij detale (porządek na stronie, ale nie jest to konieczne)
            const closeBtn = detailsRow.querySelector('[data-test-id$="CloseButton"]');
            if (closeBtn) {
                closeBtn.click();
                await sleep(60);
            }
        } catch (e) {
            // pomijamy pojedyncze błędy
        }
    }

    if (!results.length) {
        alert("Brak danych do eksportu.");
        return;
    }

    const filename = "mbank_export.csv";
    const headers = ["Rodzaj", "Fundusz", "Ilość jednostek", "Data wyceny", "Wartość", "Podatek"];
    const csv = [headers, ...results.map(r => r.split(";"))].map(r => r.join(";")).join("\n");


    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        chrome.storage.local.set({
            [filename]: csv
        }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                    action: "dataSaved"
                });
                chrome.runtime.sendMessage({
                    action: "checkStorage"
                });
            }
        });
    });
}

function extractAndSaveTable_paribas(STORAGE_KEYS_ALL) {
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

    // 🔒 helper LOKALNY (musi być w tej funkcji)
    function normalizePlAmount(raw) {
        if (!raw) return "";
        let s = String(raw);
        s = s.replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ");
        s = s.replace(/\s+/g, " ").trim();
        s = s.replace(/[^\d,.\-\s]/g, "");
        s = s.replace(/(\d)\s+(?=\d)/g, "$1");
        if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "");
        s = s.replace(",", ".");
        return s.trim();
    }

    const transactions = Array.from(
        document.querySelectorAll("tr.nx-table-row.table__tr")
    );

    // 1️⃣ OTWÓRZ SZCZEGÓŁY (klik „Ukryj” = już otwarte)
    transactions.forEach(tr => {
        const btn = tr.querySelector("a.nx-button, button.nx-button");
        const nextRow = tr.nextElementSibling;
        const opened =
            nextRow &&
            nextRow.className.includes("history-table__details") &&
            nextRow.querySelector("app-transaction-details");

        if (!opened && btn) {
            const label = btn.textContent.trim();
            if (label !== "Ukryj") btn.click();
        }
    });

    // 2️⃣ POCZEKAJ NA ANGULAR I ZBIERZ DANE
    setTimeout(() => {
        transactions.forEach(tr => {

            // 🔹 kolumny Z TABELI (zgodnie z <thead>)
            const tds = tr.querySelectorAll("td");

            if (tds.length < 6) return;

            // thead:
            // 0 → Data złożenia
            // 1 → Typ transakcji
            // 2 → Typ oświadczenia/dyspozycji
            // 3 → Jednostki/Wartość
            // 4 → Fundusz/Produkt

            const typOswiadczenia = tds[2]?.textContent.trim() || "";

            const detailsTr = tr.nextElementSibling;
            if (!detailsTr) return;

            const details = detailsTr.querySelector("app-transaction-details");
            if (!details) return;

            const getValue = (label) => {
                const props = details.querySelectorAll("app-property");
                for (const p of props) {
                    const lbl = p.querySelector("span.label");
                    if (lbl && lbl.textContent.trim() === label) {
                        const h4 = p.querySelector("h4.ng-star-inserted");
                        return h4?.textContent.trim() || "";
                    }
                }
                return "";
            };

            const dataWyceny = getValue("Data wyceny");
            const fundusz = getValue("Fundusz docelowy");
            const typTransakcji = getValue("Typ transakcji");

            const liczbaJUraw = getValue("Liczba jednostek transakcji");
            const wanjuRaw = getValue("WANJU dla transakcji");

            const liczbaJU = normalizePlAmount(liczbaJUraw);
            const wanju = normalizePlAmount(wanjuRaw);

            rows.push([
                `"${dataWyceny}"`,
                `"${fundusz}"`,
                `"${typTransakcji}"`,
                `"${typOswiadczenia}"`,
                liczbaJU,
                wanju
            ]);
        });

        if (rows.length <= 1) {
            return alert("Brak danych do eksportu.");
        }

        const csvContent = rows.map(r => r.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({ [filename]: csvContent }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({ action: "dataSaved" });
                    chrome.runtime.sendMessage({ action: "checkStorage" });
                }
            });
        });

    }, 1500);
}



// 📋 Wyciągnięcie danych z tabeli investors i zapisanie jako CSV

function extractAndSaveTable_investors(STORAGE_KEYS_ALL) {

  function normalizePlAmount(raw) {
    if (raw == null) return "";
    let s = String(raw);
    s = s.replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/[^\d,\.\-\s]/g, "");
    s = s.replace(/(\d)\s+(?=\d)/g, "$1");
    if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "");
    s = s.replace(",", ".");
    s = s.replace(/(?!^)-/g, "");
    return s.trim();
  }



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

    // 1. Otwieramy szczegóły – NOWA STRUKTURA
    transactions.forEach(tr => {
        const toggleBtn = tr.querySelector("button.nx-button--tertiary");
        const nextRow = tr.nextElementSibling;
        const detailsAreVisible = nextRow && nextRow.className.includes("history-table__details");

        if (!detailsAreVisible) {
            if (toggleBtn) {
                toggleBtn.click();
            } else {
                tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
        }
    });

    // 2. Czekamy aż Angular załaduje DOM
    setTimeout(() => {

        transactions.forEach(tr => {
            const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

            const detailsTr = tr.nextElementSibling;

            if (!detailsTr || !detailsTr.className.includes("history-table__details")) return;

            // NOWY PARSER PROPERTIES
            const getValue = (label) => {
                const props = detailsTr.querySelectorAll("app-property");
                for (const p of props) {
                    const spanLabel = p.querySelector("span.label");
                    if (spanLabel && spanLabel.textContent.trim() === label) {
                        const value = p.querySelector("p.nx-heading--subsection-xsmall");
                        return value?.textContent?.trim() || "";
                    }
                }
                return "";
            };

            const dataWyceny = getValue("Data wyceny");
            const fundusz = getValue("Fundusz docelowy");
            const typTransakcji = getValue("Typ transakcji");

            const liczbaJUraw = getValue("Liczba jednostek transakcji");
            const wanjuRaw = getValue("WANJU dla transakcji");

            const liczbaJU = normalizePlAmount(liczbaJUraw);
            const wanju = normalizePlAmount(wanjuRaw);


            rows.push([
                `"${dataWyceny}"`,
                `"${fundusz}"`,
                `"${typTransakcji}"`,
                `"${typOswiadczenia}"`,
                liczbaJU,
                wanju
            ]);
        });

        if (rows.length <= 1) {
            return alert("Brak danych do eksportu.");
        }

        const csvContent = rows.map(r => r.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({ [filename]: csvContent }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({ action: "dataSaved" });
                    chrome.runtime.sendMessage({ action: "checkStorage" });
                }
            });
        });

    }, 1500); // Angular potrzebuje minimalnie więcej czasu
}


// 📋 Wyciągnięcie danych z tabeli santander i zapisanie jako CSV

function extractAndSaveTable_santander(STORAGE_KEYS_ALL) {
  function normalizePlAmount(raw) {
    if (raw == null) return "";
    let s = String(raw);
    s = s.replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/[^\d,\.\-\s]/g, "");
    s = s.replace(/(\d)\s+(?=\d)/g, "$1");
    if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "");
    s = s.replace(",", ".");
    s = s.replace(/(?!^)-/g, "");
    return s.trim();
  }
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
            tr.dispatchEvent(new MouseEvent("click", {
                bubbles: true
            }));
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
                        return h4?.textContent?.trim() || "";

                    }
                }
                return "";
            };

            const dataWyceny = getValue("Data wyceny");
            const fundusz = getValue("Fundusz docelowy");
            const typTransakcji = getValue("Typ transakcji");

            const liczbaJUraw = getValue("Liczba jednostek transakcji");
            const wanjuRaw = getValue("WANJU dla transakcji");

            const liczbaJU = normalizePlAmount(liczbaJUraw);
            const wanju = normalizePlAmount(wanjuRaw);


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

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}

// 📋 Wyciągnięcie danych z tabeli milenium i zapisanie jako CSV

function extractAndSaveTable_milenium(STORAGE_KEYS_ALL) {
  function normalizePlAmount(raw) {
    if (raw == null) return "";
    let s = String(raw);
    s = s.replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/[^\d,\.\-\s]/g, "");
    s = s.replace(/(\d)\s+(?=\d)/g, "$1");
    if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "");
    s = s.replace(",", ".");
    s = s.replace(/(?!^)-/g, "");
    return s.trim();
  }
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
            tr.dispatchEvent(new MouseEvent("click", {
                bubbles: true
            }));
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
                        return h4?.textContent?.trim() || "";

                    }
                }
                return "";
            };

            const dataWyceny = getValue("Data wyceny");
            const fundusz = getValue("Fundusz docelowy");
            const typTransakcji = getValue("Typ transakcji");

            const liczbaJUraw = getValue("Liczba jednostek transakcji");
            const wanjuRaw = getValue("WANJU dla transakcji");

            const liczbaJU = normalizePlAmount(liczbaJUraw);
            const wanju = normalizePlAmount(wanjuRaw);


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

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}

// 📋 Wyciągnięcie danych z tabel Finax i zapisanie jako CSV

function extractAndSaveTable(STORAGE_KEYS_ALL) {
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

    const csvContent = filename === "finax_operacje.csv" ?
        rows.map(row => row.map(cell => `"${cell}"`).join(";")).join("\n") :
        rows.map(row => row.join(";")).join("\n");

    // 🧹 Usuwamy oba pliki – żeby był tylko jeden
    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        // 📝 Zapisujemy tylko ten aktualny
        chrome.storage.local.set({
            [filename]: csvContent
        }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                    action: "dataSaved"
                });
                chrome.runtime.sendMessage({
                    action: "checkStorage"
                });
            }
        });
    });
}

// 📋 Wyciągnięcie danych z tabel Noble i zapisanie jako CSV

function extractAndSaveTable_noble(STORAGE_KEYS_ALL) {
  function normalizePlAmount(raw) {
    if (raw == null) return "";
    let s = String(raw);
    s = s.replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/[^\d,\.\-\s]/g, "");
    s = s.replace(/(\d)\s+(?=\d)/g, "$1");
    if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "");
    s = s.replace(",", ".");
    s = s.replace(/(?!^)-/g, "");
    return s.trim();
  }
    const filename = "noble_export.csv";
    const headers = [
        "Data",
        "Papier",
        "Rodzaj operacji",
        "Liczba",
        "Kurs/Cena",
        "Prowizja DM",
        "Wartość netto",
        "Wartość brutto",
        "Emitent"
    ];
    const rows = [headers];

    const parseNumber = (text) => {
    const normalized = normalizePlAmount(text);
    if (!normalized) return "";
    const num = parseFloat(normalized);
    return Number.isFinite(num) ? num : "";
};


    // Dostosowane do nowego HTML:
    //  - wartość jest w 1. węźle tekstowym TD
    //  - waluta (np. PLN) w <span class="col-text-addon">
    const getValueWithCurrency = (td) => {
    if (!td) return "";

    const rawVal =
        (td.childNodes && td.childNodes[0] && td.childNodes[0].textContent)
            ? td.childNodes[0].textContent
            : td.textContent;

    const text = (rawVal ?? "").toString().trim();
    const currency = (td.querySelector(".col-text-addon")?.textContent || "").trim();

    // Jeśli mamy osobno walutę w addon – czyścimy tylko część liczbową normalizePlAmount
    if (currency) {
        const numeric = normalizePlAmount(text);
        return numeric ? `${numeric} ${currency}` : currency;
    }

    // Fallback: stary wzorzec "10 005,60 PLN" w jednym stringu
    // Wyciągamy walutę z końcówki, a liczbę normalizujemy helperem
    const m = text.match(/^(.*?)[\s\u00A0\u202F]*([A-Za-z]{2,5})\s*$/);
    if (m) {
        const numeric = normalizePlAmount(m[1]);
        const cur = m[2];
        return numeric ? `${numeric} ${cur}` : cur;
    }

    // Jeśli nie ma waluty – zwróć tekst (albo samą liczbę, jeśli chcesz)
    const numericOnly = normalizePlAmount(text);
    return numericOnly || text;
};


    // 1) Kliknij wszystkie przyciski w kolumnie szczegółów, jeśli ich tekst ≠ "Zamknij"
    const buttons = Array.from(document.querySelectorAll("td.col-show-instrument-history button"));
    buttons.forEach(btn => {
        const label = (btn.querySelector("span")?.textContent || btn.textContent || "").trim();
        if (label !== "Zamknij") btn.click();
    });

    // 2) Poczekaj jak w oryginale
    setTimeout(() => {
        // Główna zmiana: Noble przeszło z ui-table na p-datatable.
        // Bierzemy oba warianty, a potem i tak filtrujemy tylko te wiersze, które mają kolumnę z przyciskiem.
        const mainRowsAll = Array.from(document.querySelectorAll(
            "tbody.p-datatable-tbody > tr, tbody.ui-table-tbody > tr"
        ));
        const mainRows = mainRowsAll.filter(tr => tr.querySelector(".col-show-instrument-history"));

        for (let i = 0; i < mainRows.length; i++) {
            const mainRow = mainRows[i];
            const nextRow = mainRow.nextElementSibling;

            // Jak wcześniej: Papier i Emitent z wiersza głównego
            const papier =
                mainRow.querySelector(".col-instrument .name")?.textContent.trim() ||
                mainRow.querySelector(".col-instrument label")?.textContent.trim() || "";
            const emitent = mainRow.querySelector(".col-issuer")?.textContent.trim() || "";

            // Detale: teraz siedzą w .detailEntries i PrimeNG-owym tbody
            const tbody =
                nextRow?.querySelector(".detailEntries table tbody.p-datatable-tbody") ||
                nextRow?.querySelector(".detailEntries table tbody.ui-table-tbody") ||
                nextRow?.querySelector("table tbody.p-datatable-tbody") ||
                nextRow?.querySelector("table tbody.ui-table-tbody");

            if (!tbody) continue;

            const detailsRows = Array.from(tbody.querySelectorAll("tr"));
            for (const row of detailsRows) {
                const data = row.querySelector(".col-operation-date")?.textContent.trim() || "";
                const rodzaj = row.querySelector(".col-operation-type")?.textContent.trim() || "";
                const liczba = parseNumber(row.querySelector(".col-amount")?.textContent);
                const cena = parseNumber(row.querySelector(".col-price")?.textContent);
                const prowizja = parseNumber(row.querySelector(".col-commission")?.textContent);
                const netto = getValueWithCurrency(row.querySelector(".col-net-value"));
                const brutto = getValueWithCurrency(row.querySelector(".col-gross-value"));

                rows.push([
                    data,
                    papier,
                    rodzaj,
                    liczba,
                    cena,
                    prowizja,
                    netto,
                    brutto,
                    emitent
                ]);
            }
        }

        if (rows.length === 1) return alert("Brak danych do eksportu.");

        // CSV jak w Twoim oryginale: średniki; nagłówki + tekstowe w cudzysłowach
        const csvContent = rows.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (rowIndex === 0 || colIndex <= 2 || colIndex >= 6) return `"${cell}"`;
                return cell;
            }).join(";")
        ).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });

    }, 1000);
}


function bybit_extract_depositSpot() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_Deposit";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    const isCompleted = (statusCell) => /completed/i.test(txt(statusCell));

    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?$/);
        return m ? `${m[1]} ${m[3] ? m[2] + ":" + m[3] : m[2] + ":00"}` : raw;
    };

    function collectPageRows() {
        const rows = Array.from(document.querySelectorAll("tr.funding-records__common-table-row"));
        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            if (!tds || tds.length < 9) continue;

            const coin = txt(tds[1]); // Coin
            const qtyRaw = txt(tds[3]); // Qty
            const statusCell = tds[6]; // Status
            const dateTimeRaw = txt(tds[7]); // Date & Time

            if (!isCompleted(statusCell)) continue;

            // ⬇︎ NOWA WERSJA: żadnych + / -
            let qty = qtyRaw.replace(/\s+/g, "");
            qty = qty.replace(/^[+-]/, ""); // usuń znak na początku, jeśli jest

            const date_time = normalizeDateTime(dateTimeRaw);

            out.push(`;${SOURCE};${date_time};${coin};${qty};Deposit;`);
        }
        return out;
    }

    function findNextButton() {
        const btns = Array.from(document.querySelectorAll("button.funding-records__pagination-btn-item:not([disabled])"));
        return btns.find((b) => /next/i.test(b.textContent || "")) || null;
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;
        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:nth-child(2)"
                )?.textContent || "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:nth-child(2)"
                    )?.textContent || "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }
        return out;
    }

    const norm = (line) => String(line).replace(/\s+$/g, "");

    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            const uniq = Array.from(new Set(incoming));
            return [HEADER, ...uniq].join("\n");
        }

        const lines = existingCsv.split(/\r?\n/).filter((l) => l.trim() !== "");
        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") === HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // tu dalej Twoja istniejąca logika filtrowania Funding;
        const kept = lines.filter((l) => {
  const cols = l.split(";");
  const source = (cols[1] || "").trim();
  return !/^Funding_/i.test(source);     // usuń wszystkie Funding_*
  // albo wężej: return source !== SOURCE; // tylko dany extractor
});


        const existingSet = new Set(kept.map(norm));

        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                [BYBIT_KEY]: merged
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert("Brak rekordów ze statusem Completed w sekcji Deposit (Funding).");
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Deposit (Funding) error:", e);
            alert("Błąd podczas zbierania danych z Deposit (Funding). Sprawdź konsolę (F12).");
        }
    })();
}


function bybit_extract_withdrawSpot() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_Withdraw";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // tylko "Successfully Transferred"
    const isTransferred = (statusCell) => /successfully\s+transferred/i.test(txt(statusCell));

    // YYYY-MM-DD HH:MM -> dodaj :00
    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?$/);
        return m ? `${m[1]} ${m[3] ? `${m[2]}:${m[3]}` : `${m[2]}:00`}` : raw;
    };

    function collectPageRows() {
        const rows = Array.from(document.querySelectorAll("tr.funding-records__common-table-row"));
        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            // 0 expand, 1 Coin, 2 Chain, 3 Qty, 4 Transaction Fee, 5 Address, 6 Txid, 7 Status, 8 Date & Time, 9 Action
            if (!tds || tds.length < 10) continue;

            const coin = txt(tds[1]);
            let qtyRaw = txt(tds[3]);
            const feeRaw = txt(tds[4]);
            const statusCell = tds[7];
            const dateTimeRaw = txt(tds[8]);

            if (!isTransferred(statusCell)) continue;

            let qty = qtyRaw.replace(/\s+/g, "");
            qty = qty.replace(/^[+-]/, ""); // usuń pierwszy znak jeśli to + albo -


            const fee = feeRaw.replace(/\s+/g, ""); // zachowujemy zapis jak na stronie
            const date_time = normalizeDateTime(dateTimeRaw);

            // Source;Date_time;Coin;Qty;Type;Fee
            out.push(`;${SOURCE};${date_time};${coin};${qty};Withdraw;${fee}`);
        }
        return out;
    }

    function findNextButton() {
        const btns = Array.from(
            document.querySelectorAll("button.funding-records__pagination-btn-item:not([disabled])")
        );
        return btns.find((b) => /next/i.test(b.textContent || "")) || null;
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;
        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:nth-child(2)"
                )?.textContent || "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:nth-child(2)"
                    )?.textContent || "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }
        return out;
    }

    // normalizacja linii do porównań
    const norm = (line) => String(line).replace(/\s+$/g, "");

    // ⬇️ NOWA logika: usuń tylko "Funding;" i dopisz wyłącznie nieistniejące wiersze
    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            const uniq = Array.from(new Set(incoming));
            return [HEADER, ...uniq].join("\n");
        }

        const lines = existingCsv.split(/\r?\n/).filter((l) => l.trim() !== "");
        const hasHeader =
            lines[0] && lines[0].toLowerCase().replace(/\s/g, "") === HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // 1) usuń tylko ogólne "Funding;"
        const kept = lines.filter((l) => !/^Funding;/i.test(l.trim()));

        // 2) zbiór istniejących (po usunięciu Funding)
        const existingSet = new Set(kept.map(norm));

        // 3) dodaj tylko brakujące
        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                [BYBIT_KEY]: merged
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert("Brak rekordów ze statusem 'Successfully Transferred' w sekcji Withdraw (Funding).");
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Withdraw (Funding) error:", e);
            alert("Błąd podczas zbierania danych z Withdraw (Funding). Sprawdź konsolę (F12).");
        }
    })();
}


function bybit_extract_oneClickBuy() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_One_Click";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // "1000.00 PLN" -> {amount:"1000.00", currency:"PLN"}
    // "2.23826226 SOL" -> {amount:"2.23826226", currency:"SOL"}
    const parseAmountWithCurrency = (s) => {
        if (!s) return {
            amount: "",
            currency: ""
        };
        const cleaned = s.replace(/\s+/g, " ").trim();
        const m = cleaned.match(
            /(-?\d+(?:[.,]\d+)?)[\s]*([A-Za-z]{2,}|USDT|USDC|EUR|PLN|USD|GBP|CZK|HUF|TRY|BRL|AUD|CAD|CHF|JPY|NOK|SEK|DKK|MXN|ZAR|AED|SAR|ILS|RUB|INR|IDR|KRW|CNY|HKD|SGD)?/
        );
        if (!m) return {
            amount: "",
            currency: ""
        };
        return {
            amount: m[1].replace(",", "."),
            currency: (m[2] || "").toUpperCase()
        };
    };

    // "2025-04-03 15:44:46" -> jeśli brak sekund, dopisz :00
    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
        );
        if (!m) return raw;
        const [_, d, hh, mm, ss] = m;
        return `${d} ${hh}:${mm}:${ss ? ss : "00"}`;
    };

    const isSuccess = (statusCell) => {
        const byAttr = statusCell?.querySelector('.fiat-record__status-icon[status="success"]');
        const byText = /success/i.test(txt(statusCell));
        return !!(byAttr || byText);
    };

    function collectPageRows() {
        // kolumny: 0 Order No., 1 Qty, 2 Total Amount, 3 Price, 4 Fee, 5 Status, 6 Date & Time
        const rows = Array.from(
            document.querySelectorAll("tr.funding-records__common-table-row")
        );

        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            if (!tds || tds.length < 7) continue;

            const orderNoCell = tds[0];
            const qtyCell = tds[1];
            const totalAmountCell = tds[2];
            const feeCell = tds[4];
            const statusCell = tds[5];
            const dateTimeCell = tds[6];

            if (!isSuccess(statusCell)) continue;

            const orderNoRaw = txt(orderNoCell); // "01JQXYB9R..."
            const qtyText = txt(qtyCell); // "2.23826226 SOL"
            const totalText = txt(totalAmountCell); // "1000.00 PLN"
            const feeText = txt(feeCell); // "9.50 PLN"
            const dateTimeRaw = txt(dateTimeCell); // "2025-04-03 15:44:46"

            // parse
            let {
                amount: cryptoQty,
                currency: cryptoCoin
            } = parseAmountWithCurrency(qtyText);
            let {
                amount: fiatAmt,
                currency: fiatCoin
            } = parseAmountWithCurrency(totalText);
            const {
                amount: feeAmt
            } = parseAmountWithCurrency(feeText);

            // 🔽 usuń ewentualny znak +/- z początku wartości
            cryptoQty = cryptoQty.replace(/^[+-]/, "");
            fiatAmt = fiatAmt.replace(/^[+-]/, "");

            if (!orderNoRaw || !dateTimeRaw || !cryptoQty || !cryptoCoin || !fiatAmt || !fiatCoin) {
                continue;
            }

            const date_time = normalizeDateTime(dateTimeRaw);

            // WIERSZ 1: FIAT IN
            out.push(
                [
                    orderNoRaw,
                    SOURCE,
                    date_time,
                    fiatCoin,
                    fiatAmt,
                    "One_Click_fiat_in",
                    feeAmt || ""
                ].join(";")
            );

            // WIERSZ 2: CRYPTO OUT
            out.push(
                [
                    orderNoRaw,
                    SOURCE,
                    date_time,
                    cryptoCoin,
                    cryptoQty,
                    "One_Click_fiat_out",
                    ""
                ].join(";")
            );
        }

        return out;
    }

    function findNextButton() {
        const btns = Array.from(
            document.querySelectorAll(
                "button.funding-records__pagination-btn-item:not([disabled])"
            )
        );
        return btns.find((b) => /next/i.test(b.textContent || "")) || null;
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;

        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                )?.textContent ||
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                )?.textContent ||
                "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                    )?.textContent ||
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                    )?.textContent ||
                    "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }

        return out;
    }

    const norm = (line) => String(line).replace(/\s+$/g, "");

    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...Array.from(new Set(incoming))].join("\n");
        }

        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");

        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") ===
            HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        const kept = lines.filter((l) => {
            const cols = l.split(";");
            return cols[1] !== SOURCE;
        });

        const existingSet = new Set(kept.map(norm));

        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                [BYBIT_KEY]: merged
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert("Brak rekordów ze statusem 'Success' w sekcji One-Click Buy.");
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit One-Click Buy error:", e);
            alert("Błąd podczas zbierania danych z One-Click Buy (sprawdź konsolę F12).");
        }
    })();
}


function bybit_extract_p2p() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_P2P";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // "633.74 PLN" -> { amount:"633.74", currency:"PLN" }
    // "173.1530 USDT" -> { amount:"173.1530", currency:"USDT" }
    // "0 USDT" -> { amount:"0", currency:"USDT" }
    const parseAmountWithCurrency = (s) => {
        if (!s) return {
            amount: "",
            currency: ""
        };
        const cleaned = s.replace(/\s+/g, " ").trim();
        const m = cleaned.match(
            /(-?\d+(?:[.,]\d+)?)[\s]*([A-Za-z]{2,}|USDT|USDC|EUR|PLN|USD|GBP|CZK|HUF|TRY|BRL|AUD|CAD|CHF|JPY|NOK|SEK|DKK|MXN|ZAR|AED|SAR|ILS|RUB|INR|IDR|KRW|CNY|HKD|SGD)?/i
        );
        if (!m) return {
            amount: "",
            currency: ""
        };
        return {
            amount: m[1].replace(",", "."),
            currency: (m[2] || "").toUpperCase(),
        };
    };

    // "YYYY-MM-DD HH:MM" -> dodaj :00 jeśli brak sekund
    // "YYYY-MM-DD HH:MM:SS" -> zostaw jak jest
    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
        );
        if (!m) return raw;
        const [_, d, hh, mm, ss] = m;
        return `${d} ${hh}:${mm}:${ss ? ss : "00"}`;
    };

    const isCompleted = (cell) => /completed/i.test(txt(cell));

    function collectPageRows() {
        // kolumny:
        // 0 Qty
        // 1 Amount
        // 2 Price
        // 3 Type
        // 4 Status
        // 5 Fee
        // 6 Date & Time
        // 7 Order No.
        const rows = Array.from(
            document.querySelectorAll("tr.funding-records__common-table-row")
        );

        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            if (!tds || tds.length < 8) continue;

            const qtyText = txt(tds[0]); // "173.1530 USDT"
            const amtText = txt(tds[1]); // "633.74 PLN"
            const statusCell = tds[4]; // "Completed"
            const feeText = txt(tds[5]); // "0 USDT"
            const dateText = txt(tds[6]); // "2025-10-21 21:01:02"
            const orderNoText = txt(tds[7]); // "1980710935320780800"

            if (!isCompleted(statusCell)) continue;

            let {
                amount: cryptoAmt,
                currency: cryptoCoin
            } = parseAmountWithCurrency(qtyText);
            let {
                amount: fiatAmt,
                currency: fiatCoin
            } = parseAmountWithCurrency(amtText);
            const {
                amount: feeAmt
            } = parseAmountWithCurrency(feeText);

            // 🔽 usuń ewentualne + / - z przodu liczb
            cryptoAmt = cryptoAmt.replace(/^[+-]/, "");
            fiatAmt = fiatAmt.replace(/^[+-]/, "");

            if (
                !cryptoAmt ||
                !cryptoCoin ||
                !fiatAmt ||
                !fiatCoin ||
                !dateText ||
                !orderNoText
            ) {
                continue;
            }

            const date_time = normalizeDateTime(dateText);

            // Wiersz 1: FIAT (ile zapłaciłaś w walucie fiat)
            // Qty = CZYSTA liczba, bez "-"
            out.push(
                [
                    orderNoText,
                    SOURCE,
                    date_time,
                    fiatCoin,
                    fiatAmt,
                    "P2P_fiat",
                    feeAmt || "",
                ].join(";")
            );

            // Wiersz 2: CRYPTO (ile dostałaś krypto)
            // Qty = CZYSTA liczba, bez "+"
            out.push(
                [
                    orderNoText,
                    SOURCE,
                    date_time,
                    cryptoCoin,
                    cryptoAmt,
                    "P2P_crypto",
                    "",
                ].join(";")
            );
        }

        return out;
    }

    function findNextButton() {
        const btns = Array.from(
            document.querySelectorAll(
                "button.funding-records__pagination-btn-item:not([disabled])"
            )
        );
        return btns.find((b) => /next/i.test(b.textContent || "")) || null;
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;

        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                )?.textContent ||
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                )?.textContent ||
                "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                    )?.textContent ||
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                    )?.textContent ||
                    "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }

        return out;
    }

    const norm = (line) => String(line).replace(/\s+$/g, "");

    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...Array.from(new Set(incoming))].join("\n");
        }

        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");

        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") ===
            HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // usuń tylko stare rekordy z SOURCE === "Funding_P2P"
        const kept = lines.filter((l) => {
            const cols = l.split(";");
            return cols[1] !== SOURCE;
        });

        const existingSet = new Set(kept.map(norm));

        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                [BYBIT_KEY]: merged
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved"
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert("Brak rekordów P2P ze statusem 'Completed'.");
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit P2P error:", e);
            alert("Błąd podczas zbierania danych z P2P (sprawdź konsolę F12).");
        }
    })();
}



function bybit_extract_depositFiat() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_Deposit_Fiat";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // "640 PLN" -> { amount:"640", currency:"PLN" }
    const parseAmountWithCurrency = (s) => {
        if (!s) return {
            amount: "",
            currency: ""
        };
        const cleaned = s.replace(/\s+/g, " ").trim();
        const m = cleaned.match(/(-?\d+(?:[.,]\d+)?)[\s]*([A-Za-z]{2,})/);
        if (!m) return {
            amount: "",
            currency: ""
        };
        return {
            amount: m[1].replace(",", "."),
            currency: m[2].toUpperCase()
        };
    };

    // "6.26 PLN" -> "6.26"
    const extractNumber = (s) => {
        if (!s) return "";
        const m = s.replace(/\s+/g, " ").match(/-?\d+(?:[.,]\d+)?/);
        return m ? m[0].replace(",", ".") : "";
    };

    // "YYYY-MM-DD HH:MM" -> dodaj :00, jeśli brak sekund
    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?$/
        );
        if (!m) return raw;
        return `${m[1]} ${m[3] ? `${m[2]}:${m[3]}` : `${m[2]}:00`}`;
    };

    const isCompleted = (cell) => /completed/i.test(txt(cell));

    // kolumny: 0 Order No. | 1 Amount Received | 2 Pay | 3 Fee | 4 Payment Method | 5 Date & Time | 6 Status
    function collectPageRows() {
        const rows = Array.from(
            document.querySelectorAll("tr.funding-records__common-table-row")
        );
        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            if (!tds || tds.length < 7) continue;

            const payText = txt(tds[2]); // np. "640 PLN"
            const feeText = txt(tds[3]); // np. "6.26 PLN"
            const dateText = txt(tds[5]);
            const status = tds[6];

            if (!isCompleted(status)) continue;

            let {
                amount: payAmt,
                currency: payCurr
            } = parseAmountWithCurrency(payText);
            const feeNum = extractNumber(feeText);
            const date_time = normalizeDateTime(dateText);

            // 🔽 usuń ewentualny znak +/- z początku kwoty
            payAmt = payAmt.replace(/^[+-]/, "");

            if (!payAmt || !payCurr || !date_time) continue;

            out.push(
                [
                    "", // ID puste, bo ta funkcja go nie zbiera
                    SOURCE,
                    date_time,
                    payCurr,
                    payAmt,
                    "Deposit_Fiat",
                    feeNum
                ].join(";")
            );
        }
        return out;
    }

    function findNextButton() {
        // aktywny „Next” – brak atrybutu disabled
        const candidates = Array.from(
            document.querySelectorAll(
                "button.funding-records__pagination-btn-item:not([disabled])"
            )
        );
        return (
            candidates.find((b) => /next/i.test(b.textContent || "")) || null
        );
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;
        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            // marker zmiany strony
            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                )?.textContent ||
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                )?.textContent ||
                "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                    )?.textContent ||
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                    )?.textContent ||
                    "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }
        return out;
    }

    const norm = (line) => String(line).replace(/\s+$/g, "");

    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...Array.from(new Set(incoming))].join("\n");
        }

        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");
        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") ===
            HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // 1) usuń tylko ogólny "Funding;"
        const kept = lines.filter(
            (l) => !/^Funding;/i.test(l.trim())
        );

        const existingSet = new Set(kept.map(norm));

        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                    [BYBIT_KEY]: merged
                },
                () => {
                    if (!chrome.runtime.lastError) {
                        chrome.runtime.sendMessage({
                            action: "dataSaved"
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    }
                }
            );
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert(
                    "Brak rekordów Deposit Fiat ze statusem 'Completed'."
                );
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Deposit Fiat error:", e);
            alert(
                "Błąd podczas zbierania danych z Deposit Fiat (sprawdź konsolę F12)."
            );
        }
    })();
}


function bybit_extract_withdrawFiat() {
    const BYBIT_KEY = "bybit_export.csv";
    const SOURCE = "Funding_Withdraw_Fiat";
    const HEADER = "ID;Source;Date_time;Coin;Qty;Type;Fee";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const txt = (el) => (el?.textContent || "").replace(/\u00a0/g, " ").trim();

    // np. "332.31 PLN" → { amount: "332.31", currency: "PLN" }
    const parseAmountWithCurrency = (s) => {
        if (!s) return {
            amount: "",
            currency: ""
        };
        const cleaned = s.replace(/\s+/g, " ").trim();
        const m = cleaned.match(/(-?\d+(?:[.,]\d+)?)[\s]*([A-Za-z]{2,})/);
        if (!m) return {
            amount: "",
            currency: ""
        };
        return {
            amount: m[1].replace(",", "."),
            currency: m[2].toUpperCase()
        };
    };

    // np. "0 PLN" → "0"
    const extractNumber = (s) => {
        if (!s) return "";
        const m = s.match(/-?\d+(?:[.,]\d+)?/);
        return m ? m[0].replace(",", ".") : "";
    };

    // "YYYY-MM-DD HH:MM" → dodaj :00, jeśli brak sekund
    const normalizeDateTime = (s) => {
        const raw = (s || "").trim().replace(/\s+/g, " ");
        const m = raw.match(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?$/
        );
        if (!m) return raw;
        return `${m[1]} ${m[3] ? `${m[2]}:${m[3]}` : `${m[2]}:00`}`;
    };

    const isCompleted = (cell) => /completed/i.test(txt(cell));

    // kolumny: 0 Order No. | 1 Receive | 2 Fee | 3 Amount | 4 Receive with | 5 Date & Time | 6 Status
    function collectPageRows() {
        const rows = Array.from(
            document.querySelectorAll("tr.funding-records__common-table-row")
        );
        const out = [];

        for (const tr of rows) {
            const tds = tr.querySelectorAll("td.ant-table-cell");
            if (!tds || tds.length < 7) continue;

            const receiveText = txt(tds[1]); // np. "332.31 PLN"
            const feeText = txt(tds[2]); // np. "0 PLN"
            const dateText = txt(tds[5]);
            const status = tds[6];

            if (!isCompleted(status)) continue;

            let {
                amount: recvAmt,
                currency: recvCurr
            } =
            parseAmountWithCurrency(receiveText);
            const feeNum = extractNumber(feeText);
            const date_time = normalizeDateTime(dateText);

            // 🔽 usuń ewentualny znak +/- z początku wartości wypłaty
            recvAmt = recvAmt.replace(/^[+-]/, "");

            if (!recvAmt || !recvCurr || !date_time) continue;

            out.push(
                [
                    "", // ID brak na tej stronie
                    SOURCE,
                    date_time,
                    recvCurr,
                    recvAmt, // bez żadnego "-" już
                    "Withdraw_Fiat",
                    feeNum
                ].join(";")
            );
        }
        return out;
    }

    function findNextButton() {
        const btns = Array.from(
            document.querySelectorAll(
                "button.funding-records__pagination-btn-item:not([disabled])"
            )
        );
        return btns.find((b) => /next/i.test(b.textContent || "")) || null;
    }

    async function collectAllPages() {
        const out = [];
        let guard = 100;
        while (guard-- > 0) {
            out.push(...collectPageRows());

            const nextBtn = findNextButton();
            if (!nextBtn) break;

            const markerBefore =
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                )?.textContent ||
                document.querySelector(
                    "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                )?.textContent ||
                "";

            nextBtn.click();

            for (let i = 0; i < 50; i++) {
                await sleep(200);
                const markerAfter =
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:last-child"
                    )?.textContent ||
                    document.querySelector(
                        "tr.funding-records__common-table-row td.ant-table-cell:first-child"
                    )?.textContent ||
                    "";
                if (markerAfter && markerAfter !== markerBefore) break;
            }
        }
        return out;
    }

    const norm = (line) => String(line).replace(/\s+$/g, "");

    function mergeIntoCsv(existingCsv, newRowsArr) {
        const incoming = (newRowsArr || []).map(norm);

        if (!existingCsv || !existingCsv.trim()) {
            return [HEADER, ...Array.from(new Set(incoming))].join("\n");
        }

        const lines = existingCsv
            .split(/\r?\n/)
            .filter((l) => l.trim() !== "");
        const hasHeader =
            lines[0] &&
            lines[0].toLowerCase().replace(/\s/g, "") ===
            HEADER.toLowerCase().replace(/\s/g, "");
        const header = hasHeader ? lines.shift() : HEADER;

        // 1) usuń tylko ogólny "Funding;"
        const kept = lines.filter(
            (l) => !/^Funding;/i.test(l.trim())
        );

        const existingSet = new Set(kept.map(norm));

        for (const r of incoming) {
            if (!existingSet.has(r)) {
                kept.push(r);
                existingSet.add(r);
            }
        }

        return [header, ...kept].join("\n");
    }

    function saveCsv(rowsArr) {
        chrome.storage.local.get(BYBIT_KEY, (data) => {
            const merged = mergeIntoCsv(data?.[BYBIT_KEY], rowsArr);
            chrome.storage.local.set({
                    [BYBIT_KEY]: merged
                },
                () => {
                    if (!chrome.runtime.lastError) {
                        chrome.runtime.sendMessage({
                            action: "dataSaved"
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    }
                }
            );
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                alert(
                    "Brak rekordów Withdraw Fiat ze statusem 'Completed'."
                );
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Withdraw Fiat error:", e);
            alert(
                "Błąd podczas zbierania danych z Withdraw Fiat (sprawdź konsolę F12)."
            );
        }
    })();
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
    const bybitIcon = document.getElementById("bybitIcon");

    // Domyślnie ukryj obie
    finaxIcon.style.display = "none";
    mbankIcon.style.display = "none";
    paribasIcon.style.display = "none";
    mileniumIcon.style.display = "none";
    investorsIcon.style.display = "none";
    santanderIcon.style.display = "none";
    nobleIcon.style.display = "none";
    bybitIcon.style.display = "none";

    // Sprawdź aktywną zakładkę
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        const url = tabs[0]?.url || "";

        if (url.includes("finax")) {
            finaxIcon.style.display = "inline-block";
        }
        if (url.includes("mbank")) {
            mbankIcon.style.display = "inline-block";
        }
        if (url.includes("paribas")) {
            paribasIcon.style.display = "inline-block"
        }
        if (url.includes("millennium")) {
            mileniumIcon.style.display = "inline-block"
        }
        if (url.includes("investors")) {
            investorsIcon.style.display = "inline-block"
        }
        if (url.includes("santander")) {
            santanderIcon.style.display = "inline-block"
        }
        if (url.includes("bybit")) {
            bybitIcon.style.display = "inline-block";

        } else if (url.includes("noble")) {
            nobleIcon.style.display = "inline-block"
        }
    });
}

document.addEventListener("DOMContentLoaded", updateVisibleIcon);

// 🌐 Obsługa kliknięć w ikonki na dole popupu

document.getElementById("finaxIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://finax.eu"
    });
});
document.getElementById("myfundIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://myfund.pl"
    });
});
document.getElementById("mbankIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://www.mbank.pl"
    });
});
document.getElementById("paribasIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://sti24.tfi.bnpparibas.pl/"
    });
});
document.getElementById("mileniumIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://millenniumtfi.sti24.pl/"
    });
});
document.getElementById("investorsIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://online24.investors.pl/"
    });
});
document.getElementById("santanderIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://online.santander-ppk.pl/"
    });
});
document.getElementById("nobleIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://mynsapp.noblesecurities.pl/"
    });
});
document.getElementById("bybitIcon").addEventListener("click", () => {
    chrome.tabs.create({
        url: "https://www.bybit.com"
    });
});

const clearDataIcon = document.getElementById("clearDataIcon");
clearDataIcon.addEventListener("click", () => {
    if (clearDataIcon.dataset.hasData === "true") {
        chrome.storage.local.remove(STORAGE_KEYS.ALL, () => {
            if (!chrome.runtime.lastError) {
                checkStoredData(); // 🔄 Aktualizacja ikony kosza
                actionContainer.innerHTML = ""; // 🧹 Ukryj przyciski natychmiast
                updateActionButtons(); // 🔁 Odśwież listę przycisków
                sendMessageToPage("🗑️ Dane zostały usunięte!");
            }
        });
    }
});


function checkStoredData() {
    chrome.storage.local.get(STORAGE_KEYS.ALL, (items) => {
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
        chrome.storage.local.remove(STORAGE_KEYS.ALL, () => {
            if (!chrome.runtime.lastError) {
                checkStoredData();
                actionContainer.innerHTML = "";
                updateActionButtons();
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, (tabs) => {

                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "showPageMessage",
                        hasData: true
                    });
                });
            }
        });
    } else {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "showPageMessage",
                hasData: false
            });
        });
    }
});