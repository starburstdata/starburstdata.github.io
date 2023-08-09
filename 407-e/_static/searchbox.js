document.addEventListener('DOMContentLoaded', function () {
  const ALGOLIA_ID = '0X4IAR77M1'; // Algolia ID
  const ALGOLIA_KEY = 'b4ad1fa9a2f4742b5c610060b34e87f8'; // Algolia API Key

  aa('init', {
    appId: ALGOLIA_ID,
    apiKey: ALGOLIA_KEY,
    useCookie: true,
  });

  const searchClient = algoliasearch(
    ALGOLIA_ID, // Algolia ID
    ALGOLIA_KEY // Algolia Key
  );

  const hitsContainer = document.querySelector('#hits');
  const statsContainer = document.querySelector('#stats');
  const refinementContainer = document.querySelector('#refinement-list');

  const pathName = window.location.pathname;
  const pathArray = pathName.split('/');
  const searchSegment = pathArray[1];
  let pathSegment = pathArray[1];
  //Retrieve all versions supported by Algolia
  const allDocsIndex = searchClient.initIndex('AllDocs');
  let versions = [];
  allDocsIndex
    .search('', {
      facets: ['version'],
    })
    .then((res) => {
      versions = Object.keys(res.facets.version);
      if (!versions.includes(pathSegment)) {
        pathSegment = 'latest'; //Defaults to latest if version is not supported
      }

      const search = instantsearch({
        indexName: 'AllDocs',
        searchClient,
        searchFunction: function (helper) {
          helper.state.facetFilters = [[`version:${pathSegment}`, 'type: guides']];
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
          facetFilters: [[`version:${pathSegment}`, 'type: guides']],
        },
      });

      const renderStats = (renderOptions) => {
        const { nbHits, query } = renderOptions;

        if (nbHits > 5) {
          document.querySelector('#stats').innerHTML = `
          <a href='/${searchSegment}/search.html?q=${query}' class="view-more-button">View more results</a>
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
                `<li class="hit-item">
              <a ${bindEvent('click', hit, 'hit clicked')} href="` +
                hit.url +
                `">
                <h2>
                  ${instantsearch.highlight({ attribute: 'title', hit: hit })}
                </h2>
                <p>
                  ${instantsearch.snippet({ attribute: 'content', hit: hit })}
                </p>
                ${hit['categories.lvl2']
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
              refinementContainer.style.display = 'none';
              return `<div id="noResults">
                    <h2>We're sorry!</h2>
                    <p>We couldn't find any results for: "${results && results.query
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

      document.addEventListener('keydown', event => {
        const searchInput = document.querySelector('.ais-SearchBox-input').value;

        if (searchInput && event.key == 'Enter') {
          if (document.activeElement == document.querySelector('.ais-SearchBox-input')) {
            window.location.href = "/" + searchSegment + "/search.html?q=" + searchInput;
          }
        }
      })
    });
});
