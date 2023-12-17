import mysql2 from "mysql2/promise";

export const executeSQL = async (SQL: string) => {
	const connection = await mysql2.createConnection({
		host: "localhost",
		user: "admin",
		password: "280819",
		database: "Digital_Store",
		port: 3306,
	});

	const [resultados] = await connection.query(SQL);
	connection.destroy();

	return resultados;
};
