import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  // Consultar versão do banco de dados
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  // Consultar o número máximo de conexões do banco de dados
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnectionsValue = parseInt(
    maxConnectionsResult.rows[0].max_connections,
    10,
  );

  // Consultar o número de conexões abertas no banco de dados
  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName], // Parâmetro é passado como um array
  });

  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  // Construir a resposta JSON
  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
      },
    },
  });
}

export default status;
