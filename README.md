# sharepoint-wb-ibese-upload

## Summary

Webpart is created to provide a simple interface/abstraction for users to upload xlsx files to Sharepoint.
Project makes use of PNP/js, React and Fluent Ui.
Rush stack compilier was also updated to 4.2

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.13-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> A Document Library on your sharepoint tenant, make sure the library is in the same site you will be deploying the application
> A Sharepoint List with sample columns below, also make sure the list exist in the same site as deployment
| department: string | users: People/Group(s) | role: Choice: "User","Admin"|
| ------------------ | ---------------------- | --------------------------- |
| HR                 | user.user@tenant.com   | "User"                      |
> Make sure to change the initial page to match your tenant in the directory `config/serv.json`

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| ibeseUpload | Mubarak Yahaya  |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | July 1st, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- Make sure to change the initial page to match your tenant in the directory `config/serve.json`
- Add the names of the cretaed document library and users list to the Webpart properties before deployment
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.
> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from <http://aka.ms/m365pnp>.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
