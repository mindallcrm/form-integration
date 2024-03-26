# Usage

## Inject & Configure

To create leads in CRM insert the script and configure it.
Required fields are organization ID and inputs descriptions.
You can find configuration examples below.

### Minimum configuration

```html
<script src="https://cdn.jsdelivr.net/gh/mindallcrm/form-integration/dist/inject.js"></script>
<script>
    window.MINDALL_CRM.init(
        // Organization ID in Mindall CRM. (Required)
        'dd6175f2-ad36-46a8-bfa6-31d0b2f49cff',
        {
            // Config to discover needed fields within the form. (Required)
            // It is possible to specify field's name or id using either RegExp or exact string match.
            // Also, it's possible to pass a callback to build a value manually.
            inputs: {
                firstname: { name: 'firstname-field-name' },
                lastname: { name: /^lastname-.*/ },
                phone: (formHtml) => {
                    return formHtml.querySelector('input').value.replaceAll(/\D/g, '')
                },
                email: { id: 'email-field-id' },
            },
        },
    )
</script>
```

### Available configuration

```html

<script src="https://cdn.jsdelivr.net/gh/mindallcrm/form-integration/dist/inject.js"></script>
<script>
    window.MINDALL_CRM.init(
        'a71de314-8041-4c86-a7b4-9ad22c37fe9b',
        {
            // Url to send a request to.
            // Default: 'https://crm.mindall.co/api/api/lead/create/byExternalForm'
            url: 'https://example.com/send-the-request-here',

            // Set Form ID to watch only certain form, but not all of them.
            // Default: all forms on the page
            formId: 'wpforms-form-233',

            // Whether to prevent form submit after sending request or not.
            // Default: true
            prevent: false,

            inputs: {
                firstname: { name : 'wpforms[fields][0][first]' },
                lastname: { name: 'wpforms[fields][0][last]' },
                phone: { name: 'wpforms[fields][3]' },
                email: { name: 'wpforms[fields][1]' },
                propertyReference: { name: 'wpforms[fields][4]' },
                notes: { name: 'wpforms[fields][2]' },
            },

            meta: {
                // Lead Source. (acceptable values enumerated in lead_source type in PostgreSQL)
                // Default: 'website'
                source: 'landing',

                // Lead Source ID.
                // Default: title value of the current page
                sourceId: 'Best Landing #29834',
            },
        }
    )
</script>
```

# Contribution

## Build

1. `pnpm i`
2. Testing is available via index.html

## Deploy

1. `pnpm build`
2. `git push`