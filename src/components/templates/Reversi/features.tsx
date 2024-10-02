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


export function getWinner(gameState: GameState, index: number) {
  // TODO implements
  return null;
}