import { test, expect } from '@playwright/test';

test.describe('TitleScreen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the game title', async ({ page }) => {
    const title = page.getByTestId('game-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('海戦ゲーム');
  });

  test('should display the subtitle', async ({ page }) => {
    const subtitle = page.getByText('Battleship');
    await expect(subtitle).toBeVisible();
  });

  test('should display the start button', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveText('ゲーム開始');
  });

  test('should navigate to placement screen when start button is clicked', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    await startButton.click();

    // 配置画面に遷移したことを確認
    const currentPlayer = page.getByTestId('current-player');
    await expect(currentPlayer).toBeVisible();
    await expect(currentPlayer).toHaveText('Player 1 の番');
  });
});
