export type Area = { width: number; height: number; };
export type GridArea = Spot[][];
export type Spots = { openList: Spot[]; closedList: Spot[]; };

export type Position = { x: number; y: number, width?: number, height?: number };
export type Start = Position;
export type End = Position;
export type Spot = { x: number; y: number; w: boolean; h: number; neighbors: Spot[], g: number, f: number, p: Spot | null };
export type Polyline = { coodinates: string, markup: string };

export default class PathFinder {
    constructor(public area: Area) { }

    private removeFromArray(item: Spot, array: Spot[]) {
        const index = array.indexOf(item);
        array.splice(index, 1);
    }

    public findPath(start: Start, end: End, spots: Spots, area: GridArea): Spot[] {
        const path: Spot[] = []; 

        start = this.calculateStartPosition(start);
        end = this.calculateEndPosition(end);

        spots.openList.push({ x: start.x, y: start.y, w: false, 
            h: this.calculateHuristicValue({ x: start.x, y: start.y }, end), neighbors: [], g: 0, f: 0, p: null });

        while (spots.openList.length > 0) {
            const current = spots.openList.sort((a,b) => b.h - a.h).pop();
            this.addNeighbors(current, area);
            if (current.x === end.x && current.y === end.y) {
                let c = current;
                while(c != null) {
                    path.push(c);
                    c = c.p;
                }
                
                return path;
            }

            this.removeFromArray(current, spots.openList);
            spots.closedList.push(current);

            for (let x = 0; x < current.neighbors.length; x++) {
                const neighbor = current.neighbors[x] as Spot;
                neighbor.neighbors = [];
                if (!spots.closedList.includes(neighbor) && !neighbor.w) {
                    const tempG = current.g + 1;
                    let newPath = false;
                    if (spots.openList.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;   
                    }
                    
                    if (newPath) {
                        neighbor.h = this.calculateHuristicValue({ x: current.x, y: current.y }, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.p = current;
                        spots.openList.push(neighbor);
                    }
                    
                }
            }

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

    private addNeighbors(current: Spot, area: GridArea) {
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

    public dispayPath = (positions: Spot[], gridArea: GridArea) => {
        for (let y = 0; y < gridArea.length; y++) {
            let text = "";
            for (let x = 0; x < gridArea[y].length; x++) {
                const cell = gridArea[x][y];
                const position = positions.find( x => x.x === cell.x && x.y === cell.y);
                if (position) {
                    text += " + ";
                } else if (cell.w) {
                    text += " X ";
                } else {
                    text += " . ";
                }
            }
            console.log(text);
        }
    };

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

    public optimizePathSVG(positions: Spot[]): Polyline {
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
            markup: `<polyline points="${coordinates}" fill="none" stroke="black" />`
        };
        return polyLine;
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