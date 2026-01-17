// Habit Array

// Yhi pe sare habits store hoge

let habits = [];

// Date feature

function getDate() {
    let today = new Date();
    return today.toISOString().split("T")[0];
}

// Loading habits 

if (localStorage.getItem("habits")) {
    habits = JSON.parse(localStorage.getItem("habits"));
}

// Vars

const habitName = document.querySelector("#habitName");
const addBtn = document.querySelector("#addBtn");
const habitList = document.querySelector("#habitList");
const progressInfo = document.querySelector("#progressInfo");
const currentDate = document.querySelector("#currentDate");
const emptyState = document.querySelector("#emptyState");

let today = new Date();
currentDate.innerText = today.toDateString();

// Adding Habit

addBtn.addEventListener('click', function () {
    let habit = habitName.value.trim();

    if (habit === "") {
        alert("Please enter a habit name");
        habitName.focus();
        return;
    }

    let habitObj = {
        name: habit,
        streak: 0,
        habitAdded: getDate(),
        completedDate: null
    };

    habits.push(habitObj);
    habitName.value = "";

    saveData();
    loadHabits();
});

// keyboard event se enter se task add krna hai

// Enter key dabate pr bhi habit add ho jaega

habitName.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Load Habits

function loadHabits() {
    habitList.innerHTML = "";
    let completedToday = 0;
    let todayDate = getDate();

    if (habits.length === 0) {
        emptyState.style.display = 'block';
        habitList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        habitList.style.display = 'block';
    }

    for (let i = 0; i < habits.length; i++) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.className = "habit-name";

        let habitAdded = "";
        let completedInfo = "";

        if (habits[i].habitAdded) 
            habitAdded = `Started : ${habits[i].habitAdded}`;
        

        if (habits[i].completedDate) 
            completedInfo = `Last completed : ${habits[i].completedDate}`;
        else 
            completedInfo = `Not completed yet`;
        

        let streakBadge = "";
        if (habits[i].streak > 0) 

            streakBadge = `<span class="streak-badge">🔥 ${habits[i].streak} day streak</span>`;
        

        span.innerHTML = `
            <strong>${habits[i].name}</strong> ${streakBadge}<br>
            <small>${habitAdded}</small><br>
            <small>${completedInfo}</small>
        `;

        if (habits[i].completedDate === todayDate) {

            span.classList.add("over");
            completedToday++;
        }

        let actions = document.createElement("div");

        actions.className = "actions";

        let finishBtn = document.createElement("button");

        finishBtn.innerHTML = '<i class="fas fa-check"></i> Complete Today';

        if (habits[i].completedDate === todayDate) {

            finishBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
            finishBtn.style.opacity = '0.7';
            finishBtn.style.cursor = 'not-allowed';

        }

        finishBtn.addEventListener('click', function () {
            let today = getDate();

            if (habits[i].completedDate === today) {

                alert("Habit already completed today!");
                return;
            }

            if (habits[i].completedDate) {

                let lastDate = new Date(habits[i].completedDate);
                let currentDate = new Date(today);
                let gap = (currentDate - lastDate) / (1000 * 60 * 60 * 24);

                if (gap === 1)
                    habits[i].streak++;
                else if (gap > 1)
                    habits[i].streak = 1;
            } else 
                habits[i].streak = 1;
            

            habits[i].completedDate = today;
            saveData();
            loadHabits();
        });

        let deleteBtn = document.createElement("button");

        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';

        deleteBtn.addEventListener('click', function () {
            if (confirm("Are you sure you want to delete this habit?")) {
                habits.splice(i, 1);
                saveData();
                loadHabits();
            }
        });

        actions.appendChild(finishBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);

        habitList.appendChild(li);
    }

    updateProgress(completedToday);
}

// Progress Info

function updateProgress(finishCount) {
    if (habits.length == 0) 
        progressInfo.innerHTML = '<i class="fas fa-chart-pie"></i> No habits added yet';
     else {

        let progressPercent = Math.round((finishCount / habits.length) * 100);
        progressInfo.innerHTML = `
            <i class="fas fa-chart-pie"></i> Progress: ${finishCount}/${habits.length} habits completed today (${progressPercent}%)
        `;

        // Progress Data

        // Abhi progress bar ko update karna hai, kitna kaam hai yr...

        const progressBar = document.querySelector('.progressBar');
        if (progressPercent === 100) {
            progressBar.style.background = '#d5f4e6';
            progressBar.style.borderColor = '#82e5aa';
        } else if (progressPercent >= 50) {
            progressBar.style.background = '#f8d7da';
            progressBar.style.borderColor = '#f5c6cb';
        }
    }
}

// Local Storage me store krna hai

function saveData() {
    localStorage.setItem("habits", JSON.stringify(habits));
};

// load krna hai sab hone k baad

loadHabits();

// Baki kaam baad me pehle pet-puaja