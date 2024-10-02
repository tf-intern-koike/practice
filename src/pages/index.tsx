import Head from "next/head";

const Index = () => {
  return <>
    <Head>
      <title>Hello React</title>
    </Head>
    <h3>Hello React</h3>

    <a href='./mark-game-v1'>まるばつゲーム(useStateで状態管理)</a><br />
    <a href='./mark-game-v2'>まるばつゲーム(useReducerで状態管理)</a><br />
    <a href='./reversi'>リバーシ(useReducerで状態管理)</a><br />
  </>
};

export default Index;