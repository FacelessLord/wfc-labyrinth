import {RoomsController} from "./roomController";
import {RoomInternals, RoomPrototype} from "./room";
import {GameMap} from "./gameMap";

const SEED_SPAWN_ATTEMPTS = 20;

export class MapController {
    private roomController: RoomsController;

    constructor(roomController: RoomsController) {
        this.roomController = roomController;
    }

    setRoomController(roomController: RoomsController) {
        this.roomController = roomController;
    }

    generateRandomMap(width: number, height: number): RoomPrototype[][] {
        const mapPrototypes = new Array(height) as RoomPrototype[][];
        for (let i = 0; i < height; i++) {
            mapPrototypes[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                mapPrototypes[i][j] = this.roomController.getRandomRoom();
            }
        }
        return mapPrototypes
    }

    createMap(width: number, height: number): GameMap {
        const map = new GameMap(width, height);
        this.createSeedRoom(map);
        return map;
    }

    createSeedRoom(map: GameMap) {
        for (let i = 0; i < SEED_SPAWN_ATTEMPTS; i++) {
            const spawnResult = this.createSeedRoomAttempt(map);
            if (spawnResult)
                break;
        }
    }

    private createSeedRoomAttempt(map: GameMap): boolean {
        const spawnX = Math.floor(Math.random() * map.width);
        const spawnY = Math.floor(Math.random() * map.height);
        if (!!map.getRoom(spawnX, spawnY))
            return false;

        const centerX = Math.floor(map.width / 2);
        const centerY = Math.floor(map.height / 2);
        const dx = spawnX - centerX;
        const dy = spawnY - centerY;

        let spawnRoom: RoomPrototype;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0)
                spawnRoom = this.roomController.deadEndRooms[0]
            else
                spawnRoom = this.roomController.deadEndRooms[2]
        } else {
            if (dy > 0)
                spawnRoom = this.roomController.deadEndRooms[3]
            else
                spawnRoom = this.roomController.deadEndRooms[1]
        }

        map.setRoom(spawnX, spawnY, {
            ...spawnRoom,
            id: this.roomController.roomRegistrationId++,
            internals: RoomInternals.Spawn
        });
        map.enqueueAround(spawnX, spawnY);

        return true;
    }

    makeGenerationStep(map: GameMap): GameMap | null {
        const queue = map.roomsQueue;
        if (!queue.length) {
            console.log("Room queue is empty");
            return null;
        }

        let minRoom = queue[0];
        let minPossibilities: RoomPrototype[] | undefined = undefined;

        for (let i = 0; i < queue.length; i++) {
            const [x, y] = queue[i];
            const room = map.getRoom(x, y)
            if (room) {
                continue;
            }
            const neighbours = [
                map.getRoom(x, y - 1),
                map.getRoom(x + 1, y),
                map.getRoom(x, y + 1),
                map.getRoom(x - 1, y),
            ];
            const result = this.roomController.prototypes.filter(p => {
                return coincidesWithNeighbour(p, neighbours, 0)
                    && coincidesWithNeighbour(p, neighbours, 1)
                    && coincidesWithNeighbour(p, neighbours, 2)
                    && coincidesWithNeighbour(p, neighbours, 3)
            });
            if (!minPossibilities || result.length < minPossibilities.length) {
                minRoom = queue[i];
                minPossibilities = result;
            }
        }

        if (minPossibilities) {
            const minRoomQueueIndex = queue.findIndex(p => p === minRoom);
            if (~minRoomQueueIndex)
                map.roomsQueue.splice(minRoomQueueIndex, 1);
            const room = this.getRandomRoom(minPossibilities);
            map.setRoom(minRoom[0], minRoom[1], room);

            map.enqueueAround(minRoom[0], minRoom[1]);
        } else {
            console.log("Not found rooms to grow");
            return null;
        }

        return map;
    }

    private getRandomRoom(rooms: RoomPrototype[]): RoomPrototype {
        const weightSum = rooms.map(r => r.weight).reduce((a, b) => a + b);
        let random = Math.random() * weightSum;
        for (let i = 0; i < rooms.length; i++) {
            if (random < (rooms[i].weight))
                return rooms[i];
            random -= rooms[i].weight;
        }
        console.error("Произошла чёрная магия");
        return GameMap.fullWall;
    }

    breakWall(map: GameMap) {
        console.log("breaking 2")
        const deadEnds: [number, number, RoomPrototype][] = [];
        for (let j = 0; j < map.height; j++) {
            for (let i = 0; i < map.width; i++) {
                const room = map.getRoom(i, j);
                if (!room)
                    continue;

                if (!this.roomController.deadEndRooms.map(p => p.id).includes(room.id))
                    continue;

                const dir = room.data.direction as [number, number];

                console.log("room", room);
                if (map.getRoom(i + dir[0], j + dir[1]))
                    continue;

                deadEnds.push([i, j, room]);
            }
        }
        if (deadEnds.length) {
            const randomDeadEnd = deadEnds[Math.floor(Math.random() * deadEnds.length)];

            const passage = randomDeadEnd[2].data.passage as RoomPrototype;
            map.setRoom(randomDeadEnd[0], randomDeadEnd[1], passage);
            map.enqueueAround(randomDeadEnd[0], randomDeadEnd[1]);
            return map;
        } else {
            console.log("Not found dead ends")
        }
    }
}

const coincidesWithNeighbour = (room: RoomPrototype, neighbours: (RoomPrototype | null)[], sideId: number) => {
    return !neighbours[sideId] || listEqual(room.sidesInterfaces[sideId].reverse(), neighbours[sideId]!.sidesInterfaces[(sideId + 2) % 4])
}

export const listEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length)
        return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}