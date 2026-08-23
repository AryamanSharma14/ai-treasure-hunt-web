const ROWS = 15;
const COLS = 35;
let grid = [];
let startNode = { r: 7, c: 5 };
let targetNode = { r: 7, c: 29 };
let isRunning = false;
let isMouseDown = false;
let movingNodeType = null; // 'start', 'target', 'wall', 'erase'

const gridElement = document.getElementById('grid');
const btnGenerate = document.getElementById('btn-generate');
const btnClear = document.getElementById('btn-clear');
const btnSolve = document.getElementById('btn-solve');

function initGrid() {
    gridElement.style.gridTemplateColumns = `repeat(${COLS}, 28px)`;
    gridElement.innerHTML = '';
    grid = [];

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            if (r === startNode.r && c === startNode.c) {
                cell.classList.add('start');
            } else if (r === targetNode.r && c === targetNode.c) {
                cell.classList.add('target');
            }

            // Mouse events for drawing walls and moving nodes
            cell.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleMouseDown(e, r, c);
            });
            cell.addEventListener('mouseenter', (e) => {
                handleMouseEnter(e, r, c);
            });

            gridElement.appendChild(cell);
            row.push({
                r, c,
                isWall: false,
                isVisited: false,
                previousNode: null,
                element: cell
            });
        }
        grid.push(row);
    }
}

function handleMouseDown(e, r, c) {
    if (isRunning) return;
    
    isMouseDown = true;
    clearPaths();
    
    const node = grid[r][c];
    
    if (r === startNode.r && c === startNode.c) {
        movingNodeType = 'start';
    } else if (r === targetNode.r && c === targetNode.c) {
        movingNodeType = 'target';
    } else {
        if (node.isWall) {
            movingNodeType = 'erase';
            node.isWall = false;
            node.element.classList.remove('wall');
        } else {
            movingNodeType = 'wall';
            node.isWall = true;
            node.element.classList.add('wall');
        }
    }
}

function handleMouseEnter(e, r, c) {
    if (!isMouseDown || isRunning) return;
    
    const node = grid[r][c];
    
    if (movingNodeType === 'start') {
        if (node.isWall || (r === targetNode.r && c === targetNode.c)) return;
        
        grid[startNode.r][startNode.c].element.classList.remove('start');
        startNode = { r, c };
        node.element.classList.add('start');
    } else if (movingNodeType === 'target') {
        if (node.isWall || (r === startNode.r && c === startNode.c)) return;
        
        grid[targetNode.r][targetNode.c].element.classList.remove('target');
        targetNode = { r, c };
        node.element.classList.add('target');
    } else if (movingNodeType === 'wall') {
        if ((r === startNode.r && c === startNode.c) || (r === targetNode.r && c === targetNode.c)) return;
        node.isWall = true;
        node.element.classList.add('wall');
    } else if (movingNodeType === 'erase') {
        if ((r === startNode.r && c === startNode.c) || (r === targetNode.r && c === targetNode.c)) return;
        node.isWall = false;
        node.element.classList.remove('wall');
    }
}

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    movingNodeType = null;
});

function clearPaths() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const node = grid[r][c];
            node.isVisited = false;
            node.previousNode = null;
            if (!node.isWall && !(r === startNode.r && c === startNode.c) && !(r === targetNode.r && c === targetNode.c)) {
                node.element.className = 'cell';
            }
        }
    }
}

function clearAll() {
    if (isRunning) return;
    initGrid();
}

function generateRandomMaze() {
    if (isRunning) return;
    clearPaths();
    
    // Add random walls
    for(let r=0; r<ROWS; r++){
        for(let c=0; c<COLS; c++){
            if((r === startNode.r && c === startNode.c) || (r === targetNode.r && c === targetNode.c)) continue;
            const node = grid[r][c];
            if(Math.random() < 0.3) {
                node.isWall = true;
                node.element.className = 'cell wall';
            } else {
                node.isWall = false;
                node.element.className = 'cell';
            }
        }
    }
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function solveBFS() {
    if (isRunning) return;
    clearPaths();
    isRunning = true;
    setButtonsState(true);

    const queue = [];
    const start = grid[startNode.r][startNode.c];
    start.isVisited = true;
    queue.push(start);

    // Directions: Up, Right, Down, Left
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    let foundTarget = false;
    let target = null;
    let nodesToAnimate = [];

    // Run BFS Algorithm
    while (queue.length > 0) {
        const current = queue.shift();

        if (current.r === targetNode.r && current.c === targetNode.c) {
            foundTarget = true;
            target = current;
            break;
        }

        if (!(current.r === startNode.r && current.c === startNode.c)) {
            nodesToAnimate.push(current);
        }

        for (let i = 0; i < 4; i++) {
            const nr = current.r + dr[i];
            const nc = current.c + dc[i];

            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const neighbor = grid[nr][nc];
                if (!neighbor.isVisited && !neighbor.isWall) {
                    neighbor.isVisited = true;
                    neighbor.previousNode = current;
                    queue.push(neighbor);
                }
            }
        }
    }

    // Animate Visited Nodes
    for (let i = 0; i < nodesToAnimate.length; i++) {
        nodesToAnimate[i].element.classList.add('visited');
        // Faster animation scale depending on nodes
        if (i % 3 === 0) await sleep(5); 
    }

    // Animate Shortest Path
    if (foundTarget) {
        await drawPath(target);
    } else {
        setTimeout(() => {
            alert("No path found! The target is blocked.");
        }, 100);
    }

    isRunning = false;
    setButtonsState(false);
}

async function drawPath(target) {
    let current = target.previousNode;
    const path = [];
    
    // Backtrack from target to start
    while (current && !(current.r === startNode.r && current.c === startNode.c)) {
        path.push(current);
        current = current.previousNode;
    }
    
    path.reverse();
    
    for (const node of path) {
        node.element.classList.remove('visited');
        node.element.classList.add('path');
        await sleep(40);
    }
}

function setButtonsState(disabled) {
    btnGenerate.disabled = disabled;
    btnClear.disabled = disabled;
    btnSolve.disabled = disabled;
    
    if (disabled) {
        btnSolve.classList.remove('primary');
        btnSolve.style.opacity = '0.5';
    } else {
        btnSolve.classList.add('primary');
        btnSolve.style.opacity = '1';
    }
}

// Event Listeners
btnGenerate.addEventListener('click', generateRandomMaze);
btnClear.addEventListener('click', clearAll);
btnSolve.addEventListener('click', solveBFS);

// Initialize application on load
initGrid();
