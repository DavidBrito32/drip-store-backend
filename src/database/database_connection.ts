import mysql2 from "mysql2/promise";

export const executeSQL = async (SQL: string) => {
	const connection = await mysql2.createConnection({
		host: "localhost",
		user: "Admin",//Nome de usuario cadastrado no banco: (caso não tenha feito - geralmente é o root)
		password: "280819",
		database: "Digital_Store", //Nome do banco criado (tem que ser exatamente o mesmo nome)
		port: 3306,
	});

	const [resultados] = await connection.query(SQL);
	connection.destroy();

	return resultados;
};
