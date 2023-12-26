/// Configuration

let config = {
    url: 'https://crm.mindall.co/api/api/lead/create/byExternalForm',
    submitDefaultForm: false,

    inputs: {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        notes: '',
    },

    hiddenInputs: {
        orgId: '',
        sourceId: '',
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
                const errorMessage = response.statusText || 'Request failed'
                return Promise.reject(errorMessage)
            }

            if (config.submitDefaultForm) {
                event.target.submit()
            }
        })
        .catch(err => alert(err))
}

function inject() {
    if (document.forms.length === 0) {
        console.error('[Mindall CRM] Plugin has not found any forms')
        return
    }

    if (!config.hiddenInputs?.sourceId) {
        setDefaultSourceId()
    }

    Array.from(document.forms).forEach(
        form => form.setAttribute('onsubmit', 'saveLead(event)')
    )

    console.info('[Mindall CRM] Successfully installed')
}

function updateConfig(defaultValue, newValue) {
    for (const newKey in defaultValue) {
        const field = newValue[newKey] ?? undefined

        if (field === undefined) {
            continue
        }

        if (typeof field === 'object' && !Array.isArray(field) && field !== null) {
            defaultValue[newKey] = updateConfig(defaultValue[newKey], field)
        } else {
            defaultValue[newKey] = field
        }
    }

    return defaultValue
}

function setDefaultSourceId() {
    console.info(`[Mindall CRM] Setting Source ID from title: ${document.title}`)
    config.hiddenInputs.sourceId = document.title
}

window.MINDALL_CRM = {
    init(userConfig) {
        if (!userConfig || !userConfig.hiddenInputs?.orgId) {
            console.error('[Mindall CRM] Plugin is not injected due to missing configuration')
            return
        }

        config = updateConfig({...config}, userConfig)

        window.onload = inject
    }
}