/// Configuration

let config = {
    url: 'https://{domain}/api/lead/create/byExternalForm',

    inputs: {
        firstname: 'firstName',
        lastname: 'lastName',
        email: 'email',
        phone: 'phone',
        notes: 'notes',
    },

    hiddenInputs: {
        // Required
        orgId: '{uuid}',
        sourceId: '{?}',

        // Optional
        source: '',
    },
}

// TODO delete
config.url = 'http://127.0.0.1:8000/api/lead/create/byExternalForm'
config.inputs.firstname = 'wpforms[fields][0][first]'
config.inputs.lastname = 'wpforms[fields][0][last]'
config.inputs.phone = 'wpforms[fields][3]'
config.inputs.email = 'wpforms[fields][1]'
config.inputs.notes = 'wpforms[fields][2]'

config.hiddenInputs.orgId = '55c99ec5-6b8b-4f85-8837-a8101ce240ad'
config.hiddenInputs.sourceId = 'Sabiha or whatever'
config.hiddenInputs.source = ''
//

///

function formatData(formData) {
    const data = {}

    for (let inputKey in config.inputs) {
        data[inputKey] = formData.get(config.inputs[inputKey])
    }

    for (let inputKey in config.hiddenInputs) {
        data[inputKey] = config.hiddenInputs[inputKey]
    }

    return JSON.stringify(data)
}

async function apiCall(formData) {
    return fetch(config.url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: formatData(formData)
    })
}

window.saveLead = async (event) => {
    event.preventDefault()

    const data = new FormData(event.target)
    await apiCall(data)
}

function getButton(form) {
    return form.querySelector('[type="submit"]')
}

function addHiddenField(form, key, value) {
    const input = document.createElement('input')

    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', value)

    form.appendChild(input)
}

function addHiddenFields(form) {
    const additionalFields = config.hiddenInputs

    for (let key in additionalFields) {
        if (!additionalFields[key]) {
            continue;
        }

        addHiddenField(form, key, additionalFields[key])
    }
}

function setSubmitHandler(form) {
    form.setAttribute('onsubmit', 'saveLead(event)')
}

function embed(form) {
    addHiddenFields(form)
    setSubmitHandler(form)
}

function inject() {
    Array.from(document.forms).forEach(
        form => embed(form)
    )
}

window.onload = () => {
    inject()
}