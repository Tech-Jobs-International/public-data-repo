
let table;
const noResultsMsg = document.getElementById("no-results");


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
  
// Fetch and render the table
// document.addEventListener("DOMContentLoaded", function () {
//   Papa.parse("data/development-financing-institutions-lac/LAC_SWF.csv", {
//     download: true,
//     header: true,
//     encoding:"utf-8",
//     complete: function (results) {
//       const data = results.data;

//       const columns = Object.keys(data[0] || {} ).map((key) => ({
//         title: key,
//         field: key,
//         formatter: enhancedFormatter,
//         tooltip:true,
//         hozAlign: "left",
//         headerSort: true,
//         headerTooltip: true
//       }));


//       table = new Tabulator("#table-container", {
//         data: data,
//         layout: "fitColumns",
//         pagination: "local",
//         paginationSize: 10,
//         movableColumns: true,
//         responsiveLayout: "collapse",
//         columns,
//         tooltips: true,
//       });
//     },
//   });
// });


// Initialize table after DOM load
document.addEventListener("DOMContentLoaded", async function () {
    try {
      const response = await fetch("data/development-financing-institutions-lac/LAC_SWF.csv");
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("windows-1252");
      const csvText = decoder.decode(buffer);
  
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
  
          const columns = Object.keys(data[0] || {}).map((key) => ({
            title: key.replace(/_/g, ' '),
            field: key,
            formatter: enhancedFormatter,
            tooltip: true,
            hozAlign: "left",
            headerSort: true,
            headerTooltip: true,
          }));
  
          table = new Tabulator("#table-container", {
            data,
            columns,
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 10,
            responsiveLayout: "collapse",
            tooltips: true,
            movableColumns: true,
          });
        },
      });
    } catch (error) {
      console.error("Failed to load and parse CSV:", error);
    }
  });


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




