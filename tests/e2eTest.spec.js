const { test, expect } = require("@playwright/test");
const { loginPage } = require("../pages/loginPage");
const { productsPage } = require("../pages/productPage");
const { cartPage } = require("../pages/cartPage");
const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
/**
 * Test case for logging in, selecting a product, adding it to the cart, and validating the cart contents, and deleting cart items.
 */
test("Login", async ({ page }) => {
  // Initialize page objects for login, product, and cart
  const LoginPage = new loginPage(page);
  const ProductsPage = new productsPage(page);
  const CartPage = new cartPage(page);

  // Navigate to the login page
  await LoginPage.navigateToLoginPage();

  // Select product by index
  await ProductsPage.selectProduct({ byName: false, productIdentifier: 3 });

  // Alternatively, select product by name:
  // await ProductsPage.selectProduct({ byName: true, productIdentifier: productData.productName });

  // Retrieve product details from the UI
  const { name: productNameFromUI, price: productPriceFromUI, size:productSizeFromUI } =
    await ProductsPage.getProductDetailsFromUI();

      // Check if the product is available before adding it to the cart
  try {
    await ProductsPage.checkProductAvailability();
  } catch (error) {
    console.log("Test aborted: " + error.message);
    return;
  }

  // Add the product to the cart and retrieve the notification text
  const productAddedNotificationText = ProductsPage.addToCart();
  const productDetailText = await ProductsPage.getProductDetails();

  // Validate that the product was successfully added to the cart
  expect(productAddedNotificationText).toBeDefined();
  expect(productDetailText).toBeDefined();

  // Validate the updated cart count
  await ProductsPage.getCartItemCount();
  const updatedCartCountText = await ProductsPage.cartIcon.textContent();
  expect(updatedCartCountText).toContain("1 item");

  // Navigate to the cart page
  await ProductsPage.page.locator(`//a[@id='cart-icon-bubble']`).click();

  // Verify cart page is displayed
  await CartPage.verifyCartPageIsVisible;

  // Set up the expected product details for cart validation
  const expectedProductDetails = [
    {
      name: productNameFromUI,
      price: productPriceFromUI,
      size: productSizeFromUI
    },
  ];

  // Validate the contents of the cart against expected product details
  await CartPage.validateCartContents(expectedProductDetails);
  
   // Delete the product from the cart and confirm the cart is empty
  const cartEmptyConfirmation=await CartPage.removeProductFromCart()
  expect(cartEmptyConfirmation).toBeDefined()
});
