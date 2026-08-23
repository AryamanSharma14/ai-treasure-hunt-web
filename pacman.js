// =============================================
// PACMAN AI — Full Implementation
// Maze layouts, ghost AI (BFS/DFS/A*/Greedy),
// autopilot, smooth movement, rendering, HUD
// =============================================

// ── Maze layouts (21×21) ─────────────────────
// Cell types:
//   0 = open (has pellet)
//   1 = wall
//   2 = ghost-house interior
//   3 = gate
//   4 = power pellet
//   5 = open (no pellet, e.g. tunnel sides)

const _CLASSIC = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,4,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1],
  [1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1],
  [1,1,1,0,1,1,0,1,1,1,3,1,1,1,0,1,1,0,1,1,1],
  [5,5,5,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,5,5,5],
  [1,1,1,0,1,1,0,1,2,2,2,2,2,1,0,1,1,0,1,1,1],
  [1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1],
  [1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const _ARENA = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0,0,0,0,1],
  [5,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,5],
  [1,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const _LABYRINT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,4,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,4,1],
  [1,0,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,1,1,3,1,1,1,0,1,1,0,1,0,1],
  [5,0,1,0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,1,0,5],
  [1,0,1,0,1,1,0,1,2,2,2,2,2,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
  [1,4,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,4,1],
  [1,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const PAC_MAZES = [_CLASSIC, _ARENA, _LABYRINT];
const PAC_MAZE_NAMES = ['Classic', 'Open Arena', 'Labyrinth'];
const PAC_ROWS = 21, PAC_COLS = 21;
const PAC_TUNNEL_ROW = 9;
// Ghost colors & labels
const PAC_GHOST_COLORS = ['#4A9EFF', '#FFB830', '#50E3A4', '#FF6B6B'];
const PAC_GHOST_LABELS = ['BFS', 'DFS', 'A*', 'GRD'];
// Ghost house gate position (classic: row 8, col 10)
const PAC_GATE_R = 8, PAC_GATE_C = 10;
// Ghost house spawn positions (inside ghost house)
const PAC_GHOST_SPAWNS = [[9,10],[9,9],[9,11],[10,10]];
// Pacman start position
const PAC_START_R = 15, PAC_START_C = 10;

// ── Main state object ──────────────────────────
let pacGame = null;

// ── Maze helpers ──────────────────────────────

/**
 * Returns true if (r,c) is a wall for the given entity.
 * Pacman cannot enter ghost house (type 2) or gate (type 3).
 * Ghosts can traverse ghost house interior and gate.
 */
function pacIsWall(maze, r, c, forGhost) {
  if (r < 0 || r >= PAC_ROWS || c < 0 || c >= PAC_COLS) return true;
  const t = maze[r][c];
  if (t === 1) return true;
  if (!forGhost && (t === 2 || t === 3)) return true;
  return false;
}

/**
 * Returns passable neighbors of (r,c).
 * Handles tunnel wrap: row 9, col 0 ↔ col 20.
 */
function pacNeighbors(maze, r, c, forGhost) {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const result = [];
  for (const [dr, dc] of dirs) {
    let nr = r + dr, nc = c + dc;
    // Tunnel wrap
    if (r === PAC_TUNNEL_ROW) {
      if (c === 0 && dc === -1) { nr = PAC_TUNNEL_ROW; nc = PAC_COLS - 1; }
      else if (c === PAC_COLS - 1 && dc === 1) { nr = PAC_TUNNEL_ROW; nc = 0; }
    }
    if (!pacIsWall(maze, nr, nc, forGhost)) result.push([nr, nc]);
  }
  return result;
}

// ── Path-finding algorithms ───────────────────

/** BFS: returns shortest path [[r,c],...] from (sr,sc) to (gr,gc), or [] */
function pacPathBFS(maze, sr, sc, gr, gc, forGhost) {
  if (sr === gr && sc === gc) return [[sr, sc]];
  const parent = new Map();
  const key = (r, c) => r * PAC_COLS + c;
  parent.set(key(sr, sc), null);
  const queue = [[sr, sc]];
  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [nr, nc] of pacNeighbors(maze, r, c, forGhost)) {
      const k = key(nr, nc);
      if (!parent.has(k)) {
        parent.set(k, [r, c]);
        if (nr === gr && nc === gc) return pacReconstructPath(parent, sr, sc, gr, gc, key);
        queue.push([nr, nc]);
      }
    }
  }
  return [];
}

/** DFS: returns a path (not necessarily shortest) */
function pacPathDFS(maze, sr, sc, gr, gc, forGhost) {
  if (sr === gr && sc === gc) return [[sr, sc]];
  const parent = new Map();
  const key = (r, c) => r * PAC_COLS + c;
  parent.set(key(sr, sc), null);
  const stack = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r === gr && c === gc) return pacReconstructPath(parent, sr, sc, gr, gc, key);
    for (const [nr, nc] of pacNeighbors(maze, r, c, forGhost)) {
      const k = key(nr, nc);
      if (!parent.has(k)) {
        parent.set(k, [r, c]);
        stack.push([nr, nc]);
      }
    }
  }
  return [];
}

