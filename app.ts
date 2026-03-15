const openBtn = document.getElementById('addDocumentBtn')
const dialog = <HTMLDialogElement | null>document.getElementById('addDocumentDialog')
const closeBtn = document.getElementById('closeModalBtn')
const closeIcon = document.getElementById('closeIcon')
const addDocumentHeading = document.getElementById('add-document-heading')
const nameInput = <HTMLInputElement | null>document.querySelector('#addDocumentDialog input[type="text"]')
const statusInput = <HTMLInputElement | null>document.querySelector('#addDocumentDialog select')

interface DocumentModel {
    name: string
    status: string
    lastModified: string
}

function getDocuments(): DocumentModel[] {
    try {
        return JSON.parse(localStorage.getItem('documents') || '[]')
    } catch {
        return []
    }
}

openBtn?.addEventListener('click', () => {
    if (closeBtn) closeBtn.textContent = 'Add'

    if (addDocumentHeading) addDocumentHeading.textContent = 'Add Document'
    if (nameInput) nameInput.value = ''
    if (statusInput) statusInput.value = ''

    dialog?.showModal()
})

closeBtn?.addEventListener('click', () => {
    const name = nameInput?.value.trim()
    const status = statusInput?.value

    if (!name || !status) {
        alert('Please fill in all fields')
        return
    }

    const edit = dialog?.dataset.edit
    const documents = getDocuments()

    if (edit) {
        const index = documents.findIndex((doc) => doc.name === edit)
        documents[index].name = name
        documents[index].status = status
        documents[index].lastModified = getCurrentDateTime()
        delete dialog?.dataset.edit
    } else {
        const newDoc = {
            name: name,
            status: status,
            lastModified: getCurrentDateTime(),
        }

        documents.push(newDoc)
    }

    localStorage.setItem('documents', JSON.stringify(documents))

    if (nameInput) nameInput.value = ''
    if (statusInput) statusInput.value = ''

    dialog?.close()
    renderTable(null)
})

closeIcon?.addEventListener('click', () => {
    dialog?.close()
})

function renderTable(documents: DocumentModel[] | null) {
    if (!documents) {
        documents = getDocuments()
    }

    const tableBody = document.getElementById('document-table-body')
    if (tableBody) tableBody.innerHTML = ''

    documents?.forEach((doc) => {
        const tr = document.createElement('tr')

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
        `

        tableBody?.appendChild(tr)
    })
}

function getStatus(status: string): string {
    if (status === 'needs-signing') {
        return `<span class="need-signing">Needs Signing</span>`
    } else if (status === 'pending') {
        return `
            <div class="pending-primary">
                <span class="pending">Pending</span>
                <p>
                    <span style="color: #b5bdcd; font-style: italic">Waiting for</span>
                    <span style="color: #436d7c; font-style: italic">1 Person</span>
                </p>
            </div>`
    } else if (status === 'completed') {
        return `<span class="completed">Completed</span>`
    }

    return ''
}

function getAction(status: string): string {
    if (status === 'needs-signing') return 'Sign now'
    else if (status === 'pending') return 'Preview'
    else if (status === 'completed') return 'Download PDF'

    return ''
}

function formatDateTime(dateTimeStr: string) {
    const [date, time, meridiem] = dateTimeStr.split(' ')
    return `<p>${date}</p><p>${time} ${meridiem}</p>`
}

const searchInput = document.getElementById('search-box')

searchInput?.addEventListener('input', (e) => {
    const inputElement = e.target as HTMLInputElement

    const query = inputElement.value.trim().toLowerCase()
    const documents = getDocuments()

    const filterDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(query))

    renderTable(filterDocuments)
})

function getCurrentDateTime(): string {
    const now = new Date()

    const date = now.toLocaleDateString('en-US')

    const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })

    const [timePart, meridiem] = time.split(' ')

    return `${date} ${timePart} ${meridiem?.toLowerCase()}`
}

document.getElementById('document-table-body')?.addEventListener('click', (e) => {
    const documents = getDocuments()

    const inputElement = e.target as HTMLInputElement
    if (inputElement.classList.contains('delete-btn')) {
        const name = inputElement.dataset.name

        const remaining = documents.filter((doc) => doc.name !== name)

        localStorage.setItem('documents', JSON.stringify(remaining))

        renderTable(null)
    }

    if (inputElement.classList.contains('edit-btn')) {
        const name = inputElement.dataset.name

        const doc = documents.find((doc) => doc.name === name)

        if (nameInput) nameInput.value = doc!.name
        if (statusInput) statusInput.value = doc!.status
        if (closeBtn) closeBtn.textContent = 'Update'
        if (addDocumentHeading) addDocumentHeading.textContent = 'Edit Document'
        if (dialog) dialog.dataset.edit = name
        dialog?.showModal()
    }
})

renderTable(null)
