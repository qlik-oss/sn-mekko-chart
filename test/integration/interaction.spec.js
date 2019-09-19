describe('interaction', () => {
  const content = '.nebulajs-sn';
  before(async () => {
    const app = encodeURIComponent(process.env.APP_ID || '/apps/Executive_Dashboard.qvf');
    await page.goto(`${process.testServer.url}/render/app/${app}?cols=Region,Fiscal Year,=1&permissions=interact,select,passive`);
    await page.waitForSelector(content, {
      timeout: 5000,
    });
  });
  it('should select "Americas, Europe" and "2012"', async () => {
    await page.click('[data-key="column-boxes"] rect[data-label="Americas"]');
    await page.click('[data-key="column-boxes"] rect[data-label="Europe"]');
    await page.click('button[title="Confirm selection"]');

    let rects = await page.$$eval('[data-key="column-boxes"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));
    expect(rects).to.eql(['Americas', 'Europe']);

    await page.click('[data-key="cells"] rect[data-label="2012"]');
    await page.click('button[title="Confirm selection"]');

    rects = await page.$$eval('[data-key="cells"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));
    expect(rects).to.eql(['2012', '2012']);
  });
  it('should show tooltip for column "Europe" and data cell "Americas 2012"', async () => {
    // hover column "Europe"
    await page.hover('[data-key="column-boxes"] rect[data-label="Europe"]');
    await page.waitForSelector('.pic-tooltip', { visible: true });
    let tooltipContent = [];
    let tooltiphHeader = await page.$eval('.pic-tooltip-content th', header => header.textContent);
    let tooltipValue = await page.$eval('.pic-tooltip-content tr', value => value.textContent);
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(['Europe', '=1:1']);
    // hover "Americas, 2012" */
    tooltipContent = [];
    await page.hover('[data-key="cells"] rect[data-label="2012"]');
    await page.waitForSelector('.pic-tooltip', { visible: true });
    tooltiphHeader = await page.$eval('.pic-tooltip-content th', header => header.textContent);
    tooltipValue = await page.$eval('.pic-tooltip-content tr', value => value.textContent);
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(['Americas, 2012', '=1:100.00%']);
  });
});
