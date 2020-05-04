/*
Game of life: Reglas
1) Cualquier célula viva con menos de dos vecinos vivos muere, como por subpoblación.
2) Cualquier célula viva con más de tres vecinos vivos muere, como por sobrepoblación.
3) Cualquier célula muerta con exactamente tres vecinos vivos se convierte en una célula viva, como por reproducción.
4) Cualquier célula viva con dos o tres vecinos vivos vive hasta la próxima generación.
La cuarta regla se toma como caso default, solo programo las otras 3.
*/

// Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let resolution = 5;
canvas.width = 600;
canvas.height = 600;

// Grid
const COLS = canvas.width / resolution;
const ROWS = canvas.width / resolution;
let grid = buildGrid();

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}
let pause = false;

function update() {
  grid = nextGen(grid);
  render(grid);
  if (!pause) {
    requestAnimationFrame(update);
  }
}

function nextGen(grid) {
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
          const x_cel = col + i;
          const y_cel = row + j;

          if (x_cel >= 0 && y_cel >= 0 && x_cel < COLS && y_cel < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            // Si la celda vecina = 1 se suma, sino suma 0
            numNeighbours += currentNeighbour;
          }
        }
      }
      // REGLAS DEL JUEGO:
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
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

document.getElementById("btn-start").addEventListener("click", (e) => {
  e.preventDefault();
  pause = false;
  requestAnimationFrame(update);
  document.getElementById("btn-start").setAttribute("style", "display: none");
  document.getElementById("btn-pause").setAttribute("style", "display: inline");
});

document.getElementById("btn-pause").addEventListener("click", (e) => {
  e.preventDefault();
  pause = true;
  document.getElementById("btn-pause").setAttribute("style", "display: none");
  document.getElementById("btn-start").setAttribute("style", "display: inline");
  document.getElementById("btn-start").innerText = "Continuar";
});
