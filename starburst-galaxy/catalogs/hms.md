#### Hive Metastore Service

You can use a Hive Metastore Service (HMS) to manage the metadata about your
object storage. The HMS must be located in the same cloud provider and region as
the object storage itself.

A connection to the HMS can be established directly, if the {{site.terms.sg}} IP
range/CIDR is allowed to connect.

If the HMS is only accessible inside the virtual private cloud (VPC) of the
cloud provider, you can [use an SSH tunnel](../security/ssh-tunnels.html) with a
bastion host in the VPC.

In both cases, configure access with the following parameters:

* **Hive Metastore host**, the fully qualified domain name of the HMS server.
* **Hive Metastore port**, the port used by the HMS, typically 9083.
* **Allow creating external tables**, switch to indicate if new tables can be
  created in the objects storage and HMS from {{site.terms.sg}} with [CREATE
  TABLE](../../latest/sql/create-table.html) or [CREATE TABLE
  AS](../../latest/sql/create-table-as.html).
* **Allow writing to external tables**, switch to indicate if [data management
  write operations](../../latest/language/sql-support.html#data-management) are
  permitted.
