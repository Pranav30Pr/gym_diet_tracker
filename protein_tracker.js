const foodData = {
  "Boiled Egg": { protein: 6, calories: 78 },
  "Milk (250ml)": { protein: 8, calories: 150 },
  "Chapati": { protein: 3, calories: 70 },
  "Rice (100g)": { protein: 2.5, calories: 130 },
  "Dal (1 bowl)": { protein: 6, calories: 120 },
  "Paneer (100g)": { protein: 18, calories: 265 },
  "Sprouts (50g)": { protein: 5, calories: 60 },
  "Banana": { protein: 1.3, calories: 105 },
  "Cavin's Milkshake": { protein: 10, calories: 180 },
  "Mix Veg": { protein: 3, calories: 90 },
  "Chicken (100g)": { protein: 27, calories: 239 },
  "Peanut Butter (1 tbsp)": { protein: 4, calories: 95 },
  "Tak (200ml)": { protein: 2, calories: 35 },
  "Curd/Dahi (100g)": { protein: 3.5, calories: 60 },
  "Khajur (2 pcs)": { protein: 0.6, calories: 47 },
  "Kaju (10 pcs)": { protein: 3, calories: 100 },
  "Badam (10 pcs)": { protein: 2.5, calories: 70 },
  "Kharik (2 pcs)": { protein: 1.2, calories: 65 },
  "Sukka Anjir (2 pcs)": { protein: 1, calories: 60 },
  "Oats (40g, dry)": { protein: 5, calories: 150 }
};

// DOM Elements
const foodItemSelect = document.getElementById("foodItem");
const foodForm = document.getElementById("foodForm");
const summaryTableBody = document.querySelector("#summaryTable tbody");
const totalsDiv = document.getElementById("totals");
const submitDayBtn = document.getElementById("submitDay");
const logSection = document.getElementById("logSection");
const homeSection = document.getElementById("homeSection");
const logTable = document.getElementById("logTable");

let currentDayLog = [];
let fullLog = JSON.parse(localStorage.getItem("fullLog")) || [];

displayLog();

// Populate dropdown
Object.keys(foodData).forEach(item => {
  const option = document.createElement("option");
  option.value = item;
  option.textContent = item;
  foodItemSelect.appendChild(option);
});

// Navigation
document.getElementById("homeLink").addEventListener("click", () => {
  homeSection.style.display = "block";
  logSection.style.display = "none";
});

document.getElementById("logLink").addEventListener("click", () => {
  homeSection.style.display = "none";
  logSection.style.display = "block";
  displayLog();
});

// Form Submit Handler
foodForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const meal = document.getElementById("meal").value;
  const food = document.getElementById("foodItem").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!meal || !food || !quantity || quantity <= 0) {
    showToast("Please fill all fields correctly.");
    return;
  }

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
  foodForm.reset();
});

// Update Table
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
submitDayBtn.addEventListener("click", () => {
  if (currentDayLog.length === 0) {
    showToast("Add some food before submitting the day!");
    return;
  }

  const today = new Date().toLocaleDateString();
  fullLog.push({ date: today, entries: [...currentDayLog] });
  localStorage.setItem("fullLog", JSON.stringify(fullLog));

  currentDayLog = [];
  updateSummaryTable();
  summaryTableBody.innerHTML = "";
  totalsDiv.textContent = "";

  showToast("Day submitted successfully!");
  displayLog();
});

// Display Logs
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

// Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
