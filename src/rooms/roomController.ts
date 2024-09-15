import {RoomInternals, RoomPrototype, SideInterface, SideInterfaceConfig, SideType} from "./room";
import {RoomConfig} from "./roomConfig";


export class RoomsController {
    prototypes: RoomPrototype[] = [];

    deadEndRooms: RoomPrototype[] = [];
    passageRooms: RoomPrototype[] = [];
    private roomConfig: RoomConfig;

    constructor(roomConfig: RoomConfig) {
        this.roomConfig = roomConfig;
        this.setupPrototypes();
    }

    getRandomRoom(): RoomPrototype {
        return this.prototypes[Math.floor(Math.random() * this.prototypes.length)];
    }

    directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    roomRegistrationId = 0;
    opening: SideInterface = [SideType.Wall, SideType.None, SideType.Wall];
    wall: SideInterface = [SideType.Wall, SideType.Wall, SideType.Wall];

    setupPrototypes() {
        const wall = this.wall;
        const opening = this.opening;

        const cornerOpeningTrain = this.repeatInterface([wall, wall, opening, opening])
        this.setupRoomsFromTrain(cornerOpeningTrain, RoomInternals.None);
        const passageOpeningTrain = this.repeatInterface([wall, opening, wall, opening])
        this.passageRooms = this.setupPassageRoomsFromTrain(passageOpeningTrain, RoomInternals.None, this.roomConfig.passageWeight);

        const oneOpeningTrain = this.repeatInterface([wall, wall, wall, opening])
        this.deadEndRooms = this.setupRoomsFromTrain(oneOpeningTrain, RoomInternals.None, this.roomConfig.deadEndWeight);
        for (let i = 0; i < 4; i++) {
            this.deadEndRooms[i].data = {
                passage: this.passageRooms[i % 2],
                direction: this.directions[(5 - i) % 4]
            };
        }
        this.setupRoomsFromTrain(oneOpeningTrain, RoomInternals.Chest, this.roomConfig.chestDeadEndWeight);

        const threeOpeningTrain = this.repeatInterface([wall, opening, opening, opening])
        this.setupRoomsFromTrain(threeOpeningTrain, RoomInternals.None);

        const crossJunction: RoomPrototype = {
            id: this.roomRegistrationId++,
            sidesInterfaces: [opening, opening, opening, opening],
            internals: RoomInternals.None,
            weight: 1
        };
        this.prototypes.push(crossJunction);
    }

    setupRoomsFromTrain(train: SideInterface[], internals: RoomInternals, weight: number = 1) {
        const createdRooms = []

        for (let i = 0; i < 4; i++) {
            const roomProto: RoomPrototype = {
                id: this.roomRegistrationId++,
                sidesInterfaces: train.slice(i, i + 4) as SideInterfaceConfig,
                internals: internals,
                weight,
            };
            createdRooms.push(roomProto);
            this.prototypes.push(roomProto);
        }
        return createdRooms;
    }

    setupPassageRoomsFromTrain(train: SideInterface[], internals: RoomInternals, weight: number = 1) {
        const createdRooms = []

        for (let i = 0; i < 2; i++) {
            const roomProto: RoomPrototype = {
                id: this.roomRegistrationId++,
                sidesInterfaces: train.slice(i, i + 4) as SideInterfaceConfig,
                internals: internals,
                weight,
            };
            createdRooms.push(roomProto);
            this.prototypes.push(roomProto);
        }
        return createdRooms;
    }

    repeatInterface(interfaces: SideInterface[]) {
        return [...interfaces, ...interfaces];
    }

}
