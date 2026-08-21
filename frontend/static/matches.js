import { api, requireLogin } from './app.js';

await requireLogin();

const matchContainer = document.getElementById('match-container');
const matchCount = document.getElementById('match-count');

const matches = await api('/matches');

if (!matches) {
    matchContainer.innerHTML = '<p class="text-white">No matches for now. Swipe more!</p>';
    matchCount.textContent = '(0)';
} else {
    const usernames = matches.usernames;
    matchContainer.innerHTML = '';

    // Each row is built with createElement and textContent so that a username
    // can never be interpreted as markup.
    const matchItems = usernames.map((username) => {
        const item = document.createElement('div');
        item.className = 'match-item';
        item.dataset.name = username;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = username.slice(0, 2);

        const details = document.createElement('div');
        details.style.flex = '1';

        const name = document.createElement('div');
        name.className = 'match-username';
        name.textContent = username;

        details.appendChild(name);
        item.append(avatar, details);

        item.addEventListener('click', () => {
            window.location.href = `/chat?username=${encodeURIComponent(username)}`;
        });

        matchContainer.appendChild(item);
        return item;
    });

    const searchInput = document.getElementById('search-matches');
    searchInput.addEventListener('input', function () {
        let count = 0;
        const searchTerm = this.value.toLowerCase();

        matchItems.forEach((item) => {
            const name = item.dataset.name.toLowerCase();
            if (name.includes(searchTerm)) {
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
