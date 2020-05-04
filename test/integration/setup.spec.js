const serve = require('@nebula.js/cli-serve'); // eslint-disable-line

if (!process.env.BASE_URL) {
  let s;
  before(async function run() {
    this.timeout(10000);
    s = await serve({
      build: false,
      open: false,
    });

    process.env.BASE_URL = s.url;

    page.on('pageerror', (e) => {
      console.log('Error:', e.message, e.stack);
    });
  });

  after(() => {
    s.close();
  });
}
