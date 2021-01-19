import PathFinder, { Area, GridArea, Position, Spots } from "./pathFinder";


const displaySpots = function(gridArea: GridArea) {
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

const pf = new PathFinder({ width: 10, height: 10 });
let gridArea = pf.createArea();

const start: Position = { x: 0, y: 0 };
const size: Area = { width: 2, height: 2 };
const spots: Spots = { openList: [], closedList: [] };

let areaWithSpots;
areaWithSpots = pf.addSpotsToArea(start, size, gridArea);
areaWithSpots = pf.addSpotsToArea({ x: 4, y: 4 }, { width: 2, height: 2 }, gridArea);
areaWithSpots = pf.addSpotsToArea({ x: 8, y: 8 }, { width: 2, height: 2 }, gridArea);

displaySpots(areaWithSpots);
