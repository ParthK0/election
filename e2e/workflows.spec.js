import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('ElectIQ Core Workflows', () => {
  const bypassOnboarding = async (page) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('electiq_onboarded', 'true');
    });
  };



  test('Accessibility audit on Home page', async ({ page }) => {
    await bypassOnboarding(page);
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();


    
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });



  test('can switch country and see updated content', async ({ page }) => {
    await bypassOnboarding(page);
    await page.goto('/');



    // Check default country (India)
    await expect(page.locator('text=India Election Intelligence Active')).toBeVisible();

    // Open country selector
    await page.locator('button', { hasText: '🇮🇳' }).click();
    await page.locator('button', { hasText: 'USA' }).click();

    // Check updated country
    await expect(page.locator('text=USA Election Intelligence Active')).toBeVisible();
  });


  test('can complete a quiz flow', async ({ page }) => {
    await bypassOnboarding(page);
    await page.goto('/quiz');



    // Start quiz
    await page.locator('button', { hasText: 'Beginner' }).click();

    // Answer first question - looking for the first option button in the list
    const firstOption = page.locator('button').filter({ hasText: /.+/ }).nth(3); // Skip the difficulty buttons if any are still in DOM, or use a more specific parent
    // Wait, let's be more specific
    const optionBtn = page.locator('.grid.gap-3 button').first();
    await optionBtn.click();


    // Continue
    await page.locator('button', { hasText: /Continue|See Final Score/ }).click();

    // See results (since quiz length varies, we just check if we move forward)
    await expect(page.locator('text=Question 2').or(page.locator('text=Analysis Complete'))).toBeVisible();
  });

  test('can ask AI a question', async ({ page }) => {
    await bypassOnboarding(page);
    await page.goto('/ask');



    // Type question
    const input = page.locator('input[placeholder*="message"]');
    await input.fill('What is a polling booth?');
    
    // Send
    await page.locator('button[aria-label="Send message"]').click();

    // Check that typing indicator or bot response appears
    // Check that typing indicator or bot response appears in the chat area
    await expect(page.locator('article').filter({ hasText: 'polling' }).or(page.locator('.p-4 .animate-pulse'))).toBeVisible();

  });

  test('can search glossary terms', async ({ page }) => {
    await bypassOnboarding(page);
    await page.goto('/glossary');



    // Search for a term - case insensitive placeholder
    const input = page.locator('input[placeholder*="search" i]');
    await input.fill('voter');


    // Check that results appear
    // Check that results appear (e.g. "X terms")
    // Check that results appear (e.g. "X terms") - using specific class to avoid strictness issues
    await expect(page.locator('.font-mono').filter({ hasText: /terms?/ })).toBeVisible();


  });
});
