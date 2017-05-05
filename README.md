# repairshopr-alert-manager
A NodeJS API Monitor to facilitate faster alerting on Repairshopr Tickets

Repairshopr has very limited notifications options that do not allow for filtering based on status or subject content.  Additionally, the ticket automation triggers are run only at an hour interval.  This solution is ineffective for time sensitive notifications such as emergency tickets.

This project aims to create an API monitor to watch for tickets of high priority that require special alerts.   On first iteration it will watch for tickets with a status of 'New' and the term 'Emergency' in the subject.
