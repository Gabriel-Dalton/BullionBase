document.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-overlay")) {
        event.target.classList.add("hidden");
    }
});
