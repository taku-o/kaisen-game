import type { PlayerType } from '../types';

interface ResultScreenProps {
  winner: PlayerType;
  onReturnToTitle: () => void;
}

export function ResultScreen({ winner, onReturnToTitle }: ResultScreenProps) {
  const winnerName = winner === 'player1' ? 'Player 1' : 'Player 2';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white">
      <h1 className="text-4xl font-bold mb-8">ゲーム終了</h1>
      <div className="text-6xl font-bold mb-12 text-yellow-400" data-testid="winner-display">
        {winnerName} の勝利！
      </div>
      <button
        onClick={onReturnToTitle}
        className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
        data-testid="return-to-title-button"
      >
        タイトルに戻る
      </button>
    </div>
  );
}
