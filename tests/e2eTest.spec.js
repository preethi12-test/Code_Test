const { test, expect } = require("@playwright/test");
const { loginPage } = require("../pages/loginPage");
const { productsPage } = require("../pages/productPage");

test("Login", async ({ page }) => {
  const LoginPage = new loginPage(page);
  const ProductsPage= new productsPage(page)

  await LoginPage.goTo();
  await ProductsPage.addProduct();
 const productDetailText= await ProductsPage.getProductDetails()
  expect(productDetailText).toBeDefined()
  
 
});
