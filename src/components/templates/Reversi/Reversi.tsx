import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard/ReversiBoard";
import { GameStatus, GameStatusV2 } from '@/components/ormanisms/GameStatus/ReversiStatus';
import { useReversi, useReversiV2 } from '@/providers/ReversiProvider';
import { ReversiTitle } from './features';
import style from '@/styles/Reversi.module.css';

var initEffect = false;

export const Reversi: React.FC = () => {
  const { gameState, initReversiState, onGameBoardClick, onPlaceableCellClick, onPassCheckClick } = useReversi();

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
      <GameBoard gameState={gameState} onGameBoardClick={() => {
        onGameBoardClick();
      }} onPlaceableClick={
        (cell, stonesToReverse) => onPlaceableCellClick(cell, stonesToReverse)
      } />
      <GameStatus gameState={gameState} onGameResetClick={() => {
        initReversiState();
      }} onPassCheckClick={() => {
        onPassCheckClick();
      }} />
    </div>
  </>;
}

export const ReversiV2: React.FC = () => {
  const { gameState, initReversiState, onGameStartWithBlackCPUClick, onGameStartWithWhiteCPUClick, onGameBoardClick, onPlaceableCellClick, onPassCheckClick } = useReversiV2();

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
      <GameBoard gameState={gameState} onGameBoardClick={() => {
        onGameBoardClick();
      }} onPlaceableClick={
        (cell, stonesToReverse) => onPlaceableCellClick(cell, stonesToReverse)
      } />
      <GameStatusV2 gameState={gameState} onGameStartWithBlackCPUClick={() => {
        onGameStartWithBlackCPUClick();
      }} onGameStartWithWhiteCPUClick={() => {
        onGameStartWithWhiteCPUClick();
      }} onGameResetClick={() => {
        initReversiState();
      }} onPassCheckClick={() => {
        onPassCheckClick();
      }} />
    </div>
  </>;
}