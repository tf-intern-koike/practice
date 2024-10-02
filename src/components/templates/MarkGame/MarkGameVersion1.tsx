import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard";
import { GameStatus } from '@/components/ormanisms/GameStatus';
import { GameState, Player, markGameTitle, isCellEmpty, getWinner } from './features';
import style from '@/styles/MarkGameVersion1.module.css';

var initEffect = false;

export const MarkGame: React.FC = () => {
  var initGameState = {
    boardWidth: 3,
    boardData: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: Player.Maru,
    winner: null,
    draw: false
  };
  //! useStateで行っていることは何か。
  const [gameState, setGameState] = useState<GameState>(initGameState);

  //! useEffectで行っていることは何か。
  useEffect(() => {
    if (initEffect) {
      return;
    }
    initEffect = true;
    console.debug('useEffect!');
  }, []);

  return <>
    <Head>
      {
        //! タグの中の{}でHTML出力時に何が出力されるか。
      }
      <title>{markGameTitle()}</title>
    </Head>
    <p className='desc'>MarkGameVersion1.tsx</p>
    まるばつゲーム(useStateで状態管理)
    {
      //! classNameのfieldはどこに記載があるのか。
    }
    <div className={style.field}>
      {
          //! GameBoardタグの属性でTypeScriptから渡す値の型の指定方法
      }
      <GameBoard gameState={gameState} onGameBoardClick={
        (index) => {
          console.debug('click index=' + index);
          if (isCellEmpty(gameState, index) && gameState.winner == null) {
            var boardData = gameState.boardData;
            var currentPlayer = gameState.currentPlayer;
            var boardWidth = gameState.boardWidth;
            boardData[index] = currentPlayer;
            if (currentPlayer == Player.Maru) {
              currentPlayer = Player.Batsu;
            } else {
              currentPlayer = Player.Maru;
            }
            var winner = getWinner(gameState, index);
            var draw = boardData.filter((cell)=>cell == '').length == 0;
            setGameState({boardWidth, boardData, currentPlayer, winner, draw});                        
          } else {
            console.debug('invelid index!');
          }
        }
      } />
      <GameStatus gameState={gameState} onGameResetClick={() => {
        setGameState(initGameState);
      }} />
    </div>
  </>;
}