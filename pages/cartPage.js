const { test, expect } = require("@playwright/test");
/**
 * Class representing the Cart Page.
 * Provides actions and verifications related to the cart page.
 */
export class cartPage {
  /**
   * Creates an instance of the Cart Page.
   * @param {Page} page - The Playwright page object representing the browser tab.
   */
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(`//*[@id='main-cart-items']`);
    this.cartTotal = page.locator(`//*[@class='totals']/p`);
    this.cartPageHeader = page.locator(
      "//div[@class='title-wrapper-with-link']//h1"
    );
    this.productName = page.locator(`//*[@id='main-cart-items']//td[2]//a`);
    this.productQuantity = page.locator(`#Quantity-1`
      // `//div[@class='cart__items']/descendant::input[@id='Quantity-1']`
    );
    this.productPrice = page.locator(`//*[@id='main-cart-items']//td[5]//span`);
    this.productSize = page.locator(`//div[@class='product-option']//dd`);
    this.deleteBtn = page.locator(`//*[@id='Remove-1']`);
    this.cartEmptyText = page.locator(`//*[@class='cart__empty-text']`);
  }

  /**
   * Verifies that the Cart page is displayed.
   * @throws {Error} Throws an error if the cart page is not visible within the specified timeout.
   */
  async verifyCartPageIsVisible() {
    try {
      await this.cartPageHeader.waitFor({ state: "visible", timeout: 5000 });
      console.log("Cart page is displayed.");
    } catch (error) {
      throw new Error("Failed to navigate to the cart page.");
    }
  }

  /**
   * Validates the contents of the cart.
   * @param {Array} expectedProductDetails - Expected product details to validate against.
   * @returns {Array} An array of actual product details present in the cart.
   * @throws {Error} Throws an error if no items are found in the cart.
   */
  async validateCartContents(expectedProductDetails) {
    const cartItemsDetails = [];

    // Verify that at least one item exists in the cart
    const itemCount = await this.cartItems.count();
    if (itemCount === 0) {
      throw new Error("No items found in the cart.");
    }

    for (let i = 0; i < itemCount; i++) {
      const itemName = await this.productName.nth(i).textContent();
      const itemQuantity = await this.productQuantity.nth(i).inputValue();
      const itemPrice = await this.productPrice.nth(i).textContent();
      const itemSize = await this.productSize.nth(i).textContent();
      cartItemsDetails.push({
        name: itemName.trim(),
        quantity: parseInt(itemQuantity.trim(), 10),
        price: itemPrice.trim(),
        size: itemSize.trim(),
      });
      // Compare actual product details with expected details
      const expectedItem = expectedProductDetails[0];
      expect(itemName.trim()).toBe(expectedItem.name);
      expect(parseInt(itemQuantity.trim(), 10)).toBe(1);
      expect(itemPrice.trim()).toBe(expectedItem.price);
      expect(itemSize.trim()).toBe(expectedItem.size);
    }

    return cartItemsDetails;
  }
 /**
   * Deletes a product from the cart.
   * @returns {string} A confirmation message indicating the cart is empty.
   */
  async removeProductFromCart() {
    await this.deleteBtn.click();
    return this.cartEmptyText.textContent();
  }
}
