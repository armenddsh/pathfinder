import PathFinder, { Area, GridArea, Position, Spots } from "./pathFinder";


const displayArea = (title: string, gridArea: GridArea) => {
    console.log(title);
    displaySpots(gridArea);
    console.log("");
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

const start: Position = { x: 2, y: 2 };
const size: Area = { width: 5, height: 5 };
const spots: Spots = { openList: [], closedList: [] };

displayArea("Area", gridArea); // Area

pf.addSpotsToArea(start, size, gridArea);
pf.addSpotsToArea({ x: 24, y: 24 }, size, gridArea);

displayArea("Area with Spots", gridArea); // Area with Spots
