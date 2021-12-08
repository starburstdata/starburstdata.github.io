function searchResults() {
  const resultsSearchBox = document.querySelector('#resultsSearchbox');

  if (resultsSearchBox) {
    const searchClient = algoliasearch(
      '0X4IAR77M1', // Algolia ID
      'b4ad1fa9a2f4742b5c610060b34e87f8' // Algolia Key
    );

    const hitsContainer = document.querySelector('#resultsHits');
    const statsContainer = document.querySelector('#resultsStats');
    const refinementContainer = document.querySelector(
      '.filter-stats-container'
    );
    const versionContainer = document.querySelector('#versionRefinementList');

    const queryParameter = new URLSearchParams(window.location.search).get('q');

    const searchResults = instantsearch({
      indexName: 'AllDocs',
      searchClient,
      searchFunction: function (helper) {
        // if less than 2 character, don't trigger search and hide inner content
        if (helper.state.query.length < 2) {
          hitsContainer.style.display = 'none';
          statsContainer.style.display = 'none';
          refinementContainer.style.display = 'none';
          versionContainer.style.display = 'none';
        } else {
          hitsContainer.style.display = 'block';
          statsContainer.style.display = 'flex';
          refinementContainer.style.display = 'flex';
          versionContainer.style.display = 'flex';
          helper.search(); // trigger search
        }
      },
    });

    const renderHits = (renderOptions) => {
      const { hits, results, widgetParams } = renderOptions;
      if (hits.length > 0) {
        widgetParams.container.innerHTML = `
      <ul class="search-hits">
        ${hits
          .map(
            (item) =>
              ` <a href="` +
              item.url +
              `"><li class="hit-item">
                  <h2>
                    ${instantsearch.highlight({
                      attribute: 'title',
                      hit: item,
                    })}
                  </h2>
                  ${
                    item['categories.lvl2']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        ${item['categories.lvl2']}
                      </p>`
                      : item['categories.lvl1']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        ${item['categories.lvl1']}
                      </p>`
                      : item['categories.lvl0']
                      ? `<p style="color:#b835a1; font-size: 0.85rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
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
      } else {
        widgetParams.container.innerHTML = `<div id="noResults">
          <h2>We're sorry!</h2>
          <p>We couldn't find any results for: "${results && results.query}"</p>
        </div>`;
      }
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
        sortBy: ['version:desc'],
      }),

      instantsearch.widgets.refinementList({
        container: '#resultsRefinementList',
        attribute: 'type',
        showMore: true,
        searchableEscapeFacetValues: false,
        sortBy: ['name:desc', 'count:desc'],
      }),

      instantsearch.widgets.menuSelect({
        container: '#versionRefinementList',
        attribute: 'version',
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

    queryParameter &&
      searchResults.setUiState({
        AllDocs: {
          query: queryParameter,
        },
      });
  }
}

searchResults();
