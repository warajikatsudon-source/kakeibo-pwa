let records =
JSON.parse(
localStorage.getItem("records")
) || [];

let chart = null;

function saveData(){

    localStorage.setItem(
        "records",
        JSON.stringify(records)
    );

}

function addRecord(){

    const record = {

        date:
        document.getElementById("date").value,

        type:
        document.getElementById("type").value,

        amount:Number(
          document.getElementById("amount").value
        ),

        category:
        document.getElementById("category").value,

        memo:
        document.getElementById("memo").value

    };

    records.push(record);

    saveData();
    render();
}

function render(){

    let income = 0;
    let expense = 0;

    records.forEach(r=>{

        if(r.type==="収入"){
            income += r.amount;
        }else{
            expense += r.amount;
        }

    });

    document.getElementById("income")
    .innerText = income.toLocaleString();

    document.getElementById("expense")
    .innerText = expense.toLocaleString();

    document.getElementById("balance")
    .innerText =
       (income-expense).toLocaleString();

    const list =
    document.getElementById("recordList");

    list.innerHTML = "";

    records.forEach(r=>{

        list.innerHTML += `
        <div class="record">
            ${r.date}
            ${r.category}
            ¥${r.amount}
        </div>
        `;

    });

    renderChart();
}

function renderChart(){

    const totals = {};

    records
    .filter(r=>r.type==="支出")
    .forEach(r=>{

        totals[r.category] =
          (totals[r.category]||0)
          + r.amount;

    });

    const labels =
    Object.keys(totals);

    const values =
    Object.values(totals);

    if(chart){
        chart.destroy();
    }

    chart =
    new Chart(
      document.getElementById("expenseChart"),
      {
        type:"pie",
        data:{
          labels:labels,
          datasets:[{
            data:values
          }]
        }
      }
    );
}

function exportCSV(){

    let csv =
    "date,type,amount,category,memo\n";

    records.forEach(r=>{

        csv +=
`${r.date},${r.type},${r.amount},${r.category},${r.memo}\n`;

    });

    const blob =
    new Blob(
        [csv],
        {type:"text/csv"}
    );

    const a =
    document.createElement("a");

    a.href =
    URL.createObjectURL(blob);

    a.download =
    "kakeibo.csv";

    a.click();

}

function importCSV(){

    const file =

    document.getElementById(
        "csvFile"
    ).files[0];

    if(!file)return;

    const reader =
    new FileReader();

    reader.onload=(e)=>{

      const lines =
      e.target.result.split("\n");

      lines.shift();

      lines.forEach(line=>{

        if(!line.trim()) return;

        const col =
        line.split(",");

        records.push({

          date:col[0],
          type:col[1],
          amount:Number(col[2]),
          category:col[3],
          memo:col[4]

        });

      });

      saveData();
      render();

    };

    reader.readAsText(file);

}

render();

if("serviceWorker" in navigator){

 navigator.serviceWorker
 .register("service-worker.js");

}
