import { api, requireLogin } from './app.js';

await requireLogin();

let usernames;

const matchContainer = document.getElementById('match-container');
const matchCount = document.getElementById('match-count');

const matches = await api('/matches');
if (!matches) {
    matchContainer.innerHTML = '<p class="text-white">No matches for now. Swipe more!</p>';
    matchCount.textContent = '(0)';
} else {
    usernames = matches.usernames;
    matchContainer.innerHTML = '';

    usernames.forEach((username) => {
        const item = `<div class="match-item" data-name="${username}">
                        <div class="avatar">${username.slice(0, 2)}</div>
                        <div style="flex: 1;">
                            <div class="match-username">${username}</div>
                        </div>
                    </div>`
        matchContainer.innerHTML += item;
    });

    const matchItems = document.querySelectorAll('.match-item');
    matchItems.forEach(function(item) {
        item.addEventListener('click', function() {
            window.location.href = `/chat?username=${item.getAttribute('data-name')}`;
        });
    });

    const searchInput = document.getElementById('search-matches');
    searchInput.addEventListener('input', function() {
        let count = 0;
        const searchTerm = this.value.toLowerCase();
        matchItems.forEach((item) => {
            const name = item.getAttribute('data-name').toLowerCase();
            if (name.indexOf(searchTerm) !== -1) {
                item.style.display = 'flex';
                count += 1;
            } else {
                item.style.display = 'none';
            }
        });
        matchCount.textContent = `(${count})`;
    });

    matchCount.textContent = `(${usernames.length})`;
}