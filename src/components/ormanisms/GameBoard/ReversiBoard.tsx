import { Cell } from "@/components/templates/Reversi/features";
import { ReversiState as GameState } from '@/providers/ReversiProvider';
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
  onGameBoardClick: (cell: Cell) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({gameState, onGameBoardClick}) => {
  const boardWidth = gameState.boardWidth;
  var boardData = gameState.boardData;

  return <div>
    <p className='desc'>GameBoard.tsx</p>
    <table>
    {
    // 各行を出力する
    boardData.map((row, rowIdx) =>
      <tbody key={'board-tbody-' + rowIdx}>
      <tr key={'board-tr-' + rowIdx}>
      {
      // 各行ごとの値を出力する
      row.map((cell, colIdx) =>
        <Square key={'board-tr-' + rowIdx * boardWidth + colIdx} onSquareClick={
          () => {onGameBoardClick([rowIdx, colIdx]);}}>{cell}</Square>
      )}
      </tr>
      </tbody>
    )}
    </table>
  </div>;
}