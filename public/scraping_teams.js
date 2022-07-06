const players = [];
document.querySelectorAll('.classement--squad table').forEach(table => {
    [...table.lastElementChild.children].forEach(tr => {
        const player = {};
        [...tr.children].forEach(td => {
            if (td.classList.contains('classement__number')) {
                try {
                    player['number'] = td.lastChild.nodeValue;
                } catch (error) {
                    player['number'] = td.innerText;
                }
            }
            if (td.classList.contains('classement__player')) {
                player['fullName'] = td.children[0].innerText;
            }
        });
        players.push(player);
    })
});
JSON.stringify({ team: 'BRAZIL', players });