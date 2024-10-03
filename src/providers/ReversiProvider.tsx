import { getOpponentPlayer, getStonesToReverse, getWinner } from "@/components/templates/Reversi/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

export enum Player {
  Black = '●',
  White = '○'
}

interface ReversiState {
  boardWidth: number;
  boardData: string[];
  currentPlayer: Player;
  winner: Player | null;
  draw: boolean;
}
interface ReversiContext {
  gameState: ReversiState,
  initReversiState: () => void,
  onGameBoardClick: (index: number) => void
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
  var firstGameState: ReversiState = {
    boardWidth: 8,
    boardData: [
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '○', '●', '', '', '',
      '', '', '', '●', '○', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', ''
    ],
    currentPlayer: Player.Black,
    winner: null,
    draw: false
  };
  const initReversiState = (() => {
    dispatch({type: ActionType.updateGameState, payload: {
      gameState: firstGameState
    }});
  });
  const onGameBoardClick = (index: number) => {
    console.debug('click index=' + index);

    var stonesToReverse = getStonesToReverse(gameState, index);

    if (stonesToReverse.length > 0 && gameState.winner == null) {
      var boardData = gameState.boardData;
      var currentPlayer = gameState.currentPlayer;
      var boardWidth = gameState.boardWidth;
      boardData[index] = currentPlayer;

      for (var stone of stonesToReverse) {
        boardData[stone] = currentPlayer;
      }

      currentPlayer = getOpponentPlayer(currentPlayer);
      var winner = getWinner(gameState, index);
      var draw = boardData.filter((cell)=>cell == '').length == 0;
      dispatch({type: ActionType.updateGameState, payload: {
        gameState: {boardWidth, boardData, currentPlayer, winner, draw}
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