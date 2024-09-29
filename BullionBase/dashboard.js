// Initialize Supabase client using the given URL and public anon key
const SUPABASE_URL = 'https://zgdjdoatmhbnyjmcqkzc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZGpkb2F0bWhibnlqbWNxa3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1NjcxODUsImV4cCI6MjA0MzE0MzE4NX0.6K8EZl59rkLs3N0lT6-obdtiZaJ0zBwrAmvFINx9zx0';  // Replace with your actual anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Allow users to add multiple gold and silver investments
let goldInvestments = [];
let silverInvestments = [];

document.getElementById('addGold').addEventListener('click', () => {
    const id = goldInvestments.length + 1;
    document.getElementById('goldSelection').insertAdjacentHTML('beforeend', `
        <div class="flex space-x-4" id="goldRow${id}">
            <input type="number" id="goldQuantity${id}" class="p-2 border rounded" placeholder="Quantity">
            <input type="text" id="goldType${id}" class="p-2 border rounded" placeholder="Type">
            <input type="number" id="goldPrice${id}" class="p-2 border rounded" placeholder="Price per Oz">
        </div>
    `);
});

document.getElementById('addSilver').addEventListener('click', () => {
    const id = silverInvestments.length + 1;
    document.getElementById('silverSelection').insertAdjacentHTML('beforeend', `
        <div class="flex space-x-4" id="silverRow${id}">
            <input type="number" id="silverQuantity${id}" class="p-2 border rounded" placeholder="Quantity">
            <input type="text" id="silverType${id}" class="p-2 border rounded" placeholder="Type">
            <input type="number" id="silverWeight${id}" class="p-2 border rounded" placeholder="Weight per unit (oz)">
            <input type="number" id="silverPrice${id}" class="p-2 border rounded" placeholder="Price per Oz">
        </div>
    `);
});

// Fetch real-time prices from Supabase
async function fetchMetalPrices() {
    try {
        let { data, error } = await supabase
            .from('metal_prices')
            .select('metal, buy_price, sell_price');

        if (error) {
            console.error('Error fetching data from Supabase:', error);
            return null;
        }

        const goldPriceData = data.find(item => item.metal === 'gold');
        const silverPriceData = data.find(item => item.metal === 'silver');

        return {
            goldBuyPrice: goldPriceData.buy_price,
            silverBuyPrice: silverPriceData.buy_price
        };
    } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        return null;
    }
}

// Calculate and update the dashboard
async function updateDashboard() {
    const prices = await fetchMetalPrices();
    if (!prices) return;

    const { goldBuyPrice, silverBuyPrice } = prices;

    goldInvestments = [];
    silverInvestments = [];

    // Collect gold investments
    const goldRows = document.querySelectorAll('#goldSelection > div');
    goldRows.forEach((row, index) => {
        const quantity = parseFloat(document.getElementById(`goldQuantity${index + 1}`).value);
        const pricePerOz = parseFloat(document.getElementById(`goldPrice${index + 1}`).value);
        if (!isNaN(quantity) && !isNaN(pricePerOz)) {
            goldInvestments.push({ quantity, pricePerOz });
        }
    });

    // Collect silver investments
    const silverRows = document.querySelectorAll('#silverSelection > div');
    silverRows.forEach((row, index) => {
        const quantity = parseFloat(document.getElementById(`silverQuantity${index + 1}`).value);
        const weight = parseFloat(document.getElementById(`silverWeight${index + 1}`).value);
        const pricePerOz = parseFloat(document.getElementById(`silverPrice${index + 1}`).value);
        if (!isNaN(quantity) && !isNaN(weight) && !isNaN(pricePerOz)) {
            silverInvestments.push({ quantity, weight, pricePerOz });
        }
    });

    // Calculate total values
    let totalGoldValue = goldInvestments.reduce((total, item) => total + (item.quantity * item.pricePerOz), 0);
    let totalSilverValue = silverInvestments.reduce((total, item) => total + (item.quantity * item.weight * item.pricePerOz), 0);

    document.getElementById('goldValue').textContent = `$${totalGoldValue.toFixed(2)} CAD`;
    document.getElementById('silverValue').textContent = `$${totalSilverValue.toFixed(2)} CAD`;
    document.getElementById('totalValue').textContent = `$${(totalGoldValue + totalSilverValue).toFixed(2)} CAD`;

    // Update chart
    updateChart(totalGoldValue, totalSilverValue);
}

// Create a chart using Chart.js
function updateChart(totalGoldValue, totalSilverValue) {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gold', 'Silver'],
            datasets: [{
                data: [totalGoldValue, totalSilverValue],
                backgroundColor: ['#FFD700', '#C0C0C0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

updateDashboard();
