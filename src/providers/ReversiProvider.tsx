import { Player, getOpponentPlayer, getStonesToReverse, getWinner, checkIfDraw } from "@/components/templates/Reversi/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

export interface ReversiState {
  boardWidth: number;
  boardData: string[][];
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
}
interface ReversiContext {
  gameState: ReversiState,
  initReversiState: () => void,
  onGameBoardClick: (row: number, col: number) => void
}
const ReversiContext = createContext({} as ReversiContext);
export const useReversi = () => React.useContext(ReversiContext);

enum ActionType {
  updateGameState,
}
// typeで別の連想配列を|で指定できるようにして
// typeごとの更新情報の型(payload)を可変にできるようにする。
type Action =
{
  type: ActionType.updateGameState,
  payload: {
    gameState: ReversiState
  }
};

export const ReversiProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  var boardData: string[][] = Array.from(new Array(8), _ => new Array(8).fill(''));
  boardData[3][3] = '○';
  boardData[3][4] = '●';
  boardData[4][3] = '●';
  boardData[4][4] = '○';

  var firstGameState: ReversiState = {
    boardWidth: 8,
    boardData,
    currentPlayer: Player.Black,
    winner: null,
    isDraw: false
  };
  const initReversiState = (() => {
    dispatch({type: ActionType.updateGameState, payload: {
      gameState: firstGameState
    }});
  });
  const onGameBoardClick = (row: number, col: number) => {
    console.debug('click row=' + row + ', col=' + col);

    var stonesToReverse = getStonesToReverse(gameState, row, col);

    if (stonesToReverse.length > 0 && gameState.winner == null) {
      var boardData = gameState.boardData;
      var currentPlayer = gameState.currentPlayer;
      var boardWidth = gameState.boardWidth;
      boardData[row][col] = currentPlayer;

      for (var [rowOfStone, colOfStone] of stonesToReverse) {
        boardData[rowOfStone][colOfStone] = currentPlayer;
      }

      currentPlayer = getOpponentPlayer(currentPlayer);
      var winner = getWinner(gameState);
      var isDraw = checkIfDraw(gameState);
      dispatch({type: ActionType.updateGameState, payload: {
        gameState: {boardWidth, boardData, currentPlayer, winner, isDraw}
      }});
    } else {
      console.debug('invelid index!');
    }
  }
  const reducer = (_: ReversiState, action: Action): ReversiState => {
    switch (action.type) {
      case ActionType.updateGameState:
      return action.payload.gameState;
    }
  }
  const [gameState, dispatch] = useReducer(reducer, firstGameState);
  return <ReversiContext.Provider value={{
    gameState, initReversiState, onGameBoardClick
  }}>
  {children}
  </ReversiContext.Provider>;
}