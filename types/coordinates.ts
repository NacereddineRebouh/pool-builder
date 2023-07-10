// @types.todo.ts

export type CoordinatesType = {
    x: number;
    y: number;
    z: number;
};
export type CoordinatesContextType = {
    Coord:CoordinatesType,
    UpdateCoordinates:(Coord: CoordinatesType)=>void
};