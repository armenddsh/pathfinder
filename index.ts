import PathFinder, { Area, Position, Spots } from "./pathFinder";


const pf = new PathFinder({ width: 1, height: 10 });
let gridArea = pf.createArea();

const start: Position = { x: 0, y: 0 };
const end: Position = { x: 10, y: 10 };
const area: Area = { width: 300, height: 100 };
const spots: Spots = { openList: [], closedList: [] };

const path = pf.findPath( start, end, spots );
const areaWithSpots = pf.addSpotsToArea(start, area, spots);

console.log(areaWithSpots);
