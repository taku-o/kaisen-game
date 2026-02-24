interface TitleScreenProps {
  onStartGame: () => void;
}

export function TitleScreen({ onStartGame }: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white">
      <h1 className="text-6xl font-bold mb-8" data-testid="game-title">
        海戦ゲーム
      </h1>
      <p className="text-xl mb-12 text-blue-200">Battleship</p>
      <button
        onClick={onStartGame}
        className="px-8 py-4 text-2xl bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
        data-testid="start-button"
      >
        ゲーム開始
      </button>
    </div>
  );
}
