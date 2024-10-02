// [!] exportで何ができるのか。
//
export enum Player {
    Maru = '⭕️',
    Batsu = '❌'
}

export interface GameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}

// [!] 変数にはどのような値が入っているのか
//
export const markGameTitle = () => {
    return 'まるばつゲーム';
}

export function isCellEmpty(gameState: GameState, index: number) {
    return gameState.boardData[index] == '';
}

export function convertMarkGameCols(boardWidth: number, boardData: string[]) {
    // 各行の列ごとの値を格納した配列にする
    // ['1','2','3','4','5','6','7','8','9']
    // ↓
    // [['1','2','3'], ['4','5','6'], ['7','8','9']]
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
    var boardWidth = gameState.boardWidth;
    var boardData = gameState.boardData;
    var cols = convertMarkGameCols(boardWidth, boardData);
    var rowIdx = Math.floor(index / boardWidth);
    var colIdx = index % boardWidth;
    console.debug('rowIdx=' + rowIdx + ' colIdx=' + colIdx);
    console.debug(cols);
    var player = cols[rowIdx][colIdx];

    // 右下方向のチェック
    var currentRowIdx = 0;
    var currentColIdx = 0;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx++;
        currentColIdx++;
    }
    var crossLine1 = currentRowIdx == boardWidth;

    // 左下方向のチェック
    currentRowIdx = 2;
    currentColIdx = 0;
    while (currentRowIdx >= 0) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx--;
        currentColIdx++;
    }
    var crossLine2 = currentRowIdx < 0;

    // 縦方向のチェック
    currentRowIdx = rowIdx;
    currentColIdx = 0;
    while (currentColIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentColIdx++;
    }
    var holizontalLine = currentColIdx == boardWidth;

    // 横方向のチェック
    currentRowIdx = 0;
    currentColIdx = colIdx;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx++;
    }
    var varticalLine = currentRowIdx == boardWidth;

    var playerType = null;
    if (player == Player.Maru) {
        playerType = Player.Maru;
    } else if (player == Player.Batsu) {
        playerType = Player.Batsu;
    }

    return crossLine1 || crossLine2 || holizontalLine || varticalLine
        ? playerType : null;
}