const openBtn = document.getElementById("addDocumentBtn");
const dialog = document.getElementById("addDocumentDialog");
const closeBtn = document.getElementById("closeModalBtn");
const closeIocn = document.getElementById("closeIcon");

openBtn.addEventListener("click", () => {
    dialog.showModal();
});

closeBtn.addEventListener("click", () => {
    dialog.close();
});

closeIocn.addEventListener("click", () => {
    dialog.close();
});

function renderTable(documents) {
    if (!documents) {
        documents = JSON.parse(localStorage.getItem("documents"));
    }

    const tableBody = document.getElementById("document-table-body");
    tableBody.innerHTML = "";

    documents.forEach((doc) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><input type="checkbox" /></td>
            <td class="table-body">${doc.name}</td>
            <td>${getStatus(doc.status)}</td>
            <td class="date">${formatDateTime(doc.lastModified)}</td>
            <td class="sign-now">
                <button class="btn-secondary">${getAction(doc.status)}</button>
                <img src="./assets/3dot.svg" alt="3dots" />
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function getStatus(status) {
    if (status === "needs-signing") {
        return `<span class="need-signing">Needs Signing</span>`;
    } else if (status === "pending") {
        return `
            <div class="pending-primary">
                <span class="pending">Pending</span>
                <p>
                    <span style="color: #b5bdcd; font-style: italic">Waiting for</span>
                    <span style="color: #436d7c; font-style: italic">1 Person</span>
                </p>
            </div>`;
    } else if (status === "completed") {
        return `<span class="completed">Completed</span>`;
    }
}

function getAction(status) {
    if (status === "needs-signing") return "Sign now";
    if (status === "pending") return "Preview";
    if (status === "completed") return "Download PDF";
}

function formatDateTime(dateTimeStr) {
    const [date, time, meridiem] = dateTimeStr.split(" ");
    return `<p>${date}</p><p>${time} ${meridiem}</p>`;
}

const searchInput = document.getElementById("search-box");

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    const documents = JSON.parse(localStorage.getItem("documents"));

    const filterDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(query));

    renderTable(filterDocuments);
});

renderTable();
