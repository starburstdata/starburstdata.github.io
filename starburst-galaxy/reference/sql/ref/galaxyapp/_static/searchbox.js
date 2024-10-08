document.addEventListener('DOMContentLoaded', function () {
  const ALGOLIA_ID = '0X4IAR77M1'; // Algolia ID
  const ALGOLIA_KEY = '591d39ef5124b1813557f8e7f123cbd1'; // Algolia API Key

  aa('init', {
    appId: ALGOLIA_ID,
    apiKey: ALGOLIA_KEY,
    useCookie: true,
  });

  const searchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);

  const hitsContainer = document.querySelector('#hits');
  const statsContainer = document.querySelector('#stats');
  const productRefinementContainer = document.querySelector('#product-list');

  const search = instantsearch({
    indexName: 'DocsAll',
    searchClient,
    searchFunction: function (helper) {
      helper.state.facetFilters = [['version:latest']];
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
    searchParameters: {
      facetFilters: [['version:latest']],
    },
  });

  const renderStats = (renderOptions) => {
    const { nbHits, query } = renderOptions;

    if (nbHits > 5) {
      document.querySelector('#stats').innerHTML = `
      <a href='/starburst-galaxy/reference/sql/ref/search.html?q=${query}' class="view-more-button">View more results</a>
    `;
    } else {
      document.querySelector('#stats').innerHTML = ``;
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
        '(product:sep<score=0> OR product:galaxy<score=1> OR product:all<score=0>)',
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
            `<a href="${url}" style="display:flex;gap:0.25rem;font-size:16px;color:#000;line-height:1;align-items:center; ${
              isRefined ? 'font-weight: bold' : ''
            }">
              <input type="checkbox" class="refinement-list-checkbox" ${
                isRefined ? 'checked' : ''
              } />
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

    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: (hit, bindEvent) => {
          let score = hit._rankingInfo.firstMatchedWord / 1000;
          let url = score === 0 ? hit.url.replace(/#.*$/, '') : hit.url;

          return (
            `<li class="hit-item">
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
            </li>
            `
          );
        },
        empty: (results) => {
          productRefinementContainer.style.display = 'none';
          return `<div id="noResults" style="padding: 0.5rem;">
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

  document.addEventListener('keydown', (event) => {
    const searchInput = document.querySelector('.ais-SearchBox-input').value;

    if (searchInput && event.key == 'Enter') {
      if (
        document.activeElement == document.querySelector('.ais-SearchBox-input')
      ) {
        window.location.href =
          '/starburst-galaxy/reference/sql/ref/search.html?q=' + searchInput;
      }
    }
  });
});
