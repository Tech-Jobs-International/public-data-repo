
// $(document).ready(function(){
//     $("#dataTable").DataTable();
// })

//To fetch data from the csv file
document.addEventListener("DOMContentLoaded", function(){

    //laod and parse the CSV
    Papa.parse("data/development-financing-institutions-lac/LAC_SWF.csv", {
        download:true,
        header:true,
        complete: function(results){
            const data = results?.data;
            console.log(data)
            const tableBody = document.querySelector("#dataTable tbody");

            //loop through the data
         data.forEach(row => {
          const tr = document.createElement("tr");
  
          tr.innerHTML = `
            <td>${row["Assets under management(Billion USD)"]}</td>
            <td>${row["SWF Country"]}</td>
            <td>${row["SWF Name"]}</td>
            <td><a href="${row["Url"]}" target="_blanc">${row["Url"]}</a></td>
            <td>${row["Year"]}</td>
          `;
  
          tableBody.appendChild(tr);
        });


          // Now initialize DataTable
          $('#dataTable').DataTable();
        }
    })
})


// document.addEventListener("DOMContentLoaded", function () {
//     // Load and parse CSV
//     Papa.parse("data/dataset.csv", {
//       download: true,
//       header: true,
//       complete: function (results) {
//         const data = results.data;
//         const tableBody = document.querySelector("#policyTable tbody");
  
//         data.forEach(row => {
//           const tr = document.createElement("tr");
  
//           tr.innerHTML = `
//             <td>${row.Country}</td>
//             <td>${row.PolicyName}</td>
//             <td>${row.Type}</td>
//             <td>${row.Year}</td>
//             <td>${row.Funding}</td>
//           `;
  
//           tableBody.appendChild(tr);
//         });
  
//         // Now initialize DataTable
//         $('#policyTable').DataTable();
//       }
//     });
//   });
  