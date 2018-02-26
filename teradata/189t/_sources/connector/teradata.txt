==================
Teradata Connector
==================

Teradata provides a low latency high performing connector that
supports high concurrency and parallel processing between Teradata
and Presto. The Teradata connector (also known as Presto-To-Teradata QueryGrid)
can initiate a query from Presto to reach out to Teradata. The connector is
architected to be as efficient as possible, leveraging SQL pushdown, column pruning,
auto data conversion, and compression as well as optimized CPU usage.

This QueryGrid connector is proprietary and only available from Teradata.
Teradata also provides a Teradata-to-Presto QueryGrid connector, to
allow querying data in Presto from Teradata. See :doc:`QueryGrid
<../querygrid>`.

Contact **presto@teradata.com** for more information to obtain an
evaluation of the Presto Teradata QueryGrid Connectors.

Once QueryGrid is installed you can add a `teradata.properties` file
to query from the **teradata** catalog. For example, if you have a
sales table in Teradata and want to get the average price for the
state of Massachusetts, execute the following query in Presto —

.. code-block:: none
   
   SELECT AVG(price)
   FROM teradata.sales.transactions
   WHERE state=’MA’;

It is also possible to join data from Teradata with different data sources
available in Presto.

The Presto-to-Teradata QueryGrid connector has simple, easy-to-use syntax,
enabling a business user to quickly and interactively query between
systems.