/** A*: heuristic = manhattan distance + optional penaltyFn(r,c) */
function pacPathAstar(maze, sr, sc, gr, gc, forGhost, penaltyFn) {
  if (sr === gr && sc === gc) return [[sr, sc]];
  const key = (r, c) => r * PAC_COLS + c;
  const h = (r, c) => manhattan([r, c], [gr, gc]);
  const gCost = new Map([[key(sr, sc), 0]]);
  const parent = new Map([[key(sr, sc), null]]);
  // Min-heap via sorted array (sufficient for 21x21)
  const open = [[h(sr, sc), sr, sc]];

  while (open.length) {
    // Pop node with lowest f
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i][0] < open[best][0]) best = i;
    const [, r, c] = open.splice(best, 1)[0];

    if (r === gr && c === gc) return pacReconstructPath(parent, sr, sc, gr, gc, key);

    const g = gCost.get(key(r, c));
    for (const [nr, nc] of pacNeighbors(maze, r, c, forGhost)) {
      const k = key(nr, nc);
      const penalty = penaltyFn ? penaltyFn(nr, nc) : 0;
      const ng = g + 1 + penalty;
      if (!gCost.has(k) || ng < gCost.get(k)) {
        gCost.set(k, ng);
        parent.set(k, [r, c]);
        open.push([ng + h(nr, nc), nr, nc]);
      }
    }
  }
  return [];
}

/** Greedy Best-First: always expand node closest to goal */
function pacPathGreedy(maze, sr, sc, gr, gc, forGhost) {
  if (sr === gr && sc === gc) return [[sr, sc]];
  const key = (r, c) => r * PAC_COLS + c;
  const h = (r, c) => manhattan([r, c], [gr, gc]);
  const parent = new Map([[key(sr, sc), null]]);
  const open = [[h(sr, sc), sr, sc]];

  while (open.length) {
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i][0] < open[best][0]) best = i;
    const [, r, c] = open.splice(best, 1)[0];

    if (r === gr && c === gc) return pacReconstructPath(parent, sr, sc, gr, gc, key);

    for (const [nr, nc] of pacNeighbors(maze, r, c, forGhost)) {
      const k = key(nr, nc);
      if (!parent.has(k)) {
        parent.set(k, [r, c]);
        open.push([h(nr, nc), nr, nc]);
      }
    }
  }
  return [];
}

/** Reconstruct path from parent map */
function pacReconstructPath(parent, sr, sc, gr, gc, keyFn) {
  const path = [];
  let cur = [gr, gc];
  while (cur) {
    path.unshift(cur);
    const k = keyFn(cur[0], cur[1]);
    const p = parent.get(k);
    if (!p) break;
    cur = p;
  }
  return path;
}

// ── Ghost AI helpers ──────────────────────────

/** Find the cell farthest from pacman for scared-mode routing */
function pacFarthestCell(maze, fromR, fromC, pr, pc) {
  let best = null, bestDist = -1;
  for (let r = 0; r < PAC_ROWS; r++) {
    for (let c = 0; c < PAC_COLS; c++) {
      const t = maze[r][c];
      if (t === 1 || t === 2 || t === 3) continue;
      const d = manhattan([r, c], [pr, pc]);
      if (d > bestDist) { bestDist = d; best = [r, c]; }
    }
  }
  return best || [fromR, fromC];
}

/** Recalculate path for a single ghost */
function pacRecalcGhost(g, maze, pr, pc) {
  const algo = g.idx;
  if (g.eaten) {
    // Return to ghost house gate
    const path = pacPathBFS(maze, g.r, g.c, PAC_GATE_R, PAC_GATE_C, true);
    g.path = path.length > 1 ? path.slice(1) : [];
    g.pathStep = 0;
    g.stats.totalPath += g.path.length;
    g.stats.pathCount++;
    return;
  }
  if (g.scared) {
    const [fr, fc] = pacFarthestCell(maze, g.r, g.c, pr, pc);
    const path = pacPathBFS(maze, g.r, g.c, fr, fc, true);
    g.path = path.length > 1 ? path.slice(1) : [];
    g.pathStep = 0;
    return;
  }
  // Normal: chase pacman using ghost's algorithm
  let path = [];
  if (algo === 0) path = pacPathBFS(maze, g.r, g.c, pr, pc, true);
  else if (algo === 1) path = pacPathDFS(maze, g.r, g.c, pr, pc, true);
  else if (algo === 2) path = pacPathAstar(maze, g.r, g.c, pr, pc, true, null);
  else if (algo === 3) path = pacPathGreedy(maze, g.r, g.c, pr, pc, true);
  g.path = path.length > 1 ? path.slice(1) : [];
  g.pathStep = 0;
  if (g.path.length === 0) g.stats.stuckCount++;
  g.stats.totalPath += g.path.length;
  g.stats.pathCount++;
}

// ── Initialization ────────────────────────────

/** Build maze grid copy from layout, collect pellets */
function pacBuildMaze(mazeIdx) {
  const src = PAC_MAZES[mazeIdx];
  const maze = src.map(row => row.slice());
  const pellets = new Set();
  const powerPellets = new Set();
  for (let r = 0; r < PAC_ROWS; r++) {
    for (let c = 0; c < PAC_COLS; c++) {
      if (src[r][c] === 0) pellets.add(r + ',' + c);
      if (src[r][c] === 4) powerPellets.add(r + ',' + c);
    }
  }
  return { maze, pellets, powerPellets };
}

/** Create a fresh ghost object */
function pacMakeGhost(idx) {
  const [sr, sc] = PAC_GHOST_SPAWNS[idx];
  const speeds = [0.8, 1.0, 1.1, 1.05];
  return {
    idx, r: sr, c: sc,
    prevR: sr, prevC: sc,
    progress: 0,
    dir: { dr: 0, dc: 0 },
    path: [], pathStep: 0,
    scared: false,
    eaten: false,
    eatenTimer: 0,
    speed: speeds[idx],
    stats: { caught: 0, totalPath: 0, pathCount: 0, stuckCount: 0 }
  };
}

