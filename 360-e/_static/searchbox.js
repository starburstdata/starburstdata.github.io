document.addEventListener('DOMContentLoaded', function () {
  const searchClient = algoliasearch(
    '0X4IAR77M1', // Algolia ID
    'b4ad1fa9a2f4742b5c610060b34e87f8' // Algolia Key
  );

  const hitsContainer = document.querySelector('#hits');
  const statsContainer = document.querySelector('#stats');
  const refinementContainer = document.querySelector('#refinement-list');

  const pathName = window.location.pathname;
  const pathArray = pathName.split('/');
  const pathSegment = pathArray[1];

  const search = instantsearch({
    indexName: 'AllDocs',
    searchClient,
    searchFunction: function (helper) {
      helper.state.facetFilters = [
        [`version:${pathSegment}`, 'type: guides'],
      ];
      // if less than 2 character, don't trigger search and hide inner content
      if (helper.state.query.length < 2) {
        hitsContainer.style.display = 'none';
        statsContainer.style.display = 'none';
        refinementContainer.style.display = 'none';
      } else {
        hitsContainer.style.display = 'block';
        statsContainer.style.display = 'flex';
        refinementContainer.style.display = 'flex';
        helper.search();
      }
    },
    searchParameters: {
      facetFilters: [
        [`version:${pathSegment}`, 'type: guides'],
      ],
    },
  });

  const renderHits = (renderOptions) => {
    const { hits, widgetParams } = renderOptions;

    widgetParams.container.innerHTML = `<ul class="search-hits">
      ${hits
        .map(
          (item) =>
            `<li class="hit-item">
              <a href="${item.url}">
                <h2>
                  ${instantsearch.highlight({ attribute: 'title', hit: item })}
                </h2>
                ${
                  item.content &&
                  `<p>
                  ${instantsearch.snippet({ attribute: 'content', hit: item })}
                </p>`
                }
                ${
                  item['categories.lvl2']
                    ? `<p class="search-breadcrumb">
                      ${item['categories.lvl2']}
                    </p>`
                    : item['categories.lvl1']
                    ? `<p class="search-breadcrumb">
                      ${item['categories.lvl1']}
                    </p>`
                    : item['categories.lvl0']
                    ? `<p class="search-breadcrumb">
                      ${item['categories.lvl0']}
                    </p>`
                    : null
                }
              </a>
            </li>
            `
        )
        .join('')}
    </ul>`;
  };

  const renderStats = (renderOptions) => {
    const { nbHits, query } = renderOptions;

    if (nbHits > 5) {
      document.querySelector('#stats').innerHTML = `
      <a href='/${pathSegment}/search.html?q=${query}' class="view-more-button">View more results</a>
    `;
    } else {
      document.querySelector('#stats').innerHTML = ``;
    }
  };

  const customHits = instantsearch.connectors.connectHits(renderHits);
  const customStats = instantsearch.connectors.connectStats(renderStats);

  search.addWidgets([
    instantsearch.widgets.configure({
      attributesToSnippet: ['content'],
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

    customHits({
      container: document.querySelector('#hits'),
    }),

    customStats({
      container: document.querySelector('#stats'),
    }),
  ]);

  search.start();
});
