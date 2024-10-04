import { ReversiState as GameState } from '@/providers/ReversiProvider';

export enum Player {
  Black = '●',
  White = '○'
}

export const ReversiTitle = () => {
  return 'リバーシ';
}

export function getOpponentPlayer(currentPlayer: Player): Player {
  if (currentPlayer == Player.Black) {
    return Player.White;
  } else {
    return Player.Black;
  }
}

export function isCellEmpty(gameState: GameState, row: number, col: number) {
  return gameState.boardData[row][col] == '';
}

/**
 * 隣接マスの配列を返す
 * @param index 隣接マスを調べたいマス
 */
function getNeighborhoods(row: number, col: number): [number, number][] {
  const neighborhoods: [number, number][] = [];
  // 左上
  if (row > 0 && col > 0) {
    neighborhoods.push([row - 1, col - 1]);
  }
  // 上
  if (row > 0) {
    neighborhoods.push([row - 1, col]);
  }
  // 右上
  if (row > 0 && col < 7) {
    neighborhoods.push([row - 1, col + 1]);
  }
  // 左
  if (col > 0) {
    neighborhoods.push([row, col - 1]);
  }
  // 右
  if (col < 7) {
    neighborhoods.push([row, col + 1]);
  }
  // 左下
  if (row < 7 && col > 0) {
    neighborhoods.push([row + 1, col - 1]);
  }
  // 下
  if (row < 7) {
    neighborhoods.push([row + 1, col]);
  }
  // 右下
  if (row < 7 && col < 7) {
    neighborhoods.push([row + 1, col + 1]);
  }

  return neighborhoods;
}

function isOutOfGameBoard(row: number, col: number): boolean {
  return row < 0 || 7 < row || col < 0 || 7 < col;
}

/**
 * 石を置くときにリバースするべき石の配列を返す
 * @param index 石を置く位置
 * @return リバースするべき石の配列 石を置けないときは[]
 */
export function getStonesToReverse(gameState: GameState, row: number, col: number): [number, number][] {
  // 石を置く位置が空でないとき
  if (!isCellEmpty(gameState, row, col)) {
    return [];
  }

  var boardData = gameState.boardData;
  var currentPlayer = gameState.currentPlayer;
  var opponentPlayer = getOpponentPlayer(currentPlayer);

  // リバースするべき石の配列
  var stonesToReverse: [number,number][] = [];

  for (var neighborhood of getNeighborhoods(row, col)) {
    var [rowOfNeighborhood, colOfNeighborhood] = neighborhood;
    // 隣接マスに相手の石があるかどうか
    if (boardData[rowOfNeighborhood][colOfNeighborhood] == opponentPlayer) {
      // 挟まれている可能性のある石の配列
      var stonesSandwiched = [neighborhood];
      // 置こうとしているマスから見た相手の石の方向
      var rowOfDirection = rowOfNeighborhood - row;
      var colOfDirection = colOfNeighborhood - col;
      // 相手の石の方向への距離
      var distance = 1;
      //  相手の石の方向へ、距離を増やしながら、判定する
      while (true) {
        // 判定の対象となるマス
        // ? 左右の境界を突破しているかどうか不詳
        distance++;
        var rowOfTarget = row + rowOfDirection * distance;
        var colOfTarget = col + colOfDirection * distance;
        // ゲームボードの外にあるとき、空であるとき
        if (isOutOfGameBoard(rowOfTarget, colOfTarget) || isCellEmpty(gameState, rowOfTarget, colOfTarget)) {
          // stonesSandwichedを破棄
          break;
        }
        // 判定の対象となるマスが自分の石であるとき
        if (boardData[rowOfTarget][colOfTarget] == currentPlayer) {
          // stonesSandwichedをstonesToReverseに連結
          stonesToReverse = stonesToReverse.concat(stonesSandwiched);
          break;
        }
        // 判定の対象となるマスが相手の石であるとき
        if (boardData[rowOfTarget][colOfTarget] == opponentPlayer) {
          // stonesSandwichedに追加
          stonesSandwiched.push([rowOfTarget, colOfTarget]);
          continue;
        }
      }
    }
  }
  return stonesToReverse;
}
export function getWinner(gameState: GameState) {
  var boardData = gameState.boardData;

  // 片方の石が無くなったとき
  var blackStones = boardData.map(cols => cols.filter((cell) => cell == Player.Black)).reduce((cols1, cols2) => cols1.concat(cols2));
  if (blackStones.length == 0) {
    return Player.White;
  }
  var whiteStones = boardData.map(cols => cols.filter((cell) => cell == Player.Black)).reduce((cols1, cols2) => cols1.concat(cols2));
  if (whiteStones.length == 0) {
    return Player.Black;
  }
  // すべてのマスが埋まったとき
  var emptyCells = boardData.map(cols => cols.filter((cell) => cell == '')).reduce((cols1, cols2) => cols1.concat(cols2));
  if (emptyCells.length == 0) {
    if (blackStones.length < whiteStones.length) {
      return Player.White;
    } else if (blackStones.length > whiteStones.length) {
      return Player.Black;
    }
  }
  return null;
}

export function checkIfDraw(gameState: GameState) {
  var boardData = gameState.boardData;
  var blackStones = boardData.map(cols => cols.filter((cell) => cell == Player.Black)).reduce((cols1, cols2) => cols1.concat(cols2));
  var whiteStones = boardData.map(cols => cols.filter((cell) => cell == Player.White)).reduce((cols1, cols2) => cols1.concat(cols2));

  // すべてのマスが埋まったとき
  var emptyCells = boardData.map(cols => cols.filter((cell) => cell == '')).reduce((cols1, cols2) => cols1.concat(cols2));
  if (emptyCells.length == 0) {
    if (blackStones.length == whiteStones.length) {
      return true;
    }
  }
  return false;
}