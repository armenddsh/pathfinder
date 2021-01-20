export type Area = { width: number; height: number; };
export type GridArea = Spot[][];
export type Spots = { openList: Spot[]; closedList: Spot[]; };

export type Position = { x: number; y: number, width?: number, height?: number };
export type Start = Position;
export type End = Position;
export type Spot = { x: number; y: number; w: boolean; h: number; neighbors: Spot[] };

export default class PathFinder {
    constructor(public area: Area) { }

    public findPath(start: Start, end: End, spots: Spots, area: GridArea): Spot[] {
        const path: Spot[] = []; 

        start = this.calculateStartPosition(start);
        end = this.calculateEndPosition(end);

        // Mark the source cell as visited
        //spots.closedList.push({ x: start.x, y: start.y, w: false });
        spots.openList.push({ x: start.x, y: start.y, w: false, h: 0, neighbors: [] });

        while (spots.openList.length > 0) {
            const current = spots.openList.pop() as Spot;
            if (current.x === end.x && current.y === end.y) {
                path.push(current);
                return path;
            }
            
            current.h = this.calculateHuristicValue({ x: current.x, y: current.y }, end);
            this.addNeighbors({ x: current.x, y: current.y }, end ,current.neighbors, area);
            
            const shortestNeighbor = current.neighbors.sort((a,b) => b.h - a.h).filter(f => f.w === false).pop();

            spots.closedList.push(current);
            spots.openList.push(shortestNeighbor);

            path.push(shortestNeighbor);   
        }

        return [];
    }

    private calculateStartPosition = (start: Position) => {
        const x = start.x + Math.floor(start.height / 2);
        const y = start.y + Math.floor(start.width) - 1;
        const position: Position = { x, y, width: start.width, height: start.height };
        return position;
    };

    private calculateEndPosition = (end: Position) => {
        const x = end.x + Math.floor(end.height / 2);
        const position: Position = { x, y: end.y - 1, width: end.width, height: end.height };
        return position;
    };

    private calculateHuristicValue(start: Position, end: Position) {
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    }

    private addNeighbors(current: Position, goal: Position, neighbors: Spot[], area: GridArea) {
        const hx = Math.abs((current.x + 1) - goal.x) + Math.abs((current.y) - goal.y);
        const hy = Math.abs((current.x - 1) - goal.x) + Math.abs((current.y) - goal.y);
        const hz = Math.abs((current.x) - goal.x) + Math.abs((current.y + 1) - goal.y);
        const hk = Math.abs((current.x) - goal.x) + Math.abs((current.y - 1) - goal.y);

        neighbors.push({ x: current.x + 1, y: current.y, neighbors: [], w: area[current.x + 1][current.y].w ||  false, h: hx });
        neighbors.push({ x: current.x - 1, y: current.y, neighbors: [], w: area[current.x - 1][current.y].w ||  false, h: hy });
        neighbors.push({ x: current.x, y: current.y + 1, neighbors: [], w: area[current.x][current.y + 1].w ||  false, h: hz });
        neighbors.push({ x: current.x, y: current.y - 1, neighbors: [], w: area[current.x][current.y - 1].w ||  false, h: hk });
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

    public optimizePathSVG(positions: Spot[]): string {
        let path = "";
        const positionReduced: Spot[] = [];
        let previous: { x : number, y: number };
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
            if ( x === positions.length - 1) {
                positionReduced.push(element);
            }
        }
        
        const paths: string[] = [];
        for (let x = 0; x < positionReduced.length; x++) {
            const element = positionReduced[x];
            let p: string;
            if (x === 0) {
                p = `M ${element.x} ${element.y}`;
                paths.push(p);
                continue;
            }
            p = `L ${element.x} ${element.y}`;
            paths.push(p);
        }

        return paths.join(" ");
    }

    public addSpotsToArea(position: Position, gridArea: GridArea): void {
        for (let x = 0; x < position.width; x++) {
            for (let y = 0; y < position.height; y++) {
                const positionX = position.x + x;
                const positionY = position.y + y;

                gridArea[positionX][positionY].w = true;    
            }
        }
    }
}