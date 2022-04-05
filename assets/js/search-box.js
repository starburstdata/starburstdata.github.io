const ALGOLIA_ID = '0X4IAR77M1'; // Algolia ID
const ALGOLIA_KEY = 'b4ad1fa9a2f4742b5c610060b34e87f8'; // Algolia API Key

// algolia analytics
aa('init', {
  appId: ALGOLIA_ID,
  apiKey: ALGOLIA_KEY,
  useCookie: true,
});

// init algolia search client with credentials
const searchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);

const hitsContainer = document.querySelector('#hits');
const statsContainer = document.querySelector('#stats');
const refinementContainer = document.querySelector('#refinement-list');
const noResultsContainer = document.querySelector('#noResults');

const search = instantsearch({
  indexName: 'AllDocs',
  searchClient,
  searchFunction: function (helper) {
    helper.state.facetFilters = [['version: latest', 'type: guides']];
    // if less than 2 character, don't trigger search and hide inner content
    if (helper.state.query.length < 2) {
      hitsContainer.style.display = 'none';
      statsContainer.style.display = 'none';
      refinementContainer.style.display = 'none';
    } else {
      hitsContainer.style.display = 'block';
      statsContainer.style.display = 'flex';
      refinementContainer.style.display = 'flex';
      helper.search(); // trigger search
    }
  },
  searchParameters: {
    facetFilters: [['version: latest', 'type: guides']],
  },
});

const renderStats = (renderOptions) => {
  const { nbHits, query } = renderOptions;
  if (nbHits > 5) {
    statsContainer.innerHTML = `
      <a href='/searchresults?q=${query}'>View more results</a>
    `;
  } else if (nbHits <= 5) {
    statsContainer.innerHTML = `<a href='/searchresults?q=${query}'>Advanced search</a>`;
  } else if (nbHits == 0) {
    statsContainer.innerHTML = ``;
  }
};

const customStats = instantsearch.connectors.connectStats(renderStats);

search.addWidgets([
  instantsearch.widgets.configure({
    attributesToSnippet: ['content'],
    clickAnalytics: true,
    hitsPerPage: 5,
  }),

  instantsearch.widgets.searchBox({
    container: '#searchbox',
    showLoadingIndicator: true,
    showReset: true,
    placeholder: 'Search documentation',
  }),

  instantsearch.widgets.refinementList({
    container: '#refinement-list',
    attribute: 'type',
    showMore: true,
    sortBy: ['name:desc', 'count:desc'],
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, bindEvent) => {
        return (
          `
        <a ${bindEvent('click', hit, 'hit clicked')} href="` +
          hit.url +
          `">
          <h2>
            ${instantsearch.highlight({ attribute: 'title', hit: hit })}
          </h2>
          <p>
            ${instantsearch.snippet({ attribute: 'content', hit: hit })}
          </p>
          ${
            hit['categories.lvl2']
              ? `<p class="search-breadcrumb">
                ${hit['categories.lvl2']}
              </p>`
              : hit['categories.lvl1']
              ? `<p class="search-breadcrumb">
                ${hit['categories.lvl1']}
              </p>`
              : hit['categories.lvl0']
              ? `<p class="search-breadcrumb">
                ${hit['categories.lvl0']}
              </p>`
              : null
          }
        </a>
        `
        );
      },
      empty: (results) => {
        refinementContainer.style.display = 'none';
        return `<div id="noResults">
              <h2>We're sorry!</h2>
              <p>We couldn't find any results for: "${
                results && results.query
              }"</p>
            </div>`;
      },
    },
  }),

  customStats({
    container: document.querySelector('#stats'),
  }),
]);

search.use(
  instantsearch.middlewares.createInsightsMiddleware({
    insightsClient: window.aa,
  })
);

search.start();
