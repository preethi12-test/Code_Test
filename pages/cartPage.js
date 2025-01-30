const { test, expect } = require("@playwright/test");
/**
 * Class representing the Cart Page.
 * Provides actions and verifications related to the cart page.
 */
export class cartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(`//*[@id='main-cart-items']`);
    this.cartTotal = page.locator(`//*[@class='totals']/p`);
    this.cartPageHeader = page.locator(
      "//div[@class='title-wrapper-with-link']//h1"
    );
    this.productName = page.locator(`//*[@id='main-cart-items']//td[2]//a`);
    this.productQuantity = page.locator(
      `//div[@class='cart__items']/descendant::input[@id='Quantity-1']`
    );
    this.productPrice = page.locator(`//*[@id='main-cart-items']//td[5]//span`);
    this.prooductSize = page.locator(
      `//div[@class='product-option']/descendant::dd[normalize-space(text()) and contains(text(), 'cm')]`
    );
    this.deleteBtn = page.locator(`//*[@id='Remove-1']`);
    this.cartEmptyText = page.locator(`//*[@class='cart__empty-text']`);
  }

  /**
   * Verifies that the Cart page is displayed.
   * Throws an error if the page is not visible within the specified timeout.
   */
  async verifyCartPage() {
    try {
      await this.cartPageHeader.waitFor({ state: "visible", timeout: 5000 });
      console.log("Cart page is displayed.");
    } catch (error) {
      throw new Error("Failed to navigate to the cart page.");
    }
  }

  /**
   * Validates the contents of the cart.
   * Verifies product details such as name, quantity, price, and size.
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
      const itemSize = await this.prooductSize.nth(i).textContent();
      cartItemsDetails.push({
        name: itemName.trim(),
        quantity: parseInt(itemQuantity.trim(), 10),
        price: itemPrice.trim(),
        size: itemSize.trim().replace(/\D/g, ""),
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
   * @returns - Confirmation message when the cart is empty.
   */
  async deleteProduct() {
    await this.deleteBtn.click();
    return this.cartEmptyText.textContent();
  }
}
