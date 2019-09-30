describe('interaction', () => {
  const content = '.nebulajs-sn';
  const app = encodeURIComponent(process.env.APP_ID || '/apps/Executive_Dashboard.qvf');
  beforeEach(async () => {
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
    let tooltipValue = await page.$$eval('.pic-tooltip-content tr', values => values.map(v => v.textContent));
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(['Europe', ['Share:14.3%', '=1:3']]);
    // hover "Americas, 2012"
    tooltipContent = [];
    const rects = await page.$$('[data-key="cells"] rect[data-label="2012"]');
    await rects[1].hover();
    await page.waitForSelector('.pic-tooltip', { visible: true });
    tooltiphHeader = await page.$eval('.pic-tooltip-content th', header => header.textContent);
    tooltipValue = await page.$$eval('.pic-tooltip-content tr', values => values.map(v => v.textContent));
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(['Americas, 2012', ['Share:33.3%', '=1:1', 'Fiscal Year:2012']]);
  });
  it('should select "2011" in the legend', async () => {
    await page.waitForSelector('[data-key="color-legend-cat"] [data-label="2011"]', { visible: true });
    await page.click('[data-key="color-legend-cat"] [data-label="2011"]');
    await page.click('button[title="Confirm selection"]');

    const dataCellRects = await page.$$eval('[data-key="cells"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));
    const legendRects = await page.$$eval('[data-key="color-legend-cat"] rect[data-label]', sel => sel.map(r => r.getAttribute('data-label')));

    expect(dataCellRects).to.eql(['2011', '2011', '2011', '2011', '2011', '2011', '2011']);
    expect(legendRects).to.eql(['2011']);
  });
});
