import Tile from "./Tile";

export default function Board({ size } : { size: number }) {
    return (
        <div className="board">
            <Tile symbol='X' />
        </div>
    );
}