/** Initialize or reinitialize the pacGame state */
function pacStart(mazeIdx) {
  mazeIdx = mazeIdx || 0;
  if (pacGame && pacGame.animId) cancelAnimationFrame(pacGame.animId);

  const { maze, pellets, powerPellets } = pacBuildMaze(mazeIdx);
  const totalPellets = pellets.size + powerPellets.size;

  // Get canvas
  const pacCanvas = document.getElementById('pac-canvas');
  const pacCtx = pacCanvas ? pacCanvas.getContext('2d') : null;

  pacGame = {
    running: false, paused: false,
    state: 'playing',
    score: 0, lives: 3, level: 1,
    mazeIdx,
    maze, pellets, powerPellets,
    totalPellets,
    pelletsLeft: totalPellets,
    autopilot: false, showPaths: false,
    scaredTimer: 0, powerActive: false,
    pacman: {
      r: PAC_START_R, c: PAC_START_C,
      prevR: PAC_START_R, prevC: PAC_START_C,
      progress: 0,
      dir: { dr: 0, dc: 0 },
      nextDir: { dr: 0, dc: -1 },
      mouthAngle: 0.25,
      mouthDir: 1,
      dead: false, deadTimer: 0
    },
    ghosts: [0, 1, 2, 3].map(pacMakeGhost),
    recalcTimer: 0, autopilotTimer: 0,
    autopilotPath: [], autopilotTarget: null,
    animId: null, lastTime: null,
    canvas: pacCanvas, ctx: pacCtx,
    cellW: 30, cellH: 30,
    catchFlash: [],
    levelUpTimer: 0,
    gameOverShown: false
  };

  pacResize();
  // Initial ghost path calc
  for (const g of pacGame.ghosts) {
    pacRecalcGhost(g, pacGame.maze, pacGame.pacman.r, pacGame.pacman.c);
  }

  pacGame.running = true;
  pacGame.animId = requestAnimationFrame(pacGameLoop);
  pacUpdatePanel();
}

/** Stop the game loop */
function pacStop() {
  if (pacGame && pacGame.animId) {
    cancelAnimationFrame(pacGame.animId);
    pacGame.animId = null;
  }
  if (pacGame) pacGame.running = false;
}

/** Restart with current maze */
function pacRestart() {
  if (pacGame) pacStart(pacGame.mazeIdx);
}

/** Toggle autopilot mode */
function pacToggleAutopilot() {
  if (!pacGame) return;
  pacGame.autopilot = !pacGame.autopilot;
  pacGame.autopilotPath = [];
  pacGame.autopilotTarget = null;
  pacUpdatePanel();
}

/** Toggle path visualization */
function pacTogglePaths() {
  if (!pacGame) return;
  pacGame.showPaths = !pacGame.showPaths;
  pacUpdatePanel();
}

/** Handle keyboard input; returns true if consumed */
function pacHandleKey(key) {
  if (!pacGame || !pacGame.running) return false;

  const dirMap = {
    'ArrowUp': { dr: -1, dc: 0 }, 'w': { dr: -1, dc: 0 }, 'W': { dr: -1, dc: 0 },
    'ArrowDown': { dr: 1, dc: 0 }, 's': { dr: 1, dc: 0 }, 'S': { dr: 1, dc: 0 },
    'ArrowLeft': { dr: 0, dc: -1 }, 'a': { dr: 0, dc: -1 }, 'A': { dr: 0, dc: -1 },
    'ArrowRight': { dr: 0, dc: 1 }, 'd': { dr: 0, dc: 1 }, 'D': { dr: 0, dc: 1 },
  };

  if (dirMap[key]) {
    pacGame.autopilot = false;
    pacGame.pacman.nextDir = dirMap[key];
    return true;
  }
  if (key === 'p' || key === 'P') {
    if (pacGame.state === 'playing') { pacGame.state = 'paused'; pacGame.paused = true; }
    else if (pacGame.state === 'paused') { pacGame.state = 'playing'; pacGame.paused = false; }
    return true;
  }
  if (key === 'a' || key === 'A') { pacToggleAutopilot(); return true; }
  if (key === 'v' || key === 'V') { pacTogglePaths(); return true; }
  if (key === 'r' || key === 'R') { pacRestart(); return true; }
  return false;
}

/** Resize canvas to fit the pac-canvas parent */
function pacResize() {
  if (!pacGame || !pacGame.canvas) return;
  const wrap = pacGame.canvas.parentElement;
  if (!wrap) return;
  const maxW = wrap.clientWidth - 16;
  const maxH = wrap.clientHeight - 16;
  const cell = Math.floor(Math.min(maxW / PAC_COLS, maxH / PAC_ROWS));
  pacGame.cellW = cell;
  pacGame.cellH = cell;
  pacGame.canvas.width = cell * PAC_COLS;
  pacGame.canvas.height = cell * PAC_ROWS;
}

// ── Game Loop ──────────────────────────────────

function pacGameLoop(ts) {
  if (!pacGame || !pacGame.running) return;
  pacGame.animId = requestAnimationFrame(pacGameLoop);

  const dt = pacGame.lastTime ? Math.min((ts - pacGame.lastTime) / 1000, 0.1) : 0.016;
  pacGame.lastTime = ts;

  if (!pacGame.paused && pacGame.state !== 'paused') {
    pacUpdate(dt);
  }
  pacDraw();
  pacUpdatePanel();
}

// ── Game Update ───────────────────────────────

