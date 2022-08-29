function searchResults() {
  const resultsSearchBox = document.querySelector('#resultsSearchbox');

  if (resultsSearchBox) {
    const ALGOLIA_ID = '0X4IAR77M1'; // Algolia ID
    const ALGOLIA_KEY = 'b4ad1fa9a2f4742b5c610060b34e87f8'; // Algolia API Key

    const searchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);

    aa('init', {
      appId: ALGOLIA_ID,
      apiKey: ALGOLIA_KEY,
      useCookie: true,
    });

    const hitsContainer = document.querySelector('#resultsHits');
    const statsContainer = document.querySelector('#resultsStats');
    const refinementContainer = document.querySelector(
      '.filter-stats-container'
    );

    const queryParameter = new URLSearchParams(window.location.search).get('q');

    const searchResults = instantsearch({
      indexName: 'AllDocs',
      searchClient,
      searchFunction: function (helper) {
        helper.state.facetFilters = [['version:latest', 'type: guides']];
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
      const { nbHits } = renderOptions;

      document.querySelector('#resultsStats').innerHTML = `
      <p>Found ${nbHits} results</p>`;
    };

    const customStats = instantsearch.connectors.connectStats(renderStats);

    searchResults.addWidgets([
      instantsearch.widgets.configure({
        attributesToSnippet: ['content:50'],
        clickAnalytics: true,
      }),

      instantsearch.widgets.searchBox({
        container: '#resultsSearchbox',
        showLoadingIndicator: true,
        showReset: true,
        placeholder: 'Search documentation',
      }),

      instantsearch.widgets.refinementList({
        container: '#resultsRefinementList',
        attribute: 'type',
        sortBy: ['name:desc', 'count:desc'],
      }),

      instantsearch.widgets.pagination({
        container: '#pagination',
      }),

      instantsearch.widgets.hits({
        container: '#resultsHits',
        templates: {
          item: (hit, bindEvent) => {
            return (
              `<a ${bindEvent('click', hit, 'Item clicked')} href="` +
              hit.url +
              `"><li>
                  <h2>
                    ${instantsearch.highlight({
                      attribute: 'title',
                      hit: hit,
                    })}
                  </h2>
                  ${
                    hit['categories.lvl2']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        ${hit['categories.lvl2']}
                      </p>`
                      : hit['categories.lvl1']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        ${hit['categories.lvl1']}
                      </p>`
                      : hit['categories.lvl0']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        ${hit['categories.lvl0']}
                      </p>`
                      : null
                  }
                  ${
                    hit.content &&
                    `<p>
                  ${instantsearch.snippet({
                    attribute: 'content',
                    hit: hit,
                  })} ...
                  </p>`
                  }
              </li>
              </a>`
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
        container: document.querySelector('#resultsStats'),
      }),
    ]);

    searchResults.use(
      instantsearch.middlewares.createInsightsMiddleware({
        insightsClient: window.aa,
      })
    );

    searchResults.start();

    queryParameter &&
      searchResults.setUiState({
        AllDocs: {
          query: queryParameter,
        },
      });
  }
}

searchResults();
