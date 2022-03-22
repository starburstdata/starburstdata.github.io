### Cloud SQL configuration

The database on Cloud SQL needs to fulfill the following requirements:

* **Database IP address**, use the IP address for the server available as
  **Public IP address** in the Cloud SQL console under **Connect to this
  instance**.
* **Database port**, port of the server available with endpoint.  Typically
  {{page.dbport}} for {{page.dbname}}.
* **Database name**, used only for PostgreSQL databases to identify the specific
  database to connect to.
* **Username**, use a configured user with sufficient access.
* **Password**, use the password for the user.

The database on Cloud SQL needs to fulfill the following requirements:

* Configured for **Public IP**, available in the Cloud SQL console for your
  database in **Connections** - **Public IP** with an **Authorized network**
  configured with the CIDR to allow {{site.terms.sg}} access. The specific IP
  address range/CIDR is dependent on your Google Cloud region, and displayed
  after a **Test connection** execution.
* **Zonal availability** set to **Single zone**.
* User configured with username and password in **Users**.