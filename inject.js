const MINDALL_CRM = {
    config: {
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
    },
    init(organizationId, userConfig) {
        if (!organizationId || !userConfig || !userConfig.inputs) {
            console.error('[Mindall CRM] Plugin is not injected due to missing configuration')
            return
        }

        this.config = this.updateConfig({...this.config}, userConfig)
        this.config.meta.orgId = organizationId

        window.onload = () => this.inject()
    },
    updateConfig(defaultValue, newValue) {
        for (const newKey in defaultValue) {
            const field = newValue[newKey] ?? undefined

            if (field === undefined) {
                continue
            }

            if (typeof field === 'object' && !Array.isArray(field) && field !== null) {
                defaultValue[newKey] = this.updateConfig(defaultValue[newKey], field)
            } else {
                defaultValue[newKey] = field
            }
        }

        return defaultValue
    },
    inject() {
        if (!this.config.meta?.sourceId) {
            this.setDefaultSourceId()
        }

        if (this.updateForms()) {
            console.info('[Mindall CRM] Successfully installed')
        } else {
            console.error('[Mindall CRM] Installation failed')
        }
    },
    setDefaultSourceId() {
        console.info(`[Mindall CRM] Setting Source ID from title: '${document.title}'`)
        this.config.meta.sourceId = document.title
    },
    formatData(formData) {
        const data = {}

        for (let inputKey in this.config.inputs) {
            data[inputKey] = formData.get(this.config.inputs[inputKey])
        }

        for (let inputKey in this.config.meta) {
            data[inputKey] = this.config.meta[inputKey]
        }

        return data
    },
    updateForms() {
        if (document.forms.length === 0) {
            console.error('[Mindall CRM] Plugin has not found any forms')
            return false
        }

        if (!this.config.formId) {
            Array.from(document.forms).forEach(
                form => form.setAttribute('onsubmit', 'saveLead(event)')
            )
            return true
        }

        const form = document.getElementById(this.config.formId)

        if (!form) {
            console.error(`[Mindall CRM] Form with ID '${this.config.formId}' not found`)
            return false
        }

        form.setAttribute('onsubmit', 'saveLead(event)')
        return true
    },
    async apiCall(data) {
        return fetch(this.config.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }
}

window.saveLead = async (event) => {
    event.preventDefault()

    const data = MINDALL_CRM.formatData(new FormData(event.target))

    MINDALL_CRM.apiCall(data)
        .then(async response => {
            if (!response.ok) {
                const errorMessage = response.statusText || 'Request failed'
                return Promise.reject(errorMessage)
            }

            if (!MINDALL_CRM.config.prevent) {
                event.target.submit()
            }
        })
        .catch(err => alert(err))
}

window.MINDALL_CRM = MINDALL_CRM