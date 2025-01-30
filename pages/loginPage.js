/**
 * Class representing the Login Page.
 * Provides login functionality.
 */
export class loginPage {
  constructor(page) {
    this.page = page;
  }
  /**
   * Navigates to the login page URL.
   */
  async goTo() {
    await this.page.goto("https://web-playground.ultralesson.com/");
  }
}
