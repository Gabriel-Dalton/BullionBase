document.addEventListener('DOMContentLoaded', () => {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBGL4qe8Qf4t0KqSkB48One76sV2HHbmjY",
        authDomain: "cangoldinvestment.firebaseapp.com",
        databaseURL: "https://cangoldinvestment-default-rtdb.firebaseio.com",
        projectId: "cangoldinvestment",
        storageBucket: "cangoldinvestment.appspot.com",
        messagingSenderId: "1052369951680",
        appId: "1:1052369951680:web:5c0a1bb89a58df91718625"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const profitsContainer = document.getElementById('profits-container');
    const chartCtx = document.getElementById('collection-chart').getContext('2d');
    let chart;

    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    }

    function loadProfits() {
        const userId = "demo_user";
        const walletsRef = database.ref(`users/${userId}/wallets`);

        walletsRef.once("value", (snapshot) => {
            const wallets = snapshot.val() || {};
            profitsContainer.innerHTML = '';

            const chartData = {
                labels: [],
                datasets: [{
                    label: 'Profit/Loss Percentage',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            Object.keys(wallets).forEach(walletKey => {
                const wallet = wallets[walletKey];
                const collection = wallet.collection || {};

                Object.keys(collection).forEach(itemKey => {
                    const item = collection[itemKey];
                    const profit = calculateProfit(item);

                    // Render profit data
                    const itemElement = document.createElement('div');
                    itemElement.className = 'card rounded-lg shadow-lg p-6 bg-white text-center';

                    itemElement.innerHTML = `
                        <h2 class="text-lg font-semibold text-gray-800">${item.name}</h2>
                        <p class="text-gray-600 mt-2">Quantity: <span class="font-bold">${item.quantity}</span></p>
                        <p class="text-gray-600">Purchase Date: <span class="font-bold">${item.purchaseDate}</span></p>
                        <p class="text-gray-600">Purchase Price: <span class="font-bold">${item.purchasePrice} CAD</span></p>
                        <p class="text-gray-600">Current Price: <span class="font-bold">${item.price} CAD</span></p>
                        <p class="text-gray-600">Total Value: <span class="font-bold">${item.totalValue} CAD</span></p>
                        <p class="mt-4 ${profit > 0 ? 'text-green-500' : 'text-red-500'}">
                            ${profit > 0 ? 'Profit' : 'Loss'}: <span>${profit.toFixed(2)}%</span>
                        </p>
                    `;

                    profitsContainer.appendChild(itemElement);

                    // Populate chart data
                    chartData.labels.push(item.name);
                    chartData.datasets[0].data.push(profit);
                });
            });

            // Render chart
            if (chart) chart.destroy();
            chart = new Chart(chartCtx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Profit/Loss Overview for Collection'
                        }
                    }
                }
            });
        });
    }

    function calculateProfit(item) {
        if (!item.purchasePrice || !item.price) return 0;
        const purchasePrice = parseFloat(item.purchasePrice);
        const currentPrice = parseFloat(item.price);
        return ((currentPrice - purchasePrice) / purchasePrice) * 100;
    }

    loadProfits();
});
