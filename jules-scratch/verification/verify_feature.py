
from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    time.sleep(10)
    page.goto("http://localhost:3000")

    # Click the "Continuar com o Google" button
    page.click('button:has-text("Continuar com o Google")')

    # Click the new "Bank" button
    page.click('button[aria-label="Adicionar do banco de produtos"]')

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
