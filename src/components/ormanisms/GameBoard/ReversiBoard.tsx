import { Cell, traverseStonesToReverse } from "@/components/templates/Reversi/features";
import { ReversiState as GameState } from '@/providers/ReversiProvider';
import style from '@/styles/GameBoard.module.css';

type SquareProps = {
  children: string,
  onSquareClick: Function
}

const Square: React.FC<SquareProps> = ({children, onSquareClick}) => {
  return (
    <td className={ `${style.square}` } onClick={() => {onSquareClick();}}>
      {children}
    </td>
  )
}

const SquareLastPlaced: React.FC<SquareProps> = ({children, onSquareClick}) => {
  return (
    <td className={ `${style.square} ${style.lastPlaced}` } onClick={() => {onSquareClick();}}>
      {children}
    </td>
  )
}

const SquarePlaceable: React.FC<SquareProps> = ({children, onSquareClick}) => {
  return (
    <td className={ `${style.square} ${style.placeable}` } onClick={() => {onSquareClick();}}>
      {children}
    </td>
  )
}

export type GameBoardProps = {
  gameState: GameState,
  onGameBoardClick: () => void;
  onPlaceableClick: (cell: Cell, stonesToReverse: Cell[]) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({gameState, onGameBoardClick, onPlaceableClick}) => {
  const boardWidth = gameState.boardWidth;
  const boardData = gameState.boardData;

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
        row.map((cell, colIdx) => {
          const stonesToReverse = traverseStonesToReverse(gameState, [rowIdx, colIdx]);
          const lastPlaced = gameState.lastPlaced;
          if (lastPlaced != null && rowIdx == lastPlaced[0] && colIdx == lastPlaced[1]) {
            return <SquareLastPlaced
              key={ 'board-tr-' + rowIdx * boardWidth + colIdx }
              onSquareClick={() => {
                console.debug('onClick row=' + rowIdx + ', col=' + colIdx);
                onGameBoardClick()
              }}
            >{ cell }</SquareLastPlaced>;
          }
          if (stonesToReverse.length == 0) {
            return <Square
              key={ 'board-tr-' + rowIdx * boardWidth + colIdx }
              onSquareClick={() => {
                console.debug('onClick row=' + rowIdx + ', col=' + colIdx);
                onGameBoardClick()
              }}
            >{ cell }</Square>;
          } else {
            return <SquarePlaceable
              key={ 'board-tr-' + rowIdx * boardWidth + colIdx }
              onSquareClick={() => {
                console.debug('onClick(placeable) row=' + rowIdx + ', col=' + colIdx);
                onPlaceableClick([rowIdx, colIdx], stonesToReverse);
              }}
            >{ cell }</SquarePlaceable>;
          }
        })
      }
      </tr>
      </tbody>
    )}
    </table>
  </div>;
}