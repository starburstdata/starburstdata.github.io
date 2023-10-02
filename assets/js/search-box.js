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
const productRefinementContainer = document.querySelector('#product-list');
const noResultsContainer = document.querySelector('#noResults');

const search = instantsearch({
  indexName: 'DocsAll',
  searchClient,
  searchFunction: function (helper) {
    helper.state.facetFilters = [['version: latest']];
    // if less than 2 character, don't trigger search and hide inner content
    if (helper.state.query.length < 2) {
      hitsContainer.style.display = 'none';
      statsContainer.style.display = 'none';
      productRefinementContainer.style.display = 'none';
    } else {
      hitsContainer.style.display = 'block';
      statsContainer.style.display = 'flex';
      productRefinementContainer.style.display = 'flex';
      if (
        helper
          .getRefinements('product')
          .find(
            (refinement) =>
              refinement.value === 'sep' || refinement.value === 'galaxy'
          )
      ) {
        helper
          .addDisjunctiveFacetRefinement('product', 'all')
          .addDisjunctiveFacetRefinement('version', 'latest');
      } else {
        helper.clearRefinements('product');
      }
      helper.search();
    }
  },
});

const renderStats = (renderOptions) => {
  const { nbHits, query } = renderOptions;
  if (nbHits > 5) {
    statsContainer.innerHTML = `
      <a href='/searchresults?q=${query}'>View more results</a>
    `;
  } else {
    statsContainer.innerHTML = ``;
  }
};

const customStats = instantsearch.connectors.connectStats(renderStats);

search.addWidgets([
  instantsearch.widgets.configure({
    attributesToSnippet: ['content'],
    clickAnalytics: true,
    hitsPerPage: 5,
    getRankingInfo: true,
    filters:
      '(product:sep<score=1> OR product:galaxy<score=1> OR product:all<score=0>)',
  }),

  instantsearch.widgets.searchBox({
    container: '#searchbox',
    showLoadingIndicator: true,
    showReset: true,
    placeholder: 'Search documentation',
  }),

  instantsearch.widgets.refinementList({
    container: '#versionsRefinementList',
    attribute: 'version',
    sortBy: ['name:desc', 'count:desc'],
  }),

  instantsearch.widgets.refinementList({
    container: '#product-list',
    attribute: 'product',
    sortBy: ['name:desc', 'count:desc'],
    templates: {
      item(item) {
        const { url, label, isRefined } = item;

        return (
          label != 'all' &&
          `<a href="${url}" style="display:flex;gap:0.5rem;align-items:center; ${
            isRefined ? 'font-weight: bold' : ''
          }">
            <input type="checkbox" class="refinement-list-checkbox" ${isRefined ? 'checked' : ''} />
            <span>
            ${
              label == 'sep'
                ? 'Starburst Enterprise'
                : label == 'galaxy'
                ? 'Starburst Galaxy'
                : ''
            }
            </span>
          </a>`
        );
      },
    },
  }),

  // 0 = title
  // 1 = section
  // 2 = url
  // 3 = content

  // hit._rankingInfo.firstMatchedWord / 1000

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, bindEvent) => {
        let score = hit._rankingInfo.firstMatchedWord / 1000;
        let url = score === 0 ? hit.url.replace(/#.*$/, '') : hit.url;

        return (
          `
        <a ${bindEvent('click', hit, 'hit clicked')} href="` +
          url +
          `">
          <h2>
            ${instantsearch.highlight({ attribute: 'title', hit: hit })}
          </h2>
          ${
            '<p>' +
            instantsearch.snippet({ attribute: 'content', hit: hit }) +
            '</p>'
          }
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
        productRefinementContainer.style.display = 'none';
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
