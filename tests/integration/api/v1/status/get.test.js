test("GET to /api/v1/status should return 200 with database version, max connections, and opened connections", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  // Verificação do campo updated_at
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  // Verificação da versão do banco de dados
  expect(responseBody.dependecies.database.version).toEqual("16.0");

  // Verificação de max_connections
  expect(typeof responseBody.dependecies.database.max_connections).toBe(
    "number",
  );
  expect(responseBody.dependecies.database.max_connections).toBeGreaterThan(0);

  //Teste para verificar opened_connections
  expect(typeof responseBody.dependecies.database.opened_connections).toBe(
    "number",
  );
  expect(responseBody.dependecies.database.opened_connections).toEqual(1);
});
