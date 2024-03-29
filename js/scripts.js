/*
Game of life: Reglas
1) Cualquier célula viva con menos de dos vecinos vivos muere, como por subpoblación.
2) Cualquier célula viva con más de tres vecinos vivos muere, como por sobrepoblación.
3) Cualquier célula muerta con exactamente tres vecinos vivos se convierte en una célula viva, como por reproducción.
4) Cualquier célula viva con dos o tres vecinos vivos vive hasta la próxima generación.
La cuarta regla se toma como caso default, solo programo las otras 3.
*/

//Variables globales
let genCounter = 0; // cuenta las generaciones transcurridas
let pause = false; // Frena el ciclo de iteraciones.
const defaultLimit = 0.5;
const defaultMargin = 0.40;

// Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let resolution = 6;
canvas.width = 600;
canvas.height = 600;

// Grid
const COLS = canvas.width / resolution;
const ROWS = COLS; // cuadrado
let grid = buildLimitedGrid(defaultLimit, defaultMargin);
render(grid);

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

function buildLimitedGrid(limit, margin) {
  return new Array(COLS).fill(null).map((col, i) =>
    new Array(ROWS).fill(null).map((row, j) => {
      const minborder = Math.floor(margin * COLS);
      const maxborder = Math.floor((1 - margin) * COLS);
      if (i < minborder || i > maxborder || j < minborder || j > maxborder) {
        return 0;
      } else {
        return Math.random() <= limit ? 1 : 0;
      }
    })
  );
}

function update() {
  genCounter++;
  document.getElementById("counter").innerText = genCounter;
  grid = nextGen(grid);
  render(grid);
  if (!pause) {
    requestAnimationFrame(update);
  }
}

function nextGen(grid) {
  // REGLAS DEL JUEGO: Se pueden cambiar durante la partida!
  let rule1 = parseInt(document.getElementById("rule-1").value);
  let rule2 = parseInt(document.getElementById("rule-2").value);
  let rule3 = parseInt(document.getElementById("rule-3").value);
  // Creo una copia del estado actual
  const nextGen = grid.map((arr) => [...arr]);
  // itero en todas las celdas
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid.length; row++) {
      // Defino la celda actual
      const cell = grid[col][row];
      //Cuento el numero de vecinos (reglas del juego)
      let numNeighbours = 0;
      // Itero entre sus 8 vecinos inmediatos
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            // Omito la celda en la que estoy parado
            continue;
          }
          /* Toroide: las celdas de los bordes ven a las del
          borde opuesto como sus vecinas (tipo pacman) */
          const x_cel = (col + i + COLS) % COLS;
          const y_cel = (row + j + ROWS) % ROWS;
          const currentNeighbour = grid[x_cel][y_cel];
          // Si la celda vecina = 1 se suma, sino suma 0
          numNeighbours += currentNeighbour;
        }
      }
      if (cell === 1 && numNeighbours < rule1) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > rule2) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === rule3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

// Rendering

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid.length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      // ctx.rect(x pos, y pos, width, h);
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? "black" : "white";
      ctx.fill();
      // ctx.stroke();
    }
  }
}

/* Controles:  */

// Start
document.getElementById("btn-start").addEventListener("click", (e) => {
  e.preventDefault();
  pause = false;
  requestAnimationFrame(update);
  document.getElementById("btn-start").setAttribute("style", "display: none");
  document.getElementById("btn-pause").setAttribute("style", "display: inline");
  document.getElementById("btn-reset").setAttribute("style", "display: inline");
});

// Pause
document.getElementById("btn-pause").addEventListener("click", (e) => {
  e.preventDefault();
  pause = true;
  document.getElementById("btn-pause").setAttribute("style", "display: none");
  document.getElementById("btn-start").setAttribute("style", "display: inline");
  document.getElementById("btn-start").innerText = "Continuar";
});

// Reset
document.getElementById("btn-reset").addEventListener("click", (e) => {
  e.preventDefault();
  pause = true;
  grid = buildLimitedGrid(defaultLimit, defaultMargin);
  render(grid);
  genCounter = -1;
  document.getElementById("btn-pause").setAttribute("style", "display: none");
  document.getElementById("btn-start").setAttribute("style", "display: inline");
  document.getElementById("btn-reset").setAttribute("style", "display: none");
  document.getElementById("btn-start").innerText = "Comenzar";
  document.getElementById("counter").innerText = 0;
});

// Reset Rules:
document.getElementById("btn-reset-rules").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("rule-1")[1].selected = "selected";
  document.getElementById("rule-2")[2].selected = "selected";
  document.getElementById("rule-3")[2].selected = "selected";
});
