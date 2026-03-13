"use strict";
var _a;
const openBtn = document.getElementById("addDocumentBtn");
const dialog = document.getElementById("addDocumentDialog");
const closeBtn = document.getElementById("closeModalBtn");
const closeIcon = document.getElementById("closeIcon");
const addDocumentHeading = document.getElementById("add-document-heading");
const nameInput = (document.querySelector('#addDocumentDialog input[type="text"]'));
const statusInput = document.querySelector("#addDocumentDialog select");
openBtn === null || openBtn === void 0 ? void 0 : openBtn.addEventListener("click", () => {
    if (closeBtn)
        closeBtn.textContent = "Add";
    if (addDocumentHeading)
        addDocumentHeading.textContent = "Add Document";
    if (nameInput)
        nameInput.value = "";
    if (statusInput)
        statusInput.value = "";
    dialog === null || dialog === void 0 ? void 0 : dialog.showModal();
});
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
    const name = nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim();
    const status = statusInput === null || statusInput === void 0 ? void 0 : statusInput.value;
    if (!name || !status) {
        alert("Please fill in all fields");
        return;
    }
    const edit = dialog === null || dialog === void 0 ? void 0 : dialog.dataset.edit;
    const local_documents = localStorage.getItem("documents");
    let documents = [];
    if (local_documents)
        documents = JSON.parse(local_documents) || [];
    if (edit) {
        const index = documents.findIndex((doc) => doc.name === edit);
        const doc = documents[index];
        if (doc) {
            doc.name = name;
            doc.status = status;
            doc.lastModified = getCurrentDateTime();
        }
        delete dialog.dataset.edit;
    }
    else {
        const newDoc = {
            name: name,
            status: status,
            lastModified: getCurrentDateTime(),
        };
        documents.push(newDoc);
    }
    localStorage.setItem("documents", JSON.stringify(documents));
    if (nameInput)
        nameInput.value = "";
    statusInput.value = "";
    dialog === null || dialog === void 0 ? void 0 : dialog.close();
    renderTable(null);
});
closeIcon === null || closeIcon === void 0 ? void 0 : closeIcon.addEventListener("click", () => {
    dialog === null || dialog === void 0 ? void 0 : dialog.close();
});
function renderTable(documents) {
    if (!documents) {
        const localDocuments = localStorage.getItem("documents");
        if (localDocuments)
            documents = JSON.parse(localDocuments);
    }
    const tableBody = document.getElementById("document-table-body");
    if (tableBody)
        tableBody.innerHTML = "";
    documents === null || documents === void 0 ? void 0 : documents.forEach((doc) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" /></td>
            <td class="table-body">${doc.name}</td>
            <td>${getStatus(doc.status)}</td>
            <td class="date">${formatDateTime(doc.lastModified)}</td>
            <td class="sign-now">
                <button class="btn-secondary">${getAction(doc.status)}</button>
                <div class="action-wrapper">
                    <img src="./assets/3dot.svg" alt="3dots" />
                    <div class="kabab-menu">
                        <button class="edit-btn" data-name="${doc.name}">Edit</button>
                        <button class="delete-btn" data-name="${doc.name}">Delete</button>
                    </div>
                </div>
            </td>
        `;
        tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(tr);
    });
}
function getStatus(status) {
    if (status === "needs-signing") {
        return `<span class="need-signing">Needs Signing</span>`;
    }
    else if (status === "pending") {
        return `
            <div class="pending-primary">
                <span class="pending">Pending</span>
                <p>
                    <span style="color: #b5bdcd; font-style: italic">Waiting for</span>
                    <span style="color: #436d7c; font-style: italic">1 Person</span>
                </p>
            </div>`;
    }
    else if (status === "completed") {
        return `<span class="completed">Completed</span>`;
    }
}
function getAction(status) {
    if (status === "needs-signing")
        return "Sign now";
    if (status === "pending")
        return "Preview";
    if (status === "completed")
        return "Download PDF";
}
function formatDateTime(dateTimeStr) {
    const [date, time, meridiem] = dateTimeStr.split(" ");
    return `<p>${date}</p><p>${time} ${meridiem}</p>`;
}
const searchInput = document.getElementById("search-box");
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", (e) => {
    const inputElement = e.target;
    const query = inputElement.value.trim().toLowerCase();
    const localDocuments = localStorage.getItem("documents");
    let documents = [];
    if (localDocuments)
        documents = JSON.parse(localDocuments);
    const filterDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(query));
    renderTable(filterDocuments);
});
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const [timePart, meridiem] = time.split(" ");
    return `${date} ${timePart} ${meridiem === null || meridiem === void 0 ? void 0 : meridiem.toLowerCase()}`;
}
(_a = document.getElementById("document-table-body")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
    let localDocuments = localStorage.getItem("documents");
    let documents = [];
    if (localDocuments)
        documents = JSON.parse(localDocuments) || [];
    const inputElement = e.target;
    if (inputElement.classList.contains("delete-btn")) {
        const name = inputElement.dataset.name;
        const remaining = documents.filter((doc) => doc.name !== name);
        localStorage.setItem("documents", JSON.stringify(remaining));
        renderTable(null);
    }
    if (inputElement.classList.contains("edit-btn")) {
        const name = inputElement.dataset.name;
        const doc = documents.find((doc) => doc.name === name);
        if (nameInput)
            nameInput.value = doc.name;
        if (statusInput)
            statusInput.value = doc.status;
        if (closeBtn)
            closeBtn.textContent = "Update";
        if (addDocumentHeading)
            addDocumentHeading.textContent = "Edit Document";
        if (dialog)
            dialog.dataset.edit = name;
        dialog === null || dialog === void 0 ? void 0 : dialog.showModal();
    }
});
renderTable(null);
