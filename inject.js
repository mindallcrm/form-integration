/// Configuration

let config = {
    url: 'https://crm.mindall.co/api/api/lead/create/byExternalForm',
    prevent: true,
    formId: '',

    inputs: {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        notes: '',
    },

    meta: {
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

    for (let inputKey in config.meta) {
        data[inputKey] = config.meta[inputKey]
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

            if (!config.prevent) {
                event.target.submit()
            }
        })
        .catch(err => alert(err))
}

function updateForms() {
    if (document.forms.length === 0) {
        console.error('[Mindall CRM] Plugin has not found any forms')
        return false
    }

    if (!config.formId) {
        Array.from(document.forms).forEach(
            form => form.setAttribute('onsubmit', 'saveLead(event)')
        )
        return true
    }

    const form = document.getElementById(config.formId)

    if (!form) {
        console.error(`[Mindall CRM] Form with ID '${config.formId}' not found`)
        return false
    }

    form.setAttribute('onsubmit', 'saveLead(event)')
    return true
}

function inject() {
    if (!config.meta?.sourceId) {
        setDefaultSourceId()
    }

    if (updateForms()) {
        console.info('[Mindall CRM] Successfully installed')
    } else {
        console.error('[Mindall CRM] Installation failed')
    }
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
    console.info(`[Mindall CRM] Setting Source ID from title: '${document.title}'`)
    config.meta.sourceId = document.title
}

window.MINDALL_CRM = {
    init(organizationId, userConfig) {
        if (!organizationId || !userConfig || !userConfig.inputs) {
            console.error('[Mindall CRM] Plugin is not injected due to missing configuration')
            return
        }

        config = updateConfig({...config}, userConfig)
        config.meta.orgId = organizationId

        window.onload = inject
    }
}