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

///

function formatData(formData) {
    const data = {}

    for (let inputKey in config.inputs) {
        data[inputKey] = formData.get(config.inputs[inputKey])
    }

    for (let inputKey in config.hiddenInputs) {
        data[inputKey] = config.hiddenInputs[inputKey]
    }

    return data
}

async function apiCall(data) {
    return fetch(config.url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

window.saveLead = async (event) => {
    event.preventDefault()

    const data = formatData(new FormData(event.target))

    apiCall(data)
        .then(async response => {
            if (!response.ok) {
                const body = await response.text()
                console.error(body)

                return Promise.reject(`${response.statusText}`)
            }

            event.target.submit()
        })
        .catch(err => alert(err))
}

function inject() {
    Array.from(document.forms).forEach(
        form => form.setAttribute('onsubmit', 'saveLead(event)')
    )
}

window.onload = () => {
    inject()
}