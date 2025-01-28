const { test, expect } = require("@playwright/test");
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
  }

  // Verify the cart page is displayed
  async verifyCartPage() {
    try {
      await this.cartPageHeader.waitFor({ state: "visible", timeout: 5000 });
      console.log("Cart page is displayed.");
    } catch (error) {
      throw new Error("Failed to navigate to the cart page.");
    }
  }

  // Validate all items in the cart (name, size, quantity, price)
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
      cartItemsDetails.push({
        name: itemName.trim(),
        quantity: parseInt(itemQuantity.trim(), 10),
        price: itemPrice.trim(),
      });

      const expectedItem = expectedProductDetails[0];
      expect(itemName.trim()).toBe(expectedItem.name);
      expect(parseInt(itemQuantity.trim(), 10)).toBe(1);
      expect(itemPrice.trim()).toBe(expectedItem.price);
    }

    return cartItemsDetails;
  }


}
