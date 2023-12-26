# Change the form manually

1. Set the `target`
2. TODO

# Inject the script

### Minimum configuration

```html

<script src="https://example.com/mindall-crm-plugin.js"></script>
<script>
    window.MINDALL_CRM.init({
        inputs: {
            // Names of fields in the form. (Required)
            firstname: 'wpforms[fields][0][first]',
            lastname: 'wpforms[fields][0][last]',
            phone: 'wpforms[fields][3]',
            email: 'wpforms[fields][1]',
            notes: 'wpforms[fields][2]',
        },
        hiddenInputs: {
            // Organization ID in Mindall CRM. (Required)
            orgId: "dd6175f2-ad36-46a8-bfa6-31d0b2f49cff",
        },
    })
</script>
```

### Available configuration
```html

<script src="https://example.com/mindall-crm-plugin.js"></script>
<script>
    window.MINDALL_CRM.init({
        // Url to send a request to.
        // Default: 'https://crm.mindall.co/api/api/lead/create/byExternalForm'
        url: 'https://example.com/send-the-request-here',

        // Whether to resubmit a form or not.
        // Default: false
        submitDefaultForm: true,

        inputs: {
            firstname: 'wpforms[fields][0][first]',
            lastname: 'wpforms[fields][0][last]',
            phone: 'wpforms[fields][3]',
            email: 'wpforms[fields][1]',
            notes: 'wpforms[fields][2]',
        },

        hiddenInputs: {
            orgId: 'a71de314-8041-4c86-a7b4-9ad22c37fe9b',

            // Lead Source. (acceptable values enumerated in lead_source type in PostgreSQL)
            // Default: 'website'
            source: 'landing',

            // Lead Source ID.
            // Default: title value of the current page
            sourceId: 'Best Landing #29834',
        },
    })
</script>
```