function pacUpdate(dt) {
  const g = pacGame;
  if (g.state === 'dead') {
    g.pacman.deadTimer -= dt;
    if (g.pacman.deadTimer <= 0) {
      g.pacman.dead = false;
      g.pacman.r = PAC_START_R; g.pacman.c = PAC_START_C;
      g.pacman.prevR = PAC_START_R; g.pacman.prevC = PAC_START_C;
      g.pacman.progress = 0;
      g.pacman.dir = { dr: 0, dc: 0 };
      g.pacman.nextDir = { dr: 0, dc: -1 };
      // Respawn ghosts
      for (const gh of g.ghosts) {
        const sp = PAC_GHOST_SPAWNS[gh.idx];
        gh.r = sp[0]; gh.c = sp[1];
        gh.prevR = sp[0]; gh.prevC = sp[1];
        gh.progress = 0;
        gh.scared = false; gh.eaten = false;
        gh.path = []; gh.pathStep = 0;
        pacRecalcGhost(gh, g.maze, g.pacman.r, g.pacman.c);
      }
      g.state = 'playing';
    }
    return;
  }
  if (g.state === 'gameover' || g.state === 'levelup') {
    if (g.state === 'levelup') {
      g.levelUpTimer -= dt;
      if (g.levelUpTimer <= 0) pacNextLevel();
    }
    return;
  }

  // Power pellet countdown
  if (g.powerActive) {
    g.scaredTimer -= dt;
    if (g.scaredTimer <= 0) {
      g.scaredTimer = 0;
      g.powerActive = false;
      for (const gh of g.ghosts) {
        if (!gh.eaten) gh.scared = false;
      }
    }
  }

  // Ghost recalc timer
  const recalcInterval = g.level <= 1 ? 0.8 : g.level === 2 ? 0.6 : 0.4;
  g.recalcTimer -= dt;
  if (g.recalcTimer <= 0) {
    g.recalcTimer = recalcInterval;
    for (const gh of g.ghosts) {
      pacRecalcGhost(gh, g.maze, g.pacman.r, g.pacman.c);
    }
  }

  // Autopilot
  if (g.autopilot) {
    g.autopilotTimer -= dt;
    if (g.autopilotTimer <= 0 || !g.autopilotPath.length) {
      g.autopilotTimer = 0.3;
      pacRecalcAutopilot();
    }
    if (g.autopilotPath.length) {
      const [nr, nc] = g.autopilotPath[0];
      const dr = nr - g.pacman.r, dc = nc - g.pacman.c;
      g.pacman.nextDir = { dr, dc };
    }
  }

  // Move pacman
  pacMovePacman(dt);

  // Move ghosts
  const speedMul = g.level <= 1 ? 0.8 : g.level === 2 ? 0.9 : 1.0;
  for (const gh of g.ghosts) pacMoveGhost(gh, dt, speedMul);

  // Collision
  pacCheckCollisions();

  // Catch flash timers
  g.catchFlash = g.catchFlash.filter(f => {
    f.timer -= dt;
    return f.timer > 0;
  });

  // Mouth animation
  g.pacman.mouthAngle += g.pacman.mouthDir * dt * 2.5;
  if (g.pacman.mouthAngle > 0.3) { g.pacman.mouthAngle = 0.3; g.pacman.mouthDir = -1; }
  if (g.pacman.mouthAngle < 0.02) { g.pacman.mouthAngle = 0.02; g.pacman.mouthDir = 1; }
}

function pacRecalcAutopilot() {
  const g = pacGame;
  const pm = g.pacman;

  // Find nearest pellet
  let best = null, bestDist = Infinity;
  for (const key of g.pellets) {
    const [r, c] = key.split(',').map(Number);
    const d = manhattan([pm.r, pm.c], [r, c]);
    if (d < bestDist) { bestDist = d; best = [r, c]; }
  }
  for (const key of g.powerPellets) {
    const [r, c] = key.split(',').map(Number);
    const d = manhattan([pm.r, pm.c], [r, c]);
    if (d < bestDist) { bestDist = d; best = [r, c]; }
  }
  if (!best) { g.autopilotPath = []; g.autopilotTarget = null; return; }

  g.autopilotTarget = best;

  // A* with ghost penalty
  const penaltyFn = (r, c) => {
    let pen = 0;
    for (const gh of g.ghosts) {
      if (gh.eaten || gh.scared) continue;
      const d = manhattan([r, c], [gh.r, gh.c]);
      if (d <= 1) pen += 500;
      else if (d <= 2) pen += 300;
      else if (d <= 4) pen += (4 - d) * 50;
    }
    return pen;
  };

  const path = pacPathAstar(g.maze, pm.r, pm.c, best[0], best[1], false, penaltyFn);
  g.autopilotPath = path.length > 1 ? path.slice(1) : [];
}

