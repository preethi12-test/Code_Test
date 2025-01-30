import { cartPage } from "./cartPage";

const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
/**
 * Class representing the Products Page.
 * Provides actions for interacting with products on the product listing page.
 */
export class productsPage {
  /**
   * Creates an instance of the Products Page.
   * @param {Page} page - The Playwright page object representing the browser tab.
   */
  constructor(page) {
    this.page = page;
    this.productDetails = page.locator(
      `//*[@id='ProductInfo-template--15328405717213__main']//h1`
    );
    this.productPrice = page.locator(`//span[@class='price-item price-item--regular']`)
    this.productSize=page.locator(`//label[@for='template--15328405717213__main-Size-0']`)
    this.productAvailability = page.locator(`//span[@class='badge price__badge-sold-out color-inverse']`);
    this.addToCartBtn = page.locator(`//*[@name='add']`);
    this.productAddedNotification = page.locator(`//*[@id='cart-notification']//h2`);
    this.cartIcon = page.locator(`//*[@class='cart-count-bubble']//span[1]`);
  }
  /**
   * Selects a product based on the identifier, either by name or by index.
   * @param {Object} options - The options for selecting the product.
   * @param {boolean} options.byName - If true, selects by product name; if false, selects by index.
   * @param {string|number} options.productIdentifier - The product identifier (name or index).
   */
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
  /**
   * Verifies successful navigation to the product details page.
   * @throws {Error} Throws an error if the product details page is not visible within the specified timeout.
   */
  async navigateToProductDetailsPage() {
    try {
      await this.productDetails.waitFor({ state: "visible", timeout: 5000 });
      console.log("Successfully navigated to the product details page.");
    } catch (error) {
      throw new Error("Failed to navigate to the product details page.");
    }
  }
   /**
   * Retrieves the product details (name, price, and size) from the UI.
   * @returns {Object} - The product details, including name, price, and size.
   */
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
 /**
   * Checks if the product is available before adding it to the cart.
   * @throws {Error} Throws an error if the product is sold out.
   */
  async checkProductAvailability() {
    const productAvailabilityText = await this.addToCartBtn.textContent();
    if (productAvailabilityText.includes("Sold out")) {
      console.log("Product is sold out, stopping all tests.");
      throw new Error("Product is sold out. Test aborted.");
    }
    console.log("Product is available.");
  }
  /**
   * Adds the product to the cart.
   * @returns {string} - The notification text confirming the product was added to the cart.
   */
  async addToCart() {
    await this.addToCartBtn.click();
    return await this.productAddedNotification.textContent();
  }
  /**
   * Retrieves the current item count in the cart.
   * Updates the displayed cart count accordingly.
   */
  async getCartItemCount() {
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
