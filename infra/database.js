import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    // Executa a consulta com o objeto `queryObject` que deve conter `text` e `values`
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error; // Repassa o erro para quem chamou a função
  } finally {
    await client.end(); // Garante que a conexão será fechada, mesmo em caso de erro
  }
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "development" ? false : true;
}
