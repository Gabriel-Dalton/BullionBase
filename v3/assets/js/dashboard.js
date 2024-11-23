
const firebaseConfig = {
    apiKey: "AIzaSyBGL4qe8Qf4t0KqSkB48One76sV2HHbmjY",
    authDomain: "cangoldinvestment.firebaseapp.com",
    databaseURL: "https://cangoldinvestment-default-rtdb.firebaseio.com",
    projectId: "cangoldinvestment",
    storageBucket: "cangoldinvestment.appspot.com",
    messagingSenderId: "1052369951680",
    appId: "1:1052369951680:web:5c0a1bb89a58df91718625"
};

console.log("Initializing Firebase...");
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let vbcePrices = {};
let currentWallet = localStorage.getItem("currentWallet") || "";

async function fetchVbcePrices() {
    console.log("Fetching VBCE prices...");
    try {
        const response = await fetch('https://rs1.smallfactory.dev/api/v1/metals?apikey=bc9959c3faab76071c6fb348c509f7f32');
        const data = await response.json();
        vbcePrices = data.reduce((acc, item) => {
            const sell = Math.min(item.buy, item.sell);
            const buy = Math.max(item.buy, item.sell);
            acc[item.name] = { buy: buy, sell: sell };
            return acc;
        }, {});
        console.log("VBCE prices fetched successfully:", vbcePrices);
    } catch (error) {
        console.error("Error fetching VBCE prices:", error);
    }
}

function fetchUserCollection() {
    console.log("Fetching user collection for wallet:", currentWallet);
    if (!currentWallet) {
        console.warn("No wallet selected. Skipping collection fetch.");
        return;
    }

    const userId = "demo_user";
    const collectionRef = database.ref(`users/${userId}/wallets/${currentWallet}/collection`);

    collectionRef.on("value", async (snapshot) => {
        const data = snapshot.val() || {};
        console.log("User collection fetched:", data);
        await calculatePortfolioValue(data);
        displayUserCollection(data);
    });
}

function extractWeight(name) {
    if (name.toLowerCase().includes("kg") || name.toLowerCase().includes("kilo")) {
        const kgMatch = name.match(/(\d+(\.\d+)?)\s*(kg|kilo)/i);
        return kgMatch ? parseFloat(kgMatch[1]) * 35.27396195 : 0;
    }

    const ozMatch = name.match(/(\d+(\.\d+)?)\s*oz/i);
    return ozMatch ? parseFloat(ozMatch[1]) : 0;
}

async function calculatePortfolioValue(collection) {
    console.log("Calculating portfolio value...");
    let totalSellValue = 0;
    let totalBuyValue = 0;
    let totalGoldWeightOz = 0;
    let totalSilverWeightOz = 0;

    for (const key in collection) {
        const item = collection[key];
        const vbceItem = vbcePrices[item.name];
        const weight = extractWeight(item.name);

        if (vbceItem) {
            totalSellValue += vbceItem.sell * item.quantity;
            totalBuyValue += vbceItem.buy * item.quantity;

            if (item.name.toLowerCase().includes("gold")) {
                totalGoldWeightOz += weight * item.quantity;
            } else if (item.name.toLowerCase().includes("silver")) {
                totalSilverWeightOz += weight * item.quantity;
            }
        } else {
            console.warn(`No pricing data found for item: ${item.name}`);
        }
    }

    document.getElementById("sell-price").textContent = `$${totalSellValue.toFixed(2)}`;
    document.getElementById("buy-price").textContent = `$${totalBuyValue.toFixed(2)}`;
    document.getElementById("total-gold").textContent = `${totalGoldWeightOz.toFixed(2)} oz`;
    document.getElementById("total-silver").textContent = `${totalSilverWeightOz.toFixed(2)} oz`;

    console.log("Portfolio values updated.");
}

