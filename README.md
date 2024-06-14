# Usage

## Inject & configure script

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
                // Lead Source. (acceptable values enumerated in the end of this readme)
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

# Use raw API

You can use REST endpoint to generate leads in Mindall CRM. It accepts JSON only.

URL: `POST https://crm.mindall.co/api/api/lead/create/byExternalForm`

### Fields definitions

```yaml
orgId: required, string, uuid. (ID of organization within Mindall CRM)
phone: required, string, only numeric values. (Lead phone)
email: required, string, valid email. (Lead email)
firstname: required if fullName is missing, string. (Lead first name)
lastname: required if fullName is missing, string. (Lead last name)
fullName: required if firstname or lastname is missing, string. (Lead full name)
source: optional, string, enum(available options enumerated in the end of this readme). (Lead source)
sourceId: optional, string. (Additional source information)
propertyReference: optional, string. (Reference to the property in Mindall CRM)
notes: optional, string. (Notes made by lead while completing the form)
```

### Request example

```bash
POST https://crm.mindall.co/api/api/lead/create/byExternalForm

Content-Type: application/json
Accept: application/json

{
  "orgId": "e0efdc46-afd8-4d7c-88b9-9bd241b50084",
  "phone": "12345678912",
  "email": "lead@example.com",
  "firstname": "John",
  "lastname": "Black",
  "fullName": "John Black",
  "source": "googleSearch",
  "sourceId": "tag:3d82cf4793-49b823879",
  "propertyReference": "DUB-3873",
  "notes": "Looking for cheap apartments in the middle of Dubai"
}
```

# Contribution

## Build

1. `pnpm i`
2. Testing is available via index.html

## Deploy

1. `pnpm build`
2. `git push`

# Miscellaneous

## Source enum values:

- linkedIn
- instagram
- facebook
- digitalPress
- website
- landing
- event
- qrCode
- googleSearch
- email
- whatsApp
- call
- googleAds
- facebookAds
- externalAds
- internalAds
- otherAds
- import
- privateContact
- coldCall
- friendRecommendation
- management
- socialMedia
- coldCalling
- referal
- ownPersonalLead
- directCall