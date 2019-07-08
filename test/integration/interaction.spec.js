describe('interaction', () => {
  const content = '.nebulajs-sn';
  it('should select "Americas, Europe" and "2012"', async () => {
    const app = encodeURIComponent(process.env.APP_ID || '/apps/Executive_Dashboard.qvf');
    await page.goto(`${process.testServer.url}/render/app/${app}?cols=Region,Fiscal Year,=1&permissions=interact,select`);
    await page.waitForSelector(content, {
      timeout: 5000,
    });
    await page.click('[data-key="span-boxes"] rect[data-label="Americas"]');
    await page.click('[data-key="span-boxes"] rect[data-label="Europe"]');
    await page.click('button[title="Confirm selection"]');

    let rects = await page.$$eval('[data-key="span-boxes"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));
    expect(rects).to.eql(['Americas', 'Europe']);

    await page.click('[data-key="cells"] rect[data-label="2012"]');
    await page.click('button[title="Confirm selection"]');

    rects = await page.$$eval('[data-key="cells"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));
    expect(rects).to.eql(['2012', '2012']);
  });
});
