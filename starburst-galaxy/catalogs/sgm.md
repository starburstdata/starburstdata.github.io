#### Starburst Galaxy metastore

A metastore is necessary to query object storage systems. Starburst Galaxy
includes a metastore for your convenience. You do not need to use and manage a
separate Hive Metastore Service deployment or equivalent system.

Use the Starburst Galaxy metastore in **Metastore configuration** by selecting
**I don't have a metastore**.

Provide the name of the object store **bucket name** and **directory name**. The
location is then used to store the metastore data with the object storage.

Note that deletion of the catalog also results in removal of the Starburst
Galaxy metastore data.
