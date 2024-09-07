document.addEventListener('DOMContentLoaded', () => {
    const cells = Array.from({ length: 16 }, (_, i) => document.getElementById(`grid-cell-${i}`));
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');

    function initializeGame() {
        clearGrid();
        addNewTile();
        addNewTile();
        gameOverElement.style.display = 'none';
    }

    function clearGrid() {
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.style.backgroundColor = '#cdc1b4';
        });
    }

    function addNewTile() {
        let emptyCells = cells.filter(cell => cell.innerHTML === "");
        if (emptyCells.length === 0){
             return;}

        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.innerHTML = Math.random() > 0.1 ? 2 : 4;
        randomCell.style.backgroundColor = getColor(parseInt(randomCell.innerHTML));
    }

    function getColor(value) {
        switch (value) {
            case 2: return "#fcf403";
            case 4: return "#fc2803";
            case 8: return "#adfc03";
            case 16: return "#adfc50";
            case 32: return "#03c6fc";
            case 64: return "#0388fc";
            case 128: return "#9577b8";
            case 256: return "#b35470";
            case 512: return "#c29f9f";
            case 1024: return "#a8342d";
            case 2048: return "#7df0cf";
            default: return "#7df0a5";
        }
    }

    function move(direction) {
        let moved = false;

        if (direction === 'left') {
            for (let i = 0; i < 16; i += 4) {
                let row = [cells[i], cells[i + 1], cells[i + 2], cells[i + 3]];
                moved = slideAndMerge(row) || moved;
            }
        } else if (direction === 'right') {
            for (let i = 0; i < 16; i += 4) {
                let row = [cells[i + 3], cells[i + 2], cells[i + 1], cells[i]];
                moved = slideAndMerge(row) || moved;
            }
        } else if (direction === 'up') {
            for (let i = 0; i < 4; i++) {
                let column = [cells[i], cells[i + 4], cells[i + 8], cells[i + 12]];
                moved = slideAndMerge(column) || moved;
            }
        } else if (direction === 'down') {
            for (let i = 0; i < 4; i++) {
                let column = [cells[i + 12], cells[i + 8], cells[i + 4], cells[i]];
                moved = slideAndMerge(column) || moved;
            }
        }

        if (moved) addNewTile();
        if (isGameOver()) {
            gameOverElement.style.display = 'block';  // Show "Game Over" message
        }
    }

    function slideAndMerge(group) {
        let numbers = group.map(cell => parseInt(cell.innerHTML) || 0);
        let filtered = numbers.filter(num => num);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                filtered[i + 1] = 0;
            }
        }
        let merged = filtered.concat(new Array(4 - filtered.length).fill(0));

        let moved = false;
        for (let i = 0; i < 4; i++) {
            let value = merged[i] === 0 ? '' : merged[i];
            if (group[i].innerHTML !== value.toString()) {
                group[i].innerHTML = value;
                group[i].style.backgroundColor = value === '' ? '#cdc1b4' : getColor(parseInt(value));
                moved = true;
            }
        }
        return moved;
    }

    function isGameOver() {
        if (cells.some(cell => cell.innerHTML === '')) return false;

        for (let i = 0; i < 16; i++) {
            let value = parseInt(cells[i].innerHTML);
            if (i % 4 !== 3 && value === parseInt(cells[i + 1].innerHTML)) return false; // Check right
            if (i < 12 && value === parseInt(cells[i + 4].innerHTML)) return false; // Check down
        }

        return true; // No moves left
    }

    document.addEventListener('keydown', (e) => {
        if (gameOverElement.style.display === 'block') return; // Prevent movement if game over
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
    });

    restartButton.addEventListener('click', initializeGame);  // Reset game when restart button is clicked

    initializeGame();
});
