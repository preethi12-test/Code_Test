const { test, expect } = require("@playwright/test");
const { loginPage } = require("../pages/loginPage");
const { productsPage } = require("../pages/productPage");
const { cartPage } = require("../pages/cartPage");
const productData = JSON.parse(
  JSON.stringify(
    require("/Users/testvagrant/Desktop/CODE_TASK/testData/productData.json")
  )
);
test.describe('Login Spec', async() => {
test("Login", async ({ page }) => {
  const LoginPage = new loginPage(page);
  const ProductsPage = new productsPage(page);
  const CartPage = new cartPage(page);

  await LoginPage.navigateToLoginPage();

  await ProductsPage.selectProduct({ byName: false, productIdentifier: 3 });

  // Alternatively, select product by name:
  // await ProductsPage.selectProduct({ byName: true, productIdentifier: productData.productName });

  const { name: productNameFromUI, price: productPriceFromUI, size:productSizeFromUI } =
    await ProductsPage.getProductDetailsFromUI();
  try {
    await ProductsPage.checkProductAvailability();
  } catch (error) {
    console.log("Test aborted: " + error.message);
    return;
  }
  const productAddedNotificationText = await ProductsPage.addToCart();
  const productDetailText = await ProductsPage.getProductDetails();
  expect(productAddedNotificationText).toBeDefined();
  expect(productDetailText).toBeDefined();

  await ProductsPage.getCartItemCount();
  const updatedCartCountText = await ProductsPage.cartIcon.textContent();
  expect(updatedCartCountText).toContain("1 item");

  await ProductsPage.page.locator(`//a[@id='cart-icon-bubble']`).click();


  await CartPage.verifyCartPageIsVisible;

  const expectedProductDetails = [
    {
      name: productNameFromUI,
      price: productPriceFromUI,
      size: productSizeFromUI
    },
  ];

  await CartPage.validateCartContents(expectedProductDetails);
  
  const cartEmptyConfirmation=await CartPage.removeProductFromCart()
  expect(cartEmptyConfirmation).toBeDefined()
})
})
