const { test, expect } = require("@playwright/test");
const { loginPage } = require("../pages/loginPage");
const { productsPage } = require("../pages/productPage");
const { cartPage } = require("../pages/cartPage");
const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
test("Login", async ({ page }) => {
  const LoginPage = new loginPage(page);
  const ProductsPage = new productsPage(page);
  const CartPage = new cartPage(page);
  await LoginPage.goTo();
  // await ProductsPage.selectProductByName(productData.productName);
  await ProductsPage.selectProductByIndex(3);
  const { name: productNameFromUI, price: productPriceFromUI } =
    await ProductsPage.getProductDetailsFromUI();
  console.log(
    `Product Name: ${productNameFromUI}, Product Price: ${productPriceFromUI}`
  );
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

  // validating cart contents
  const cartItemsDetails = await CartPage.validateCartContents();

  // Validate the first product in the cart
  expect(cartItemsDetails[0].name).toBe(productNameFromUI);
  expect(cartItemsDetails[0].price).toBe(productPriceFromUI);
});
