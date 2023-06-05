const devices = require("../../node_modules/puppeteer-core/DeviceDescriptors");

const selectors = {
  columnLabels: (value) => `[data-key="column-boxes"] rect[data-label${value ? `="${value}"` : ""}]`,
  cellLabels: (value) => `[data-key="cells"] rect[data-label${value ? `="${value}"` : ""}]`,
  legendLabels: (value) => `[data-key="color-legend-cat"] rect[data-label${value ? `="${value}"` : ""}]`,
  confirm: 'button[title="Confirm selection"]',
};

const getLabels = (sel) => sel.map((r) => r.getAttribute("data-label"));

describe("interaction", () => {
  const content = '.njs-viz[data-render-count="1"]';
  const app = encodeURIComponent(process.env.APP_ID || "/apps/Executive_Dashboard.qvf");

  beforeEach(async () => {
    await page.goto(`${process.env.BASE_URL}/render/?app=${app}&render-config=x`);
    await page.waitForSelector(content, {
      timeout: 5000,
    });
  });

  it('should select "Americas, Europe" and "2012"', async function run() {
    this.timeout(10000);
    await page.click(selectors.columnLabels("Americas"));
    await page.click(selectors.columnLabels("Europe"));
    await page.waitForSelector(`${selectors.confirm}:not([disabled])`, {
      visible: true,
    });
    await page.click(selectors.confirm);
    await page.waitForSelector(selectors.columnLabels("Asia"), {
      hidden: true,
    });

    let rects = await page.$$eval(selectors.columnLabels(), getLabels);
    expect(rects).to.eql(["Americas", "Europe"]);

    await page.click(selectors.cellLabels("2012"));

    await page.waitForSelector(`${selectors.confirm}:not([disabled])`, {
      visible: true,
    });
    await page.click(selectors.confirm);

    await page.waitForSelector(selectors.cellLabels("2013"), { hidden: true });

    rects = await page.$$eval(selectors.cellLabels(), getLabels);
    expect(rects).to.eql(["2012", "2012"]);
  });

  it('should show tooltip for column "Europe" and data cell "Americas 2012"', async () => {
    // hover column "Europe"
    await page.hover(selectors.columnLabels("Europe"));
    await page.waitForSelector(".pic-tooltip", { visible: true });
    let tooltipContent = [];
    let tooltiphHeader = await page.$eval(".pic-tooltip-content th", (header) => header.textContent);
    let tooltipValue = await page.$$eval(".pic-tooltip-content tr", (values) => values.map((v) => v.textContent));
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(["Europe", ["Share:14.3%", "=1:3"]]);
    // hover "Americas, 2012"
    tooltipContent = [];
    const rects = await page.$$(selectors.cellLabels("2012"));
    await rects[1].hover();
    await page.waitForSelector(".pic-tooltip", { visible: true });
    tooltiphHeader = await page.$eval(".pic-tooltip-content th", (header) => header.textContent);
    tooltipValue = await page.$$eval(".pic-tooltip-content tr", (values) => values.map((v) => v.textContent));
    tooltipContent.push(tooltiphHeader, tooltipValue);
    expect(tooltipContent).to.eql(["Americas, 2012", ["Share:33.3%", "=1:1", "Fiscal Year:2012"]]);
  });

  it('should select "2011" in the legend', async function run() {
    this.timeout(10000);
    await page.waitForSelector(selectors.legendLabels("2011"), {
      visible: true,
    });
    await page.click(selectors.legendLabels("2011"));

    await page.waitForSelector(`${selectors.confirm}:not([disabled])`, {
      visible: true,
    });
    await page.click(selectors.confirm);

    await page.waitForSelector(selectors.legendLabels("2012"), {
      hidden: true,
    });

    const dataCellRects = await page.$$eval(selectors.cellLabels(), getLabels);
    const legendRects = await page.$$eval(selectors.legendLabels(), getLabels);

    expect(dataCellRects).to.eql(["2011", "2011", "2011", "2011", "2011", "2011", "2011"]);
    expect(legendRects).to.eql(["2011"]);
  });

  it('should tap to select column "Europe" and data cells "2012" and "2013"', async function run() {
    this.timeout(10000);
    await page.emulate(devices.iPad);

    await page.waitForSelector(selectors.columnLabels(), { visible: true });
    await page.tap(selectors.columnLabels("Europe"));

    await page.waitForSelector(`${selectors.confirm}:not([disabled])`, {
      visible: true,
    });
    await page.tap(selectors.confirm);

    await page.waitForSelector(selectors.columnLabels("Asia"), {
      hidden: true,
    });

    let rects = await page.$$eval(selectors.columnLabels(), getLabels);
    expect(rects).to.eql(["Europe"]);

    await page.tap(selectors.cellLabels("2012"));
    await page.tap(selectors.cellLabels("2013"));

    await page.waitForSelector(`${selectors.confirm}:not([disabled])`, {
      visible: true,
    });
    await page.tap(selectors.confirm);

    await page.waitForSelector(selectors.cellLabels("2011"), { hidden: true });

    rects = await page.$$eval(selectors.cellLabels(), getLabels);
    expect(rects).to.eql(["2012", "2013"]);
  });
});
