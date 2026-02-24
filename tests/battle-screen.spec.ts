import { test, expect } from '@playwright/test';

// 両プレイヤーの配置を行うヘルパー関数
async function setupBothPlayersPlacement(page: import('@playwright/test').Page) {
  // タイトル画面からゲーム開始
  await page.goto('/');
  await page.getByTestId('start-button').click();

  // Player 1の全艦を配置
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

  // Player 1の配置確定
  await page.getByTestId('confirm-button').click();

  // Player 2の全艦を配置
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

  // Player 2の配置確定 -> 対戦画面へ
  await page.getByTestId('confirm-button').click();
}

test.describe('BattleScreen', () => {
  test.beforeEach(async ({ page }) => {
    await setupBothPlayersPlacement(page);
  });

  test('should display battle screen after both players placement', async ({ page }) => {
    // 対戦画面のタイトルを確認
    const title = page.getByRole('heading', { name: '対戦' });
    await expect(title).toBeVisible();
  });

  test('should display current turn indicator', async ({ page }) => {
    // 現在のターン表示を確認（Player 1 または Player 2）
    const currentTurn = page.getByTestId('current-turn');
    await expect(currentTurn).toBeVisible();
    await expect(currentTurn).toContainText('の番');
  });

  test('should display both grids (attack and own)', async ({ page }) => {
    // 相手の海域と自分の海域の見出しを確認
    await expect(page.getByText('相手の海域')).toBeVisible();
    await expect(page.getByText('自分の海域')).toBeVisible();
  });

  test('should display ship fleet sections', async ({ page }) => {
    // 艦隊表示セクションを確認
    await expect(page.getByText('相手の艦隊')).toBeVisible();
    await expect(page.getByText('自分の艦隊')).toBeVisible();
  });

  test('should display grid cells for attack', async ({ page }) => {
    // 攻撃用グリッドのセルが表示されていることを確認
    const attackGrid = page.getByTestId('attack-grid');
    await expect(attackGrid.getByTestId('cell-A1')).toBeVisible();
    await expect(attackGrid.getByTestId('cell-J10')).toBeVisible();
  });

  test('should show attack result after clicking a cell', async ({ page }) => {
    // 攻撃グリッド内のセルをクリックして攻撃
    const attackGrid = page.getByTestId('attack-grid');
    await attackGrid.getByTestId('cell-A1').click();

    // 攻撃結果のメッセージが表示されることを確認（命中またはミス）
    const attackResult = page.getByTestId('attack-result');
    await expect(attackResult).toBeVisible({ timeout: 2000 });
  });

  test('should show turn transition screen after attack', async ({ page }) => {
    // 攻撃グリッド内のセルをクリックして攻撃
    const attackGrid = page.getByTestId('attack-grid');
    await attackGrid.getByTestId('cell-F1').click();

    // ターン交代画面が表示されることを確認
    await expect(page.getByText('ターン交代')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('continue-button')).toBeVisible();
  });

  test('should continue to next player turn after clicking continue button', async ({ page }) => {
    // 最初のプレイヤーのターン表示を取得
    const initialTurnText = await page.getByTestId('current-turn').textContent();

    // 攻撃グリッド内のセルをクリックして攻撃
    const attackGrid = page.getByTestId('attack-grid');
    await attackGrid.getByTestId('cell-F1').click();

    // ターン交代画面を待つ
    await expect(page.getByTestId('continue-button')).toBeVisible({ timeout: 3000 });

    // 準備完了ボタンをクリック
    await page.getByTestId('continue-button').click();

    // 次のプレイヤーのターンになったことを確認
    const newTurnText = await page.getByTestId('current-turn').textContent();
    expect(newTurnText).not.toBe(initialTurnText);
  });
});
