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
    this.addToCartBtn=page.locator(`//*[@name='add']`)
    this.productAddedNotification=page.locator(`//*[@id='cart-notification']//h2`)
    this.cartIcon=page.locator(`#cart-icon-bubble > span.visually-hidden`)
  }
  async addProduct() {
    await this.product.click();
  }
  async getProductDetails() {
    return await this.productDetails.textContent();
  }
  async productAvailabilityCheck() {
    const productAvailabilityText = await this.addToCartBtn.textContent(); 
    if (productAvailabilityText.includes("Sold out")) {
      console.log("Product is sold out, stopping all tests.");
      throw new Error("Product is sold out. Test aborted.");
    }
    console.log("Product is available.");
  }
  async addingProductToCart(){
    await this.addToCartBtn.click();
    return await this.productAddedNotification.textContent();
  }
  async getCartCount() {
    const currentCountText = await this.cartIcon.textContent(); 
    console.log("Current Count Text: ", currentCountText); 
    let currentCount = parseInt(currentCountText.split(' ')[0], 10);
    if (isNaN(currentCount)) {
      currentCount = 0; 
    }
    currentCount++; 
    await this.cartIcon.evaluate((el, count) => {
      el.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    }, currentCount);
  }

}

