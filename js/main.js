
const defaulltURL = `data/development-financing-institutions-lac`

const defaultURL = "https://github.com/Tech-Jobs-International/public-data-repo/tree/main/data";
const datasets = [
  {
    id:0,
    title: "Multilateral Development Banks Data",
    path: `${defaulltURL}/LAC_MDBS.csv`,
    urls:[
      {
      title:"Xu, Jiajun, et al. 2021. “Public Development Banks Dataset.” Harvard Dataverse.",
      link:`https://doi.org/10.18170/DVN/VLG6SN`
      }
    ]
  },
  {
    id:1,
    title: "National Development Bank Data",
    path: `${defaulltURL}/LAC_NDBS.csv`,
    urls:[
     {
      title:`Xu, Jiajun, et al. 2021. “Public Development Banks Dataset.” Harvard Dataverse.`,
      link:"https://doi.org/10.18170/DVN/VLG6SN"
     }
    ]
  },
  {
    id:2,
    title: "Sovereign Wealth Fund Data",
    path: `${defaulltURL}/LAC_SWF.csv`,
  },
  {
    id:3,
    title: "Public Spending in LAC",
    path: "data/prublic procurement and spending/public spending in LAC.csv",
    urls:[
      {
      title:`Economic Commission for Latin America and the Caribbean (ECLAC). "Government Operations (Economic Classification), as a Percentage of GDP." CEPALSTAT`,
      link:"https://statistics.cepal.org/portal/databank/index.html?indicator_id=1246&lang=en",
      },
      {
      title:`United Nations Statistics Division. "National Accounts Main Aggregates Database – Basic Data Selection`,
      link:"https://unstats.un.org/unsd/snaama/Basic"
      }
    ],
   refrence:`Public Spending Value as a product of 
(1) GDP (source: United Nations Statistics Division, "National Accounts Main Aggregates Database – Basic Data Selection") and 
(2) Public Spending as a percentage of GDP (source: Economic Commission for Latin America and the Caribbean (ECLAC), "Government Operations (Economic Classification), as a Percentage of GDP," CEPALSTAT).`
  }
];






let table;
const noResultsMsg = document.getElementById("no-results");
const tableFooter = document.getElementById("table-footer");


// Helper: Decode malformed characters
function decodeText(text) {
    try {
      return decodeURIComponent(escape(text));
    } catch {
      return text;
    }
  }
  
  // Formatter for clickable links & tooltips
  function enhancedFormatter(cell) {
    const value = cell.getValue();
    const decoded = decodeText(value);
    const urlPattern = /^(http|https):\/\/[^\s]+$/;
  
    if (urlPattern.test(decoded)) {
      return `<a href="${decoded}" target="_blank" style="color:#49d94b; text-decoration:underline;">${decoded}</a>`;
    }
  
    return decoded;
  }
  
  function renderFooterLink(urls) {
    tableFooter.innerHTML = ""; // Clear previous content
  
    if (urls) {
    for(let i =0; i < urls.length; i ++){
      const anchor = document.createElement("a");
      anchor.href = urls[i]?.link;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = urls[i].title
      anchor.style.cssText =
        "color: #49d94b; text-decoration: underline; display: inline-block; margin-top: 1rem;";
      tableFooter.appendChild(anchor);
    }
    }
  }
  


// Initialize table after DOM load
async function loadDataset(dataset) {

  document.getElementById("dataset-title").textContent = dataset.title;
    try {
      const response = await fetch(dataset?.path);
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("windows-1252");
      const csvText = decoder.decode(buffer);
  
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
  
          const columns = Object.keys(data[0] || {}).map((key, index) => ({
            title: key.replace(/_/g, ' '),
            field: key,
            formatter: enhancedFormatter,
            tooltip: true,
            hozAlign: "left",
            headerSort: true,
            headerTooltip: true,
          }));

          if (table) table.destroy(); // remove old table
  
          table = new Tabulator("#table-container", {
            data,
            columns,
            layout: "fitColumns",
            responsiveLayout: "scroll",
            pagination: "local",
            paginationSize: 10,
            tooltips: true,
            movableColumns: true,
          });

          renderFooterLink(dataset.urls);
        },
      });
    } catch (error) {
      console.error("Failed to load and parse CSV:", error);
    }

}



// Render Tabs
function initTabs() {
  const tabsContainer = document.getElementById("tabs");
  datasets.forEach((dataset, index) => {
    const tab = document.createElement("button");
    tab.textContent = dataset.title;
    tab.className = `tab ${index === 0 ? 'active-tab' : ''}`;
    tab.addEventListener("click", () => {
      document.querySelectorAll("#tabs button").forEach(btn => btn.classList.remove("active-tab", "font-bold"));
      tab.classList.add("active-tab", "font-bold");
      loadDataset(dataset)
    });
    tabsContainer.appendChild(tab);
  });

  loadDataset(datasets[0]); // Load first tab by default
}

initTabs();




// Download CSV button
document.getElementById("download-csv").addEventListener("click", function () {
  if (table) table.download("csv", "exported-data.csv");
});

// Global Search
document.getElementById("search-input").addEventListener("keyup", function () {
      const query = this.value.toLowerCase();
      table.setFilter((rowData) =>
        Object.values(rowData).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );

          // Delay to ensure filtering is applied before checking
    setTimeout(() => {
        const visibleRows = table.getDataCount("active"); // only rows after filter
        if (visibleRows === 0) {
          noResultsMsg.style.display = "block";
        } else {
          noResultsMsg.style.display = "none";
        }
      }, 100);
  
});




