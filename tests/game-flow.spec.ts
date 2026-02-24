import { test, expect } from '@playwright/test';

test.describe('Game Flow E2E', () => {
  test('should complete full game flow from title to result', async ({ page }) => {
    // 1. タイトル画面
    await page.goto('/');
    await expect(page.getByTestId('game-title')).toBeVisible();
    await expect(page.getByTestId('start-button')).toBeVisible();

    // ゲーム開始
    await page.getByTestId('start-button').click();

    // 2. Player 1 配置画面
    await expect(page.getByTestId('current-player')).toHaveText('Player 1 の番');

    // Player 1の全艦を配置（横向き）
    // 空母 (5マス) - A1から
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();

    // 戦艦 (4マス) - B1から
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();

    // 巡洋艦 (3マス) - C1から
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();

    // 潜水艦 (3マス) - D1から
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();

    // 駆逐艦 (2マス) - E1から
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();

    // 配置確定
    await expect(page.getByTestId('confirm-button')).toBeEnabled();
    await page.getByTestId('confirm-button').click();

    // 3. Player 2 配置画面
    await expect(page.getByTestId('current-player')).toHaveText('Player 2 の番');

    // Player 2の全艦を配置（横向き）
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();

    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();

    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();

    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();

    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();

    // 配置確定 -> 対戦画面へ
    await page.getByTestId('confirm-button').click();

    // 4. 対戦画面
    await expect(page.getByRole('heading', { name: '対戦' })).toBeVisible();
    await expect(page.getByTestId('current-turn')).toBeVisible();
    await expect(page.getByText('相手の海域')).toBeVisible();
    await expect(page.getByText('自分の海域')).toBeVisible();

    // 対戦画面に到達したことを確認
    const currentTurnText = await page.getByTestId('current-turn').textContent();
    expect(currentTurnText).toMatch(/Player [12] の番/);
  });

  test('should allow attacking and show results', async ({ page }) => {
    // セットアップ：両プレイヤーの配置を行う
    await page.goto('/');
    await page.getByTestId('start-button').click();

    // Player 1の配置
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();
    await page.getByTestId('confirm-button').click();

    // Player 2の配置
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();
    await page.getByTestId('confirm-button').click();

    // 対戦画面に到達
    await expect(page.getByRole('heading', { name: '対戦' })).toBeVisible();

    // 攻撃を行う（攻撃グリッド内のセルをクリック）
    const attackGrid = page.getByTestId('attack-grid');
    await attackGrid.getByTestId('cell-A1').click();

    // 攻撃結果が表示されることを確認
    await expect(page.getByTestId('attack-result')).toBeVisible({ timeout: 2000 });
    const resultText = await page.getByTestId('attack-result').textContent();
    expect(resultText).toMatch(/命中！|ミス\.\.\./);
  });

  test('should handle turn transitions correctly', async ({ page }) => {
    // セットアップ
    await page.goto('/');
    await page.getByTestId('start-button').click();

    // Player 1の配置
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();
    await page.getByTestId('confirm-button').click();

    // Player 2の配置
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();
    await page.getByTestId('confirm-button').click();

    // 対戦画面
    await expect(page.getByRole('heading', { name: '対戦' })).toBeVisible();

    // 最初のプレイヤーを記録
    const firstPlayerText = await page.getByTestId('current-turn').textContent();

    // 攻撃（相手のいないセルを狙う - 攻撃グリッド内）
    const attackGrid = page.getByTestId('attack-grid');
    await attackGrid.getByTestId('cell-J10').click();

    // ターン交代画面を待つ
    await expect(page.getByText('ターン交代')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('continue-button')).toBeVisible();

    // 準備完了ボタンをクリック
    await page.getByTestId('continue-button').click();

    // ターンが交代したことを確認
    const secondPlayerText = await page.getByTestId('current-turn').textContent();
    expect(secondPlayerText).not.toBe(firstPlayerText);
  });

  test('should complete a full game until one player wins', async ({ page }) => {
    // このテストは時間がかかるため、タイムアウトを延長
    test.setTimeout(300000);

    await page.goto('/');
    await page.getByTestId('start-button').click();

    // Player 1の配置（A-E行の1列目から横向き）
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();
    await page.getByTestId('confirm-button').click();

    // Player 2の配置（F-J行の1列目から横向き - Player 1とは異なる位置）
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-F1').click();
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-G1').click();
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-H1').click();
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-I1').click();
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-J1').click();
    await page.getByTestId('confirm-button').click();

    // 対戦開始
    await expect(page.getByRole('heading', { name: '対戦' })).toBeVisible();

    // 両プレイヤーの艦の位置:
    // Player 1: A1-A5, B1-B4, C1-C3, D1-D3, E1-E2
    // Player 2: F1-F5, G1-G4, H1-H3, I1-I3, J1-J2
    //
    // 両プレイヤーが交互に攻撃するため、各プレイヤー用の攻撃対象を用意
    // Player 1 が攻撃する Player 2 の艦の位置
    const player1AttackCells = [
      'F1', 'F2', 'F3', 'F4', 'F5', // Player 2の空母
      'G1', 'G2', 'G3', 'G4',       // Player 2の戦艦
      'H1', 'H2', 'H3',             // Player 2の巡洋艦
      'I1', 'I2', 'I3',             // Player 2の潜水艦
      'J1', 'J2',                   // Player 2の駆逐艦
    ];

    // Player 2 が攻撃する位置（Player 1の艦がない場所）
    const player2AttackCells = [
      'J10', 'J9', 'J8', 'J7', 'J6', // ミス
      'I10', 'I9', 'I8', 'I7',       // ミス
      'H10', 'H9', 'H8',             // ミス
      'G10', 'G9', 'G8',             // ミス
      'F10', 'F9',                   // ミス
    ];

    // ヘルパー関数：攻撃グリッド内のセルをクリック
    const attackCell = async (cellId: string) => {
      const attackGrid = page.getByTestId('attack-grid');
      const cell = attackGrid.getByTestId(`cell-${cellId}`);
      await cell.click();
    };

    // ヘルパー関数：現在の画面状態を判定
    const getScreenState = async () => {
      if (await page.getByTestId('winner-display').isVisible().catch(() => false)) {
        return 'result';
      }
      if (await page.getByTestId('continue-button').isVisible().catch(() => false)) {
        return 'transition';
      }
      if (await page.getByRole('heading', { name: '対戦' }).isVisible().catch(() => false)) {
        return 'battle';
      }
      return 'unknown';
    };

    // ヘルパー関数：現在のプレイヤーを取得
    const getCurrentPlayer = async (): Promise<'player1' | 'player2' | null> => {
      const turnText = await page.getByTestId('current-turn').textContent().catch(() => null);
      if (turnText?.includes('Player 1')) return 'player1';
      if (turnText?.includes('Player 2')) return 'player2';
      return null;
    };

    let player1AttackIndex = 0;
    let player2AttackIndex = 0;
    const maxIterations = 100;
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;
      const state = await getScreenState();

      if (state === 'result') {
        break;
      }

      if (state === 'transition') {
        await page.getByTestId('continue-button').click();
        await page.waitForTimeout(500);
        continue;
      }

      if (state === 'battle') {
        const currentPlayer = await getCurrentPlayer();

        try {
          if (currentPlayer === 'player1' && player1AttackIndex < player1AttackCells.length) {
            // Player 1はPlayer 2の艦を攻撃（命中）
            await attackCell(player1AttackCells[player1AttackIndex]);
            player1AttackIndex++;
          } else if (currentPlayer === 'player2' && player2AttackIndex < player2AttackCells.length) {
            // Player 2はPlayer 1の艦がない場所を攻撃（ミス）
            await attackCell(player2AttackCells[player2AttackIndex]);
            player2AttackIndex++;
          }
          // 攻撃後、結果表示とターン交代画面を待つ
          await page.waitForTimeout(2000);
        } catch {
          await page.waitForTimeout(500);
        }
        continue;
      }

      // 状態が不明な場合は待機
      await page.waitForTimeout(1000);
    }

    // 結果画面が表示されることを確認（Player 1が勝利）
    await expect(page.getByTestId('winner-display')).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId('winner-display')).toContainText('の勝利！');

    // タイトルに戻るボタンが表示されることを確認
    await expect(page.getByTestId('return-to-title-button')).toBeVisible();

    // タイトルに戻るボタンをクリック
    await page.getByTestId('return-to-title-button').click();

    // タイトル画面に戻ったことを確認
    await expect(page.getByTestId('game-title')).toBeVisible();
    await expect(page.getByTestId('start-button')).toBeVisible();
  });
});
