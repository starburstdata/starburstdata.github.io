### Azure Database configuration

The database on Azure Database needs to fulfill the following requirements:

* **DB server host**, use the fully qualified domain name for the server
  available as **Server name** in **Essentials**, as well as the **Connections
  strings** in the Azure Database console.
* **DB server port**, port of the server available with endpoint. Typically 5432
  for PostgreSQL and 3306 for MySQL.
* **Database name**, used only for PostgreSQL databases to identify the specific
  database to connect to.
* **DB server admin login name**, use the **Admin username** of the
  **Administrator account**.
* **DB server admin password**, use the password for the user.

The database on Cloud SQL needs to fulfill the following requirements from the
**Connection security** section of the **Settings** for the database:

* A firewall rule configured for the {{site.terms.sg}} IP address range with
  **Start IP** and **End IP** configured with a random **Firewall rule name**.
* **TLS setting** configured for the **Minimum TLS version** as 1.2