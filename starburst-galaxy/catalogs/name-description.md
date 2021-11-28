### Define catalog name and description

The **Name** of the catalog is visible in Query editor and other clients. It is
used to identify the catalog when writing SQL or showing the catalog and nested
schemas and tables in client applications.

The name is displayed in Query editor, and when running a [SHOW
CATALOGS](../../latest/sql/show-catalogs.html). It is used to fully qualify the
name of any table in SQL queries following the
``catalogname.schemaname.tablename`` syntax. For example, you can run the
following query in the demo cluster without setting any context of catalog or
schema.

```sql
SELECT * FROM tpch.sf1.nation;
```

The **Description** is a short, optional paragraph that provides more details
about the catalog than the name alone. It appears in the user interface and can
help other users to determine what data can be accessed with the catalog.
