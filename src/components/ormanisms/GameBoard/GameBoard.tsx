import { GameState, convertMarkGameCols } from '@/components/templates/MarkGame/features';
import style from '@/styles/GameBoard.module.css';

type SquareProps = {
    children: string,
    onSquareClick: Function
}

const Square: React.FC<SquareProps> = ({children, onSquareClick}) => {
    return (
        <td className={style.square} onClick={() => {onSquareClick();}}>
            {children}
        </td>
    )
}

export type GameBoardProps = {
    gameState: GameState,
    onGameBoardClick: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({gameState, onGameBoardClick}) => {
    const boardWidth = gameState.boardWidth;
    var boardData = gameState.boardData;
    var cols = convertMarkGameCols(boardWidth, boardData);

    return <div>
        <p className='desc'>GameBoard.tsx</p>
        <table>
        {
        // 各行を出力する
        cols.map((col, colIdx) =>
            <tbody key={'board-tbody-' + colIdx}>
            <tr key={'board-tr-' + colIdx}>
            {
            // 各行ごとの値を出力する
            col.map((cell, rowIdx) =>
                <Square key={'board-tr-' + colIdx * boardWidth + rowIdx} onSquareClick={
                    () => {onGameBoardClick(colIdx * boardWidth + rowIdx);}}>{cell}</Square>
            )}
            </tr>
            </tbody>
        )}
        </table>
    </div>;
}