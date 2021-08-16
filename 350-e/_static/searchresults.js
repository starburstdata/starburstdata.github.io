document.addEventListener('DOMContentLoaded', function () {
  const resultsContainer = document.querySelector('#search-results');

  // Hijack Sphinx search template container and inject HTML
  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="search-results-content">
        <div id="resultsSearchbox"></div>
        <div class="filter-stats-container">
          <div class="filter-options">
            <h3>Filter:</h3>
            <div id="resultsRefinementList"></div>
          </div>
          <div id="resultsStats"></div>
        </div>
        <div id="resultsHits"></div>
        <div id="pagination"></div>
      </div>
    `;

    function searchResults() {
      const searchClient = algoliasearch(
        '0X4IAR77M1', // Algolia ID
        'b4ad1fa9a2f4742b5c610060b34e87f8' // Algolia Key
      );

      const hitsContainer = document.querySelector('#resultsHits');
      const refinementContainer = document.querySelector(
        '.filter-stats-container'
      );

      const pathName = window.location.pathname;
      const pathPort = window.location.port;
      const pathArray = pathName.split('/');
      const pathSegment = pathArray[1];

      const searchResults = instantsearch({
        indexName: 'AllDocs',
        searchClient,
        searchFunction: function (helper) {
          helper.state.facetFilters = [
            [pathPort == '9080' ? 'version: latest' : `version:${pathSegment}`, 'type: guides'],
          ];
          // if less than 2 character, don't trigger search and hide inner content
          if (helper.state.query.length < 2) {
            hitsContainer.style.display = 'none';
            refinementContainer.style.display = 'none';
          } else {
            hitsContainer.style.display = 'block';
            refinementContainer.style.display = 'flex';
            helper.search();
          }
        },
        searchParameters: {
          facetFilters: [
            [pathPort == '9080' ? 'version: latest' : `version:${pathSegment}`, 'type: guides'],
          ],
        },
      });

      const renderHits = (renderOptions) => {
        const { hits, widgetParams } = renderOptions;

        widgetParams.container.innerHTML = `
      <ul class="search-hits">
        ${hits
          .map(
            (item) =>
              `<a href="${item.url}"><li class="hit-item">
                  <h2>
                    ${instantsearch.highlight({
                      attribute: 'title',
                      hit: item,
                    })}
                  </h2>
                  ${
                    item['categories.lvl2']
                      ? `<p style="color:#000a2c; font-size: 0.7rem; font-weight: 600; margin-top: 0; margin-bottom: -0.5em;">
                        ${item['categories.lvl2']}
                      </p>`
                      : item['categories.lvl1']
                      ? `<p style="color:#000a2c; font-size: 0.7rem; font-weight: 600; margin-top: 0; margin-bottom: -0.5em;">
                        ${item['categories.lvl1']}
                      </p>`
                      : item['categories.lvl0']
                      ? `<p style="color:#000a2c; font-size: 0.7rem; font-weight: 600; margin-top: 0; margin-bottom: -0.5em;">
                        ${item['categories.lvl0']}
                      </p>`
                      : null
                  }
                  ${
                    item.content &&
                    `<p>
                  ${instantsearch.snippet({
                    attribute: 'content',
                    hit: item,
                  })} ...
                  </p>`
                  }
              </li>
              </a>
              `
          )
          .join('')}
      </ul>
    `;
      };

      const renderStats = (renderOptions) => {
        const { nbHits } = renderOptions;

        document.querySelector('#resultsStats').innerHTML = `
      <p>Found ${nbHits} results</p>`;
      };

      const customHits = instantsearch.connectors.connectHits(renderHits);
      const customStats = instantsearch.connectors.connectStats(renderStats);

      searchResults.addWidgets([
        instantsearch.widgets.configure({
          attributesToSnippet: ['content:50'],
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
          showMore: true,
          sortBy: ['name:desc', 'count:desc'],
        }),

        instantsearch.widgets.pagination({
          container: '#pagination',
        }),

        customHits({
          container: document.querySelector('#resultsHits'),
        }),

        customStats({
          container: document.querySelector('#resultsStats'),
        }),
      ]);

      searchResults.start();

      const queryParameter = new URLSearchParams(window.location.search).get(
        'q'
      );

      // If a query parameter was passed in the url, show results based on query
      queryParameter &&
        searchResults.setUiState({
          AllDocs: {
            query: queryParameter,
          },
        });
    }

    searchResults();
  }
});
