const firebaseConfig = {
        apiKey: "AIzaSyBGL4qe8Qf4t0KqSkB48One76sV2HHbmjY",
        authDomain: "cangoldinvestment.firebaseapp.com",
        databaseURL: "https://cangoldinvestment-default-rtdb.firebaseio.com",
        projectId: "cangoldinvestment",
        storageBucket: "cangoldinvestment.appspot.com",
        messagingSenderId: "1052369951680",
        appId: "1:1052369951680:web:5c0a1bb89a58df91718625"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const profitsContainer = document.getElementById('profits-container');
    const chartCtx = document.getElementById('collection-chart').getContext('2d');

    let chart;

    function loadProfitDashboard() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemKey = urlParams.get('itemKey');

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
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            };

            if (itemKey) {
                // Filter for a specific item
                Object.keys(wallets).forEach(walletKey => {
                    const collection = wallets[walletKey]?.collection || {};
                    if (collection[itemKey]) {
                        const item = collection[itemKey];
                        displayItemProfitDetails(item);
                        chartData.labels.push(item.name);
                        chartData.datasets[0].data.push(calculateProfitOrLoss(item));
                    }
                });
            } else {
                // Show overall collection summary
                Object.keys(wallets).forEach(walletKey => {
                    const collection = wallets[walletKey]?.collection || {};
                    Object.keys(collection).forEach(itemKey => {
                        const item = collection[itemKey];
                        profitsContainer.innerHTML += `
                            <div class="card rounded-lg shadow-lg p-6 bg-white text-center">
                                <h2 class="text-lg font-semibold text-gray-800">${item.name}</h2>
                                <p class="text-gray-600">Current Price: ${item.price}</p>
                                <p class="text-gray-600">Profit/Loss: ${item.purchasePrice ? calculateProfitOrLoss(item).toFixed(2) + '%' : 'N/A'}</p>
                            </div>`;
                        if (item.purchasePrice) {
                            chartData.labels.push(item.name);
                            chartData.datasets[0].data.push(calculateProfitOrLoss(item));
                        }
                    });
                });
            }

            renderChart(chartData);
        });
    }

    function calculateProfitOrLoss(item) {
        if (!item.purchasePrice) return 0;
        const currentPrice = parseFloat(item.price) || 0;
        const purchasePrice = parseFloat(item.purchasePrice) || 0;
        return ((currentPrice - purchasePrice) / purchasePrice) * 100;
    }

    function renderChart(chartData) {
        if (chart) chart.destroy();
        chart = new Chart(chartCtx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Profit/Loss Overview' }
                }
            }
        });
    }

    loadProfitDashboard();