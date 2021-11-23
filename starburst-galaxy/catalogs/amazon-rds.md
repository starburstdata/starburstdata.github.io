### Amazon RDS configuration

To configure the connection to your database on Amazon RDS you need to provide
the following details:

* **RDS database host**, use the fully qualified domain name for the server
  available as **Endpoint** in the Amazon RDS console under **Connectivity &
  security**. Typically
  `dbidentifier.random.regionname.rds.amazonaws.com`.
* **RDS database port**, port of the server available with endpoint. Typically
  5432 for PostgreSQL and 3306 for MySQL, but configurable for your database in
  the Amazon RDS console under **Connectivity** - **Databse port**.
* **Database name**, used only for PostgreSQL databases to identify the specific
  database to connect to.
* **RDS master database username**, use the **Master username**.
* **RDS master database password**, use the password for the master user.

The database on Amazon RDS needs to fulfill the following requirements:

* Configured for **Public access**, available in the Amazon RDS console for your
  database in **Connectivity** - **Additional configuration**
* **VPC security group** configured to allow {{site.terms.sg}} access. The
  specific IP address range/CIDR is dependent on your AWS region, and displayed
  after a **Test connection** execution. Add it as an inbound rule to allow the
  range.
* **Database authentication** set to **Password authentication**.

