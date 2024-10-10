import { ReversiState as GameState } from '@/providers/ReversiProvider';

export enum Player {
  Black = '●',
  White = '○'
}

export type Cell = [number, number];

function sum(cell1: Cell, cell2: Cell): Cell {
  const [row1, col1] = cell1;
  const [row2, col2] = cell2;
  return [row1 + row2, col1 + col2];
}

function offset(cell1: Cell, cell2: Cell): Cell {
  const [row1, col1] = cell1;
  const [row2, col2] = cell2;
  return [row2 - row1, col2 - col1];
}

function scales(cell: Cell, scale: number): Cell {
  const [row, col] = cell;
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
  const [row, col] = cell;
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

  for (const direction of directions) {
    const neighborhood = sum(cell, direction);
    if (!isOutOfGameBoard(neighborhood)) {
      neighborhoods.push(neighborhood);
    }
  }

  return neighborhoods;
}

function isOutOfGameBoard(cell: Cell): boolean {
  const [row, col] = cell;
  return row < 0 || 7 < row || col < 0 || 7 < col;
}

/**
 * 石を置くときにリバースするべき石の配列を返す
 * @param index 石を置く座標
 * @return リバースするべき石の座標の配列 石を置けないときは[]
 */
export function traverseStonesToReverse(gameState: GameState, cell: Cell): Cell[] {
  // 石を置く位置が空でないとき
  if (!isCellEmpty(gameState, cell)) {
    return [];
  }
  const boardData = gameState.boardData;
  const currentPlayer = gameState.currentPlayer;
  const opponentPlayer = getOpponentPlayer(currentPlayer!);

  // リバースするべき石の座標の配列
  var stonesToReverse: Cell[] = [];

  for (const neighborhood of getNeighborhoods(cell)) {
    const [rowOfNeighborhood, colOfNeighborhood] = neighborhood;
    // 隣接セルに相手の石があるかどうか
    if (boardData[rowOfNeighborhood][colOfNeighborhood] == opponentPlayer) {
      // 挟まれている可能性のある石の座標の配列
      const stonesSandwiched = [neighborhood];
      // 置こうとしているセルから見た相手の石の方向
      const direction = offset(cell, neighborhood);
      // 相手の石の方向への距離
      var distance = 2;
      // 判定の対象となるセル
      var target = sum(cell, scales(direction, distance));
      // ゲームボードの外にあるとき、空であるとき、判定を終了する
      while (!isOutOfGameBoard(target) && !isCellEmpty(gameState, target)) {
        const [rowOfTarget, colOfTarget] = target;
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
          // 相手の石の方向へ、距離を増やしながら、判定を続ける
          distance++;
          target = sum(cell, scales(direction, distance))
        }
      }
    }
  }
  return stonesToReverse;
}
export function getWinner(gameState: GameState) {
  const boardData = gameState.boardData;

  const gameStateWithCurrentPlayer = gameState;
  const currentPlayerPlaceableCells = getPlaceableCells(gameStateWithCurrentPlayer);
  const gameStateWithOpponentPlayer = {
    ...gameState,
    currentPlayer: getOpponentPlayer(gameState.currentPlayer!),
  };
  const opponetPlayerPlaceableCells = getPlaceableCells(gameStateWithOpponentPlayer);
  if (currentPlayerPlaceableCells.size == 0 && opponetPlayerPlaceableCells.size == 0) {
    const blackStones = searchInsideGameBoard(boardData, Player.Black);
    const whiteStones = searchInsideGameBoard(boardData, Player.White);

    if (blackStones.length < whiteStones.length) {
      return Player.White;
    } else if (blackStones.length > whiteStones.length) {
      return Player.Black;
    }
  }
  return null;
}

export function checkIfDraw(gameState: GameState) {
  const boardData = gameState.boardData;

  const gameStateWithCurrentPlayer = gameState;
  const currentPlayerPlaceableCells = getPlaceableCells(gameStateWithCurrentPlayer);
  const gameStateWithOpponentPlayer = {
    ...gameState,
    currentPlayer: getOpponentPlayer(gameState.currentPlayer!),
  };
  const opponetPlayerPlaceableCells = getPlaceableCells(gameStateWithOpponentPlayer);
  if (currentPlayerPlaceableCells.size == 0 && opponetPlayerPlaceableCells.size == 0) {
    const blackStones = searchInsideGameBoard(boardData, Player.Black);
    const whiteStones = searchInsideGameBoard(boardData, Player.White);

    if (blackStones.length == whiteStones.length) {
      return true;
    }
  }
  return false;
}

/**
 * 「置ける座標」と「その座標に置いたときにリバースするべき石の座標の配列」のマップを得る
 */
export function getPlaceableCells(gameState: GameState): Map<number, Cell[]> {
  const emptyCells = searchInsideGameBoard(gameState.boardData, '');
  return emptyCells
    .map<[Cell, Cell[]]>((cell) => [cell, traverseStonesToReverse(gameState, cell)])
    .filter(([_, stonesToReverse]) => stonesToReverse.length > 0)
    .reduce((map, [cell, stonesToReverse]) => setCell(map, cell, stonesToReverse), new Map<number, Cell[]>());
}

/**
 * 与えられた文字列と一致するセルを行の中で検索する
 * @param target 検索する文字列
 * @return 検索する文字列を持つセルの座標の配列
 */
function searchInsideRow(row: string[], rowIdx: number, target: string): Cell[] {
  return row.map<[string, number]>((cell, colIdx) => [cell, colIdx])
    .filter(([cell, _]) => cell === target)
    .map(([_, colIdx]) => [rowIdx, colIdx]);
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
  const [row, col] = cell;
  return row * 8 + col;
}

function numberToCell(num: number): Cell {
  const row = Math.floor(num / 8);
  const col = num % 8;
  return [row, col];
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

export function randomPlaceableCell(map: Map<number, Cell[]>): Cell {
  const placeableCells = Array.from(map.keys());
  const randomIdx = Math.floor(Math.random() * placeableCells.length);
  return numberToCell(placeableCells[randomIdx]);
}