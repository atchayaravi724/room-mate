// =====================================
// ROOMMATE APP
// =====================================


// LOAD DATA

let members =
    JSON.parse(localStorage.getItem("roomMembers")) || [
        "You",
        "Arun",
        "Kavin"
    ];


let tasks =
    JSON.parse(localStorage.getItem("roomTasks")) || [];


let currentFilter = "all";


// =====================================
// SAVE DATA
// =====================================

function saveData() {

    localStorage.setItem(
        "roomMembers",
        JSON.stringify(members)
    );

    localStorage.setItem(
        "roomTasks",
        JSON.stringify(tasks)
    );
}


// =====================================
// ADD MEMBER
// =====================================

function addMember() {

    const input =
        document.getElementById("memberName");

    const name =
        input.value.trim();


    if (name === "") {

        alert("Enter roommate name!");

        return;
    }


    if (members.includes(name)) {

        alert("This roommate already exists!");

        return;
    }


    members.push(name);

    input.value = "";

    saveData();

    render();

}


// =====================================
// REMOVE MEMBER
// =====================================

function removeMember(name) {

    if (name === "You") {

        alert("You cannot remove yourself.");

        return;
    }


    const hasTasks =
        tasks.some(
            task => task.assignedTo === name
        );


    if (hasTasks) {

        alert(
            "This roommate still has assigned tasks."
        );

        return;
    }


    members =
        members.filter(
            member => member !== name
        );


    saveData();

    render();

}


// =====================================
// UPDATE MEMBER DROPDOWN
// =====================================

function updateMemberDropdown() {

    const select =
        document.getElementById("assignedTo");


    select.innerHTML = "";


    members.forEach(member => {

        const option =
            document.createElement("option");

        option.value = member;

        option.textContent = member;

        select.appendChild(option);

    });

}


// =====================================
// ADD TASK
// =====================================

document
    .getElementById("taskForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("taskName")
                .value.trim();


        const category =
            document.getElementById("taskCategory")
                .value;


        const assignedTo =
            document.getElementById("assignedTo")
                .value;


        const dueDate =
            document.getElementById("dueDate")
                .value;


        if (!name || !assignedTo || !dueDate) {

            alert("Please fill all fields.");

            return;
        }


        const task = {

            id: Date.now(),

            name: name,

            category: category,

            assignedTo: assignedTo,

            dueDate: dueDate,

            completed: false

        };


        tasks.unshift(task);

        saveData();

        this.reset();

        render();

    });


// =====================================
// COMPLETE TASK
// =====================================

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveData();

    render();

}


// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveData();

    render();

}


// =====================================
// CLEAR COMPLETED
// =====================================

function clearCompleted() {

    tasks =
        tasks.filter(
            task => !task.completed
        );


    saveData();

    render();

}


// =====================================
// FILTER TASKS
// =====================================

function filterTasks(filter, button) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter")
        .forEach(btn =>
            btn.classList.remove("active")
        );


    button.classList.add("active");


    renderTasks();

}


// =====================================
// RENDER MEMBERS
// =====================================

function renderMembers() {

    const container =
        document.getElementById("membersList");


    container.innerHTML = "";


    members.forEach(member => {

        const div =
            document.createElement("div");

        div.className = "member";


        const firstLetter =
            member.charAt(0).toUpperCase();


        div.innerHTML = `

            <div class="member-left">

                <div class="avatar">
                    ${firstLetter}
                </div>

                <strong>
                    ${member}
                </strong>

            </div>

            ${
                member !== "You"
                ?
                `<button
                    class="remove-member"
                    onclick="removeMember('${member}')">
                    ✕
                </button>`
                :
                ""
            }

        `;


        container.appendChild(div);

    });

}


// =====================================
// RENDER TASKS
// =====================================

function renderTasks() {

    const container =
        document.getElementById("taskList");


    let filteredTasks = tasks;


    if (currentFilter === "pending") {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );

    }


    if (filteredTasks.length === 0) {

        container.innerHTML = `

            <div class="empty">

                🏠

                <br><br>

                No tasks here.

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    filteredTasks.forEach(task => {

        const div =
            document.createElement("div");


        div.className =
            task.completed
                ? "task done"
                : "task";


        const icon =
            getCategoryIcon(task.category);


        div.innerHTML = `

            <div class="task-left">

                <div
                    class="check ${
                        task.completed
                            ? "completed"
                            : ""
                    }"
                    onclick="toggleTask(${task.id})">

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </div>


                <div class="task-info">

                    <h3>
                        ${icon} ${task.name}
                    </h3>

                    <p>
                        Due:
                        ${formatDate(task.dueDate)}
                        •
                        ${task.category}
                    </p>

                </div>

            </div>


            <div class="task-right">

                <span class="assigned">

                    ${task.assignedTo}

                </span>


                <button
                    class="delete-task"
                    onclick="deleteTask(${task.id})">

                    🗑️

                </button>

            </div>

        `;


        container.appendChild(div);

    });

}


// =====================================
// CATEGORY ICON
// =====================================

function getCategoryIcon(category) {

    const icons = {

        Cleaning: "🧹",

        Kitchen: "🍳",

        Shopping: "🛒",

        Laundry: "👕",

        Bills: "💳",

        Other: "📦"

    };


    return icons[category] || "📦";

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(date) {

    const d =
        new Date(date + "T00:00:00");


    return d.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}


// =====================================
// UPDATE STATS
// =====================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const points =
        completed * 10;


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "totalPoints"
    ).textContent = points;

}


// =====================================
// LEADERBOARD
// =====================================

function renderLeaderboard() {

    const container =
        document.getElementById(
            "leaderboardList"
        );


    const scores = {};


    members.forEach(member => {

        scores[member] = 0;

    });


    tasks.forEach(task => {

        if (
            task.completed &&
            scores[task.assignedTo] !== undefined
        ) {

            scores[task.assignedTo] += 10;

        }

    });


    const sorted =
        Object.entries(scores)
            .sort(
                (a, b) => b[1] - a[1]
            );


    container.innerHTML = "";


    sorted.forEach(
        ([name, points], index) => {

            const div =
                document.createElement("div");

            div.className =
                "leaderboard-item";


            div.innerHTML = `

                <div class="rank">

                    ${
                        index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : "#" + (index + 1)
                    }

                </div>


                <div class="leader-avatar">

                    ${name.charAt(0).toUpperCase()}

                </div>


                <div class="leader-name">

                    ${name}

                </div>


                <div class="points">

                    ⭐ ${points}

                </div>

            `;


            container.appendChild(div);

        }
    );

}


// =====================================
// MAIN RENDER
// =====================================

function render() {

    updateMemberDropdown();

    renderMembers();

    renderTasks();

    updateStats();

    renderLeaderboard();

}


// =====================================
// START
// =====================================

render();