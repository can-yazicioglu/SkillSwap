// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Make all match items clickable
    const matchItems = document.querySelectorAll('.match-item');
    matchItems.forEach(function(item) {
        item.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-matches');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            matchItems.forEach(function(item) {
                const name = item.getAttribute('data-name').toLowerCase();
                if (name.indexOf(searchTerm) !== -1) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});