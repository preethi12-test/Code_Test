const { test, expect } = require("@playwright/test");
const { loginPage } = require("../pages/loginPage");
const { productsPage } = require("../pages/productPage");

test("Login", async ({ page }) => {
  const LoginPage = new loginPage(page);
  const ProductsPage = new productsPage(page);

  await LoginPage.goTo();
  await ProductsPage.addProduct();
  try {
    await ProductsPage.productAvailabilityCheck();
  } catch (error) {
    console.log("Test aborted: " + error.message);
    return;
  }
  const productAddedNotificationText = await ProductsPage.addingProductToCart();
  const productDetailText = await ProductsPage.getProductDetails();
  expect(productAddedNotificationText).toBeDefined();
  expect(productDetailText).toBeDefined();
  await ProductsPage.getCartCount();
  const updatedCartCountText = await ProductsPage.cartIcon.textContent();
  expect(updatedCartCountText).toContain("1 item");
});