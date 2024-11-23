const portfolioSummary = document.getElementById("portfolio-summary");
document.getElementById("grid-view-btn").addEventListener("click", () => {
    portfolioSummary.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
});
document.getElementById("list-view-btn").addEventListener("click", () => {
    portfolioSummary.className = "grid grid-cols-1 gap-6";
});