function pacMovePacman(dt) {
  const g = pacGame;
  const pm = g.pacman;
  if (pm.dead) return;

  const speed = 5.0; // cells per second
  pm.progress += speed * dt;

  if (pm.progress >= 1) {
    pm.progress = pm.progress - Math.floor(pm.progress);
    pm.prevR = pm.r; pm.prevC = pm.c;

    // Try nextDir first
    const nd = pm.nextDir;
    const nR = pm.r + nd.dr, nC = pm.c + nd.dc;
    let moved = false;

    // Tunnel wrap check
    let actualNR = nR, actualNC = nC;
    if (pm.r === PAC_TUNNEL_ROW) {
      if (pm.c === 0 && nd.dc === -1) { actualNC = PAC_COLS - 1; actualNR = PAC_TUNNEL_ROW; }
      else if (pm.c === PAC_COLS - 1 && nd.dc === 1) { actualNC = 0; actualNR = PAC_TUNNEL_ROW; }
    }

    if (!pacIsWall(g.maze, actualNR, actualNC, false)) {
      pm.r = actualNR; pm.c = actualNC;
      pm.dir = { ...nd };
      moved = true;
    } else {
      // Try current dir
      const d = pm.dir;
      let cR = pm.prevR + d.dr, cC = pm.prevC + d.dc;
      if (pm.prevR === PAC_TUNNEL_ROW) {
        if (pm.prevC === 0 && d.dc === -1) { cC = PAC_COLS - 1; cR = PAC_TUNNEL_ROW; }
        else if (pm.prevC === PAC_COLS - 1 && d.dc === 1) { cC = 0; cR = PAC_TUNNEL_ROW; }
      }
      if (!pacIsWall(g.maze, cR, cC, false)) {
        pm.r = cR; pm.c = cC;
        moved = true;
      }
    }

    if (!moved) { pm.r = pm.prevR; pm.c = pm.prevC; pm.progress = 0; }

    // Consume pellet
    const pKey = pm.r + ',' + pm.c;
    if (g.pellets.has(pKey)) {
      g.pellets.delete(pKey);
      g.pelletsLeft--;
      g.score += 10;
    } else if (g.powerPellets.has(pKey)) {
      g.powerPellets.delete(pKey);
      g.pelletsLeft--;
      g.score += 50;
      g.powerActive = true;
      g.scaredTimer = 8; // 8 seconds of scared mode
      for (const gh of g.ghosts) { if (!gh.eaten) gh.scared = true; }
      // Re-route all ghosts away
      for (const gh of g.ghosts) pacRecalcGhost(gh, g.maze, pm.r, pm.c);
    }

    // Advance autopilot path
    if (g.autopilot && g.autopilotPath.length) {
      const [pr, pc] = g.autopilotPath[0];
      if (pm.r === pr && pm.c === pc) g.autopilotPath.shift();
    }

    // Check level complete
    if (g.pelletsLeft <= 0) {
      g.state = 'levelup';
      g.levelUpTimer = 2;
      return;
    }
  }
}

function pacMoveGhost(gh, dt, speedMul) {
  if (gh.eaten) {
    // Eaten ghosts move faster back to house
    gh.progress += 6 * dt;
  } else {
    gh.progress += gh.speed * speedMul * 4.5 * dt;
  }

  if (gh.progress >= 1) {
    gh.progress = gh.progress - Math.floor(gh.progress);
    gh.prevR = gh.r; gh.prevC = gh.c;

    if (gh.path.length > 0) {
      const [nr, nc] = gh.path[0];
      gh.path.shift();
      gh.dir = { dr: nr - gh.r, dc: nc - gh.c };
      gh.r = nr; gh.c = nc;

      // If eaten ghost reached gate, enter house
      if (gh.eaten && gh.r === PAC_GATE_R && gh.c === PAC_GATE_C) {
        const sp = PAC_GHOST_SPAWNS[gh.idx];
        gh.r = sp[0]; gh.c = sp[1];
        gh.prevR = sp[0]; gh.prevC = sp[1];
        gh.eaten = false;
        gh.scared = false;
        gh.progress = 0;
      }
    }
  }
}

function pacCheckCollisions() {
  const g = pacGame;
  const pm = g.pacman;
  if (pm.dead || g.state !== 'playing') return;

  for (const gh of g.ghosts) {
    if (gh.eaten) continue;
    // Check if same cell (with progress threshold)
    const sameCell = (pm.r === gh.r && pm.c === gh.c);
    const bothProgress = pm.progress > 0.3 && gh.progress > 0.3;
    if (!sameCell && !bothProgress) continue;
    if (!sameCell) continue;

    if (gh.scared) {
      // Eat ghost
      gh.eaten = true;
      gh.scared = false;
      g.score += 200;
      g.catchFlash.push({ ghostIdx: gh.idx, timer: 0.8 });
      gh.stats.caught++;
      pacRecalcGhost(gh, g.maze, pm.r, pm.c);
    } else {
      // Pacman dies
      g.lives--;
      pm.dead = true;
      pm.deadTimer = 1.5;
      gh.stats.caught++;
      if (g.lives <= 0) {
        g.state = 'gameover';
      } else {
        g.state = 'dead';
      }
      return;
    }
  }
}

function pacNextLevel() {
  const g = pacGame;
  g.level++;
  g.mazeIdx = (g.mazeIdx + 1) % PAC_MAZES.length;
  const { maze, pellets, powerPellets } = pacBuildMaze(g.mazeIdx);
  g.maze = maze;
  g.pellets = pellets;
  g.powerPellets = powerPellets;
  g.pelletsLeft = pellets.size + powerPellets.size;
  g.totalPellets = g.pelletsLeft;
  g.powerActive = false;
  g.scaredTimer = 0;
  g.pacman.r = PAC_START_R; g.pacman.c = PAC_START_C;
  g.pacman.prevR = PAC_START_R; g.pacman.prevC = PAC_START_C;
  g.pacman.progress = 0;
  g.pacman.dir = { dr: 0, dc: 0 };
  g.pacman.nextDir = { dr: 0, dc: -1 };
  g.pacman.dead = false;
  for (const gh of g.ghosts) {
    const sp = PAC_GHOST_SPAWNS[gh.idx];
    gh.r = sp[0]; gh.c = sp[1];
    gh.prevR = sp[0]; gh.prevC = sp[1];
    gh.progress = 0; gh.scared = false; gh.eaten = false;
    gh.path = []; gh.pathStep = 0;
    pacRecalcGhost(gh, g.maze, g.pacman.r, g.pacman.c);
  }
  g.recalcTimer = 0;
  g.catchFlash = [];
  g.state = 'playing';
  g.paused = false;
}

// ── Rendering ─────────────────────────────────

