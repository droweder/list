from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Go to the invite page
    page.click('button:has(svg > path[d^="M4 12a1"])')

    # Fill the form
    page.fill('input[type="email"]', "test@example.com")
    page.click('button[type="submit"]')

    # Take screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
