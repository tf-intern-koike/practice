import { GameState, Player } from '@/components/templates/Reversi/features';

export type GameStatusProps = {
  gameState: GameState,
  onGameResetClick: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({gameState, onGameResetClick}) => {
  var currentPlayer = gameState.currentPlayer;
  var winner = gameState.winner;
  var draw = gameState.draw;

  return <div>
    <p className='desc'>GameStatus.tsx</p>
    <div className='small'>
      {
        //! タグの中で条件と&&でHTML出力がどうなるのか。
        winner == null && !draw
          && <>現在のプレイヤー：{currentPlayer == Player.Black
          ? <>●(くろ)</> : <>○(しろ)</>}<br /></>
      }
      {winner != null && <>{winner}が勝ちました。<br /></>}
      <div onClick={() => {onGameResetClick();}}>リセット</div>
    </div>
  </div>;
}