function pacDraw() {
  const g = pacGame;
  if (!g || !g.ctx) return;
  const { ctx, canvas, cellW: cW, cellH: cH, maze } = g;
  const W = canvas.width, H = canvas.height;
  const pm = g.pacman;

  // Background
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, W, H);

  if (g.state === 'gameover') { pacDrawGameOver(); return; }

  // Draw maze cells
  for (let r = 0; r < PAC_ROWS; r++) {
    for (let c = 0; c < PAC_COLS; c++) {
      const t = maze[r][c];
      const x = c * cW, y = r * cH;
      if (t === 1) {
        ctx.fillStyle = '#2a2a4a';
        // Slightly rounded walls if supported
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, cW - 2, cH - 2, 2);
          ctx.fill();
        } else {
          ctx.fillRect(x + 1, y + 1, cW - 2, cH - 2);
        }
      } else if (t === 2) {
        ctx.fillStyle = '#1a1a35';
        ctx.fillRect(x, y, cW, cH);
        ctx.strokeStyle = '#333366';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, cW - 1, cH - 1);
      } else if (t === 3) {
        // Gate: open cell + gold line on top
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, cW, cH);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 1, y + cH * 0.35, cW - 2, cH * 0.3);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, cW, cH);
      }
    }
  }

  // Pellets
  const now = performance.now();
  for (const key of g.pellets) {
    const [r, c] = key.split(',').map(Number);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(c * cW + cW / 2, r * cH + cH / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Power pellets (pulsing)
  for (const key of g.powerPellets) {
    const [r, c] = key.split(',').map(Number);
    const pulse = 0.7 + 0.3 * Math.sin(now / 350);
    const rad = 7 * pulse;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(c * cW + cW / 2, r * cH + cH / 2, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ghost paths (V key)
  if (g.showPaths) {
    for (const gh of g.ghosts) {
      if (!gh.path.length) continue;
      const col = PAC_GHOST_COLORS[gh.idx];
      ctx.strokeStyle = col + '88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gh.r * cH + cH / 2, gh.c * cW + cW / 2); // will fix below
      let pr = gh.r, pc = gh.c;
      ctx.beginPath();
      ctx.moveTo(pc * cW + cW / 2, pr * cH + cH / 2);
      for (const [nr, nc] of gh.path) {
        ctx.lineTo(nc * cW + cW / 2, nr * cH + cH / 2);
        pr = nr; pc = nc;
      }
      ctx.stroke();
    }
  }

  // Autopilot path
  if (g.autopilot && g.autopilotPath.length) {
    ctx.strokeStyle = '#00ff8888';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pm.c * cW + cW / 2, pm.r * cH + cH / 2);
    for (const [nr, nc] of g.autopilotPath) {
      ctx.lineTo(nc * cW + cW / 2, nr * cH + cH / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw ghosts
  for (const gh of g.ghosts) {
    pacDrawGhost(ctx, gh, cW, cH, now);
  }

  // Draw pacman
  if (!pm.dead) {
    pacDrawPacman(ctx, pm, cW, cH, g.autopilot);
  } else {
    // Death animation: shrink/spin
    const t = Math.max(0, pm.deadTimer - 0.7); // animation in first 0.8s
    const frac = Math.max(0, t / 0.8);
    const cx = pm.c * cW + cW / 2;
    const cy = pm.r * cH + cH / 2;
    const rad = (cW / 2 - 2) * frac;
    if (rad > 0) {
      ctx.fillStyle = '#FFE000';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Catch flash labels
  for (const fl of g.catchFlash) {
    // Show "+200" near ghost position
    const gh = g.ghosts[fl.ghostIdx];
    const alpha = Math.min(1, fl.timer / 0.5);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${Math.round(cW * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('+200', gh.c * cW + cW / 2, gh.r * cH);
    ctx.globalAlpha = 1;
  }

  // Power pellet timer bar
  if (g.powerActive) {
    const barW = W - 20;
    const barH = 6;
    const frac = Math.min(1, g.scaredTimer / 8);
    ctx.fillStyle = '#333355';
    ctx.fillRect(10, 4, barW, barH);
    const hue = Math.floor(frac * 120); // green → red
    ctx.fillStyle = `hsl(${hue},90%,55%)`;
    ctx.fillRect(10, 4, barW * frac, barH);
  }

  // Overlay screens
  if (g.state === 'paused') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(H * 0.1)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', W / 2, H / 2);
    ctx.font = `${Math.round(H * 0.045)}px sans-serif`;
    ctx.fillStyle = '#8888aa';
    ctx.fillText('Press P to resume', W / 2, H / 2 + H * 0.12);
  }

  if (g.state === 'dead' && pm.deadTimer > 0.5) {
    ctx.fillStyle = 'rgba(200,50,50,0.4)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ff4444';
    ctx.font = `bold ${Math.round(H * 0.08)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('LIFE LOST', W / 2, H / 2);
  }

  if (g.state === 'levelup') {
    ctx.fillStyle = 'rgba(0,20,0,0.65)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#50E3A4';
    ctx.font = `bold ${Math.round(H * 0.09)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', W / 2, H / 2 - H * 0.05);
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.round(H * 0.05)}px sans-serif`;
    ctx.fillText('Score: ' + g.score, W / 2, H / 2 + H * 0.06);
  }
}

function pacDrawPacman(ctx, pm, cW, cH, autopilot) {
  const cx = pm.prevC * cW + cW / 2 + (pm.c - pm.prevC) * cW * pm.progress;
  const cy = pm.prevR * cH + cH / 2 + (pm.r - pm.prevR) * cH * pm.progress;
  const rad = cW / 2 - 2;

  // Autopilot ring
  if (autopilot) {
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Facing angle
  let angle = 0;
  if (pm.dir.dc === 1) angle = 0;
  else if (pm.dir.dc === -1) angle = Math.PI;
  else if (pm.dir.dr === -1) angle = -Math.PI / 2;
  else if (pm.dir.dr === 1) angle = Math.PI / 2;

  const mouth = pm.mouthAngle * Math.PI;
  ctx.fillStyle = '#FFE000';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, rad, angle + mouth, angle + Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
}

function pacDrawGhost(ctx, gh, cW, cH, now) {
  const cx = gh.prevC * cW + cW / 2 + (gh.c - gh.prevC) * cW * gh.progress;
  const cy = gh.prevR * cH + cH / 2 + (gh.r - gh.prevR) * cH * gh.progress;
  const w = cW - 4, h = cH - 4;
  const x = cx - w / 2, y = cy - h / 2;

  if (gh.eaten) {
    // Just draw floating eyes
    const eyeOffX = w * 0.22;
    const eyeY = y + h * 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(cx - eyeOffX, eyeY, w * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eyeOffX, eyeY, w * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1aff';
    const px = gh.dir.dc * w * 0.06, py = gh.dir.dr * w * 0.06;
    ctx.beginPath(); ctx.arc(cx - eyeOffX + px, eyeY + py, w * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eyeOffX + px, eyeY + py, w * 0.07, 0, Math.PI * 2); ctx.fill();
    return;
  }

  const col = gh.scared
    ? (Math.floor(now / 200) % 2 === 0 && gh.scared && pacGame.scaredTimer < 2 ? '#ffffff' : '#8888cc')
    : PAC_GHOST_COLORS[gh.idx];

  // Ghost body: rounded top rectangle + wavy bottom
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(cx, y + w / 2, w / 2, Math.PI, 0); // semicircle top
  ctx.lineTo(x + w, y + h);
  // Wavy bottom: 3 bumps
  const bumps = 3;
  const bumpW = w / bumps;
  for (let i = bumps - 1; i >= 0; i--) {
    const bx = x + i * bumpW + bumpW / 2;
    const bot = y + h;
    ctx.quadraticCurveTo(bx + bumpW / 4, bot - h * 0.18, bx, bot - h * 0.12);
    ctx.quadraticCurveTo(bx - bumpW / 4, bot + h * 0.04, bx - bumpW / 2, bot);
  }
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();

  if (!gh.scared) {
    // Eyes
    const eyeOffX = w * 0.22;
    const eyeY = y + h * 0.32;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(cx - eyeOffX, eyeY, w * 0.14, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + eyeOffX, eyeY, w * 0.14, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1aff';
    const px = gh.dir.dc * w * 0.07, py = gh.dir.dr * h * 0.07;
    ctx.beginPath(); ctx.arc(cx - eyeOffX + px, eyeY + py, w * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eyeOffX + px, eyeY + py, w * 0.08, 0, Math.PI * 2); ctx.fill();

    // Label above ghost
    ctx.fillStyle = col;
    ctx.font = `bold ${Math.round(cW * 0.45)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(PAC_GHOST_LABELS[gh.idx], cx, y - 2);
  } else {
    // Simple scared eyes
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const ey = y + h * 0.36;
    ctx.beginPath(); ctx.arc(cx - w * 0.2, ey, w * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + w * 0.2, ey, w * 0.08, 0, Math.PI * 2); ctx.fill();
    // Wavy scared mouth
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const my = y + h * 0.65;
    ctx.moveTo(cx - w * 0.28, my);
    for (let i = 0; i < 4; i++) {
      const sx = cx - w * 0.28 + (i + 0.5) * w * 0.56 / 4;
      const sy = my + (i % 2 === 0 ? h * 0.08 : -h * 0.08);
      ctx.lineTo(sx, sy);
    }
    ctx.lineTo(cx + w * 0.28, my);
    ctx.stroke();
  }
}

function pacDrawGameOver() {
  const g = pacGame;
  const { ctx, canvas: cv } = g;
  const W = cv.width, H = cv.height;

  ctx.fillStyle = '#0a0a18';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#FF4444';
  ctx.font = `bold ${Math.round(H * 0.1)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', W / 2, H * 0.18);

  // Score
  ctx.fillStyle = '#FFD700';
  ctx.font = `bold ${Math.round(H * 0.06)}px sans-serif`;
  ctx.fillText('Score: ' + g.score, W / 2, H * 0.28);

  // Ghost stats
  ctx.fillStyle = '#8888aa';
  ctx.font = `${Math.round(H * 0.04)}px sans-serif`;
  ctx.fillText('Ghost Statistics', W / 2, H * 0.38);

  const rowH = H * 0.07;
  const colX = [W * 0.1, W * 0.38, W * 0.62, W * 0.82];
  ctx.fillStyle = '#666688';
  ctx.font = `${Math.round(H * 0.035)}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Ghost', colX[0], H * 0.45);
  ctx.fillText('Caught', colX[1], H * 0.45);
  ctx.fillText('Avg Path', colX[2], H * 0.45);
  ctx.fillText('Stuck', colX[3], H * 0.45);

  for (let i = 0; i < 4; i++) {
    const gh = g.ghosts[i];
    const y = H * 0.45 + (i + 1) * rowH;
    ctx.fillStyle = PAC_GHOST_COLORS[i];
    ctx.fillText(PAC_GHOST_LABELS[i], colX[0], y);
    ctx.fillStyle = '#ccccee';
    ctx.fillText(gh.stats.caught, colX[1], y);
    const avg = gh.stats.pathCount ? Math.round(gh.stats.totalPath / gh.stats.pathCount) : 0;
    ctx.fillText(avg, colX[2], y);
    ctx.fillText(gh.stats.stuckCount, colX[3], y);
  }

  ctx.fillStyle = '#50E3A4';
  ctx.font = `${Math.round(H * 0.042)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Press R to restart', W / 2, H * 0.9);
}

// ── Side Panel ────────────────────────────────

function pacUpdatePanel() {
  const el = document.getElementById('pac-panel');
  if (!el || !pacGame) return;
  const g = pacGame;

  // HUD
  const hud = document.getElementById('pac-hud');
  if (hud) {
    const livesStr = '♥'.repeat(Math.max(0, g.lives)) + '<span style="opacity:0.2">' + '♥'.repeat(Math.max(0, 3 - g.lives)) + '</span>';
    hud.innerHTML = `
      <div style="font-size:18px;font-weight:700;color:#FFD700;margin-bottom:4px">PACMAN AI</div>
      <div style="font-size:13px;color:#ccccee">Score: <b>${g.score}</b></div>
      <div style="font-size:13px;color:#ff6666">Lives: ${livesStr}</div>
      <div style="font-size:13px;color:#8888cc">Level: ${g.level} — ${PAC_MAZE_NAMES[g.mazeIdx]}</div>
    `;
  }

  // Power pellet bar
  let powerBarHtml = '';
  if (g.powerActive) {
    const pct = Math.max(0, Math.min(100, (g.scaredTimer / 8) * 100));
    const hue = Math.floor((pct / 100) * 120);
    powerBarHtml = `
      <div style="margin:6px 0 10px">
        <div style="font-size:11px;color:#8888aa;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.05em">Power Pellet: ${g.scaredTimer.toFixed(1)}s</div>
        <div style="height:6px;background:#222244;border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:hsl(${hue},90%,55%);transition:width 0.1s"></div>
        </div>
      </div>`;
  }

  // Ghost cards
  let ghostsHtml = '';
  for (let i = 0; i < 4; i++) {
    const gh = g.ghosts[i];
    const col = PAC_GHOST_COLORS[i];
    const status = gh.eaten ? 'Eaten — returning' : gh.scared ? 'SCARED!' : gh.path.length === 0 ? 'Stuck' : 'Chasing';
    const statusCol = gh.eaten ? '#ff8844' : gh.scared ? '#8888cc' : gh.path.length === 0 ? '#888888' : '#ccccee';
    ghostsHtml += `
      <div style="background:#252535;border-radius:6px;border:1px solid #323248;border-left:4px solid ${col};margin-bottom:6px;padding:8px 10px 8px 14px">
        <div style="font-size:13px;font-weight:700;color:${col};margin-bottom:4px">${PAC_GHOST_LABELS[i]}</div>
        <div style="display:flex;justify-content:space-between;font-size:11px;line-height:1.7">
          <span style="color:#8888aa">Path</span>
          <span style="color:#ccccee">${gh.path.length} steps</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;line-height:1.7">
          <span style="color:#8888aa">Status</span>
          <span style="color:${statusCol}">${status}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;line-height:1.7">
          <span style="color:#8888aa">Caught pac</span>
          <span style="color:#ccccee">${gh.stats.caught}x</span>
        </div>
      </div>`;
  }

  // Autopilot status
  const apColor = g.autopilot ? '#50E3A4' : '#5a5a78';
  const apText = g.autopilot ? 'AI AUTOPILOT: ON' : 'AI AUTOPILOT: OFF';
  let apDetails = '';
  if (g.autopilot && g.autopilotTarget) {
    apDetails = `<div style="font-size:11px;color:#8888aa;margin-top:3px">
      Target: (${g.autopilotTarget[0]},${g.autopilotTarget[1]}) — Path: ${g.autopilotPath.length} steps
    </div>`;
  }

  // Keyboard hints
  const hints = `
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #323248;font-size:11px;color:#5a5a78;line-height:1.9">
      <span style="background:#1a1a2e;border:1px solid #323248;border-radius:3px;padding:1px 5px;font-size:10px;margin-right:4px">↑↓←→</span>Move<br>
      <span style="background:#1a1a2e;border:1px solid #323248;border-radius:3px;padding:1px 5px;font-size:10px;margin-right:4px">A</span>Autopilot<br>
      <span style="background:#1a1a2e;border:1px solid #323248;border-radius:3px;padding:1px 5px;font-size:10px;margin-right:4px">V</span>Paths<br>
      <span style="background:#1a1a2e;border:1px solid #323248;border-radius:3px;padding:1px 5px;font-size:10px;margin-right:4px">P</span>Pause<br>
      <span style="background:#1a1a2e;border:1px solid #323248;border-radius:3px;padding:1px 5px;font-size:10px;margin-right:4px">R</span>Restart
    </div>`;

  el.innerHTML = `
    <div style="font-size:15px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #323248">Ghost AI</div>
    ${powerBarHtml}
    ${ghostsHtml}
    <div style="margin-top:8px;padding:8px 10px;background:#252535;border-radius:6px;border:1px solid #323248">
      <div style="font-size:12px;font-weight:700;color:${apColor}">${apText}</div>
      ${apDetails}
    </div>
    <div style="margin-top:6px;padding:8px 10px;background:#252535;border-radius:6px;border:1px solid #323248">
      <div style="font-size:11px;color:#8888aa">Pellets left: <b style="color:#FFD700">${g.pelletsLeft}</b> / ${g.totalPellets}</div>
      <div style="font-size:11px;color:#8888aa;margin-top:2px">Paths vis: <b style="color:${g.showPaths?'#50E3A4':'#5a5a78'}">${g.showPaths?'ON':'OFF'}</b></div>
    </div>
    ${hints}
  `;
}

// =============================================
