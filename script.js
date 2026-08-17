const monthNames = [
    "Январь", "Февраль", "Март", "Апрель",
    "Май", "Июнь", "Июль", "Август",
    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let currentDate = new Date();

const monthTitle = document.getElementById("currentMonth");
const table = document.getElementById("workTable");
const totalHours = document.getElementById("totalHours");

function storageKey() {
    return "workTracker_" +
        currentDate.getFullYear() + "_" +
        currentDate.getMonth();
}

function daysInMonth() {
    return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();
}

function loadData() {
    return JSON.parse(
        localStorage.getItem(storageKey()) || "{}"
    );
}

function saveData(data) {
    localStorage.setItem(
        storageKey(),
        JSON.stringify(data)
    );
}

function calculateTime(start, end) {
    if (!start || !end) return 0;

    const startParts = start.split(":").map(Number);
    const endParts = end.split(":").map(Number);

    let startMinutes =
        startParts[0] * 60 + startParts[1];

    let endMinutes =
        endParts[0] * 60 + endParts[1];

    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }

    return endMinutes - startMinutes;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return` ${hours} ч ${String(mins).padStart(2, "0")} мин;`
}

function render() {
    monthTitle.textContent =
        monthNames[currentDate.getMonth()] +
        " " +
        currentDate.getFullYear();

    table.innerHTML = "";

    const data = loadData();
    let total = 0;

    for (let day = 1; day <= daysInMonth(); day++) {

        const record = data[day] || {
            start: "",
            end: ""
        };

        const worked =
            calculateTime(record.start, record.end);

        total += worked;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${day}</td>

            <td>
                <input
                    type="time"
                    value="${record.start}"
                    data-day="${day}"
                    data-type="start"
                >
            </td>

            <td>
                <input
                    type="time"
                    value="${record.end}"
                    data-day="${day}"
                    data-type="end"
                >
            </td>

            <td id="worked-${day}">
                ${formatTime(worked)}
            </td>
        `;

        table.appendChild(row);
    }

    totalHours.textContent = formatTime(total);

    document
        .querySelectorAll('input[type="time"]')
        .forEach(input => {

            input.addEventListener("change", () => {

                const day = input.dataset.day;
                const type = input.dataset.type;

                const data = loadData();

                if (!data[day]) {
                    data[day] = {
                        start: "",
                        end: ""
                    };
                }

                data[day][type] = input.value;

                saveData(data);

                render();
            });
        });
}

document
    .getElementById("prevMonth")
    .addEventListener("click", () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        render();
    });

document
    .getElementById("nextMonth")
    .addEventListener("click", () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        render();
    });

document
    .getElementById("clearMonth")
    .addEventListener("click", () => {

        if (confirm("Очистить весь этот месяц?")) {

            localStorage.removeItem(
                storageKey()
            );

            render();
        }
    });

render();
