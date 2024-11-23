const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const portfolioSummary = document.getElementById('portfolio-summary');

    const savedLayout = localStorage.getItem('portfolioLayout') || 'grid';
    applyLayout(savedLayout);

    gridViewBtn.addEventListener('click', () => {
        applyLayout('grid');
        localStorage.setItem('portfolioLayout', 'grid');
    });

    listViewBtn.addEventListener('click', () => {
        applyLayout('list');
        localStorage.setItem('portfolioLayout', 'list');
    });

    function applyLayout(layout) {
        if (layout === 'grid') {
            portfolioSummary.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
            gridViewBtn.classList.add('bg-yellow-400');
            gridViewBtn.classList.remove('bg-gray-300');
            listViewBtn.classList.remove('bg-yellow-400');
            listViewBtn.classList.add('bg-gray-300');
        } else {
            portfolioSummary.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
            listViewBtn.classList.add('bg-yellow-400');
            listViewBtn.classList.remove('bg-gray-300');
            gridViewBtn.classList.remove('bg-yellow-400');
            gridViewBtn.classList.add('bg-gray-300');
        }
    }