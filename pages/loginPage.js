
export class loginPage {
  constructor(page) {
    this.page = page;
  }
  async navigateToLoginPage() {
    await this.page.goto("https://web-playground.ultralesson.com/");
  }
}
