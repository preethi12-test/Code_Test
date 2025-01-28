const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
export class productsPage {
  constructor(page) {
    this.page = page;
    this.productDetails = page.locator(
      `//*[@id='ProductInfo-template--15328405717213__main']//h1`
    );
    this.productPrice = page.locator(
      `//div[@class='product__info-wrapper grid__item']/descendant::div[@class='price__regular']/span[@class='price-item price-item--regular']`
    );
    this.productSize=page.locator(`//label[@for='template--15328405717213__main-Size-0']`)
    this.productAvailability = page.locator(
      `//div[@id='price-template--15328405717213__main']/descendant::span[contains(.,'Sold out')]`
    );
    this.addToCartBtn = page.locator(`//*[@name='add']`);
    this.productAddedNotification = page.locator(
      `//*[@id='cart-notification']//h2`
    );
    this.cartIcon = page.locator(`//*[@class='cart-count-bubble']//span[1]`);
  }
  async selectProduct({ byName = false, productIdentifier }) {
    let productLocator;

    if (byName) {
      productLocator = this.page.locator(
        `//a[contains(text(),'${productIdentifier}')]`
      );
    } else {
      productLocator = this.page.locator(
        `//section[@id='shopify-section-template--15328405749981__featured_products']//slider-component//li[${productIdentifier}]//h3/a`
      );
    }

    await productLocator.click();
    await this.navigateToProductDetails();
  }
  async navigateToProductDetails() {
    try {
      await this.productDetails.waitFor({ state: "visible", timeout: 5000 });
      console.log("Successfully navigated to the product details page.");
    } catch (error) {
      throw new Error("Failed to navigate to the product details page.");
    }
  }
  async getProductDetailsFromUI() {
    const productName = await this.productDetails.textContent();
    const productPrice = await this.productPrice.textContent();
    const productSize=await this.productSize.textContent()
    return {
      name: productName.trim().replace(/\s+/g, " "),
      price: productPrice.trim().replace(/\s+/g, " "),
      size: productSize.trim()
    };
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
  async addingProductToCart() {
    await this.addToCartBtn.click();
    return await this.productAddedNotification.textContent();
  }
  async getCartCount() {
    const currentCountText = await this.cartIcon.textContent();
    console.log("Current Count Text: ", currentCountText);
    let currentCount = parseInt(currentCountText.split(" ")[0], 10);
    if (isNaN(currentCount)) {
      currentCount = 0;
    }
    await this.cartIcon.evaluate((el, count) => {
      el.textContent = `${count} item${count !== 1 ? "s" : ""}`;
    }, currentCount);
  }
}
