import { useState } from 'react';
import type { GameState, PlacedShip, PlayerType } from './types';
import { INITIAL_GAME_STATE } from './constants';
import { TitleScreen } from './components/TitleScreen';
import { PlacementScreen } from './components/PlacementScreen';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { determineFirstPlayer } from './utils/battle';

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  // タイトル画面 → 配置画面
  const handleStartGame = () => {
    setGameState({
      ...INITIAL_GAME_STATE,
      phase: 'placement',
      currentPlayer: 'player1',
      player1: { ships: [], attackRecords: [] },
      player2: { ships: [], attackRecords: [] },
    });
  };

  // Player 1 配置確定 → Player 2 配置画面
  const handlePlayer1PlacementConfirm = (ships: PlacedShip[]) => {
    setGameState((prev) => ({
      ...prev,
      player1: { ...prev.player1, ships },
      currentPlayer: 'player2',
    }));
  };

  // Player 2 配置確定 → 対戦画面
  const handlePlayer2PlacementConfirm = (ships: PlacedShip[]) => {
    const firstPlayer = determineFirstPlayer();
    setGameState((prev) => ({
      ...prev,
      phase: 'battle',
      player2: { ...prev.player2, ships },
      currentPlayer: firstPlayer,
    }));
  };

  // 勝者決定 → 結果画面
  const handleGameEnd = (winner: PlayerType) => {
    setGameState((prev) => ({
      ...prev,
      phase: 'result',
      winner,
    }));
  };

  // 結果画面 → タイトル画面
  const handleReturnToTitle = () => {
    setGameState(INITIAL_GAME_STATE);
  };

  // 画面の描画
  switch (gameState.phase) {
    case 'title':
      return <TitleScreen onStartGame={handleStartGame} />;

    case 'placement':
      return (
        <PlacementScreen
          key={gameState.currentPlayer}
          currentPlayer={gameState.currentPlayer}
          onPlacementConfirm={
            gameState.currentPlayer === 'player1'
              ? handlePlayer1PlacementConfirm
              : handlePlayer2PlacementConfirm
          }
        />
      );

    case 'battle':
      return (
        <BattleScreen
          player1Ships={gameState.player1.ships}
          player2Ships={gameState.player2.ships}
          initialTurn={gameState.currentPlayer}
          onGameEnd={handleGameEnd}
        />
      );

    case 'result':
      return (
        <ResultScreen
          winner={gameState.winner!}
          onReturnToTitle={handleReturnToTitle}
        />
      );

    default:
      return <TitleScreen onStartGame={handleStartGame} />;
  }
}

export default App;
