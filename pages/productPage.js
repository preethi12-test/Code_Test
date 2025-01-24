const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
export class productsPage {
  constructor(page) {
    this.product = page.locator(
      `//a[contains(text(),'${productData.productName}')]`
    );
    this.productDetails=page.locator(`//*[@id='ProductInfo-template--15328405717213__main']//h1`)
  }
  async addProduct() {
    await this.product.click();
  }
  async getProductDetails() {
    return await this.productDetails.textContent();
  }
}
