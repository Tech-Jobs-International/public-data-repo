


const defaultURL = "https://raw.githubusercontent.com/Tech-Jobs-International/public-data-repo/main/data";
const datasets = [
  {
    id:0,
    title: "Multilateral Development Banks Data",
    path: `${defaultURL}/development-financing-institutions-lac/LAC_MDBS.csv`,
    refrence:`
    <div>
     Xu, Jiajun, and Régis Marodon. 2023. <em>"Public Development Banks and Development Financing Institutions Database." </em>
     Peking University Open Research Data Platform. 
     <a href="https://doi.org/10.18170/DVN/VLG6SN" target="_blank">https://doi.org/10.18170/DVN/VLG6SN.</a>
    </div>
    `
  },
  {
    id:1,
    title: "National Development Bank Data",
    path: `${defaultURL}/development-financing-institutions-lac/LAC_NDBS.csv`,
    refrence:`
    <div>
     Xu, Jiajun, and Régis Marodon. 2023. <em>"Public Development Banks and Development Financing Institutions Database." </em>
     Peking University Open Research Data Platform. 
     <a href="https://doi.org/10.18170/DVN/VLG6SN" target="_blank">https://doi.org/10.18170/DVN/VLG6SN.</a>
    </div>
    `
  },
  {
    id:2,
    title: "Sovereign Wealth Fund Data",
    path: `${defaultURL}/development-financing-institutions-lac/LAC_SWF.csv`,
    refrence:`
    <div>
     Barbary, Victoria, and Patrick J. Schena. 2023. <em> Can Regional Sovereign Wealth Funds Expand and Grow in Latin America? </em>
     London: International Forum of Sovereign Wealth Funds; Medford, MA: The Fletcher School of Law and Diplomacy, Tufts University; Bogotá: Fondo Latinoamericano de Reservas. 
     <a href="https://ifswf.org/can-regional-sovereign-wealth-funds-expand-and-grow-latin-america" target="_blank">https://ifswf.org/can-regional-sovereign-wealth-funds-expand-and-grow-latin-america</a>
    </div>
    `
  },
  {
    id:3,
    title: "Public Spending in LAC",
    path: `${defaultURL}/prublic procurement and spending/public spending in LAC.csv`,
    // urls:[
    //   {
    //   title:`Economic Commission for Latin America and the Caribbean (ECLAC). "Government Operations (Economic Classification), as a Percentage of GDP." CEPALSTAT`,
    //   link:"https://statistics.cepal.org/portal/databank/index.html?indicator_id=1246&lang=en",
    //   },
    //   {
    //   title:`United Nations Statistics Division. "National Accounts Main Aggregates Database – Basic Data Selection`,
    //   link:"https://unstats.un.org/unsd/snaama/Basic"
    //   }
    // ],
    refrence:`
    <div>
    Public Spending Value as a product of <br/>
    <p>(1) GDP (source: <a href="https://unstats.un.org/unsd/snaama/Basic" target="_blank">United Nations Statistics Division, "National Accounts Main Aggregates Database – Basic Data Selection"</a>)</p> <br/>
    <p>(2) Public Spending as a percentage of GDP (source: <a href="https://statistics.cepal.org/portal/databank/index.html?indicator_id=1246&lang=en" target="_blank"> Economic Commission for Latin America and the Caribbean (ECLAC), "Government Operations (Economic Classification), as a Percentage of GDP," CEPALSTAT).</a></p>.
    </div>
    `
  }
];






let table;
const noResultsMsg = document.getElementById("no-results");
const tableFooter = document.getElementById("table-footer");
const loader = document.getElementById("loader");
let isLoading = false;

// Store current filters
const filters = {
    year: '',
    country: '',
    global: ''
  };


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
  
//   function renderFooterLink(urls, refrence) {
//     tableFooter.innerHTML = ""; // Clear previous content
  
