import { test as setup } from '../src/fixtures/baseTest';

const authFile = '.auth/user.json';

setup('authenticate user and save session state', async ({ loginPage, page }) => {
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.context().storageState({ path: authFile });
});