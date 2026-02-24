import { test, expect } from '@playwright/test';

test.describe('PlacementScreen', () => {
  test.beforeEach(async ({ page }) => {
    // タイトル画面からゲーム開始して配置画面へ遷移
    await page.goto('/');
    await page.getByTestId('start-button').click();
    await expect(page.getByTestId('current-player')).toBeVisible();
  });

  test('should display Player 1 placement screen', async ({ page }) => {
    const currentPlayer = page.getByTestId('current-player');
    await expect(currentPlayer).toHaveText('Player 1 の番');
  });

  test('should display the placement title', async ({ page }) => {
    const title = page.getByRole('heading', { name: '艦配置' });
    await expect(title).toBeVisible();
  });

  test('should display all ship types', async ({ page }) => {
    await expect(page.getByTestId('ship-carrier')).toBeVisible();
    await expect(page.getByTestId('ship-battleship')).toBeVisible();
    await expect(page.getByTestId('ship-cruiser')).toBeVisible();
    await expect(page.getByTestId('ship-submarine')).toBeVisible();
    await expect(page.getByTestId('ship-destroyer')).toBeVisible();
  });

  test('should display orientation button', async ({ page }) => {
    const orientationButton = page.getByTestId('orientation-button');
    await expect(orientationButton).toBeVisible();
    await expect(orientationButton).toContainText('向き:');
  });

  test('should toggle orientation when button is clicked', async ({ page }) => {
    const orientationButton = page.getByTestId('orientation-button');

    // 初期状態は「横」
    await expect(orientationButton).toContainText('横');

    // クリックして「縦」に切り替え
    await orientationButton.click();
    await expect(orientationButton).toContainText('縦');

    // 再度クリックして「横」に戻す
    await orientationButton.click();
    await expect(orientationButton).toContainText('横');
  });

  test('should have confirm button disabled initially', async ({ page }) => {
    const confirmButton = page.getByTestId('confirm-button');
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeDisabled();
  });

  test('should display grid cells', async ({ page }) => {
    // グリッドのセルが表示されていることを確認（A1, A2, ... J10）
    await expect(page.getByTestId('cell-A1')).toBeVisible();
    await expect(page.getByTestId('cell-A10')).toBeVisible();
    await expect(page.getByTestId('cell-J1')).toBeVisible();
    await expect(page.getByTestId('cell-J10')).toBeVisible();
  });

  test('should allow selecting a ship and placing it on the grid', async ({ page }) => {
    // 駆逐艦を選択
    const destroyerShip = page.getByTestId('ship-destroyer');
    await destroyerShip.click();

    // グリッドのセルをクリックして配置
    await page.getByTestId('cell-A1').click();

    // 配置済み表示を確認
    await expect(destroyerShip).toContainText('配置済');
  });

  test('should enable confirm button when all ships are placed', async ({ page }) => {
    // 全艦を配置する
    // 空母 (5マス) - A1から横に
    await page.getByTestId('ship-carrier').click();
    await page.getByTestId('cell-A1').click();

    // 戦艦 (4マス) - B1から横に
    await page.getByTestId('ship-battleship').click();
    await page.getByTestId('cell-B1').click();

    // 巡洋艦 (3マス) - C1から横に
    await page.getByTestId('ship-cruiser').click();
    await page.getByTestId('cell-C1').click();

    // 潜水艦 (3マス) - D1から横に
    await page.getByTestId('ship-submarine').click();
    await page.getByTestId('cell-D1').click();

    // 駆逐艦 (2マス) - E1から横に
    await page.getByTestId('ship-destroyer').click();
    await page.getByTestId('cell-E1').click();

    // 配置確定ボタンが有効になっていることを確認
    const confirmButton = page.getByTestId('confirm-button');
    await expect(confirmButton).toBeEnabled();
  });

  test('should navigate to Player 2 placement after Player 1 confirms', async ({ page }) => {
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

    // 配置確定
    await page.getByTestId('confirm-button').click();

    // Player 2の配置画面に遷移したことを確認
    const currentPlayer = page.getByTestId('current-player');
    await expect(currentPlayer).toHaveText('Player 2 の番');
  });
});
