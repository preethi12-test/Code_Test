import { cartPage } from "./cartPage";

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
    this.productPrice = page.locator(`//span[@class='price-item price-item--regular']`)
    this.productSize=page.locator(`//label[contains(@for, 'template--15328405717213__main-')]`)
    this.productAvailability = page.locator(`//span[@class='badge price__badge-sold-out color-inverse']`);
    this.addToCartBtn = page.locator(`//*[@name='add']`);
    this.productAddedNotification = page.locator(`//*[@id='cart-notification']//h2`);
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
    await this.navigateToProductDetailsPage();
  }
  async navigateToProductDetailsPage() {
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
  async checkProductAvailability() {
    const productAvailabilityText = await this.productAvailability.textContent();
    if (productAvailabilityText.includes("Sold out")) {
      console.log("Product is sold out, stopping all tests.");
      throw new Error("Product is sold out. Test aborted.");
    }
    console.log("Product is available.");
  }
  async addToCart() {
    try {
      await this.checkProductAvailability();
    } catch (error) {
      console.error("Cannot add product to cart due to availability issue.");
      throw error;
    }
    try {
      console.log("Attempting to add product to cart...");
      await this.addToCartBtn.click();
    } catch (error) {
      console.error("Error occurred while clicking 'Add to Cart' button: ", error);
      throw new Error("Failed to add product to the cart. Please try again later.");
    }
     try {
      const notificationText = await this.productAddedNotification.textContent();
      if (!notificationText || notificationText.trim() === "") {
        throw new Error("No confirmation received for adding the product to the cart.");
      }
      return notificationText;
    } catch (error) {
      console.error("Error retrieving notification text: ", error.message);
      throw new Error("Failed to retrieve cart addition confirmation.");
    }
  }

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
