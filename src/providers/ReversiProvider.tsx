import { Player, Cell, getOpponentPlayer, getStonesToReverse, getWinner, checkIfDraw, getPlaceableCells, randomPlaceableCell } from "@/components/templates/Reversi/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

export interface ReversiState {
  boardWidth: number;
  boardData: string[][];
  lastPlaced: Cell | null;
  currentPlayer: Player;
  cpuPlayer: Player | null;
  winner: Player | null;
  isDraw: boolean;
}
interface ReversiContext {
  gameState: ReversiState,
  initReversiState: () => void,
  onGameBoardClick: () => void,
  onPlaceableCellClick: (cell: Cell, stonesToReverse: Cell[]) => void,
  onPassCheckClick: () => void,
}

interface ReversiContextV2 {
  gameState: ReversiState,
  initReversiState: () => void,
  onGameStartWithBlackCPUClick: () => void,
  onGameStartWithWhiteCPUClick: () => void,
  onGameBoardClick: () => void,
  onPlaceableCellClick: (cell: Cell, stonesToReverse: Cell[]) => void,
  onPassCheckClick: () => void,
}
const ReversiContext = createContext({} as ReversiContext);
const ReversiContextV2 = createContext({} as ReversiContextV2);
export const useReversi = () => React.useContext(ReversiContext);
export const useReversiV2 = () => React.useContext(ReversiContextV2);

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
  const boardData: string[][] = Array.from(new Array(8), _ => new Array(8).fill(''));
  boardData[3][3] = '○';
  boardData[3][4] = '●';
  boardData[4][3] = '●';
  boardData[4][4] = '○';

  const firstGameState: ReversiState = {
    boardWidth: 8,
    boardData,
    lastPlaced: null,
    currentPlayer: Player.Black,
    cpuPlayer: null,
    winner: null,
    isDraw: false
  };
  const initReversiState = (() => {
    dispatch({type: ActionType.updateGameState, payload: {
      gameState: firstGameState
    }});
  });
  const onGameBoardClick = () => {};
  const onPlaceableCellClick = (cell: Cell, stonesToReverse: Cell[]) => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    var currentPlayer = gameState.currentPlayer;
    const cpuPlayer = gameState.cpuPlayer;

    if (gameState.winner == null) {
      // クリックされたセルに石を置く
      const [row, col] = cell;
      boardData[row][col] = currentPlayer;
      const lastPlaced = cell;

      // 石をリバースする
      for (const [rowOfStone, colOfStone] of stonesToReverse) {
        boardData[rowOfStone][colOfStone] = currentPlayer;
      }

      // ターンを交代する
      currentPlayer = getOpponentPlayer(currentPlayer);

      // 勝敗を判定する
      const winner = getWinner(gameState);
      const isDraw = checkIfDraw(gameState);

      dispatch({
        type: ActionType.updateGameState,
        payload: {
          gameState: { boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw }
        }
      });
    }
  }
  const onPassCheckClick = () => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    const cpuPlayer = gameState.cpuPlayer;
    const winner = gameState.winner;
    const isDraw = gameState.isDraw;

    // 置けるセルの一覧を得る
    var placeableCells = getPlaceableCells(gameState);

    // 置けるセルがないとき
    if (placeableCells.size == 0) {
      // パス
      const currentPlayer = getOpponentPlayer(gameState.currentPlayer);
      const lastPlaced = null;
      dispatch({
        type: ActionType.updateGameState,
        payload: {
          gameState: {boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw}
        }
      });
    }
  };
  const reducer = (_: ReversiState, action: Action): ReversiState => {
    switch (action.type) {
      case ActionType.updateGameState:
      return action.payload.gameState;
    }
  }
  const [gameState, dispatch] = useReducer(reducer, firstGameState);
  return <ReversiContext.Provider value={{
    gameState, initReversiState, onGameBoardClick, onPlaceableCellClick ,onPassCheckClick

  }}>
  {children}
  </ReversiContext.Provider>;
}
export const ReversiProviderV2: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const boardData: string[][] = Array.from(new Array(8), _ => new Array(8).fill(''));
  boardData[3][3] = '○';
  boardData[3][4] = '●';
  boardData[4][3] = '●';
  boardData[4][4] = '○';

  const firstGameState: ReversiState = {
    boardWidth: 8,
    boardData,
    lastPlaced: null,
    currentPlayer: Player.Black,
    cpuPlayer: null,
    winner: null,
    isDraw: false
  };
  const initReversiState = (() => {
    dispatch({
      type: ActionType.updateGameState,
      payload: {
        gameState: firstGameState
      }
    });
  });
  const onGameStartWithBlackCPUClick = () => {
    if (gameState.cpuPlayer == null) {
      const cpuPlayer = Player.Black;
      dispatch({
        type: ActionType.updateGameState,
        payload: {
          gameState: { ...gameState, cpuPlayer }
        }
      });
    }
  }
  const onGameStartWithWhiteCPUClick = () => {
    if (gameState.cpuPlayer == null) {
      const cpuPlayer = Player.White;
      dispatch({
        type: ActionType.updateGameState,
        payload: {
          gameState: { ...gameState, cpuPlayer }
        }
      });
    }
  }
  const onGameBoardClick = () => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    var currentPlayer = gameState.currentPlayer;
    const cpuPlayer = gameState.cpuPlayer;

    if (currentPlayer == cpuPlayer) {
      // 置けるセルの座標の一覧を得る
      const placeableCells = getPlaceableCells(gameState);

      // 置けるセルがないとき
      if (placeableCells.size == 0) {
        const winner = gameState.winner;
        const isDraw = gameState.isDraw;

        // パス
        const lastPlaced = null;

        // ターンを交代する
        currentPlayer = getOpponentPlayer(currentPlayer);

        dispatch({
          type: ActionType.updateGameState,
          payload: {
            gameState: {boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw}
          }
        });
      // 置けるセルがあるとき
      } else {
        // 置けるセルの座標をランダムに一つ選ぶ
        const cell = randomPlaceableCell(placeableCells);

        // 選ばれたセルに石を置く
        const [row, col] = cell;
        boardData[row][col] = currentPlayer;
        const lastPlaced = cell;

        // 石をリバースする
        for (const [rowOfStone, colOfStone] of getStonesToReverse(placeableCells, cell)!) {
          boardData[rowOfStone][colOfStone] = currentPlayer;
        }

        // ターンを交代する
        currentPlayer = getOpponentPlayer(currentPlayer);

        // 勝敗を判定する
        const winner = getWinner(gameState);
        const isDraw = checkIfDraw(gameState);

        dispatch({
          type: ActionType.updateGameState,
          payload: {
            gameState: { boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw }
          }
        });
      }
    }
  };
  const onPlaceableCellClick = (cell: Cell, stonesToReverse: Cell[]) => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    var currentPlayer = gameState.currentPlayer;
    const cpuPlayer = gameState.cpuPlayer;

    if (cpuPlayer != null && gameState.winner == null) {
      if (currentPlayer == cpuPlayer) {
        onGameBoardClick();
      } else {
        // クリックされたセルに石を置く
        const [row, col] = cell;
        boardData[row][col] = currentPlayer;
        const lastPlaced = cell;

        // 石をリバースする
        for (var [rowOfStone, colOfStone] of stonesToReverse) {
          boardData[rowOfStone][colOfStone] = currentPlayer;
        }

        // ターンを交代する
        currentPlayer = getOpponentPlayer(currentPlayer);

        // 勝敗を判定する
        const winner = getWinner(gameState);
        const isDraw = checkIfDraw(gameState);

        dispatch({
          type: ActionType.updateGameState,
          payload: {
            gameState: { boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw }
          }
        });
      }
    }
  }
  const onPassCheckClick = () => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    const cpuPlayer = gameState.cpuPlayer;
    const winner = gameState.winner;
    const isDraw = gameState.isDraw;

    if (cpuPlayer != null && gameState.winner == null) {
      // 置けるセルの一覧を得る
      var placeableCells = getPlaceableCells(gameState);

      // 置けるセルがないとき
      if (placeableCells.size == 0) {
        // パス
        const currentPlayer = getOpponentPlayer(gameState.currentPlayer);
        const lastPlaced = null;
        dispatch({
          type: ActionType.updateGameState,
          payload: {
            gameState: {boardWidth, boardData, lastPlaced, currentPlayer, cpuPlayer, winner, isDraw}
          }
        });
      }
    }
  };
  const reducer = (_: ReversiState, action: Action): ReversiState => {
    switch (action.type) {
      case ActionType.updateGameState:
      return action.payload.gameState;
    }
  }
  const [gameState, dispatch] = useReducer(reducer, firstGameState);
  return <ReversiContextV2.Provider value={{
    gameState, initReversiState, onGameStartWithBlackCPUClick, onGameStartWithWhiteCPUClick, onGameBoardClick, onPlaceableCellClick ,onPassCheckClick
  }}>
  {children}
  </ReversiContextV2.Provider>;
}