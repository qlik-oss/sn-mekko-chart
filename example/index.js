(function run() {
  function connect() {
    const schemaPromise = fetch('https://unpkg.com/enigma.js/schemas/3.2.json').then(response => response.json());

    const openDoc = appId => schemaPromise.then(schema => window.enigma.create({
      schema,
      url: `ws://${window.location.hostname || 'localhost'}:9076/app/${encodeURIComponent(appId)}`,
    }).open().then(qix => qix.openDoc(appId)));

    return openDoc;
  }

  connect()('/apps/Executive_Dashboard.qvf').then((app) => {
    // configure nucleus
    const nuked = window.nucleus(app, {
      context: { theme: 'light' },
      types: [{
        name: 'mekko',
        load: () => Promise.resolve(window['sn-mekko-chart']),
      }],
    });

    nuked.selections().then(s => s.mount(document.querySelector('.toolbar')));

    // create a session object
    nuked.create({
      type: 'mekko',
      fields: ['Region', 'Product Group Desc', '=Sum([Sales Quantity]*[Sales Price])'],
    }, {
      element: document.querySelector('.object'),
    });

    // create another session object
    nuked.create({
      type: 'mekko',
      fields: ['Region', 'Fiscal Year', '=Sum([Sales Quantity]*[Sales Price])'],
    }, {
      element: document.querySelectorAll('.object')[1],
    });
  });
}());
