const walletModal = document.getElementById("wallet-modal");
    const walletNameInput = document.getElementById("wallet-name-input");
    const createWalletConfirm = document.getElementById("create-wallet-confirm");
    const cancelWallet = document.getElementById("cancel-wallet");
    const walletSelector = document.getElementById("wallet-selector");
    const errorMessage = document.getElementById("error-message");
    
    function createWallet() {
        walletNameInput.value = "";
        errorMessage.classList.add("hidden");
        walletModal.classList.remove("hidden");
    }
    
    function closeWalletModal() {
        walletModal.classList.add("hidden");
    }
    
    createWalletConfirm.addEventListener("click", () => {
        const walletName = walletNameInput.value.trim();
    
        if (!walletName) {
            errorMessage.textContent = "Please enter a wallet name.";
            errorMessage.classList.remove("hidden");
            return;
        }
    
        const userId = "demo_user";
        const walletsRef = database.ref(`users/${userId}/wallets`);
    
        const newWalletRef = walletsRef.push();
        newWalletRef.set({ name: walletName, collection: {} }, (error) => {
            if (error) {
                errorMessage.textContent = "Failed to create wallet. Please try again.";
                errorMessage.classList.remove("hidden");
            } else {
                checkWallets();
                closeWalletModal();
            }
        });
    });
    
    walletNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            createWalletConfirm.click();
        }
    });
    
    cancelWallet.addEventListener("click", closeWalletModal);
    
    walletModal.addEventListener("click", (e) => {
        if (e.target === walletModal) closeWalletModal();
    });
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeWalletModal();
    });
    
    function checkWallets() {
        const userId = "demo_user";
        const walletsRef = database.ref(`users/${userId}/wallets`);
    
        walletsRef.once("value", (snapshot) => {
            const wallets = snapshot.val() || {};
            const walletKeys = Object.keys(wallets);
    
            if (walletKeys.length > 0) {
                walletSelector.classList.remove("hidden");
                walletSelector.innerHTML = `<option value="">Select Wallet</option>`;
                walletKeys.forEach((walletKey) => {
                    const option = document.createElement("option");
                    option.value = walletKey;
                    option.textContent = wallets[walletKey].name || walletKey;
                    walletSelector.appendChild(option);
                });
            } else {
                walletSelector.classList.add("hidden");
            }
        });
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        checkWallets();
    });