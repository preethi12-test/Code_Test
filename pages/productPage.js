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
    this.productDetails = page.locator(
      `//*[@id='ProductInfo-template--15328405717213__main']//h1`
    );
    this.productAvailability = page.locator(
      `//div[@id='price-template--15328405717213__main']/descendant::span[contains(.,'Sold out')]`
    );
  }
  async addProduct() {
    await this.product.click();
  }
  async getProductDetails() {
    return await this.productDetails.textContent();
  }
  async productAvailabilityCheck() {
    const productAvailabilityText = await this.page.textContent(this.productAvailability); // Adjust the selector as needed
    if (productAvailabilityText.includes("Sold out")) {
      console.log("Product is sold out.");
      return true;  // Indicate that the product is sold out
    }
    console.log("Product is available.");
    return false;  // Indicate that the product is available
  }
}
