export enum Player {
  Black = '●',
  White = '○'
}

export interface GameState {
  boardWidth: number;
  boardData: string[];
  currentPlayer: Player;
  winner: Player | null;
  draw: boolean;
}

export const ReversiTitle = () => {
  return 'リバーシ';
}

export function isCellEmpty(gameState: GameState, index: number) {
  return gameState.boardData[index] == '';
}

export function convertReversiCols(boardWidth: number, boardData: string[]) {
  // 各行の列ごとの値を格納した配列にする
  // ['1','2','3','4','5','6','7','8',...,'57','58','59','60','61','62','63','64']
  // ↓
  // [['1','2','3','4','5','6','7','8'],...,['57','58','59','60','61','62','63','64']]
  var cols: Array<Array<string>> = [];
  for (var colIdx = 0; colIdx < boardWidth; colIdx++) {
    var col: Array<string> = [];
    for (var rowIdx = 0; rowIdx < boardWidth; rowIdx++) {
      col.push(boardData[colIdx * boardWidth + rowIdx]);
    }
    cols.push(col);
  }
  return cols;
}

/**
 * 隣接マスの配列を返す
 * @param index 隣接マスを調べたいマス
 */
function getNeighborhoods(index: number): number[] {
  const neighborhoods = [];
  // 左上
  if (8 < index && index % 8 != 0) {
    neighborhoods.push(index - 9);
  }
  // 上
  if (8 < index) {
    neighborhoods.push(index - 8);
  }
  // 右上
  if (8 < index && index % 8 != 7) {
    neighborhoods.push(index - 7);
  }
  // 左
  if (index % 8 != 0) {
    neighborhoods.push(index - 1);
  }
  // 右
  if (index % 8 != 7) {
    neighborhoods.push(index + 1);
  }
  // 左下
  if (index < 56 && index % 8 != 0) {
    neighborhoods.push(index + 7);
  }
  // 下
  if (index < 56) {
    neighborhoods.push(index + 8);
  }
  // 右下
  if (index < 56 && index % 8 != 7) {
    neighborhoods.push(index + 9);
  }

  return neighborhoods;
}

export function getOpponentPlayer(currentPlayer: Player): Player {
  if (currentPlayer == Player.Black) {
    return Player.White;
  } else {
    return Player.Black;
  }
}


function isOutOfGameBoard(index: number): boolean {
  return index < 0 || 64 <= index;
}

/**
 * 石を置くときにリバースするべき石の配列を返す
 * @param index 石を置く位置
 * @return リバースするべき石の配列 石を置けないときは[]
 */
export function getStonesToReverse(gameState: GameState, index: number): number[] {
  // 石を置く位置が空でないとき
  if (!isCellEmpty(gameState, index)) {
    return [];
  }

  var boardData = gameState.boardData;
  var currentPlayer = gameState.currentPlayer;
  var opponentPlayer = getOpponentPlayer(currentPlayer);

  // リバースするべき石の配列
  var stonesToReverse: number[] = [];

  for (var neighborhood of getNeighborhoods(index)) {
    // 隣接マスに相手の石があるかどうか
    if (boardData[neighborhood] == opponentPlayer) {
      // 挟まれている可能性のある石の配列
      var stonesSandwiched = [neighborhood];
      // 置こうとしているマスから見た相手の石の方向
      var direction = neighborhood - index;
      // 相手の石の方向への距離
      var distance = 1;
      //  相手の石の方向へ、距離を増やしながら、判定する
      while (true) {
        // 判定の対象となるマス
        // TODO 左右の境界を突破しないようにする
        var target_old = index + direction * distance;
        distance++;
        var target = index + direction * distance;
        // ゲームボードの外にあるとき、ゲームボードの上下左右の端を超えているとき、空であるとき
        if (isOutOfGameBoard(target) || !getNeighborhoods(target_old).includes(target) || isCellEmpty(gameState, target)) {
          // stonesSandwichedを破棄
          break;
        }
        // 判定の対象となるマスが自分の石であるとき
        if (boardData[target] == currentPlayer) {
          // stonesSandwichedをstonesToReverseに連結
          stonesToReverse = stonesToReverse.concat(stonesSandwiched);
          break;
        }
        // 判定の対象となるマスが相手の石であるとき
        if (boardData[target] == opponentPlayer) {
          // stonesSandwichedに追加
          stonesSandwiched.push(target);
          continue;
        }
      }
    }
  }
  return stonesToReverse;
}

export function getWinner(gameState: GameState, index: number) {
  // TODO implements
  return null;
}