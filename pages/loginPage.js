export class loginPage {
  constructor(page) {
    this.page = page;
  }
  async goTo() {
    await this.page.goto("https://web-playground.ultralesson.com/");
  }
}
