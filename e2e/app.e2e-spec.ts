import { Angular4DemoAppPage } from './app.po';

describe('angular4-demo-app App', () => {
  let page: Angular4DemoAppPage;

  beforeEach(() => {
    page = new Angular4DemoAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
