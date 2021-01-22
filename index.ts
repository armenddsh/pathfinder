import PathFinder, { Grid, Position, Spot, Spots } from "./pathFinder";

const displayArea = (title: string, gridArea: Grid) => {
  console.log(title);
  displaySpots(gridArea);
  console.log("");
};

const dispayPath = (positions: Spot[], gridArea: Grid) => {
  for (let y = 0; y < gridArea.length; y++) {
    let text = "";
    for (let x = 0; x < gridArea[y].length; x++) {
      const cell = gridArea[x][y];
      const position = positions.find((x) => x.x === cell.x && x.y === cell.y);
      if (position) {
        text += " + ";
      } else if (cell.wall) {
        text += " X ";
      } else {
        text += " . ";
      }
    }
    console.log(text);
  }
};

const displaySpots = (gridArea: Grid) => {
  for (let x = 0; x < gridArea.length; x++) {
    let text = "";
    for (let y = 0; y < gridArea[x].length; y++) {
      const cell = gridArea[x][y];
      if (cell.wall) {
        text += " X ";
      } else {
        text += " . ";
      }
    }
    console.log(text);
  }
};

const size = { width: 10, height: 10 };
const pf = new PathFinder(size);
let grid = pf.createArea();
pf.init(grid);

displayArea("Area", grid); // Area

const start = grid[0][0];
const end = grid[size.width - 1][size.height - 1];

const positions = pf.findPath(start, end, grid);
dispayPath(positions, grid);

console.log(pf.optimizePathSVG(positions));
