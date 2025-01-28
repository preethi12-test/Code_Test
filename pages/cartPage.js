export class cartPage {
  constructor(page) {
    this.cartIcon = page.locator(`//*[@class='icon icon-cart']`);
    this.cartItems = page.locator(`//*[@id='main-cart-items']`);
    this.productName = page.locator(`//*[@id='main-cart-items']//td[2]//a`);
    this.productQuantity = page.locator(
      `//div[@class='cart__items']/descendant::input[@id='Quantity-1']`
    );
    this.productPrice = page.locator(`//*[@id='main-cart-items']//td[5]//span`);
  }
  async validateCartContents() {
    await this.cartIcon.click();
    const cartItemsCount = await this.cartItems.count();
    if (cartItemsCount === 0) {
      throw new Error("No products found in the cart");
    }

    let cartDetails = [];

    for (let i = 0; i < cartItemsCount; i++) {
      const itemName = await this.productName.nth(i).textContent();
      const itemQuantity = await this.productQuantity.nth(i).inputValue();
      const itemPrice = await this.productPrice.nth(i).textContent();

      cartDetails.push({
        name: itemName.trim(),
        quantity: itemQuantity.trim(),
        price: itemPrice.trim()
      });
    }

    return cartDetails; 
  }
}
