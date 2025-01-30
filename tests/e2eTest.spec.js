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
  // Select product by index
  await ProductsPage.selectProduct({ byName: false, productIdentifier: 3 });

  // Alternatively, select product by name:
  // await ProductsPage.selectProduct({ byName: true, productIdentifier: productData.productName });
  const { name: productNameFromUI, price: productPriceFromUI, size:productSizeFromUI } =
    await ProductsPage.getProductDetailsFromUI();
  console.log(
    `Product Name: ${productNameFromUI}, Product Price: ${productPriceFromUI}, Prooduct Size: ${productSizeFromUI}}`
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

  // Navigate to the cart page
  await ProductsPage.page.locator(`//a[@id='cart-icon-bubble']`).click();

  // Verify cart page is displayed
  await CartPage.verifyCartPage();
  const expectedProductDetails = [
    {
      name: productNameFromUI,
      price: productPriceFromUI,
      size: productSizeFromUI
    },
  ];
  await CartPage.validateCartContents(expectedProductDetails);
  //Delete the Product From Cart
  const cartEmptyConfirmation=await CartPage.deleteProduct()
  expect(cartEmptyConfirmation).toBeDefined()
});
