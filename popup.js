// Globalna konfiguracja popupu i kluczy używanych do wymiany danych między serwisami.
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
        "erste_export.csv",
        "noble_export.csv",
        "bybit_export.csv",
        "pekao_ikze_export.csv",
        "analizy_pl_export.csv",
        "nn_ofe_export.csv"
    ],
    EXCEPT_BYBIT: [
        "finax_transakcje.csv",
        "finax_operacje.csv",
        "mbank_export.csv",
        "paribas_export.csv",
        "milenium_export.csv",
        "investors_export.csv",
        "erste_export.csv",
        "noble_export.csv",
        "pekao_ikze_export.csv",
        "analizy_pl_export.csv",
        "nn_ofe_export.csv"
    ]
};

// Zestaw prostych helperów do pracy na aktywnej karcie i do uruchamiania skryptów w kontekście strony.
const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    return tab;
};

const executeOnTab = (tabId, func, args = []) => {
    if (!tabId) return;
    chrome.scripting.executeScript({
        target: {
            tabId
        },
        function: func,
        args
    });
};

const openInNewTab = (url) => chrome.tabs.create({
    url
});

// Wspólny wygląd komunikatów pokazywanych bezpośrednio na stronie źródłowej lub w MyFund.
const PAGE_MESSAGE_THEME = {
    success: {
        backgroundColor: "#d4edda",
        color: "#155724",
        borderColor: "#c3e6cb"
    },
    error: {
        backgroundColor: "#f8d7da",
        color: "#842029",
        borderColor: "#f5c2c7"
    },
    empty: {
        backgroundColor: "#fff3cd",
        color: "#856404",
        borderColor: "#ffeeba"
    }
};

