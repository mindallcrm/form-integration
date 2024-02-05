# Change the form manually

### TODO

# Inject the script

## Build & Deploy

1. `pnpm i`
2. `pnpm build`
3. Find generated bundle inside `dist/` and put it on CDN

## Inject & Configure

### Minimum configuration

```html
<script src="https://cdn-example.com/mindall-crm-plugin.js"></script>
<script>
    window.MINDALL_CRM.init(
        // Organization ID in Mindall CRM. (Required)
        'dd6175f2-ad36-46a8-bfa6-31d0b2f49cff',
        {
            inputs: {
                // Names of fields in the form. (Required)
                fullName: '<fullName field>'
                phone: 'wpforms[fields][3]',
                email: 'wpforms[fields][1]',
                notes: 'wpforms[fields][2]',
            },
        },
    )
</script>
```

### Available configuration

```html

<script src="https://cdn-example.com/mindall-crm-plugin.js"></script>
<script>
    window.MINDALL_CRM.init(
        'a71de314-8041-4c86-a7b4-9ad22c37fe9b',
        {
            // Url to send a request to.
            // Default: 'https://crm.mindall.co/api/api/lead/create/byExternalForm'
            url: 'https://example.com/send-the-request-here',

            // Set Form ID to update only certain form, but not all of them.
            // Default: all forms on the page
            formId: 'wpforms-form-233',

            // Whether to prevent form submit after sending request or not.
            // Default: true
            prevent: false,

            inputs: {
                // You need to specify either fullName (as in the first example) or firstname & lastname
                firstname: 'wpforms[fields][0][first]',
                lastname: 'wpforms[fields][0][last]',
                phone: 'wpforms[fields][3]',
                email: 'wpforms[fields][1]',
                notes: 'wpforms[fields][2]',
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