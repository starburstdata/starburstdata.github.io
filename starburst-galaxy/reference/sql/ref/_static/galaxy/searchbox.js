document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector("#searchbox")) {
    return;
  }

  const ALGOLIA_ID = "0X4IAR77M1"; // Algolia ID
  const ALGOLIA_KEY = "b4ad1fa9a2f4742b5c610060b34e87f8"; // Algolia API Key

  const searchClient = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);

  const hitsContainer = document.querySelector("#searchhits-wrapper");
  const articleContainer = document.querySelector(
    "#searchhits-wrapper + .md-container"
  );

  const search = instantsearch({
    indexName: "DocsAll",
    searchClient,
    searchFunction: function (helper) {
      helper.state.facetFilters = [["version:latest"]];
      // if less than 2 character, don't trigger search and hide inner content
      if (helper.state.query.length < 2) {
        hitsContainer.style.display = "none";
        articleContainer.style.display = null;
      } else {
        hitsContainer.style.display = null;
        articleContainer.style.display = "none";
        helper.search();
      }
    },
    searchParameters: {
      facetFilters: [["version:latest"]],
    },
  });

  search.addWidgets([
    instantsearch.widgets.configure({
      attributesToSnippet: ["content"],
      clickAnalytics: true,
      hitsPerPage: 20,
      getRankingInfo: true,
      filters: '(categories.lvl2:"Starburst Galaxy > Sql > Ref")',
    }),

    instantsearch.widgets.searchBox({
      container: "#searchbox",
      showLoadingIndicator: true,
      showReset: true,
      placeholder: "Search SQL documentation",
    }),

    instantsearch.widgets.hits({
      container: "#searchhits",
      templates: {
        item: (hit, bindEvent) => {
          let score = hit._rankingInfo.firstMatchedWord / 1000;
          let url = score === 0 ? hit.url.replace(/#.*$/, "") : hit.url;
          url = url.replace(
            "starburst-galaxy/sql/ref/",
            "starburst-galaxy/sql/ref/galaxyapp/"
          );
          //docs.starburst.io/starburst-galaxy/sql/ref/galaxyapp/functions/binary.html#hex-encoding-functions
          https: return (
            `<a ${bindEvent("click", hit, "hit clicked")} href="` +
            url +
            `">
                <h2>
                  ${instantsearch.highlight({ attribute: "title", hit: hit })}
                </h2>
                ${
                  "<p>" +
                  instantsearch.snippet({ attribute: "content", hit: hit }) +
                  "</p>"
                }
              </a>`
          );
        },
        empty: (results) => {
          return `<div id="noResults" style="padding: 0.5rem;">
                    <h2>We're sorry!</h2>
                    <p>We couldn't find any results for: "${
                      results && results.query
                    }"</p>
                  </div>`;
        },
      },
    }),
  ]);

  search.start();
});
