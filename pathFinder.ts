export type Area = { width: number; height: number; };
export type GridArea = Spot[][];
export type Spots = { openList: Spot[]; closedList: Spot[]; };

export type Position = { x: number; y: number };
export type Start = Position;
export type End = Position;
export type Cell = { x: number; y: number; z: number, h: number };
export type Spot = { x: number; y: number; w: boolean; };

export default class PathFinder {
    constructor(public area: Area) { }

    public findPath(start: Start, end: End, spots: Spots): Position[] {
        spots.openList.push({ x: start.x, y: start.y, w: false });

        return [];
    }

    public createArea(area?: Area): GridArea {
        const gridArea = area ? area : this.area;
        const grid = new Array(gridArea.height);

        for (let x = 0; x < gridArea.height; x++) {
            grid[x] = new Array(gridArea.width)
        }

        for (let x = 0; x < gridArea.height; x++) {
            for (let y = 0; y < gridArea.width; y++) {
                grid[x][y] = { x, y, z: false };   
            }
        }

        return grid;
    }

    public addSpotsToArea(positionStart: Position, area: Area, gridArea: GridArea): void {
        for (let x = 0; x < area.width; x++) {
            for (let y = 0; y < area.height; y++) {
                const positionX = positionStart.x + x;
                const positionY = positionStart.y + y;

                gridArea[positionX][positionY].w = true;    
            }
        }
    }
}