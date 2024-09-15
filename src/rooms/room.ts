export enum SideType {
    Wall, None
}

export enum RoomInternals {
    None, Chest, Bridge, Spawn,
}

export type SideInterface = [SideType, SideType, SideType];
export type SideInterfaceConfig = [SideInterface, SideInterface, SideInterface, SideInterface];

export interface RoomPrototype {
    sidesInterfaces: SideInterfaceConfig;
    internals: RoomInternals;
    data?: any;
    id: number;
    weight: number;
}

export function createPrototype(side0: SideInterface, side1: SideInterface, side2: SideInterface, side3: SideInterface, id: number, weight?: number, internals?: RoomInternals): RoomPrototype {
    return {
        sidesInterfaces: [side0, side1, side2, side3],
        internals: internals || RoomInternals.None,
        id,
        weight: weight || 1
    };
}

export function createSimplePrototype(side: SideInterface, id: number, weight?: number, internals?: RoomInternals): RoomPrototype {
    return {
        sidesInterfaces: [side, side, side, side],
        internals: internals || RoomInternals.None,
        id,
        weight: weight || 1
    };
}