function displayUserCollection(collection) {
    console.log("Displaying user collection...");
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = "";

    for (const key in collection) {
        const item = collection[key];
        const vbceItem = vbcePrices[item.name];

        const itemElement = document.createElement("div");
        itemElement.classList.add("card", "p-4", "rounded-lg", "shadow", "flex", "justify-between", "items-center");

        itemElement.innerHTML = `
            <div>
                <h3 class="text-lg font-semibold text-gray-700">${item.name}</h3>
                <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
                <p class="text-sm text-gray-500">Sell Value: $${(item.quantity * vbceItem?.buy || 0).toFixed(2)}</p>
                <p class="text-sm text-gray-500">Buy Value: $${(item.quantity * vbceItem?.sell || 0).toFixed(2)}</p>
            </div>
            <button onclick="removeItem('${item.name}')" class="text-red-500 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        dashboard.appendChild(itemElement);
    }

    console.log("User collection displayed.");
}

function removeItem(itemName) {
    console.log(`Attempting to remove item: ${itemName}`);
    const userId = "demo_user";
    const collectionRef = database.ref(`users/${userId}/wallets/${currentWallet}/collection`);

    collectionRef.once("value", (snapshot) => {
        const data = snapshot.val();
        let itemKey = null;

        for (const key in data) {
            if (data[key].name === itemName) {
                itemKey = key;
                break;
            }
        }

        if (itemKey) {
            database.ref(`users/${userId}/wallets/${currentWallet}/collection/${itemKey}`).remove()
                .then(() => {
                    console.log(`${itemName} removed successfully.`);
                    fetchUserCollection();
                    showModal("Success", `${itemName} removed successfully!`);
                })
                .catch((error) => {
                    console.error("Error removing item:", error);
                    showModal("Error", "Failed to remove item. Try again.");
                });
        } else {
            console.warn(`Item not found: ${itemName}`);
            showModal("Error", "Item not found in the collection.");
        }
    });
}

function fetchWallets() {
    console.log("Fetching wallets...");
    const userId = "demo_user";
    const walletsRef = database.ref(`users/${userId}/wallets`);

    walletsRef.on("value", (snapshot) => {
        const wallets = snapshot.val() || {};
        const walletSelector = document.getElementById("wallet-selector");

        walletSelector.innerHTML = `<option value="">Select Wallet</option>`;
        for (const walletId in wallets) {
            const option = document.createElement("option");
            option.value = walletId;
            option.textContent = wallets[walletId].name || walletId;
            walletSelector.appendChild(option);
        }

        if (!currentWallet && Object.keys(wallets).length > 0) {
            currentWallet = Object.keys(wallets)[0];
            localStorage.setItem("currentWallet", currentWallet);
        }

        if (currentWallet) {
            walletSelector.value = currentWallet;
            fetchUserCollection();
        }

        console.log("Wallets fetched:", wallets);
    });
}

function createWallet() {
    const walletName = prompt("Enter a name for the new wallet:");
    if (walletName) {
        console.log(`Creating wallet: ${walletName}`);
        const userId = "demo_user";
        const walletsRef = database.ref(`users/${userId}/wallets`);

        const newWalletRef = walletsRef.push();
        newWalletRef.set({ name: walletName, collection: {} }, (error) => {
            if (error) {
                console.error("Error creating wallet:", error);
                showModal("Error", "Failed to create wallet.");
            } else {
                console.log(`Wallet "${walletName}" created successfully.`);
                currentWallet = newWalletRef.key;
                localStorage.setItem("currentWallet", currentWallet);
                fetchWallets();
            }
        });
    }
}

function switchWallet() {
    const walletSelector = document.getElementById("wallet-selector");
    currentWallet = walletSelector.value;
    localStorage.setItem("currentWallet", currentWallet);
    console.log("Switched to wallet:", currentWallet);
    fetchUserCollection();
}

function showModal(title, body) {
    console.log(`Showing modal - Title: ${title}, Body: ${body}`);
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").textContent = body;
    modal.classList.remove("hidden");

    const closeModal = () => modal.classList.add("hidden");
    document.getElementById("close-modal").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
}

async function init() {
    console.log("Initializing application...");
    await fetchVbcePrices();
    fetchWallets();
}

init();
