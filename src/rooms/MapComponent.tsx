import {useCallback, useEffect, useRef, useState} from "react";
import {RoomPrototype} from "./room";
import {RoomsController} from "./roomController";
import {Column, Row} from "../layout/Layout";
import {RoomComponent} from "./RoomComponent";
import {MapController} from "./mapController";
import {GameMap} from "./gameMap";
import {defaultRoomConfig, RoomConfig} from "./roomConfig";
import {createSetter} from "../models/setters";

interface Props {
    width: number;
    height: number;
}

export const MapComponent = (props: Props) => {
    const mapControllerRef = useRef(new MapController(new RoomsController(defaultRoomConfig)));
    const [map, setMap] = useState<GameMap>();
    const [stepNumber, setStepNumber] = useState(0);
    const [growForNumber, setGrowForNumber] = useState(25);
    const [growForHandle, setGrowForHandle] = useState(0);
    const [enableWallBreaking, setEnableWallBreaking] = useState(false);
    const nextStep = () => setStepNumber(prevStep => prevStep + 1);

    const [roomConfig, setRoomConfig] = useState<RoomConfig>(defaultRoomConfig);
    const [roomConfigSetter] = useState(createSetter(roomConfig, setRoomConfig));

    const createMap = () => {
        const map = mapControllerRef.current.createMap(props.width, props.height);
        setStepNumber(0);
        setMap(map);
    };
    useEffect(createMap, [props.width, props.height]);
    const generationStep = (map: GameMap) => {
        const newMap = mapControllerRef.current.makeGenerationStep(map);
        if (newMap) {
            setMap(newMap);
            nextStep();
            return newMap
        } else if (enableWallBreaking) {
            console.log("breaking ")
            mapControllerRef.current.breakWall(map!);
            nextStep();
            return map;
        } else {
            console.log("Not breaking")
        }
    };
    const createSeedRoom = () => {
        if (map) {
            mapControllerRef.current.createSeedRoom(map!);
            nextStep();
        } else
            console.error("Map is undefined");
    };
    const growForN = () => {
        // let count = growForNumber;
        // if (growForHandle !== 0)
        //     clearTimeout(growForHandle);
        let currentMap = map!;

        for (let i = 0; i < growForNumber; i++) {
            const newMap = generationStep(currentMap);
            if (!newMap)
                return;
            currentMap = newMap
        }
        //
        // const iterate = () => {
        //     const newMap = generationStep(currentMap!);
        //     if (!newMap)
        //         return;
        //     currentMap = newMap;
        //     count -= 1;
        //     if (count > 0)
        //         setGrowForHandle(setTimeout(iterate, 0) as unknown as number);
        // };

        // iterate();
    };

    const applyRoomConfigChange = () => {
        if (!mapControllerRef.current)
            return;

        mapControllerRef.current.setRoomController(new RoomsController(roomConfig));
    }

    return (<Column gap={4}>
            <Row gap={20}>
                <Column gap={4}>
                    <Row>
                        <button onClick={createMap}>Create map</button>
                    </Row>
                    <Row>
                        <button onClick={() => generationStep(map!)}>Step</button>
                        {stepNumber}
                        <input type="checkbox" checked={enableWallBreaking}
                               onChange={e => setEnableWallBreaking(e.target.checked)}/>
                        Enable wall breaking
                    </Row>
                    <Row>
                        <button onClick={growForN}>Grow for</button>
                        <input value={growForNumber} onChange={e => setGrowForNumber(+e.target.value)}/>
                        <button onClick={() => clearTimeout(growForHandle)}>Stop growth</button>
                    </Row>
                    <Row>
                        <button onClick={createSeedRoom}>Create new seed room</button>
                    </Row>
                </Column>
                <Column gap={4}>
                    <Row>
                        DeadEnd weight
                        <input value={roomConfig.deadEndWeight}
                               onChange={e => roomConfigSetter.setDeadEndWeight(roomConfig, +e.target.value)}/>
                    </Row>
                    <Row>
                        Chest DeadEnd weight
                        <input value={roomConfig.chestDeadEndWeight}
                               onChange={e => roomConfigSetter.setChestDeadEndWeight(roomConfig, +e.target.value)}/>
                    </Row>
                    <Row>
                        Passage weight
                        <input value={roomConfig.passageWeight}
                               onChange={e => roomConfigSetter.setPassageWeight(roomConfig, +e.target.value)}/>
                    </Row>
                    <Row>
                        <button onClick={applyRoomConfigChange}>Apply</button>
                    </Row>
                </Column>
            </Row>
            <Column>
                {map?.rooms.map((row, i) => (
                    <Row key={i}>{row?.map((room, j) => (<RoomComponent key={j} prototype={room}/>))}</Row>))}
            </Column></Column>
    );
}