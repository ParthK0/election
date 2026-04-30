const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

test.describe('ElectIQ Core Workflows', () => {
  test('Accessibility audit on Home page', async ({ page }) => {
    await page.goto('/');
    const closeBtn = page.locator('button', { hasText: 'Skip & Use Defaults' });
    if (await closeBtn.isVisible()) await closeBtn.click();
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });
  test('can switch country and see updated content', async ({ page }) => {
    await page.goto('/');
    
    // Close onboarding if present
    const closeBtn = page.locator('button', { hasText: 'Skip & Use Defaults' });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Check default country (India)
    await expect(page.locator('text=India LIVE')).toBeVisible();

    // Open country selector
    await page.locator('button', { hasText: 'IN' }).click();
    await page.locator('button', { hasText: 'USA' }).click();

    // Check updated country
    await expect(page.locator('text=USA LIVE')).toBeVisible();
  });

  test('can complete a quiz flow', async ({ page }) => {
    await page.goto('/quiz');
    
    const closeBtn = page.locator('button', { hasText: 'Skip & Use Defaults' });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Start quiz
    await page.locator('button', { hasText: 'Beginner' }).click();

    // Answer first question
    const firstOption = page.locator('button').nth(0); // This might need refinement based on actual DOM
    await firstOption.click();

    // Continue
    await page.locator('button', { hasText: /Continue|See Final Score/ }).click();

    // See results (since quiz length varies, we just check if we move forward)
    // Here we'll just check that either next question or results show
    await expect(page.locator('text=Question 2').or(page.locator('text=Analysis Complete'))).toBeVisible();
  });

  test('can ask AI a question', async ({ page }) => {
    await page.goto('/ask');

    const closeBtn = page.locator('button', { hasText: 'Skip & Use Defaults' });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Type question
    const input = page.locator('input[type="text"]');
    await input.fill('What is a polling booth?');
    
    // Send
    await page.locator('button[type="submit"]').click();

    // Check that typing indicator or bot response appears
    await expect(page.locator('.animate-pulse').or(page.locator('text=polling booth'))).toBeVisible();
  });

  test('can search glossary terms', async ({ page }) => {
    await page.goto('/glossary');

    const closeBtn = page.locator('button', { hasText: 'Skip & Use Defaults' });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Search for a term
    const input = page.locator('input[type="text"]');
    await input.fill('voter');

    // Check that filtered results appear
    await expect(page.locator('text=terms')).toBeVisible();
  });
});
