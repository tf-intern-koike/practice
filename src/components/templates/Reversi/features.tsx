import { ReversiState as GameState } from '@/providers/ReversiProvider';

export enum Player {
  Black = '●',
  White = '○'
}

export type Cell = [number, number];

function sum(cell1: Cell, cell2: Cell): Cell {
  var [row1, col1] = cell1;
  var [row2, col2] = cell2;
  return [row1 + row2, col1 + col2];
}

function offset(cell1: Cell, cell2: Cell): Cell {
  var [row1, col1] = cell1;
  var [row2, col2] = cell2;
  return [row2 - row1, col2 - col1];
}

function scales(cell: Cell, scale: number): Cell {
  var [row, col] = cell;
  return [row * scale, col * scale];
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

export function isCellEmpty(gameState: GameState, cell: Cell) {
  var [row, col] = cell;
  return gameState.boardData[row][col] == '';
}

/**
 * 隣接セルの配列を返す
 * @param index 隣接セルを調べたいセル
 */
function getNeighborhoods(cell: Cell): Cell[] {
  const neighborhoods = [];

  // 8方向の単位ベクトル
  const directions: Cell[] = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1]
  ];

  for (var direction of directions) {
    var neighborhood = sum(cell, direction);
    if (!isOutOfGameBoard(neighborhood)) {
      neighborhoods.push(neighborhood);
    }
  }

  return neighborhoods;
}

function isOutOfGameBoard(cell: Cell): boolean {
  var [row, col] = cell;
  return row < 0 || 7 < row || col < 0 || 7 < col;
}

/**
 * 石を置くときにリバースするべき石の配列を返す
 * @param index 石を置く座標
 * @return リバースするべき石の座標の配列 石を置けないときは[]
 */
function traverseStonesToReverse(gameState: GameState, cell: Cell): Cell[] {
  // 石を置く位置が空でないとき
  if (!isCellEmpty(gameState, cell)) {
    return [];
  }

  var boardData = gameState.boardData;
  var currentPlayer = gameState.currentPlayer;
  var opponentPlayer = getOpponentPlayer(currentPlayer);

  // リバースするべき石の配列
  var stonesToReverse: Cell[] = [];

  for (var neighborhood of getNeighborhoods(cell)) {
    var [rowOfNeighborhood, colOfNeighborhood] = neighborhood;
    // 隣接セルに相手の石があるかどうか
    if (boardData[rowOfNeighborhood][colOfNeighborhood] == opponentPlayer) {
      // 挟まれている可能性のある石の配列
      var stonesSandwiched = [neighborhood];
      // 置こうとしているセルから見た相手の石の方向
      var direction = offset(cell, neighborhood);
      // 相手の石の方向への距離
      var distance = 1;
      //  相手の石の方向へ、距離を増やしながら、判定する
      // ? whileの条件節を使う
      while (true) {
        // 判定の対象となるセル
        distance++;
        var target = sum(cell, scales(direction, distance));
        // ゲームボードの外にあるとき、空であるとき
        if (isOutOfGameBoard(target) || isCellEmpty(gameState, target)) {
          // stonesSandwichedを破棄
          break;
        }
        var [rowOfTarget, colOfTarget] = target;
        // 判定の対象となるセルが自分の石であるとき
        if (boardData[rowOfTarget][colOfTarget] == currentPlayer) {
          // stonesSandwichedをstonesToReverseに連結
          stonesToReverse = stonesToReverse.concat(stonesSandwiched);
          break;
        }
        // 判定の対象となるセルが相手の石であるとき
        if (boardData[rowOfTarget][colOfTarget] == opponentPlayer) {
          // stonesSandwichedに追加
          stonesSandwiched.push(target);
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
  var blackStones = searchInsideGameBoard(boardData, Player.Black)
  if (blackStones.length == 0) {
    return Player.White;
  }
  var whiteStones = searchInsideGameBoard(boardData, Player.White);
  if (whiteStones.length == 0) {
    return Player.Black;
  }
  // すべてのセルが埋まったとき
  var emptyCells = searchInsideGameBoard(boardData, '')
  if (emptyCells.length == 0) {
    if (blackStones.length < whiteStones.length) {
      return Player.White;
    } else if (blackStones.length > whiteStones.length) {
      return Player.Black;
    }
  }
  return null;
}

export function getPlaceableCells(gameState: GameState): Map<number, Cell[]> {
  var boardData = gameState.boardData;
  var emptyCells = searchInsideGameBoard(boardData, '');
  return emptyCells
    .map<[Cell, Cell[]]>((cell) => [cell, traverseStonesToReverse(gameState, cell)])
    .filter(([_, stonesToReverse]) => stonesToReverse.length > 0)
    .reduce((map, [cell, stonesToReverse]) => setCell(map, cell, stonesToReverse), new Map<number, Cell[]>());
}

export function checkIfDraw(gameState: GameState) {
  var boardData = gameState.boardData;
  var blackStones = searchInsideGameBoard(boardData, Player.Black);
  var whiteStones = searchInsideGameBoard(boardData, Player.White);

  // すべてのセルが埋まったとき
  var emptyCells = searchInsideGameBoard(boardData, '');
  if (emptyCells.length == 0) {
    if (blackStones.length == whiteStones.length) {
      return true;
    }
  }
  return false;
}

/**
 * 与えられた文字列と一致するセルを行の中で検索する
 * @param target 検索する文字列
 * @return 検索する文字列を持つセルの座標の配列
 */
function searchInsideRow(row: string[], rowIdx: number, target: string): Cell[] {
  return row.filter((cell) => cell == target)
    .map((_, colIdx) => [rowIdx, colIdx]);
}

/**
 * 与えられた文字列と一致するセルをゲームボードの中で検索する
 * @param target 検索する文字列
 * @return 検索する文字列を持つセルの座標の配列
 */
function searchInsideGameBoard(boardData: string[][], target: string): Cell[] {
  return boardData.map((row, rowIdx) => searchInsideRow(row, rowIdx, target))
    .reduce((cols1, cols2) => cols1.concat(cols2));
}

function cellToNumber(cell: Cell): number {
  var [row, col] = cell;
  return row * 8 + col;
}

function setCell(map: Map<number, Cell[]>, cell: Cell, value: Cell[]): Map<number, Cell[]> {
  return map.set(cellToNumber(cell), value);
}

export function includes(map: Map<number, Cell[]>, cell: Cell): Cell[] | undefined {
  return map.get(cellToNumber(cell));
}

export function getStonesToReverse(map: Map<number, Cell[]>, cell: Cell): Cell[] | undefined {
  return map.get(cellToNumber(cell));
}