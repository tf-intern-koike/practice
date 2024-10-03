import { ReversiState as GameState, Player } from '@/providers/ReversiProvider';

export type GameStatusProps = {
  gameState: GameState,
  onGameResetClick: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({gameState, onGameResetClick}) => {
  var currentPlayer = gameState.currentPlayer;
  var winner = gameState.winner;
  var isDraw = gameState.isDraw;

  return <div>
    <p className='desc'>GameStatus.tsx</p>
    <div className='small'>
      {
        //! タグの中で条件と&&でHTML出力がどうなるのか。
        winner == null && !isDraw
          && <>現在のプレイヤー：{currentPlayer == Player.Black
          ? <>●(くろ)</> : <>○(しろ)</>}<br /></>
      }
      {winner != null && <>{winner}が勝ちました。<br /></>}
      <div onClick={() => {onGameResetClick();}}>リセット</div>
    </div>
  </div>;
}