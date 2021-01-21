import PathFinder, { Area, GridArea, Position, Spot, Spots } from "./pathFinder";


const displayArea = (title: string, gridArea: GridArea) => {
    console.log(title);
    displaySpots(gridArea);
    console.log("");
};

const dispayPath = (positions: Spot[], gridArea: GridArea) => {
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

const displaySpots = (gridArea: GridArea) => {
    for (let x = 0; x < gridArea.length; x++) {
        let text = "";
        for (let y = 0; y < gridArea[x].length; y++) {
            const cell = gridArea[x][y];
            if (cell.w) {
                text += " X ";
            } else {
                text += " . ";
            }
        }
        console.log(text);
    }
};

const pf = new PathFinder({ width: 40, height: 40 });
let gridArea = pf.createArea();

const start: Position = { x: 3, y: 2, width: 5, height: 5 };
const middle1: Position = { x: 10, y: 12, width: 5, height: 5 };
const middle2: Position = { x: 7, y: 22, width: 5, height: 5 };
const end: Position = { x: 24, y: 24, width: 5, height: 5 };

const spots: Spots = { openList: [], closedList: [] };

displayArea("Area", gridArea); // Area

pf.addSpotsToArea(start, gridArea);
pf.addSpotsToArea(middle1, gridArea);
pf.addSpotsToArea(middle2, gridArea);
pf.addSpotsToArea(end, gridArea);

spots.closedList.push()

displayArea("Area with Spots", gridArea); // Area with Spots

const positions = pf.findPath(start, end, spots, gridArea);
dispayPath(positions, gridArea);
console.log(pf.optimizePathSVG(positions));
