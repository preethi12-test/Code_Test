/**
 * Class representing the Login Page.
 * Provides login functionality.
 */
export class loginPage {
  /**
   * Creates an instance of the Login Page.
   * @param {Page} page - The Playwright page object representing the browser tab.
   */
  constructor(page) {
    this.page = page;
  }
  /**
   * Navigates to the login page URL.
   */
  async navigateToLoginPage() {
    await this.page.goto("https://web-playground.ultralesson.com/");
  }
}
