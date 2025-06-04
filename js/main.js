
const defaulltURL = `data/development-financing-institutions-lac`

const datasets = [
  {
    id:0,
    title: "Multilateral Development Banks Data",
    path: `${defaulltURL}/LAC_MDBS.csv`,
    urls:[
      {
      title:"Database DOI ",
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
      title:`Xu, Jiajun, Régis Marodon, Xinshun Ru, Xiaomeng Ren, and Xinyue Wu. 2021. “What are Public Development Banks and Development Financing Institutions?——Qualification Criteria, Stylized Facts and Development Trends.” China Economic Quarterly International, volume 1, issue 4: 271-294 DOI: `,
      link:"https://doi.org/10.1016/j.ceqi.2021.10.001"
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
    title: "Public Procurement Spending in LAC",
    path: "data/prublic procurement and spending/public spending in LAC.csv",
    urls:[
      {
      title:`Source: CEPALSTAT – Economic Commission for Latin America and the Caribbean (ECLAC). "Government Operations (Economic Classification), as a Percentage of GDP`,
      link:"https://statistics.cepal.org/portal/databank/index.html?lang=en&indicator_id=1246&area_id=482&members=216%2C10697%2C10658%2C10698%2C10696%2C10699%2C10675%2C10676%2C10674%2C29160%2C29161%2C29162%2C29163%2C29164%2C29165%2C29166%2C29167%2C29168%2C29169%2C29170%2C29171%2C29172%2C29173%2C29174%2C29175%2C29176%2C29177%2C29178%2C29179%2C29180%2C29181%2C29182%2C29183%2C29184%2C29185%2C29186%2C29187%2C29188%2C29189%2C29190",
      },
      {
      title:`United Nations Statistics Division. "National Accounts Main Aggregates Database – Basic Data Selection.`,
      link:"https://unstats.un.org/unsd/snaama/Basic"
      }
    ]
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




