import { html, createOrderHtml } from "./view.js";

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}

let isOpen = false

const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}
const handleHelpToggle = (event) => {
    // document.querySelector('.backdrop').style.display = 'block'
    // html.help.overlay.style.display = 'block'

    isOpen = !isOpen
    if (isOpen) {
        document.querySelector('.backdrop').style.display = 'block'
        html.help.overlay.style.display = 'block'
    } else {
        document.querySelector('.backdrop').style.display = 'none'
        html.help.overlay.style.display = 'none'
    }

    checkOverlayAndFocusBtn(html.help.overlay)
}
const handleAddToggle = (event) => {
    // document.querySelector('.backdrop').style.display = 'block'
    // html.add.overlay.style.display = 'block'

    isOpen = !isOpen
    if (isOpen) {
        document.querySelector('.backdrop').style.display = 'block'
        html.add.overlay.style.display = 'block'
    } else {
        document.querySelector('.backdrop').style.display = 'none'
        html.add.overlay.style.display = 'none'
    }

    checkOverlayAndFocusBtn(html.add.overlay)
}
const handleAddSubmit = (event) => {
    // const { id, title, table, created } = order
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)
    const element = createOrderHtml(data)
    // console.log(element)
    // console.log(data)
    // console.log(html.columns)
    //html.columns.ordered.innerHTML = element
    html.columns.ordered.appendChild(element)
    // console.log(html.columns.ordered)
    event.target.reset()
    document.querySelector('.backdrop').style.display = 'none'
    html.add.overlay.style.display = 'none'
}
const handleEditToggle = (event) => {
    document.querySelector('.backdrop').style.display = 'block'
    html.edit.overlay.style.display = 'block'
    //const formData = new FormData();
    html.edit.id.dataset.editId = event.srcElement.dataset.id
    html.edit.title.value =  event.srcElement.querySelector('[data-order-title]').textContent
    html.edit.table.value = event.srcElement.querySelector('[data-order-table]').textContent
    // console.log(html.edit.title)
    // console.log(html.add.title.value)
    // console.log(event.srcElement.dataset.id)
    // console.log(event.srcElement)
    // formData.append('name', 'John');
    // formData.append('email', 'john@example.com');
    // for (const [key, value] of formData.entries()) {
    // console.log(key, value);
    // }
    // const data = formData.entries()
    // console.log(data['name'])
}
const handleEditSubmit = (event) => {}

const handleDelete = (event) => {
    // console.log('delete pressed')
    // console.log(event.target.parentNode.parentNode)
    // console.log(event.srcElement.parentNode.parentNode.querySelector(`[data-edit-id="${html.edit.id.dataset.editId}"]`))
    // html.edit.form.reset()
    // console.log(html.columns.ordered)
    html.columns.ordered.removeChild(document.querySelector(`[data-id="${html.edit.id.dataset.editId}"]`))

    document.querySelector('.backdrop').style.display = 'none'
    html.edit.overlay.style.display = 'none'
}

const checkOverlayAndFocusBtn = (overlay) => {
    if (overlay.style.display === 'none') {
        html.other.add.focus()
    }
}

console.log('hey')

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}