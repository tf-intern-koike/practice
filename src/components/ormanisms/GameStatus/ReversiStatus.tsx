import { Player } from "@/components/templates/Reversi/features";
import { ReversiState as GameState } from '@/providers/ReversiProvider';

export type GameStatusProps = {
  gameState: GameState,
  onGameResetClick: () => void,
  onPassCheckClick: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({gameState, onGameResetClick, onPassCheckClick}) => {
  const currentPlayer = gameState.currentPlayer;
  const winner = gameState.winner;
  const isDraw = gameState.isDraw;

  return <div>
    <p className='desc'>GameStatus.tsx</p>
    <div className='small'>
      <br />
      {
        //! タグの中で条件と&&でHTML出力がどうなるのか。
        winner == null && !isDraw
          && <>現在のプレイヤー：{currentPlayer == Player.Black
          ? <>●(くろ)</> : <>○(しろ)</>}<br /></>
      }
      {winner != null && <>{winner}が勝ちました。<br /></>}
      <div onClick={() => {onGameResetClick();}}>リセット</div>
      <div onClick={() => {onPassCheckClick();}}>パス</div>
    </div>
  </div>;
}

export type GameStatusPropsV2 = {
  gameState: GameState,
  onGameStartWithBlackCPUClick: () => void;
  onGameStartWithWhiteCPUClick: () => void;
  onGameResetClick: () => void,
  onPassCheckClick: () => void;
}

export const GameStatusV2: React.FC<GameStatusPropsV2> = ({gameState, onGameStartWithBlackCPUClick, onGameStartWithWhiteCPUClick, onGameResetClick, onPassCheckClick}) => {
  const currentPlayer = gameState.currentPlayer;
  const winner = gameState.winner;
  const isDraw = gameState.isDraw;

  return <div>
    <p className='desc'>GameStatus.tsx</p>
    <div className='small'>
      <>CPUは</>
      <div onClick={() => {onGameStartWithBlackCPUClick();}}><>●(くろ)</></div>
      <div onClick={() => {onGameStartWithWhiteCPUClick();}}><>○(しろ)</></div>
      <br />
      {
        //! タグの中で条件と&&でHTML出力がどうなるのか。
        winner == null && !isDraw
          && <>現在のプレイヤー：{currentPlayer == Player.Black
          ? <>●(くろ)</> : <>○(しろ)</>}<br /></>
      }
      {winner != null && <>{winner}が勝ちました。<br /></>}
      <div onClick={() => {onGameResetClick();}}>リセット</div>
      <div onClick={() => {onPassCheckClick();}}>パス</div>
    </div>
  </div>;
}