//     if (urls) {
//     for(let i =0; i < urls.length; i ++){
//       const anchor = document.createElement("a");
//       anchor.href = urls[i]?.link;
//       anchor.target = "_blank";
//       anchor.rel = "noopener noreferrer";
//       anchor.textContent = urls[i].title
//       anchor.style.cssText =
//         "color: #49d94b; text-decoration: underline; display: inline-block; margin-top: 1rem;";
//       tableFooter.appendChild(anchor);
//     }
//      tableFooter.insertAdjacentElement("beforeend",refrence)
//     }
//     // if(refrence){
//     // for(let i =0; i < urls.length; i ++){
//     //   const strong = document.createElement("strong");
//     //   const strong
//     //   anchor.href = urls[i]?.link;
//     //   anchor.target = "_blank";
//     //   anchor.rel = "noopener noreferrer";
//     //   anchor.textContent = urls[i].title
//     //   anchor.style.cssText =
//     //     "color: #49d94b; text-decoration: underline; display: inline-block; margin-top: 1rem;";
//     //   tableFooter.appendChild(anchor);
//     // }  
//     // }
//   }
  


// Initialize table after DOM load

function renderFooterLink(urls = [], refrence = "") {
    tableFooter.innerHTML = ""; // Clear previous content
  
    // Render URLs as anchor elements
    urls.forEach((item) => {
      if (item?.link && item?.title) {
        const anchor = document.createElement("a");
        anchor.href = item.link;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = item.title;
        anchor.style.cssText = `
          color: #49d94b;
          text-decoration: underline;
          display: inline-block;
          margin-top: 1rem;
        `;
        tableFooter.appendChild(anchor);
      }
    });
  
    // Render refrence if available
    if (refrence && typeof refrence === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = refrence;
      wrapper.style.marginTop = "1rem";
      tableFooter.appendChild(wrapper);
    }
  }
  

async function loadDataset(dataset) {

  document.getElementById("dataset-title").textContent = dataset.title;
    try {
      isLoading = true;
       loader.style.display = "inline-block"; // Show loader while loading
       noResultsMsg.style.display = "none"; // Hide no results message
       tableFooter.innerHTML = ""; // Clear previous content

       
      if (table) table.destroy(); // remove old table if exists
        // Fetch and parse CSV data
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
            pagination:false,
            // paginationSize: data.length,
            tooltips: true,
            movableColumns: true,
          });

          renderFooterLink(dataset?.urls, dataset?.refrence);
        },
      });
    } catch (error) {
      console.error("Failed to load and parse CSV:", error);
    }
    finally{
        isLoading = false;
        loader.style.display = "none"; // Hide loader after loading
        noResultsMsg.style.display = "none"; // Hide no results message
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


document.getElementById("clear-filters").addEventListener("click", () => {
  // Reset filter values
  filters.year = '';
  filters.country = '';
  filters.global = '';

  // Clear input fields
  document.getElementById("search-input").value = '';
  document.getElementById("filter-year").value = '';
  document.getElementById("filter-country").value = '';

  // Re-apply filters to reset the table
  applyFilters();
});



//filters
function applyFilters() {
    table.setFilter((rowData) => {
      const matchesGlobal = filters.global === '' || Object.values(rowData).some((value) =>
        String(value).toLowerCase().includes(filters.global)
      );
  
      const matchesYear = filters.year === '' || (rowData.Year || rowData.year || '').toLowerCase().includes(filters.year);
  
      const matchesCountry = filters.country === '' || (rowData.Country || rowData.country || '').toLowerCase().includes(filters.country);
  
      return matchesGlobal && matchesYear && matchesCountry;
    });
  
    setTimeout(() => {
      const visibleRows = table.getDataCount("active");
      noResultsMsg.style.display = visibleRows === 0 ? "block" : "none";
    }, 100);
  }
  
  // Global Search
  document.getElementById("search-input").addEventListener("keyup", function () {
    filters.global = this.value.toLowerCase();
    applyFilters();
  });
  
  // Name Filter
  document.getElementById("filter-year").addEventListener("keyup", function () {
    filters.year = this.value.toLowerCase();
    applyFilters();
  });
  
  // Country Filter
  document.getElementById("filter-country").addEventListener("keyup", function () {
    filters.country = this.value.toLowerCase();
    applyFilters();
  });
  
// Global Search
// document.getElementById("search-input").addEventListener("keyup", function () {
//       const query = this.value.toLowerCase();
//       table.setFilter((rowData) =>
//         Object.values(rowData).some((value) =>
//           String(value).toLowerCase().includes(query)
//         )
//       );

//           // Delay to ensure filtering is applied before checking
//     setTimeout(() => {
//         const visibleRows = table.getDataCount("active"); // only rows after filter
//         if (visibleRows === 0) {
//           noResultsMsg.style.display = "block";
//         } else {
//           noResultsMsg.style.display = "none";
//         }
//       }, 100);
  
// });




