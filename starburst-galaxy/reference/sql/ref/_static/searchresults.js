document.addEventListener('DOMContentLoaded', function () {
  const resultsContainer = document.querySelector('#search-results');

  // Hijack Sphinx search template container and inject HTML
  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="search-results-content">
        <div id="resultsSearchbox"></div>
        <div class="filter-stats-container">
        <div class="filter-options">
          <div
            class="refinement-list"
            id="versionsRefinementList"
            style="display: none"
          ></div>
          <div class="filter-type-container">
            <h4 style="margin-right: 0.5rem;">Product:</h4>
            <div id="productsRefinementList"></div>
          </div>
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
      const statsContainer = document.querySelector('#resultsStats');
      const refinementsContainer = document.querySelector(
        '.filter-stats-container'
      );

      const queryParameter = new URLSearchParams(window.location.search).get(
        'q'
      );

      const searchResults = instantsearch({
        indexName: 'DocsAll',
        searchClient,
        searchFunction: function (helper) {
          const page = helper.state.page;
          helper.state.facetFilters = [['version:latest']];
          // if less than 2 character, don't trigger search and hide inner content
          if (helper.state.query.length < 2) {
            hitsContainer.style.display = 'none';
            statsContainer.style.display = 'none';
            refinementsContainer.style.display = 'none';
          } else {
            hitsContainer.style.display = 'block';
            statsContainer.style.display = 'flex';
            refinementsContainer.style.display = 'flex';
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
            helper.state.page = page;
            helper.search();
          }
        },
        searchParameters: {
          facetFilters: [['version:latest']],
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
          attributesToSnippet: ['content'],
          clickAnalytics: true,
          getRankingInfo: true,
          filters:
            '(product:sep<score=0> OR product:galaxy<score=1> OR product:all<score=0>)',
        }),

        instantsearch.widgets.searchBox({
          container: '#resultsSearchbox',
          showLoadingIndicator: true,
          showReset: true,
          placeholder: 'Search documentation',
        }),

        instantsearch.widgets.pagination({
          container: '#pagination',
        }),

        instantsearch.widgets.refinementList({
          container: '#versionsRefinementList',
          attribute: 'version',
          sortBy: ['name:desc', 'count:desc'],
        }),

        instantsearch.widgets.refinementList({
          container: '#productsRefinementList',
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
                  <input type="checkbox" ${isRefined ? 'checked' : ''} />
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
          container: '#resultsHits',
          templates: {
            item: (hit, bindEvent) => {
              let score = hit._rankingInfo.firstMatchedWord / 1000;
              let url = score === 0 ? hit.url.replace(/#.*$/, '') : hit.url;
              return (
                `<a ${bindEvent('click', hit, 'Item clicked')} href="` +
                url +
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
