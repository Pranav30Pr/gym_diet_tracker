const foodData = {
  "Boiled Egg": { protein: 6, calories: 78 },
  "Milk (250ml)": { protein: 8, calories: 150 },
  "Chapati": { protein: 3, calories: 70 },
  "Rice (100g)": { protein: 2.5, calories: 130 },
  "Paneer (100g)": { protein: 18, calories: 265 },
  "Sprouts (50g)": { protein: 5, calories: 60 },
  "Banana": { protein: 1.3, calories: 105 },
};

const foodItemSelect = document.getElementById("foodItem");
const foodForm = document.getElementById("foodForm");
const summaryTableBody = document.querySelector("#summaryTable tbody");
const totalsDiv = document.getElementById("totals");
const submitDayBtn = document.getElementById("submitDay");
const logSection = document.getElementById("logSection");
const homeSection = document.getElementById("homeSection");
const logTable = document.getElementById("logTable");

let currentDayLog = [];
let fullLog = [];

// Populate food dropdown
Object.keys(foodData).forEach(item => {
  const option = document.createElement("option");
  option.value = item;
  option.textContent = item;
  foodItemSelect.appendChild(option);
});

// Navigation
document.getElementById("homeLink").onclick = () => {
  homeSection.style.display = "block";
  logSection.style.display = "none";
};
document.getElementById("logLink").onclick = () => {
  homeSection.style.display = "none";
  logSection.style.display = "block";
  displayLog();
};

// Add entry
foodForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const meal = document.getElementById("meal").value;
  const food = document.getElementById("foodItem").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  const { protein, calories } = foodData[food];
  const entry = {
    meal,
    food,
    quantity,
    protein: protein * quantity,
    calories: calories * quantity
  };

  currentDayLog.push(entry);
  updateSummaryTable();
});

// Update today's table
function updateSummaryTable() {
  summaryTableBody.innerHTML = "";
  let totalProtein = 0;
  let totalCalories = 0;

  currentDayLog.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.meal}</td>
      <td>${entry.food}</td>
      <td>${entry.quantity}</td>
      <td>${entry.protein.toFixed(1)}</td>
      <td>${entry.calories.toFixed(1)}</td>
    `;
    summaryTableBody.appendChild(row);
    totalProtein += entry.protein;
    totalCalories += entry.calories;
  });

  // Add total row
  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3"><strong>Total</strong></td>
    <td><strong>${totalProtein.toFixed(1)}</strong></td>
    <td><strong>${totalCalories.toFixed(1)}</strong></td>
  `;
  summaryTableBody.appendChild(totalRow);

  totalsDiv.textContent = `Protein: ${totalProtein.toFixed(1)}g | Calories: ${totalCalories.toFixed(1)} kcal`;
}

// Submit Day
submitDayBtn.onclick = () => {
  if (currentDayLog.length === 0) return;
  fullLog.push({
    date: new Date().toLocaleDateString(),
    entries: [...currentDayLog]
  });
  currentDayLog = [];
  updateSummaryTable();
  summaryTableBody.innerHTML = "";
  totalsDiv.textContent = "";
  alert("Day submitted!");
};

// Show logs
function displayLog() {
  logTable.innerHTML = "";

  fullLog.forEach(day => {
    const heading = document.createElement("h3");
    heading.textContent = `Date: ${day.date}`;
    logTable.appendChild(heading);

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Meal</th>
          <th>Food</th>
          <th>Qty</th>
          <th>Protein</th>
          <th>Calories</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    let totalP = 0, totalC = 0;
    day.entries.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.meal}</td>
        <td>${entry.food}</td>
        <td>${entry.quantity}</td>
        <td>${entry.protein.toFixed(1)}</td>
        <td>${entry.calories.toFixed(1)}</td>
      `;
      table.querySelector("tbody").appendChild(row);
      totalP += entry.protein;
      totalC += entry.calories;
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
      <td colspan="3"><strong>Total</strong></td>
      <td><strong>${totalP.toFixed(1)}</strong></td>
      <td><strong>${totalC.toFixed(1)}</strong></td>
    `;
    table.querySelector("tbody").appendChild(totalRow);
    logTable.appendChild(table);
  });
}
