export type Area = { width: number; height: number };
export type Grid = Spot[][];
export type Spots = { openList: Spot[]; closedList: Spot[] };

export type Position = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};
export type Start = Position;
export type End = Position;
export type Spot = {
  f: number;
  g: number;
  h: number;
  x: number;
  y: number;
  wall: boolean;
  visited: boolean;
  closed: boolean;
  neighbors: Spot[];
  parent: Spot | null;
  debug: string;
};
export type Polyline = { coodinates: string; markup: string };

export default class PathFinder {
  constructor(public area: Area) {}

  private removeFromArray(item: Spot, array: Spot[]) {
    const index = array.indexOf(item);
    array.splice(index, 1);
  }

  public init(grid: Grid) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        grid[x][y].f = 0;
        grid[x][y].g = 0;
        grid[x][y].h = 0;
        grid[x][y].x = x;
        grid[x][y].y = y;
        grid[x][y].wall = false;
        grid[x][y].visited = false;
        grid[x][y].closed = false;
        grid[x][y].parent = null;
        grid[x][y].debug = "";
      }
    }
  }

  public addSpotsToArea(position: Position, grid: Grid): void {
    for (let x = 0; x < position.width; x++) {
      for (let y = 0; y < position.height; y++) {
        grid[position.x + x][position.y + y].wall = true;
      }
    }
  }

  public createArea(area?: Area): Grid {
    const gridArea = area ? area : this.area;
    const grid = new Array(gridArea.height);

    for (let x = 0; x < gridArea.height; x++) {
      grid[x] = new Array(gridArea.width);
    }

    for (let x = 0; x < gridArea.height; x++) {
      for (let y = 0; y < gridArea.width; y++) {
        grid[x][y] = { x, y, z: false };
      }
    }

    return grid;
  }

  public manhattan(pos0: Position, pos1: Position): number {
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  }

  public removeFromArrayByIndex(index: number, array: Spot[]) {
    array.splice(index, 1);
  }

  public findPath(start: Spot, end: Spot, grid: Grid): Spot[] {
    const openList: Spot[] = [];
    openList.push(start);

    while (openList.length > 0) {
      let lowInd = 0;
      for (let x = 0; x < openList.length; x++) {
        if (openList[x].f < openList[lowInd].f) {
          lowInd = x;
        }

        const currentNode = openList[lowInd] as Spot;
        if (currentNode === end) {
          let curr = currentNode;
          const ret: Spot[] = [];
          while (curr.parent) {
            ret.push(curr);
            curr = curr.parent;
            console.log(curr.parent);
          }
          return ret.reverse();
        }

        this.removeFromArrayByIndex(lowInd, openList);
        currentNode.closed = true;

        const neighbors = this.neighbors(currentNode, grid) as Spot[];
        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i] as Spot;
          if (neighbor.closed || neighbor.wall) {
            continue;
          }
          const gScore = currentNode.g + 1;
          let gScoreIsBest = false;
          if (!neighbor.visited) {
            gScoreIsBest = true;
            neighbor.h = this.calculateHuristicValue(neighbor, end);
            neighbor.visited = true;
            openList.push(neighbor);
          } else if (gScore < neighbor.g) {
            gScoreIsBest = true;
          }
          if (gScoreIsBest) {
            neighbor.parent = currentNode;
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.debug =
              "F: " +
              neighbor.f +
              "<br />G: " +
              neighbor.g +
              "<br />H: " +
              neighbor.h;

            console.log(neighbor.debug);
          }
        }
      }
    }

    return [];
  }

  private neighbors(currentNode: Spot, grid: Grid) {
    const ret = [];
    const x = currentNode.x;
    const y = currentNode.y;

    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }
    if (grid[x][y - 1] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }
    if (grid[x][y + 1] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1]);
    }
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1]);
    }
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1]);
    }
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1]);
    }

    return ret;
  }

  private calculateStartPosition = (start: Position) => {
    const x = start.x + Math.floor(start.height / 2);
    const y = start.y + Math.floor(start.width);
    const position: Position = {
      x,
      y,
      width: start.width,
      height: start.height,
    };
    return position;
  };

  private calculateEndPosition = (end: Position) => {
    const x = end.x - 1;
    const position: Position = {
      x,
      y: end.y + Math.floor(end.width / 2) - 1,
      width: end.width,
      height: end.height,
    };
    return position;
  };

  private calculateHuristicValue(start: Position, end: Position) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  }

  private addNeighbors(current: Spot, area: Grid) {
    const cols = area.length;
    const rows = area[0].length;

    if (current.x < cols - 1) {
      current.neighbors.push(area[current.x + 1][current.y]);
    }
    if (current.x > 0) {
      current.neighbors.push(area[current.x - 1][current.y]);
    }
    if (current.y < rows - 1) {
      current.neighbors.push(area[current.x][current.y + 1]);
    }
    if (current.y > 0) {
      current.neighbors.push(area[current.x][current.y - 1]);
    }
    if (current.x > 0 && current.y > 0) {
      current.neighbors.push(area[current.x - 1][current.y - 1]);
    }
    if (current.x < cols - 1 && current.y > 0) {
      current.neighbors.push(area[current.x + 1][current.y - 1]);
    }
    if (current.x > 0 && current.y < rows - 1) {
      current.neighbors.push(area[current.x - 1][current.y + 1]);
    }
    if (current.x < cols - 1 && current.y < rows - 1) {
      current.neighbors.push(area[current.x + 1][current.y + 1]);
    }
  }

  public dispayPath = (positions: Spot[], gridArea: Grid) => {
    for (let y = 0; y < gridArea.length; y++) {
      let text = "";
      for (let x = 0; x < gridArea[y].length; x++) {
        const cell = gridArea[x][y];
        const position = positions.find(
          (x) => x.x === cell.x && x.y === cell.y
        );
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

  public optimizePathSVG(positions: Spot[]): Polyline {
    let path = "";
    const positionReduced: Spot[] = [];
    let previous: { x: number; y: number };
    for (let x = 0; x < positions.length; x++) {
      const element = positions[x];
      if (x === 0) {
        previous = element;
        positionReduced.push(element);
        continue;
      }
      if (element.x === previous.x || element.y === previous.y) {
        continue;
      } else {
        positionReduced.push(positions[x - 1]);
        positionReduced.push(element);
        previous = element;
      }
      if (x === positions.length - 1) {
        positionReduced.push(element);
      }
    }

    const paths: string[] = [];
    for (let x = 0; x < positionReduced.length; x++) {
      const element = positionReduced[x];
      let p: string;
      if (x === 0) {
        p = `${element.x} ${element.y}`;
        paths.push(p);
        continue;
      }
      p = `${element.x} ${element.y}`;
      paths.push(p);
    }

    const coordinates = paths.join(", ");
    const polyLine: Polyline = {
      coodinates: coordinates,
      markup: `<polyline points="${coordinates}" fill="none" stroke="black" />`,
    };
    return polyLine;
  }
}
