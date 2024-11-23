function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");
}

function createWallet() {
    walletNameInput.value = "";
    walletModal.classList.remove("hidden");
}

function closeWalletModal() {
    walletModal.classList.add("hidden");
}

function switchWallet() {
    const selectedWallet = document.getElementById("wallet-selector").value;
    if (selectedWallet) {
        localStorage.setItem("currentWallet", selectedWallet);
        console.log(`Switched to wallet: ${selectedWallet}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkWallets();
});
