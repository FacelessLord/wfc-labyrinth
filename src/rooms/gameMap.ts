import {RoomInternals, RoomPrototype, SideInterface, SideType} from "./room";
import {listEqual} from "./mapController";

export type RoomsQueue = [number, number][];

export class GameMap {
    rooms: RoomPrototype[][] = [];
    roomsQueue: RoomsQueue = [];
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        const rooms = new Array(height) as RoomPrototype[][];
        for (let i = 0; i < height; i++) {
            rooms[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                rooms[i][j] = undefined as unknown as RoomPrototype;
            }
        }
        this.rooms = rooms;
    }

    static wall: SideInterface = [SideType.Wall, SideType.Wall, SideType.Wall];
    static fullWall: RoomPrototype = {
        id: -1,
        internals: RoomInternals.None,
        sidesInterfaces: [this.wall, this.wall, this.wall, this.wall],
        weight: -1,
    };

    getRoom(x: number, y: number) {
        if (x < 0 || y < 0 || y >= this.height || x >= this.width)
            return GameMap.fullWall;
        return this.rooms[y][x];
    }

    setRoom(x: number, y: number, room: RoomPrototype) {
        if (x < 0 || y < 0 || y >= this.height || x >= this.width)
            return;
        this.rooms[y][x] = room;
    }

    enqueueAtCoordinates(x: number, y: number) {
        if (x < 0 || y < 0 || y >= this.height || x >= this.width || !!this.rooms[y][x])
            return;
        this.roomsQueue.push([x, y]);
    }

    enqueueAround(x: number, y: number) {
        const roomProto = this.rooms[y][x];
        const opening: SideInterface = [SideType.Wall, SideType.None, SideType.Wall];
        if (listEqual(roomProto.sidesInterfaces[0], opening))
            this.enqueueAtCoordinates(x, y - 1);
        if (listEqual(roomProto.sidesInterfaces[1], opening))
            this.enqueueAtCoordinates(x + 1, y);
        if (listEqual(roomProto.sidesInterfaces[2], opening))
            this.enqueueAtCoordinates(x, y + 1);
        if (listEqual(roomProto.sidesInterfaces[3], opening))
            this.enqueueAtCoordinates(x - 1, y);
    }
}