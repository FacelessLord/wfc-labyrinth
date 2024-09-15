export interface RoomConfig {
    chestDeadEndWeight: number,
    deadEndWeight: number,
    passageWeight: number
}

export const defaultRoomConfig: RoomConfig = {
    chestDeadEndWeight: 0.125,
    deadEndWeight: 0.5,
    passageWeight: 30,
};