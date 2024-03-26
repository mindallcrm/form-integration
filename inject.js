const MINDALL_CRM = {
    config: {
        url: 'https://crm.mindall.co/api/api/lead/create/byExternalForm',
        prevent: true,
        formId: '',

        inputs: {
            firstname: {},
            lastname: {},
            email: {},
            phone: {},
            propertyReference: {},
            notes: {},
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
        for (const newKey in newValue) {
            const field = newValue[newKey]

            if (typeof field === 'object' && !Array.isArray(field) && field !== null && !(field instanceof RegExp)) {
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

        console.info('[Mindall CRM] Successfully installed')
    },

    setDefaultSourceId() {
        console.info(`[Mindall CRM] Setting Source ID from title: '${document.title}'`)
        this.config.meta.sourceId = document.title
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
    },

    buildUserData(formHtml) {
        const elements = ['input', 'select', 'textarea'].reduce(
            (acc, selector) => acc.push(...formHtml.querySelectorAll(selector)) && acc,
            []
        )

        const data = {}

        for (let inputKey in this.config.inputs) {
            const fieldSearchRule = this.config.inputs[inputKey]

            let elementsWithValue = []
            if (typeof fieldSearchRule === 'function') {
                data[inputKey] = fieldSearchRule(formHtml)
                continue
            } else if (fieldSearchRule.id) {
                if (fieldSearchRule.id instanceof RegExp) {
                    elementsWithValue = elements.filter(el => fieldSearchRule.id.test(el.id))
                } else {
                    elementsWithValue = elements.filter(el => el.id === fieldSearchRule.id)
                }
            } else if (fieldSearchRule.name) {
                if (fieldSearchRule.name instanceof RegExp) {
                    elementsWithValue = elements.filter(el => fieldSearchRule.name.test(el.name))
                } else {
                    elementsWithValue = elements.filter(el => el.name === fieldSearchRule.name)
                }
            }

            if (elementsWithValue.length) {
                data[inputKey] = elementsWithValue[0].value || null
            }
        }

        for (let key in data) {
            if (data[key] === null) {
                delete data[key]
            }
        }

        return data
    },

    buildMetaData() {
        return this.config.meta
    },

    async handleFormSubmit(event) {
        event.preventDefault()

        const data = {
            ...this.buildUserData(event.target),
            ...this.buildMetaData(),
        }

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
}

document.addEventListener('submit', (event) => {
    if (event.target.tagName.toLowerCase() !== 'form') {
        return
    }

    if (MINDALL_CRM.config.formId && MINDALL_CRM.config.formId !== event.target.id) {
        return
    }

    MINDALL_CRM.handleFormSubmit(event)
}, true)

window.MINDALL_CRM = MINDALL_CRM