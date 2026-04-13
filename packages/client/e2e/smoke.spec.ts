import { expect, test } from '@playwright/test';

test('home screen loads and Start Local Game navigates to setup', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Blood Fang' })).toBeVisible();

  await page.getByRole('link', { name: 'Start Local Game' }).click();
  await expect(page).toHaveURL(/\/setup$/);
});
