document.addEventListener('DOMContentLoaded', function () {
  const resultsContainer = document.querySelector('#search-results');

  // Hijack Sphinx search template container and inject HTML
  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="search-results-content">
        <div id="resultsSearchbox"></div>
        <div class="filter-stats-container">
        <div class="filter-options">
          <div class="filter-type-container">
            <h4 style="margin-right: 0.5rem;">Filter:</h4>
            <div id="resultsRefinementList"></div>
          </div>
          <div id="toggle-refinement"></div>
        </div>
        </div>
        <div id="resultsStats"></div>
        <div id="resultsHits"></div>
        <div id="pagination"></div>
      </div>
    `;

    function searchResults() {
      const ALGOLIA_ID = '0X4IAR77M1'; // Algolia ID
      const ALGOLIA_KEY = 'b4ad1fa9a2f4742b5c610060b34e87f8'; // Algolia API Key

      const searchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);

      aa('init', {
        appId: ALGOLIA_ID,
        apiKey: ALGOLIA_KEY,
        useCookie: true,
      });

      const hitsContainer = document.querySelector('#resultsHits');
      const filterOptions = document.querySelector('.filter-options');
      const refinementContainer = document.querySelector(
        '.filter-stats-container'
      );

      const queryParameter = new URLSearchParams(window.location.search).get(
        'q'
      );

      const pathName = window.location.pathname;
      const pathArray = pathName.split('/');
      const pathSegment = pathArray[1];

      if (pathSegment == 'latest') {
        document.querySelector('#toggle-refinement').style.display = 'none';
      }

      const searchResults = instantsearch({
        indexName: 'AllDocs',
        searchClient,
        searchFunction: function (helper) {
          helper.state.facetFilters = [
            [`version: ${pathSegment}`, 'type: guides'],
          ];
          // if less than 2 character, don't trigger search and hide inner content
          if (helper.state.query.length < 2) {
            hitsContainer.style.display = 'none';
            refinementContainer.style.display = 'none';
            filterOptions.style.display = 'none';
          } else {
            hitsContainer.style.display = 'block';
            refinementContainer.style.display = 'flex';
            filterOptions.style.display = 'flex';
            helper.search();
          }
        },
        searchParameters: {
          facetFilters: [[`version: ${pathSegment}`, 'type: guides']],
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

        instantsearch.widgets.toggleRefinement({
          container: '#toggle-refinement',
          attribute: 'version',
          on: ['latest'],
          off: [`${pathSegment}`],
          templates: {
            labelText: 'Search latest version',
          },
        }),

        instantsearch.widgets.hits({
          container: '#resultsHits',
          templates: {
            item: (hit, bindEvent) => {
              return (
                `<a ${bindEvent('click', hit, 'Item clicked')} href="` +
                hit.url +
                `"><li class="hit-item">
                      <h2 style="margin-top:0;">
                        ${instantsearch.highlight({
                          attribute: 'title',
                          hit: hit,
                        })}
                      </h2>
                      ${
                        hit['categories.lvl2']
                          ? `<p style="color:#000a2c;">
                            ${hit['categories.lvl2']}
                          </p>`
                          : hit['categories.lvl1']
                          ? `<p style="color:#000a2c;">
                            ${hit['categories.lvl1']}
                          </p>`
                          : hit['categories.lvl0']
                          ? `<p style="color:#000a2c;">
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

      // If a query parameter was passed in the url, show results based on query
      queryParameter &&
        searchResults.setUiState({
          AllDocs: {
            // should match indexName in searchResults()
            query: queryParameter,
          },
        });
    }

    searchResults();
  }
});
