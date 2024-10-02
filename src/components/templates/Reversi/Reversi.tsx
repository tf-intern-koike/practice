import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard/ReversiBoard";
import { GameStatus } from '@/components/ormanisms/GameStatus/ReversiStatus';
import { useReversi } from '@/providers/ReversiProvider';
import { ReversiTitle } from './features';
import style from '@/styles/Reversi.module.css';

var initEffect = false;

export const Reversi: React.FC = () => {
  const { gameState, initReversiState, onGameBoardClick } = useReversi();

  useEffect(() => {
    if (initEffect) {
      return;
    }
    initEffect = true;
    initReversiState();
    console.debug('useEffect!');
  }, []);

  return <>
    <Head>
      <title>{ReversiTitle()}</title>
    </Head>
    <p className='desc'>Reversi.tsx</p>
    {ReversiTitle()}
    <div className={style.field}>
      <GameBoard gameState={gameState} onGameBoardClick={
        (index) => onGameBoardClick(index)
      } />
      <GameStatus gameState={gameState} onGameResetClick={() => {
        initReversiState();
      }} />
    </div>
  </>;
}