function showPageMessage(messageText, variant = "success") {
    const theme = PAGE_MESSAGE_THEME[variant] || PAGE_MESSAGE_THEME.success;
    const message = document.createElement("div");
    message.textContent = messageText;
    Object.assign(message.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        padding: "16px 22px",
        border: `1px solid ${theme.borderColor}`,
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        lineHeight: "1.4",
        textAlign: "center",
        maxWidth: "320px",
        boxShadow: "0 10px 24px rgba(2, 14, 31, 0.12)"
    });
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function importCsvToMyfund({
    selectValue,
    fileName,
    csvContent,
    retryAttempts = 0
}) {
    const select = document.querySelector('select#bank');
    if (select) {
        select.value = selectValue;
        select.dispatchEvent(new Event('change', {
            bubbles: true
        }));
    }

    const input = document.querySelector('input[type="file"]#imagefile');
    if (!input) {
        alert("Nie znaleziono pola do przesłania pliku.");
        return;
    }

    const csvBlob = new Blob([csvContent], {
        type: 'text/csv'
    });
    const file = new File([csvBlob], fileName, {
        type: "text/csv"
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event('change', {
        bubbles: true
    }));

    const tryClick = () => {
        const submitButton = document.querySelector('#submit1');
        if (submitButton) {
            submitButton.click();
            return;
        }

        if (tryClick.attempts < retryAttempts) {
            tryClick.attempts++;
            setTimeout(tryClick, 200);
        } else {
            alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
        }
    };

    tryClick.attempts = 0;
    setTimeout(tryClick, 300);
}

// Wczesna inicjalizacja popupu ustawia wysokość okna zależnie od bardziej rozbudowanego widoku Bybit.
document.addEventListener("DOMContentLoaded", async () => {
    const tab = await getActiveTab();
    const url = tab.url || "";

    const body = document.body;

    if (url.includes("bybit")) {
        body.style.height = "700px";
    } else {
        body.style.height = "530px"; // domyślnie
    }
});


// Główny bootstrap popupu: rozpoznanie aktywnej strony, konfiguracja przycisków i podpięcie zdarzeń.
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
    const tab = await getActiveTab();
    const tabUrl = tab.url;
    const tabId = tab?.id;
    const isMbankHistoryPage = (url) => url.includes("mbank.pl") && (
        url.includes("wallet/sfi/history") ||
        url.includes("investment-funds/history") ||
        url.includes("investment-pension/history")
    );
    const supportedPopupHost = /bybit|noble|erste|investors|milenium|paribas|mbank|finax|myfund|pekao24|epekaotfi|analizy\.pl|moje\.nn\.pl|logowanie\.nn\.pl/i;
    const isNnPage = (url) => url.includes("moje.nn.pl") || url.includes("logowanie.nn.pl");
    const isNnHistoryPage = (url) => url.includes("moje.nn.pl") && (
        url.includes("/pension-fund/ofe/popup/history") ||
        url.includes("moje.nn.pl:pension-fund:ofe:popup:history")
    );

    // Pomocnik do wypełnienia formularza importu w MyFund przygotowanym plikiem CSV.
    const setImportFile = ({
        selectValue,
        fileName,
        csvContent,
        retryAttempts = 0
    }) => {
        const select = document.querySelector('select#bank');
        if (select) {
            select.value = selectValue;
            select.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }

        const input = document.querySelector('input[type="file"]#imagefile');
        if (!input) {
            alert("Nie znaleziono pola do przesłania pliku.");
            return;
        }

        const csvBlob = new Blob([csvContent], {
            type: 'text/csv'
        });
        const file = new File([csvBlob], fileName, {
            type: "text/csv"
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

        const tryClick = () => {
            const submitButton = document.querySelector('#submit1');
            if (submitButton) {
                submitButton.click();
                return;
            }

            if (tryClick.attempts < retryAttempts) {
                tryClick.attempts++;
                setTimeout(tryClick, 200);
            } else {
                alert("Nie znaleziono przycisku 'Pobierz z pliku'.");
            }
        };

        tryClick.attempts = 0;
        setTimeout(tryClick, 300);
    };

    // 📤 Wklejanie transakcji Finax do formularza MyFund

    function insertTransactions(csvContent) {
        setImportFile({
            selectValue: 'finaxXls',
            fileName: "finax_transakcje.csv",
            csvContent
        });
    }

    // 📤 Wklejanie operacji Finax do formularza MyFund

    function insertOperations(csvContent) {
        setImportFile({
            selectValue: 'finaxXls',
            fileName: "finax_operacje.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    function insertTransactions_bybit(csvContent) {
        setImportFile({
            selectValue: 'ByBitWtyczka',
            fileName: "bybit_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }
    // 📤 Wklejanie transakcji mBank SFI do formularza MyFund

    function insertTransactions_mbank(csvContent) {
        setImportFile({
            selectValue: 'mBankSFI',
            fileName: "mbank_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // 📤 Wklejanie operacji Paribas do formularza MyFund

    function insertTransactions_paribas(csvContent) {
        setImportFile({
            selectValue: 'BNPParibas',
            fileName: "paribas_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // 📤 Wklejanie operacji Milenium do formularza MyFund

    function insertTransactions_milenium(csvContent) {
        setImportFile({
            selectValue: 'MillenniumPPK',
            fileName: "milenium_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // 📤 Wklejanie operacji Investors do formularza MyFund

    function insertTransactions_investors(csvContent) {
        setImportFile({
            selectValue: 'INVESTORSPPK',
            fileName: "investors_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // Specjalny ekstraktor Noble działa na rozwijanych wierszach i składa dane z części głównej oraz detali.
    function extractAndSaveTable_noble(STORAGE_KEYS_ALL) {
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

    const parseNumber = (text) => {
        const normalized = normalizePlAmount(text);
        if (!normalized) return "";
        const num = parseFloat(normalized);
        return Number.isFinite(num) ? num : "";
    };

    const getValueWithCurrency = (td) => {
        if (!td) return "";
        const currency = (td.querySelector(".col-text-addon")?.textContent || "").trim();
        const clone = td.cloneNode(true);
        clone.querySelectorAll(".col-text-addon").forEach(el => el.remove());
        const text = clone.textContent.trim();
        const numeric = normalizePlAmount(text);
        if (currency) return numeric ? `${numeric} ${currency}` : currency;
        return numeric || text;
    };

    const isOpen = (tr) => {
        const btn = tr.querySelector("td.col-show-instrument-history button");
        if (!btn) return false;
        return btn.textContent.trim().toLowerCase().includes("zamknij");
    };

    const openDetails = (tr) => {
        const btn = tr.querySelector("td.col-show-instrument-history button");
        if (btn) btn.click();
    };

    // ✅ POPRAWKA 1: szukamy wierszy z col-show-instrument-history
    const mainRows = Array.from(document.querySelectorAll(
        "tbody.ui-table-tbody > tr, p-table tbody.p-datatable-tbody > tr"
    )).filter(tr => tr.querySelector("td.col-show-instrument-history"));

    if (!mainRows.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    mainRows.forEach(tr => {
        if (!isOpen(tr)) openDetails(tr);
    });

    setTimeout(() => {
        mainRows.forEach(mainRow => {
            // ✅ POPRAWKA 2: Emitent — szukamy td.col-issuer w bieżącym wierszu
            const papier =
                mainRow.querySelector("td.col-instrument .name")?.textContent.trim() ||
                mainRow.querySelector("td.col-instrument label")?.textContent.trim() ||
                "";
            const emitent =
                mainRow.querySelector("td.col-issuer")?.textContent.trim() || "";

            // ✅ POPRAWKA 3: szukamy wiersza ze szczegółami przez closest tbody
            // zamiast nextElementSibling (może być kilka tr bez detailEntries między nimi)
            const tbody = mainRow.closest("tbody");
            if (!tbody) return;

            const allTrs = Array.from(tbody.querySelectorAll(":scope > tr"));
            const mainRowIndex = allTrs.indexOf(mainRow);

            // Szukamy najbliższego następnego wiersza zawierającego .detailEntries
            let detailRow = null;
            for (let i = mainRowIndex + 1; i < allTrs.length; i++) {
                if (allTrs[i].querySelector(".detailEntries")) {
                    detailRow = allTrs[i];
                    break;
                }
                // jeśli natrafimy na inny główny wiersz — przerywamy
                if (allTrs[i].querySelector("td.col-show-instrument-history")) break;
            }

            if (!detailRow) return;

            const detailEntries = detailRow.querySelector(".detailEntries");
            if (!detailEntries) return;

            // ✅ POPRAWKA 4: poprawny selektor tbody w nowej wersji PrimeNG
            const detailTrs = Array.from(detailEntries.querySelectorAll(
                "tbody tr, tbody.p-datatable-tbody tr"
            ));

            detailTrs.forEach(row => {
                const data =
                    row.querySelector("td.col-operation-date")?.textContent.trim() || "";
                const rodzaj =
                    row.querySelector("td.col-operation-type")?.textContent.trim() || "";
                const liczba =
                    parseNumber(row.querySelector("td.col-amount")?.textContent);
                const cena =
                    parseNumber(row.querySelector("td.col-price")?.textContent);
                const prowizja =
                    parseNumber(row.querySelector("td.col-commission")?.textContent);
                const netto =
                    getValueWithCurrency(row.querySelector("td.col-net-value"));
                const brutto =
                    getValueWithCurrency(row.querySelector("td.col-gross-value"));

                if (!data && !rodzaj) return;

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
            });
        });

        if (rows.length <= 1) {
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const csvContent = rows.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (rowIndex === 0 || colIndex === 0 || colIndex === 1 ||
                    colIndex === 2 || colIndex === 6 || colIndex === 7 || colIndex === 8) {
                    return `"${String(cell).replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(";")
        ).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({ [filename]: csvContent }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({ action: "dataSaved", filename });
                    chrome.runtime.sendMessage({ action: "checkStorage" });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });

    }, 1000);
}
    // 📤 Wklejanie operacji erste do formularza MyFund

    function insertTransactions_erste(csvContent) {
        setImportFile({
            selectValue: 'SantanderPPK2',
            fileName: "erste_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // 📤 Wklejanie operacji Noble do formularza MyFund

    function insertTransactions_noble(csvContent) {
        setImportFile({
            selectValue: 'Noble',
            fileName: "noble_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }
    // ===================== MYFUND IMPORT: PEKAO IKZE =====================
    function insertTransactions_pekao(csvContent) {
        setImportFile({
            selectValue: 'PekaoTFI',
            fileName: "pekao_ikze_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }
    
    function insertTransactions_analizyPl(csvContent) {
        setImportFile({
            selectValue: 'analizyPl',
            fileName: "analizy_pl_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    function insertTransactions_nnOfe(csvContent) {
        setImportFile({
            selectValue: 'NNOFE',
            fileName: "nn_ofe_export.csv",
            csvContent,
            retryAttempts: 5
        });
    }

    // 🧩 Aktualizacja przycisków akcji w popupie na podstawie zapisanych danych

    // Dynamicznie buduje akcje popupu na podstawie aktualnej strony i plików zapisanych w pamięci rozszerzenia.
    function updateActionButtons() {
        chrome.storage.local.get(STORAGE_KEYS.ALL, (data) => {
            actionContainer.innerHTML = "";
            warningContainer.style.display = "none";
            const isMyfundImportCryptoPage = tabUrl.includes("myfund.pl") && tabUrl.includes("raport=ImportPrzeplywowCrypto");
            const isMyfundImportOperationsPage = tabUrl.includes("myfund.pl") && tabUrl.includes("raport=ImportOperacji") && !tabUrl.includes("raport=ImportOperacjiPPK");
            const isMyfundImportPpkPage = tabUrl.includes("myfund.pl") && tabUrl.includes("raport=ImportOperacjiPPK");
            const isMyfundImportPage = isMyfundImportCryptoPage || isMyfundImportOperationsPage || isMyfundImportPpkPage;
            const getStoredDataSourceLabel = (key) => {
                const sourceNames = {
                    "bybit_export.csv": "Bybit",
                    "mbank_export.csv": "Mbank",
                    "paribas_export.csv": "Paribas",
                    "milenium_export.csv": "Milenium",
                    "investors_export.csv": "Investors",
                    "erste_export.csv": "Erste",
                    "noble_export.csv": "Noble",
                    "finax_operacje.csv": "Finax",
                    "finax_transakcje.csv": "Finax",
                    "pekao_ikze_export.csv": "Pekao",
                    "analizy_pl_export.csv": "Analizy.pl",
                    "nn_ofe_export.csv": "NN OFE"
                };
                return sourceNames[key] || "Dane";
            };

            if (isMyfundImportPage) {
                warningContainer.textContent = "Upewnij się, że jesteś na właściwym portfelu!";
                warningContainer.style.display = "block";
            }

            if (!supportedPopupHost.test(tabUrl)) return;

            const fragment = document.createDocumentFragment();
            const appendButton = (label, onClick, variant = "primary") => {
                const btn = document.createElement("button");
                btn.className = `BUTTON${variant === "secondary" ? " button-secondary" : variant === "ghost" ? " button-ghost" : ""}`;
                btn.textContent = label;
                btn.style.display = "block";
                btn.onclick = onClick;
                fragment.appendChild(btn);
            };

            const importLinks = [{
                    key: "bybit_export.csv",
                    excluded: "sourcePlugin=ByBitWtyczka",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=167&sourcePlugin=ByBitWtyczka"
                },
                {
                    key: "mbank_export.csv",
                    excluded: "sourcePlugin=mBankSFI",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=mBankSFI"
                },
                {
                    key: "paribas_export.csv",
                    excluded: "&sourcePlugin=BNPParibas",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=BNPParibas"
                },
                {
                    key: "milenium_export.csv",
                    excluded: "&sourcePlugin=MillenniumPPK",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=MillenniumPPK"
                },
                {
                    key: "investors_export.csv",
                    excluded: "&sourcePlugin=INVESTORSPPK",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=INVESTORSPPK"
                },
                {
                    key: "erste_export.csv",
                    excluded: "&sourcePlugin=SantanderPPK2",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacjiPPK&_mrid=167&sourcePlugin=SantanderPPK2"
                },
                {
                    key: "noble_export.csv",
                    excluded: "&sourcePlugin=Noble",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Noble"
                },
                {
                    key: "finax_operacje.csv",
                    excluded: "raport=ImportPrzeplywowCrypto",
                    label: "Przejdź do myfund, aby dodać zapisane operacje",
                    url: "https://myfund.pl/index.php?raport=ImportPrzeplywowCrypto&_mrid=284&sourcePlugin=Finax"
                },
                {
                    key: "finax_transakcje.csv",
                    excluded: "raport=ImportOperacji",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=Finax"
                },
                {
                    key: "pekao_ikze_export.csv",
                    excluded: "raport=ImportOperacji",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=PekaoTFI"
                },
                {
                    key: "analizy_pl_export.csv",
                    excluded: "sourcePlugin=analizyPl",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=analizyPl"
                },
                {
                    key: "nn_ofe_export.csv",
                    excluded: "sourcePlugin=NNOFE",
                    label: "Przejdź do myfund, aby dodać zapisane transakcje",
                    url: "https://myfund.pl/index.php?raport=ImportOperacji&_mrid=167&sourcePlugin=NNOFE"
                }
            ];

            importLinks.forEach(({ key, excluded, label, url }) => {
                if (data[key] && !tabUrl.includes(excluded)) {
                    appendButton(`${label} (${getStoredDataSourceLabel(key)})`, () => window.open(url, "_blank"), "primary");
                }
            });

            const pasteConfigs = [];
            if (isMyfundImportCryptoPage) {
                pasteConfigs.push({
                    key: "bybit_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'ByBitWtyczka',
                        fileName: "bybit_export.csv",
                        retryAttempts: 5
                    }
                });
                pasteConfigs.push({
                    key: "finax_operacje.csv",
                    label: "Wklej pobrane operacje",
                    importArgs: {
                        selectValue: 'finaxXls',
                        fileName: "finax_operacje.csv",
                        retryAttempts: 5
                    }
                });
            }
            if (isMyfundImportOperationsPage) {
                pasteConfigs.push({
                    key: "finax_transakcje.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'finaxXls',
                        fileName: "finax_transakcje.csv",
                        retryAttempts: 0
                    }
                }, {
                    key: "pekao_ikze_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'PekaoTFI',
                        fileName: "pekao_ikze_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "mbank_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'mBankSFI',
                        fileName: "mbank_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "noble_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'Noble',
                        fileName: "noble_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "analizy_pl_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'analizyPl',
                        fileName: "analizy_pl_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "nn_ofe_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'NNOFE',
                        fileName: "nn_ofe_export.csv",
                        retryAttempts: 5
                    }
                });
            }
            if (isMyfundImportPpkPage) {
                pasteConfigs.push({
                    key: "paribas_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'BNPParibas',
                        fileName: "paribas_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "milenium_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'MillenniumPPK',
                        fileName: "milenium_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "investors_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'INVESTORSPPK',
                        fileName: "investors_export.csv",
                        retryAttempts: 5
                    }
                }, {
                    key: "erste_export.csv",
                    label: "Wklej pobrane transakcje",
                    importArgs: {
                        selectValue: 'SantanderPPK2',
                        fileName: "erste_export.csv",
                        retryAttempts: 5
                    }
                });
            }

            pasteConfigs.forEach(({ key, label, importArgs }) => {
                if (data[key]) {
                    appendButton(label, () => executeOnTab(tabId, importCsvToMyfund, [{
                        ...importArgs,
                        csvContent: data[key]
                    }]), "primary");
                }
            });

            actionContainer.appendChild(fragment);
        });
    }
    // ✅ Wyświetlenie komunikatu o powodzeniu na stronie

    function showSuccessMessageOnPage() {
        const message = document.createElement("div");
        message.textContent = "Dane zostały pomyślnie pobrane!";
        Object.assign(message.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999",
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "16px 22px",
            border: "1px solid #c3e6cb",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "1.4",
            textAlign: "center",
            maxWidth: "320px",
            boxShadow: "0 10px 24px rgba(2, 14, 31, 0.12)"
        });
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

// Zestaw pomocników poniżej mapuje stan eksportu na czytelne komunikaty dla użytkownika.
function showExportErrorMessageOnPage(messageText = "Wystąpił błąd w pobieraniu danych.") {
    const message = document.createElement("div");
    message.textContent = messageText;
    Object.assign(message.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        backgroundColor: "#f8d7da",
        color: "#842029",
        padding: "16px 22px",
        border: "1px solid #f5c2c7",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        lineHeight: "1.4",
        textAlign: "center",
        maxWidth: "320px",
        boxShadow: "0 10px 24px rgba(2, 14, 31, 0.12)"
    });
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function showNoDataMessageOnPage(messageText = "Brak danych do pobrania.") {
    const message = document.createElement("div");
    message.textContent = messageText;
    Object.assign(message.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        backgroundColor: "#fff3cd",
        color: "#856404",
        padding: "16px 22px",
        border: "1px solid #ffeeba",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        lineHeight: "1.4",
        textAlign: "center",
        maxWidth: "320px",
        boxShadow: "0 10px 24px rgba(2, 14, 31, 0.12)"
    });
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function getSavedCsvState(value) {
    if (typeof value !== "string") return "error";

    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

    if (!lines.length) return "error";
    if (lines.length === 1) return "empty";
    return "success";
}

function showClearMessageOnPage(hasData) {
    const message = document.createElement("div");

    if (hasData) {
        message.textContent = "🗑️ Dane usunięte";
        Object.assign(message.style, {
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "2px solid #ffeeba"
        });
    } else {
        message.textContent = "ℹ️ Brak zapisanych danych";
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

// Jeśli użytkownik otworzył popup poza obsługiwaną stroną, pokazujemy tylko listę wspieranych serwisów.
if (
    !tabUrl.includes("finax.eu") &&
    !tabUrl.includes("myfund.pl") &&
    !tabUrl.includes("mbank.pl") &&
    !tabUrl.includes("tfi.bnpparibas.pl") &&
    !tabUrl.includes("millenniumtfi.sti24") &&
    !tabUrl.includes("24.investors.pl") &&
    !tabUrl.includes("online.erste-ppk") &&
    !tabUrl.includes("bybit.com") &&
    !tabUrl.includes("mynsapp.noblesecurities") &&
    !tabUrl.includes("pekao24") &&
    !tabUrl.includes("epekaotfi.pl") &&
    !tabUrl.includes("analizy.pl") &&
    !isNnPage(tabUrl)
) {
    const box = document.getElementById("instructionsBoxa");
    box.innerHTML = `
        <div style="font-size: 13px; line-height: 1.3;">
            <p style="margin: 0 0 4px 0;">Wtyczka obsługuje eksport danych ze stron:</p>
            <ul style="margin: 0 0 6px 18px; padding: 0;">
                <li><a href="https://finax.eu" target="_blank"><b>Finax.eu</b></a></li>
                <li><a href="https://online.mbank.pl" target="_blank"><b>SFI mBank</b></a></li>
                <li><a href="https://www.bybit.com" target="_blank"><b>Bybit.com</b></a></li>
                <li><a href="https://mynsapp.noblesecurities.pl/" target="_blank"><b>Noble Securities</b></a></li>
                <li><a href="https://www.pekao24.pl" target="_blank"><b>Pekao24.pl</b></a></li>
                <li><a href="https://analizy.pl" target="_blank"><b>Analizy.pl</b></a></li>
                <li><a href="https://logowanie.nn.pl" target="_blank"><b>Moje NN</b></a></li>
            </ul>

            <p style="margin: 0 0 4px 0;">PPK z banków:</p>
            <ul style="margin: 0 0 0 18px; padding: 0;">
                <li><a href="https://sti24.tfi.bnpparibas.pl" target="_blank"><b>BNP Paribas</b></a></li>
                <li><a href="https://millenniumtfi.sti24.pl" target="_blank"><b>Millennium</b></a></li>
                <li><a href="https://online24.investors.pl" target="_blank"><b>Investors</b></a></li>
                <li><a href="https://online.erste-ppk.pl" target="_blank"><b>Erste</b></a></li>
            </ul>
        </div>
    `;

    box.style.display = "block";
    exportBtn.style.display = "none";
}
    // BYBIT – informacja + 2 przyciski (aktywny zależnie od URL)
    // Dla Bybit popup przełącza się w tryb wieloetapowego eksportu i aktywuje właściwe akcje zależnie od URL-a.
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
    // Routing widoku popupu: dla każdego serwisu pokazujemy instrukcje albo odblokowujemy eksport.
    if (tabUrl.includes("finax.eu") && !tabUrl.includes("transactions")) {
        document.getElementById("grayBoxa").style.display = "block";
        exportBtn.style.display = "none";
    } else if (tabUrl.includes("finax.eu")) {
        document.getElementById("instructionsBoxb").style.display = "block";
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }

    if (tabUrl.includes("mbank.pl") && !isMbankHistoryPage(tabUrl)) {
        document.getElementById("grayBoxb").style.display = "block";
        exportBtn.style.display = "none";
    } else if (isMbankHistoryPage(tabUrl)) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }
    if (tabUrl.includes("analizy.pl") && !tabUrl.includes("walletTransactions")) {
    document.getElementById("grayBoxd").style.display = "block";
    exportBtn.style.display = "none";
} else if (tabUrl.includes("analizy.pl")) {
    document.getElementById("dateWarningBox").style.display = "block";
    exportBtn.style.display = "block";
}
    if (isNnPage(tabUrl) && !isNnHistoryPage(tabUrl)) {
        document.getElementById("grayBoxNN").style.display = "block";
        exportBtn.style.display = "none";
    } else if (isNnHistoryPage(tabUrl)) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }

    if (tabUrl.includes("pekao24") && !tabUrl.includes("historia/fundusze-inwestycyjne/transakcje") && !tabUrl.includes("historia:fundusze-inwestycyjne:transakcje")) {
        document.getElementById("grayBoxc").style.display = "block";
        exportBtn.style.display = "none";
    } else if (tabUrl.includes("pekao24")) {
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "block";
    }
    if ((tabUrl.includes("tfi.bnpparibas.pl") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes("millenniumtfi.sti24") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes("24.investors.pl") && !tabUrl.includes("/transaction/history")) ||
        (tabUrl.includes('online.erste-ppk') && !tabUrl.includes("/transaction/history"))) {
        document.getElementById("PPKWarningBox").style.display = "block";
        document.getElementById("dateWarningBox").style.display = "block";
        exportBtn.style.display = "none";
    }
    if ((tabUrl.includes("tfi.bnpparibas.pl") || tabUrl.includes("millenniumtfi.sti24") || tabUrl.includes("24.investors.pl") ||
            tabUrl.includes('online.erste-ppk')) && (tabUrl.includes(":transaction:history") || tabUrl.includes("/transaction/history"))) {
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
                                    "milenium_export.csv", "investors_export.csv", "erste_export.csv", "noble_export.csv", "pekao_ikze_export.csv"], (data) => {
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
              } else if (data["erste_export.csv"]) {
                found = data["erste_export.csv"];
                filename = "erste_export.csv";
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

    // Główny przycisk eksportu deleguje wykonanie do ekstraktora właściwego dla bieżącej platformy.

    exportBtn.addEventListener("click", async () => {
        const tab = await getActiveTab();
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
        } else if (tabUrl.includes("erste")) {
            funcToRun = extractAndSaveTable_erste;
        } else if (tabUrl.includes("noblesecurities")) {
            funcToRun = extractAndSaveTable_noble;
        } else if (tabUrl.includes("pekao24") || tabUrl.includes("epekaotfi")) {
            funcToRun = extractAndSaveTable_pekaoIkze;
        } else if (tabUrl.includes("analizy.pl")) {
            funcToRun = extractAndSaveTable_analizyPl;
        } else if (isNnHistoryPage(tabUrl)) {
            funcToRun = extractAndSaveTable_nnOfe;
        }

        if (funcToRun) {
            executeOnTab(tab.id, funcToRun, [STORAGE_KEYS.ALL]);

        } else {
            alert("Nieobsługiwana strona.");
        }
    });
    // Dodatkowe przyciski Bybit uruchamiają osobne przepływy dla Funding i Unified oraz sekcji szczegółowych.
    bybitFundingBtn?.addEventListener("click", async () => {
        const tab = await getActiveTab();
        executeOnTab(tab.id, extractAndSaveTable_bybitFunding, [STORAGE_KEYS.EXCEPT_BYBIT]);

    });
    // BYBIT – tryb rozszerzony: uruchom placeholdery
    [{ id: "bybitDepositSpotBtn", func: bybit_extract_depositSpot },
        { id: "bybitWithdrawSpotBtn", func: bybit_extract_withdrawSpot },
        { id: "bybitOneClickBuyBtn", func: bybit_extract_oneClickBuy },
        { id: "bybitP2PBtn", func: bybit_extract_p2p },
        { id: "bybitDepositFiatBtn", func: bybit_extract_depositFiat },
        { id: "bybitWithdrawFiatBtn", func: bybit_extract_withdrawFiat }
    ].forEach(({ id, func }) => {
        document.getElementById(id)?.addEventListener("click", async () => {
            const tab = await getActiveTab();
            executeOnTab(tab.id, func);
        });
    });


    bybitUnifiedBtn?.addEventListener("click", async () => {
        const tab = await getActiveTab();
        executeOnTab(tab.id, extractAndSaveTable_bybitUnified, [STORAGE_KEYS.EXCEPT_BYBIT]);

    });

// Ikona kosza czyści wszystkie zapisane CSV i odświeża stan popupu oraz komunikat na stronie.
clearDataIcon.addEventListener("click", () => {
    const hasData = clearDataIcon.dataset.hasData === "true";
    if (hasData) {
        chrome.storage.local.remove(STORAGE_KEYS.ALL, () => {
            if (!chrome.runtime.lastError) {
                checkStoredData();
                actionContainer.innerHTML = "";
                updateActionButtons();
                chrome.tabs.sendMessage(tabId, {
                    action: "showPageMessage",
                    hasData: true
                }, () => {
                    if (chrome.runtime.lastError) {}
                });
            }
        });
    } else {
        chrome.tabs.sendMessage(tabId, {
            action: "showPageMessage",
            hasData: false
        }, () => {
            if (chrome.runtime.lastError) {}
        });
    }
});
    // 🔔 Po zapisaniu danych: pokaż komunikat i odśwież przyciski

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "dataSaved") {
            const targetKey = request.filename;
            const reportResult = (result) => {
                if (result === "success") {
                    executeOnTab(tabId, showSuccessMessageOnPage);
                } else if (result === "empty") {
                    executeOnTab(tabId, showNoDataMessageOnPage, ["Brak danych do pobrania."]);
                } else {
                    executeOnTab(tabId, showExportErrorMessageOnPage, ["Wystąpił błąd w pobieraniu danych."]);
                }
                checkStoredData();
                setTimeout(updateActionButtons, 200);
            };

            if (targetKey) {
                chrome.storage.local.get(targetKey, (data) => {
                    reportResult(getSavedCsvState(data?.[targetKey]));
                });
                return;
            }

            chrome.storage.local.get(STORAGE_KEYS.ALL, (items) => {
                const result = Object.values(items)
                    .map((value) => getSavedCsvState(value))
                    .find((state) => state === "success") ||
                    Object.values(items)
                    .map((value) => getSavedCsvState(value))
                    .find((state) => state === "empty") ||
                    "error";
                reportResult(result);
            });
        }

        if (request.action === "dataSaveEmpty") {
            executeOnTab(tabId, showNoDataMessageOnPage, [request.message || "Brak danych do pobrania."]);
            checkStoredData();
            setTimeout(updateActionButtons, 200);
        }

        if (request.action === "dataSaveFailed") {
            executeOnTab(tabId, showExportErrorMessageOnPage, [request.message || "Wystąpił błąd w pobieraniu danych."]);
            checkStoredData();
            setTimeout(updateActionButtons, 200);
        }
    });

});
// Drugi nasłuch obsługuje lekkie odświeżenie UI, gdy inna część rozszerzenia pyta o stan pamięci.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkStorage") {
        checkStoredData();
    }
});

// Ekstraktory Bybit są podzielone na dwa tryby: Funding i Unified, bo każdy ma inną strukturę danych i zasady scalania CSV.
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
                            action: "dataSaved",
                            filename: BYBIT_KEY
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    } else {
                        chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }

            // b) zgrupuj po czasie z tolerancją 10s
            const groups = groupRowsByTime(allRows);

            // c) zbuduj linie CSV wg logiki operacyjnej
            const finalCsvRows = buildAllCsvRowsFromGroups(groups);

            if (!finalCsvRows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }

            // d) zapisz do chrome.storage.local (czyści stare Funding_* i dopina nowe)
            saveCsv(finalCsvRows);
        } catch (e) {
            console.error("Bybit Funding error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
        }
    })();
}



// Ten ekstraktor zbiera historię z Unified Trading Account i podmienia tylko rekordy tego źródła w zapisanym pliku.
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
                                action: "dataSaved",
                                filename: BYBIT_KEY
                            });
                            chrome.runtime.sendMessage({
                                action: "checkStorage"
                            });
                        } else {
                            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Unified error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
        }
    })();
}



// Eksport mBank musi obsłużyć wirtualizowaną tabelę, dociąganie kolejnych wierszy i kilka wariantów DOM dla detali.
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

    const getRowDataTestId = (row) => row.getAttribute("data-test-id") || "";
    const getDetailsRow = (row) => {
        const next = row?.nextElementSibling;
        return next && next.getAttribute("data-component") === "DesktopBodyRowDetails" ? next : null;
    };
    const getMainRows = () => {
        const modernRows = Array.from(document.querySelectorAll('tbody[data-component="TableBody"]'))
            .map((tbody) => {
                const trs = Array.from(tbody.querySelectorAll(':scope > tr'));
                return trs.length >= 2 && trs[1].getAttribute("data-component") === "DesktopBodyRowDetails" ? trs[0] : null;
            })
            .filter(Boolean);
        if (modernRows.length) return modernRows;

        return Array.from(document.querySelectorAll(
            'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:SourceFund"],' +
            'tr[data-component="TableBodyRow"][data-test-id^="FundsHistory:DestinationFund"]'
        ));
    };
    const getExpandButton = (row) => row?.querySelector('button[aria-expanded], button[aria-label*="wiń" i], button[aria-label*="zwiń" i], [role="button"]');
    const isExpanded = (row) => {
        const detailsRow = getDetailsRow(row);
        if (detailsRow?.getAttribute("aria-hidden") === "false") return true;
        return getExpandButton(row)?.getAttribute("aria-expanded") === "true";
    };
    const collectLabelPairs = (detailsRow) => {
        const pairs = [];

        Array.from(detailsRow.querySelectorAll('[data-test-id="LabelData:label"]')).forEach((lbl) => {
            const label = lbl.textContent.trim().toLowerCase();
            const dataEl = lbl.closest('[data-component="Box"]')?.querySelector('[data-test-id="LabelData:data"]');
            const val = dataEl ? (dataEl.querySelector('span, [data-component="Amount"]')?.textContent?.trim() || dataEl.textContent.trim()) : "";
            if (label && val) pairs.push({
                label,
                val
            });
        });

        Array.from(detailsRow.querySelectorAll('[data-component="Box"]')).forEach((box) => {
            const directPs = Array.from(box.children).filter((child) => child.tagName === "P");
            if (directPs.length < 2) return;

            const label = (directPs[0].textContent || "").trim().toLowerCase();
            const val = (directPs[1].textContent || "").trim();
            if (!label || !val) return;
            if (!pairs.some((pair) => pair.label === label && pair.val === val)) {
                pairs.push({
                    label,
                    val
                });
            }
        });

        return pairs;
    };
    const getRowFundName = (row) => {
        const fundCell = row.querySelector("td:nth-child(2)");
        if (!fundCell) return "";
        const paragraphs = Array.from(fundCell.querySelectorAll("p"))
            .map((el) => (el.textContent || "").trim())
            .filter(Boolean);
        return paragraphs.length ? paragraphs[paragraphs.length - 1] : (fundCell.textContent || "").trim();
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
    const anyRow = getMainRows()[0];
    if (!anyRow) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    const scroller = getScrollParent(anyRow);

    // ⬇️ Preload wszystkich wierszy – przewijaj do dołu dopóki przybywa
    async function preloadAllRows(maxRounds = 20) {
        let lastCount = 0;
        for (let round = 0; round < maxRounds; round++) {
            const count = getMainRows().length;
            // scrolluj do dołu, by wywołać doładowanie
            scroller.scrollTop = scroller.scrollHeight;
            await sleep(400);
            if (count === lastCount) {
                // spróbuj jeszcze raz dociągnąć — małe potrząśnięcie
                scroller.scrollTop = scroller.scrollHeight;
                await sleep(400);
                const newCount = getMainRows().length;
                if (newCount === count) break; // nic już nie przybywa
                lastCount = newCount;
            } else {
                lastCount = count;
            }
        }
    }

    await preloadAllRows();

    // Teraz pobierz pełną listę
    const rows = getMainRows();
    if (!rows.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
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
            const dtid = getRowDataTestId(row);
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
            if (!isExpanded(row)) row.click();
            // …fallback: spróbuj kliknąć dowolny przycisk w wierszu
            if (!isExpanded(row)) {
                getExpandButton(row)?.click();
            }
            // ⏳ daj UI 500 ms na rozwinięcie szczegółów
            await sleep(500);

            // Czekaj aż pokaże się sąsiadujący TR z detalami
            const detailsRow = await waitFor(() => {
                const next = getDetailsRow(row);
                return next?.getAttribute("aria-hidden") === "false" ? next : null;
            });
            if (!detailsRow) {
                // Nie udało się rozwinąć – zanotuj minimalne info (wartość + typ), żeby czegoś nie zgubić
                const minimal = (['operacja', ''].includes(typeText) ? 'Operacja' :
                    typeText.includes('odkup') ? 'Sprzedaż' :
                    (typeText.includes('nabycie') || typeText.includes('dopłata')) ? 'Kupno' :
                    typeText.includes('konwersja') ? 'Konwersja' : typeText);
                results.push([minimal, "", "", "", valueAbs.toFixed(2), ""].join(";"));
                continue;
            }

            // Szybkie query po HistoryDetails
            const q = (name) => detailsRow.querySelector(`[data-test-id="HistoryDetails${idx}:${name}"] span`)?.textContent?.trim() || "";
            const qAny = (name) => detailsRow.querySelector(`[data-test-id^="HistoryDetails"][data-test-id$=":${name}"] span`)?.textContent?.trim() || "";

            // Pary LabelData (fallbacki pod różne „modele” UI)
            const labelPairs = collectLabelPairs(detailsRow);
            const getLabel = (needle) => labelPairs.find(p => p.label.includes(needle))?.val || "";

            const valuationDate = q("ValuationDate") || qAny("ValuationDate") || getLabel("data wyceny");

            // Prosty przypadek — pojedynczy fundusz/jednostki
            let singleName = q("Name") || qAny("Name") || getLabel("nazwa funduszu") || getRowFundName(row) || "";
            const singleUnitsT = q("Units") || qAny("Units") || getLabel("liczba jednostek transakcji") || getLabel("liczba jednostek") || "";
            const singleUnits = (parseNum(singleUnitsT)?.toString()) ?? (singleUnitsT || "");

            let rodzaj;
            if (typeText.includes("odkup")) rodzaj = "Sprzedaż";
            else if (typeText.includes("nabycie") || typeText.includes("dopłata")) rodzaj = "Kupno";
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
                    const unitsArr = labelPairs.filter(p => p.label.includes("liczba jednostek transakcji") || p.label.includes("liczba jednostek")).map(p => p.val);
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
                            getRowFundName(row) || "";
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
            } else if (isExpanded(row)) {
                getExpandButton(row)?.click();
                await sleep(60);
            }
        } catch (e) {
            // pomijamy pojedyncze błędy
        }
    }

    if (!results.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
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
                    action: "dataSaved",
                    filename
                });
                chrome.runtime.sendMessage({
                    action: "checkStorage"
                });
            } else {
                chrome.runtime.sendMessage({ action: "dataSaveFailed" });
            }
        });
    });
}

// Ekstraktory PPK korzystają z podobnego schematu: rozwinięcie szczegółów transakcji i odczyt pól z komponentów Angulara.
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

    const transactions = Array.from(
        document.querySelectorAll("tr.nx-table-row.table__tr")
    );

    const isDetailsRow = (tr) => {
    if (!tr) return false;
    if (tr.classList?.contains("nx-table-row__details")) return true;
    if ((tr.className || "").includes("history-table__details")) return true;
    if (tr.querySelector?.("app-transaction-details")) return true;
    if (tr.querySelector?.("app-property")) return true;
    return false;
};
const openDetails = (tr) => {
    const toggleBtn =
        tr.querySelector("button.nx-button--tertiary") ||
        tr.querySelector("button.nx-button") ||
        tr.querySelector("a.nx-button--tertiary") ||
        tr.querySelector("a.nx-button");
    if (toggleBtn) { toggleBtn.click(); return; }
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};
transactions.forEach((tr) => {
    if (!isDetailsRow(tr.nextElementSibling)) openDetails(tr);
});

    setTimeout(() => {
        transactions.forEach(tr => {
            const typOswiadczenia =
                tr.querySelector("td:nth-child(3) span")?.textContent?.trim() ||
                tr.querySelector("td:nth-child(3)")?.textContent?.trim() ||
                "";

            const detailsTr = tr.nextElementSibling;
            if (!detailsTr || !detailsTr.querySelector("app-transaction-details")) return;

            const details = detailsTr.querySelector("app-transaction-details") || detailsTr

            const getValue = (label) => {
                const props = detailsTr.querySelectorAll("app-property");
                for (const p of props) {
                    const lbl = p.querySelector("span.label");
                    if (!lbl || lbl.textContent.trim() !== label) continue;
                    return (
                        p.querySelector("p.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("p")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall.ng-star-inserted")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("h4.ng-star-inserted")?.textContent?.trim() ||
                        ""
                    );
                }
                return "";
            };

            const dataWyceny = getValue("Data wyceny");
            const fundusz = getValue("Fundusz docelowy");
            const typTransakcji = getValue("Typ transakcji");
            const liczbaJU = normalizePlAmount(getValue("Liczba jednostek transakcji"));
            const wanju = normalizePlAmount(getValue("WANJU dla transakcji"));

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
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const csvContent = rows.map(r => r.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved",
                        filename
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
    const isDetailsRow = (tr) => {
    if (!tr) return false;
    if (tr.classList?.contains("nx-table-row__details")) return true;
    if ((tr.className || "").includes("history-table__details")) return true;
    if (tr.querySelector?.("app-transaction-details")) return true;
    if (tr.querySelector?.("app-property")) return true;
    return false;
};
const openDetails = (tr) => {
    const toggleBtn =
        tr.querySelector("button.nx-button--tertiary") ||
        tr.querySelector("button.nx-button") ||
        tr.querySelector("a.nx-button--tertiary") ||
        tr.querySelector("a.nx-button");
    if (toggleBtn) { toggleBtn.click(); return; }
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};
transactions.forEach((tr) => {
    if (!isDetailsRow(tr.nextElementSibling)) openDetails(tr);
});
    // 2. Czekamy aż Angular załaduje DOM
    setTimeout(() => {

        transactions.forEach(tr => {
            const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

            const detailsTr = tr.nextElementSibling;

            if (!isDetailsRow(detailsTr)) return;

            // NOWY PARSER PROPERTIES
            const getValue = (label) => {
                const props = detailsTr.querySelectorAll("app-property");
                for (const p of props) {
                    const lbl = p.querySelector("span.label");
                    if (!lbl || lbl.textContent.trim() !== label) continue;
                    return (
                        p.querySelector("p.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("p")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall.ng-star-inserted")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("h4.ng-star-inserted")?.textContent?.trim() ||
                        ""
                    );
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
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const csvContent = rows.map(r => r.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved",
                        filename
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });

    }, 1500); // Angular potrzebuje minimalnie więcej czasu
}


// 📋 Wyciągnięcie danych z tabeli erste i zapisanie jako CSV
// 📋 Wyciągnięcie danych z tabeli erste i zapisanie jako CSV  (NOWA WERSJA jak Paribas)
function extractAndSaveTable_erste(STORAGE_KEYS_ALL) {
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

    const filename = "erste_export.csv";
    const headers = [
        "Data wyceny",
        "Fundusz docelowy",
        "Typ transakcji",
        "Typ oświadczenia/dyspozycji",
        "Liczba jednostek transakcji",
        "WANJU dla transakcji"
    ];
    const rows = [headers];

    const transactions = Array.from(
        document.querySelectorAll("tr.nx-table-row.table__tr")
    );

    // helper: czy następny wiersz wygląda jak szczegóły
    const isDetailsRow = (tr) => {
        if (!tr) return false;
        // różne warianty na sti24
        if (tr.classList?.contains("nx-table-row__details")) return true;
        if ((tr.className || "").includes("history-table__details")) return true;
        if (tr.querySelector?.("app-transaction-details")) return true;
        if (tr.querySelector?.("app-property")) return true;
        return false;
    };

    // helper: klik otwierający szczegóły (różne warianty przycisków)
    const openDetails = (tr) => {
        const toggleBtn =
            tr.querySelector("button.nx-button--tertiary") ||
            tr.querySelector("button.nx-button") ||
            tr.querySelector("a.nx-button--tertiary") ||
            tr.querySelector("a.nx-button");
        if (toggleBtn) {
            toggleBtn.click();
            return;
        }
        tr.dispatchEvent(new MouseEvent("click", {
            bubbles: true
        }));
    };

    // 1) Otwórz szczegóły tylko jeśli nie są widoczne
    transactions.forEach((tr) => {
        const nextRow = tr.nextElementSibling;
        const detailsVisible = isDetailsRow(nextRow);

        if (!detailsVisible) openDetails(tr);
    });

    // 2) Poczekaj aż Angular doładuje DOM
    setTimeout(() => {
        transactions.forEach((tr) => {
            // "Typ oświadczenia/dyspozycji" w tabeli głównej (kolumna 3)
            const typOswiadczenia =
                tr.querySelector("td:nth-child(3) span")?.textContent?.trim() ||
                tr.querySelector("td:nth-child(3)")?.textContent?.trim() ||
                "";

            const detailsTr = tr.nextElementSibling;
            if (!isDetailsRow(detailsTr)) return;

            // kontener szczegółów (czasem siedzi w app-transaction-details)
            const detailsRoot =
                detailsTr.querySelector("app-transaction-details") || detailsTr;

            // ✅ NOWA logika jak Paribas: app-property -> span.label + (p / h4 / cokolwiek tekstowego)
            const getValue = (label) => {
                const props = detailsTr.querySelectorAll("app-property");
                for (const p of props) {
                    const lbl = p.querySelector("span.label");
                    if (!lbl || lbl.textContent.trim() !== label) continue;
                    return (
                        p.querySelector("p.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("p")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall.ng-star-inserted")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("h4.ng-star-inserted")?.textContent?.trim() ||
                        ""
                    );
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
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const csvContent = rows.map((row) => row.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved",
                        filename
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }, 1500); // jak w Paribas/Investors — bezpieczniej niż 1000ms
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
    const isDetailsRow = (tr) => {
    if (!tr) return false;
    if (tr.classList?.contains("nx-table-row__details")) return true;
    if ((tr.className || "").includes("history-table__details")) return true;
    if (tr.querySelector?.("app-transaction-details")) return true;
    if (tr.querySelector?.("app-property")) return true;
    return false;
};
const openDetails = (tr) => {
    const toggleBtn =
        tr.querySelector("button.nx-button--tertiary") ||
        tr.querySelector("button.nx-button") ||
        tr.querySelector("a.nx-button--tertiary") ||
        tr.querySelector("a.nx-button");
    if (toggleBtn) { toggleBtn.click(); return; }
    tr.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};
transactions.forEach((tr) => {
    if (!isDetailsRow(tr.nextElementSibling)) openDetails(tr);
});

    // 2. Poczekaj, aż wszystkie szczegóły się pojawią
    setTimeout(() => {
        transactions.forEach(tr => {
            const typOswiadczenia = tr.children[2]?.textContent.trim() || "";

            const detailsTr = tr.nextElementSibling;
            if (!isDetailsRow(detailsTr)) return;

            const getValue = (label) => {
                const props = detailsTr.querySelectorAll("app-property");
                for (const p of props) {
                    const lbl = p.querySelector("span.label");
                    if (!lbl || lbl.textContent.trim() !== label) continue;
                    return (
                        p.querySelector("p.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("p")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall.ng-star-inserted")?.textContent?.trim() ||
                        p.querySelector("h4.nx-heading--subsection-xsmall")?.textContent?.trim() ||
                        p.querySelector("h4.ng-star-inserted")?.textContent?.trim() ||
                        ""
                    );
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
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const csvContent = rows.map(row => row.join(";")).join("\n");

        chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
            chrome.storage.local.set({
                [filename]: csvContent
            }, () => {
                if (!chrome.runtime.lastError) {
                    chrome.runtime.sendMessage({
                        action: "dataSaved",
                        filename
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }, 1000); // 1 sekunda opóźnienia — można zwiększyć przy wolnym internecie
}

// 📋 Wyciągnięcie danych z tabel Finax i zapisanie jako CSV

// Finax ma osobną logikę dla transakcji i operacji, bo pochodzą z dwóch różnych sekcji interfejsu.
function extractAndSaveTable(STORAGE_KEYS_ALL) {
    let rows = [];
    let filename = "";
    let csvContent = "";

    const activeNav = document.querySelector(".navigation-item.active");
    const isTransakcje = activeNav?.dataset.group === "R";

    if (isTransakcje) {
        filename = "finax_transakcje.csv";
        const headers = ["Data", "Typ transakcji", "Ilość sztuk", "Cena za sztukę (€)", "Wartość transakcji (€)", "Ticker"];
        rows.push(headers);

        // Szukamy wewnątrz konkretnie sekcji group-R
        const container = document.querySelector("#transactions-group-R .hidden.md\\:block");
        if (!container) {
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const rowDivs = container.querySelectorAll(
            ".flex.flex-row.gap-8.items-center.border-b.border-\\[\\#D2D1D1\\]"
        );

        rowDivs.forEach(div => {
            const cells = div.querySelectorAll(":scope > div");
            if (cells.length >= 6) {
                const cleanEuro = (text) => text.trim().replace("€", "").replace(",", ".").trim();
                rows.push([
                    cells[0].textContent.trim(), // Data
                    cells[2].textContent.trim(), // Typ transakcji
                    cells[3].textContent.trim(), // Ilość sztuk
                    cleanEuro(cells[4].textContent), // Cena za sztukę
                    cleanEuro(cells[5].textContent), // Wartość transakcji
                    cells[1].textContent.trim(), // Ticker
                ]);
            }
        });

        if (rows.length === 1) {
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }
        csvContent = rows.map(row => row.join(";")).join("\n");

    } else {
        filename = "finax_operacje.csv";
        const headers = ["", "Data", "Rodzaj", "Uwaga", "Kwota"];
        rows.push(headers);

        // Szukamy wewnątrz konkretnie sekcji group-F
        const container = document.querySelector("#transactions-group-F .hidden.md\\:block");
        if (!container) {
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }

        const rowDivs = container.querySelectorAll(
            ".flex.flex-row.gap-8.items-center.border-b.border-\\[\\#D2D1D1\\]"
        );

        rowDivs.forEach(div => {
            const cells = div.querySelectorAll(":scope > div");
            if (cells.length >= 4) {
                const data = cells[0].textContent.trim();
                const rodzaj = cells[1].textContent.trim();
                const uwaga = cells[2].textContent.trim();
                const kwotaCell = cells[3];
                const kursEl = kwotaCell.querySelector("p");
                const kurs = kursEl ? kursEl.textContent.trim() : "";
                const kwota = kwotaCell.textContent.replace(kurs, "").trim();

                const kwotaFinal = kurs ? `${kwota}\n\n${kurs}` : kwota;
                rows.push(["", data, rodzaj, uwaga, kwotaFinal]);
            }
        });

        if (rows.length === 1) {
            chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
            return;
        }
        csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(";")).join("\n");
    }

    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        chrome.storage.local.set({
            [filename]: csvContent
        }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                    action: "dataSaved",
                    filename
                });
                chrome.runtime.sendMessage({
                    action: "checkStorage"
                });
            } else {
                chrome.runtime.sendMessage({ action: "dataSaveFailed" });
            }
        });
    });
}

// ===================== PEKAO24 IKZE =====================
// 📋 Pekao24 IKZE – lista transakcji + rozwijanie detali + eksport do CSV
// Pekao i Analizy.pl mają własne ekstraktory, bo ich widoki nie pasują do wspólnego modelu PPK/Finax.
async function extractAndSaveTable_pekaoIkze(STORAGE_KEYS_ALL) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

    // liczby w PL formacie: "1,709" / "76,73 PLN" -> zwraca string w formacie "1,709" / "76,73"
    // (nie zamieniamy na kropkę, bo do CSV chcesz dokładnie tak jak w UI)
    const pickPlNumberString = (txt) => {
        if (!txt) return "";
        const s = String(txt)
            .replace(/\u00a0/g, " ")
            .trim();

        // znajdź pierwszą liczbę z opcjonalnymi tysiącami i przecinkiem
        // np. "76,73 PLN" -> "76,73", "1,709" -> "1,709"
        const m = s.match(/-?\d{1,3}(?:[ .]\d{3})*(?:,\d+)?|-?\d+(?:,\d+)?/);
        return m ? m[0].replace(/\s+/g, "") : "";
    };

    const normalize = (s) => (s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

    // znajdź scrollowalny kontener (fallback: dokument)
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

    // wiersze transakcji (bez wierszy roku)
    const rowSelector = 'tr.cdk-row.cdk-row-default';

    const firstRow = document.querySelector(rowSelector);
    if (!firstRow) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    const scroller = getScrollParent(firstRow);

    // preload – dociągnij wszystkie transakcje (jeśli jest lazy load/virtual scroll)
    async function preloadAllRows(maxRounds = 30) {
        let lastCount = 0;

        for (let round = 0; round < maxRounds; round++) {
            const rowsNow = document.querySelectorAll(rowSelector);
            const count = rowsNow.length;

            // przewiń do dołu, żeby doładować kolejne
            scroller.scrollTop = scroller.scrollHeight;
            await sleep(450);

            const rowsAfter = document.querySelectorAll(rowSelector).length;
            if (rowsAfter === lastCount && rowsAfter === count) {
                // jeszcze jedno "potrząśnięcie"
                scroller.scrollTop = scroller.scrollHeight;
                await sleep(450);
                const rowsAfter2 = document.querySelectorAll(rowSelector).length;
                if (rowsAfter2 === rowsAfter) break;
                lastCount = rowsAfter2;
            } else {
                lastCount = rowsAfter;
            }
        }
    }

    await preloadAllRows();

    const rows = Array.from(document.querySelectorAll(rowSelector));
    if (!rows.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    // sprawdza/czeka aż pojawi się szczegółowy wiersz detali jako następny TR
    async function ensureDetailsRow(row) {
        const nextIsDetails = () => {
            const next = row.nextElementSibling;
            if (!next) return null;
            if (next.classList.contains("cdk-row-details")) return next;
            return null;
        };

        // jeśli już jest
        let details = nextIsDetails();
        if (details) return details;

        // spróbuj rozwinąć
        const toggleBtn =
            row.querySelector("td.cdk-column-toggle button") ||
            row.querySelector("pekao-button.toggle-button button") ||
            row.querySelector("button");

        if (toggleBtn) {
            toggleBtn.click();
        } else {
            // fallback: klik w cały wiersz
            row.click();
        }

        // poczekaj aż pojawi się details row
        details = await waitFor(nextIsDetails, {
            tries: 40,
            interval: 150
        });
        return details;
    }

    // z wiersza detali zbiera label->value
    function getDetailsMap(detailsRow) {
        const map = new Map();

        const pairs = Array.from(detailsRow.querySelectorAll(".details-row"));
        for (const p of pairs) {
            const label = normalize(p.querySelector(".label")?.textContent).toLowerCase();
            const value = normalize(p.querySelector(".value")?.textContent);
            if (label) map.set(label, value);
        }
        return map;
    }

    const results = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        try {
            row.scrollIntoView({
                block: "center"
            });
            await sleep(120);

            // nagłówek transakcji
            const name = normalize(row.querySelector('td.cdk-column-name p.title')?.textContent);
            const type = normalize(row.querySelector('td.cdk-column-operationType span')?.textContent);

            // detale
            const detailsRow = await ensureDetailsRow(row);
            if (!detailsRow) {
                // jak nie ma detali, pomijamy (albo możesz dopisać pusty wiersz — tu wolę nie śmiecić)
                continue;
            }

            const map = getDetailsMap(detailsRow);

            const valuationDate = normalize(map.get("data wyceny") || "");
            const unitsRaw = map.get("liczba jednostek") || "";
            const priceRaw = map.get("cena jednostki") || "";

            const units = pickPlNumberString(unitsRaw); // np. "1,709"
            const price = pickPlNumberString(priceRaw); // np. "76,73"

            // CSV row (używam średnika jako separatora, bo masz przecinek w liczbach)
            // Nagłówki zostają dokładnie jak chcesz, tylko separator w pliku będzie ; (bezpieczniej w PL Excelu)
            results.push([valuationDate, name, type, units, price].join(";"));
        } catch (e) {
            // pomijamy pojedyncze błędy
        }
    }

    if (!results.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    const filename = "pekao_ikze_export.csv";
    const headers = ["Data wyceny", "Nazwa", "Typ operacji", "Liczba jednostek", "Cena jednostki"];
    const csv = [headers.join(";"), ...results].join("\n");

    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        chrome.storage.local.set({
            [filename]: csv
        }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                    action: "dataSaved",
                    filename
                });
                chrome.runtime.sendMessage({
                    action: "checkStorage"
                });
            } else {
                chrome.runtime.sendMessage({ action: "dataSaveFailed" });
            }
        });
    });
}

function extractAndSaveTable_analizyPl(STORAGE_KEYS_ALL) {
    const filename = "analizy_pl_export.csv";
    const headers = ["Data", "Typ transakcji", "Nazwa funduszu", "Kod funduszu", "Cena", "Waluta", "Liczba jednostek"];
    const rows = [headers];

    const containers = Array.from(
        document.querySelectorAll(".walletTransaction[data-id]")
    );

    if (!containers.length) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    containers.forEach(container => {
        // Kod funduszu z data-id="fund_XXX"
        const dataId = container.getAttribute("data-id") || "";
        const kod = dataId.replace("fund_", "");

        // Nazwa funduszu
        const nazwa = container.querySelector(".productName")?.textContent?.trim() || "";

        // Data
        const dataEl = container.querySelector(".W_transaction_cell_date .productBigText");
        const data = dataEl?.textContent?.trim() || "";

        // Typ transakcji
        const typEl = container.querySelector(".W_transaction_cell_kind .productBigText");
        const typ = typEl?.textContent?.trim() || "";

        // Kwota / waluta / liczba JU / cena JU — ze span.iconIWrap title
        const tooltipEl = container.querySelector(".W_transaction_cell_Value .iconIWrap");
        const tooltipTitle = tooltipEl?.getAttribute("title") || "";

        // title format: " Liczba J.U.: -341,0176 <br></span> Wartość J.U.\n: 147,36 PLN"
        let liczbaJU = "";
        let cena = "";
        let waluta = "";

        const matchLiczba = tooltipTitle.match(/Liczba J\.U\.\s*:\s*([+-]?\d[\d\s,\.]*)/i);
        if (matchLiczba) {
            liczbaJU = matchLiczba[1]
                .replace(/\s+/g, "")
                .replace(",", ".")
                .replace(/^[+-]/, ""); // bez znaku
        }

        const matchCena = tooltipTitle.match(/Wartość J\.U\.\s*[:\n\r]+\s*([+-]?\d[\d\s,\.]*)\s*([A-Z]{3})/i);
        if (matchCena) {
            cena = matchCena[1].replace(/\s+/g, "").replace(",", ".");
            waluta = matchCena[2];
        }

        // Fallback waluta ze span.investIcons z PLN/EUR itd.
        if (!waluta) {
            const icons = Array.from(container.querySelectorAll(".investIcons"));
            for (const ico of icons) {
                const t = ico.textContent.trim();
                if (/^[A-Z]{3}$/.test(t)) { waluta = t; break; }
            }
        }

        if (!data && !nazwa) return;

        rows.push([
            `"${data}"`,
            `"${typ}"`,
            `"${nazwa}"`,
            `"${kod}"`,
            cena,
            `"${waluta}"`,
            liczbaJU
        ]);
    });

    if (rows.length <= 1) {
        chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
        return;
    }

    const csvContent = rows.map(r => r.join(";")).join("\n");

    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        chrome.storage.local.set({ [filename]: csvContent }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({ action: "dataSaved", filename });
                chrome.runtime.sendMessage({ action: "checkStorage" });
            } else {
                chrome.runtime.sendMessage({ action: "dataSaveFailed" });
            }
        });
    });
}

function extractAndSaveTable_nnOfe(STORAGE_KEYS_ALL) {
    const filename = "nn_ofe_export.csv";
    const headers = ["data", "opis", "cena", "liczba jednostek", "opłata"];
    const rows = [headers];

    const normalizeSpace = (value) => String(value || "")
        .replace(/[\u00A0\u202F\u2007\u2009\u200A\u200B\uFEFF]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const normalizeLabel = (value) => normalizeSpace(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const stripLabel = (value, label) => {
        const text = normalizeSpace(value);
        return normalizeLabel(text).startsWith(normalizeLabel(label))
            ? text.slice(label.length).trim()
            : text;
    };
    const textFromCell = (cell, label) => {
        if (!cell) return "";
        const mobileValue = Array.from(cell.querySelectorAll("span"))
            .find((span) => String(span.className || "").includes("MobileItemWithLabel"));
        return stripLabel(normalizeSpace(mobileValue?.textContent || cell.textContent), label);
    };
    const cleanNumber = (value) => {
        let text = normalizeSpace(value);
        text = text.replace(/\b[A-Z]{3}\b/g, "").replace(/\s+/g, "");
        text = text.replace(/[^\d,\.\-]/g, "");
        if (text.includes(",") && text.includes(".")) text = text.replace(/\./g, "");
        text = text.replace(",", ".");
        text = text.replace(/(?!^)-/g, "");
        return text;
    };
    const findHeaderIndex = (headers, label) =>
        headers.findIndex((header) => normalizeLabel(header).includes(normalizeLabel(label)));

    const tableCandidates = Array.from(document.querySelectorAll("table"))
        .map((table) => {
            const headerCells = Array.from(
                table.querySelectorAll("thead tr:first-child th, thead tr:first-child td")
            );
            const headersFromTable = headerCells.map((cell) => normalizeSpace(cell.textContent));
            const indexes = {
                data: findHeaderIndex(headersFromTable, "Data"),
                opis: findHeaderIndex(headersFromTable, "Opis"),
                cena: findHeaderIndex(headersFromTable, "Cena jednostki"),
                jednostki: findHeaderIndex(headersFromTable, "Liczba jednostek"),
                oplata: findHeaderIndex(headersFromTable, "Opłata")
            };
            const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
            return {
                table,
                indexes,
                bodyRows
            };
        })
        .filter(({ indexes, bodyRows }) =>
            bodyRows.length > 0 &&
            indexes.data >= 0 &&
            indexes.opis >= 0 &&
            indexes.cena >= 0 &&
            indexes.jednostki >= 0 &&
            indexes.oplata >= 0
        )
        .sort((a, b) => b.bodyRows.length - a.bodyRows.length);

    if (!tableCandidates.length) {
        chrome.runtime.sendMessage({
            action: "dataSaveEmpty",
            message: "Nie znaleziono tabeli historii NN OFE."
        });
        return;
    }

    const { indexes, bodyRows } = tableCandidates[0];

    bodyRows.forEach((tr) => {
        const cells = Array.from(tr.querySelectorAll(":scope > td, :scope > th"));
        if (!cells.length) return;

        const data = textFromCell(cells[indexes.data], "Data");
        const opis = textFromCell(cells[indexes.opis], "Opis");
        const cena = cleanNumber(textFromCell(cells[indexes.cena], "Cena jednostki"));
        const jednostki = cleanNumber(textFromCell(cells[indexes.jednostki], "Liczba jednostek"));
        const oplata = cleanNumber(textFromCell(cells[indexes.oplata], "Opłata"));

        if (!data && !opis) return;

        rows.push([
            data,
            opis,
            cena,
            jednostki,
            oplata
        ]);
    });

    if (rows.length <= 1) {
        chrome.runtime.sendMessage({
            action: "dataSaveEmpty",
            message: "Brak danych NN OFE do pobrania."
        });
        return;
    }

    const csvContent = rows.map((row) => row.join(";")).join("\n");

    chrome.storage.local.remove(STORAGE_KEYS_ALL, () => {
        chrome.storage.local.set({ [filename]: csvContent }, () => {
            if (!chrome.runtime.lastError) {
                chrome.runtime.sendMessage({ action: "dataSaved", filename });
                chrome.runtime.sendMessage({ action: "checkStorage" });
            } else {
                chrome.runtime.sendMessage({ action: "dataSaveFailed" });
            }
        });
    });
}

// Szczegółowe ekstraktory Bybit rozbijają historię Funding na osobne sekcje i dopisują je do jednego pliku wynikowego.
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
            return !/^Funding_/i.test(source); // usuń wszystkie Funding_*
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
                        action: "dataSaved",
                        filename: BYBIT_KEY
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Deposit (Funding) error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                        action: "dataSaved",
                        filename: BYBIT_KEY
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Withdraw (Funding) error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                        action: "dataSaved",
                        filename: BYBIT_KEY
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit One-Click Buy error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                        action: "dataSaved",
                        filename: BYBIT_KEY
                    });
                    chrome.runtime.sendMessage({
                        action: "checkStorage"
                    });
                } else {
                    chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                }
            });
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit P2P error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
            (l) => !/^Funding;/i.test(l.trim()));

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
                            action: "dataSaved",
                            filename: BYBIT_KEY
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    } else {
                        chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                    }
                }
            );
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Deposit Fiat error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
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
                            action: "dataSaved",
                            filename: BYBIT_KEY
                        });
                        chrome.runtime.sendMessage({
                            action: "checkStorage"
                        });
                    } else {
                        chrome.runtime.sendMessage({ action: "dataSaveFailed" });
                    }
                }
            );
        });
    }

    (async () => {
        try {
            const rows = await collectAllPages();
            if (!rows.length) {
                chrome.runtime.sendMessage({ action: "dataSaveEmpty" });
                return;
            }
            saveCsv(rows);
        } catch (e) {
            console.error("Bybit Withdraw Fiat error:", e);
            chrome.runtime.sendMessage({ action: "dataSaveFailed" });
        }
    })();
}



// 🎯 Pokaż ikonę Finax/mBank w zależności od aktywnej zakładki

// Stopka popupu pokazuje tylko ikonę serwisu związanego z aktywną kartą, żeby ułatwić orientację użytkownikowi.
function updateVisibleIcon() {
    const finaxIcon = document.getElementById("finaxIcon");
    const mbankIcon = document.getElementById("mbankIcon");
    const paribasIcon = document.getElementById("paribasIcon");
    const mileniumIcon = document.getElementById("mileniumIcon");
    const investorsIcon = document.getElementById("investorsIcon");
    const ersteIcon = document.getElementById("ersteIcon");
    const pekaoIcon = document.getElementById("pekaoIcon");
    const nobleIcon = document.getElementById("nobleIcon");
    const bybitIcon = document.getElementById("bybitIcon");
    const analizyPlIcon = document.getElementById("analizyPlIcon");
    const nnIcon = document.getElementById("nnIcon");

    // Domyślnie ukryj obie
    finaxIcon.style.display = "none";
    mbankIcon.style.display = "none";
    paribasIcon.style.display = "none";
    mileniumIcon.style.display = "none";
    investorsIcon.style.display = "none";
    ersteIcon.style.display = "none";
    pekaoIcon.style.display = "none";
    nobleIcon.style.display = "none";
    bybitIcon.style.display = "none";
    analizyPlIcon.style.display = "none";
    nnIcon.style.display = "none";

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
        if (url.includes("erste")) {
            ersteIcon.style.display = "inline-block"
        }
        if (url.includes("bybit")) {
            bybitIcon.style.display = "inline-block";

        }
        if (url.includes("noble")) {
            nobleIcon.style.display = "inline-block"
        } 
        if (url.includes("analizy.pl")) {
          analizyPlIcon.style.display = "inline-block";
        } 
        if (url.includes("moje.nn.pl") || url.includes("logowanie.nn.pl")) {
            nnIcon.style.display = "inline-block";
        }
        if (url.includes("epekaotfi")) {
          pekaoIcon.style.display = "inline-block";
        }
        else if (url.includes("pekao")) {
            pekaoIcon.style.display = "inline-block"
        }
    });
}

document.addEventListener("DOMContentLoaded", updateVisibleIcon);

// 🌐 Obsługa kliknięć w ikonki na dole popupu

// Kliknięcie ikony w stopce otwiera stronę główną danego serwisu w nowej karcie.
[
    ["finaxIcon", "https://finax.eu"],
    ["myfundIcon", "https://myfund.pl"],
    ["mbankIcon", "https://www.mbank.pl"],
    ["paribasIcon", "https://sti24.tfi.bnpparibas.pl/"],
    ["mileniumIcon", "https://millenniumtfi.sti24.pl/"],
    ["investorsIcon", "https://online24.investors.pl/"],
    ["ersteIcon", "https://online.erste-ppk.pl/"],
    ["nobleIcon", "https://mynsapp.noblesecurities.pl/"],
    ["pekaoIcon", "https://www.pekao24.pl"],
    ["analizyPlIcon", "https://www.analizy.pl"],
    ["nnIcon", "https://moje.nn.pl/"],
    ["bybitIcon", "https://www.bybit.com"]
].forEach(([id, url]) => {
    document.getElementById(id).addEventListener("click", () => openInNewTab(url));
});

const clearDataIcon = document.getElementById("clearDataIcon");


// Stan pamięci steruje ikoną kosza i dodatkowymi akcjami zależnymi od tego, czy jakiś CSV jest już zapisany.
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
