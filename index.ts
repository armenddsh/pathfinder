export type Area = {
    width: number;
    height: number;
};

export type Spots = {
    openList: Spot[];
    closedList: Spot[];
}

export type Position = { x: number; y: number };
export type Start = Position;
export type End = Position;
export type Cell = { x: number; y: number; z: number, h: number };

class Spot {
    constructor(
        public f: number = 0,
        public g: number = 0,
        public h: number = 0
    ){ }
}

export default class PathFinder {
    constructor(public area: Area) { }

    public findPath(start: Start, end: End, spots: Spots): Position[] {
        spots.openList.push(new Spot(start.x, start.y));

        return [];
    }

    public createArea(area?: Area) {
        const _area = area ? area : this.area;
        const grid = new Array(_area.height);

        for (let x = 0; x < _area.height; x++) {
            grid[x] = new Array(_area.width)
        }

        for (let x = 0; x < _area.height; x++) {
            for (let y = 0; y < _area.width; y++) {
                grid[x][y] = new Spot();   
            }
        }

        return grid;
    }

    public addSpotsToArea(positionStart: Position, area: Area, spots: Spots): Spots {
        for (let x = 0; x < area.width; x++) {
            for (let y = 0; y < area.height; y++) {
                const positionX = positionStart.x + x;
                const positionY = positionStart.y + y;

                spots.closedList.push(new Spot(positionX, positionY));   
            }
        }
        
        return spots;
    }
}

const pf = new PathFinder({ width: 1, height: 10 });
const area = pf.createArea();

const start = { x: 0, y: 0 };
const goal = { x: 10, y: 10 };
const spots: Spots = { openList: [], closedList: [] };
const path = pf.findPath( start, goal, spots );

console.log(path);
