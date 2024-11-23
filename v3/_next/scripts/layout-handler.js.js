function fetchWallets() {
    const userId = "demo_user";
    const walletsRef = database.ref(`users/${userId}/wallets`);
    walletsRef.on("value", (snapshot) => {
        const wallets = snapshot.val() || {};
        const walletSelector = document.getElementById("wallet-selector");
        walletSelector.innerHTML = Object.keys(wallets)
            .map((key) => `<option value="${key}">${wallets[key].name}</option>`)
            .join("");
        walletSelector.classList.toggle("hidden", Object.keys(wallets).length === 0);
    });
}

function createWallet() {
    document.getElementById("wallet-modal").classList.remove("hidden");
}

document.getElementById("create-wallet-confirm").addEventListener("click", () => {
    const walletName = document.getElementById("wallet-name-input").value.trim();
    if (walletName) {
        const userId = "demo_user";
        const newWalletRef = database.ref(`users/${userId}/wallets`).push();
        newWalletRef.set({ name: walletName, collection: {} });
        document.getElementById("wallet-modal").classList.add("hidden");
    }
});

document.getElementById("cancel-wallet").addEventListener("click", () => {
    document.getElementById("wallet-modal").classList.add("hidden");
});
