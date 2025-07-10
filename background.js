chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("finax.eu/pl")) {
        // Usuwamy zapisane dane po odświeżeniu strony Finax
        chrome.storage.local.remove(["finax_transakcje.csv", "finax_operacje.csv"], () => {
            console.log("Dane usunięte po odświeżeniu strony Finax.");
        });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveData") {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ [request.filename]: request.data }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Błąd zapisu w `storage.local`:", chrome.runtime.lastError);
                    sendResponse({ status: "error", message: chrome.runtime.lastError });
                } else {
                    console.log("Dane zapisane:", request.filename);
                    sendResponse({ status: "success" });
                }
            });
        } else {
            console.error("chrome.storage.local jest niezdefiniowane.");
            sendResponse({ status: "error", message: "chrome.storage.local nie jest dostępne." });
        }
        return true; // Pozwala na asynchroniczne `sendResponse`
    }
});
