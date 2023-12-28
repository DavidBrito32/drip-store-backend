import express, { Router, Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const Users: Router = express.Router();
const tabela = "users";

Users.get("/", async (req: Request, res: Response) => {
	try {
		const listarUsers = await executeSQL(`SELECT * FROM ${tabela};`);
		res.status(200).send(await listarUsers);
	} catch (err) {
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (err instanceof Error) {
			res.send(err.message);
		}
	}
});

Users.post("/", async (req: Request, res: Response) => {
	try {
		const { user_email, user_password, user_level, user_name } = req.body;

		if (!user_email || !user_password || !user_name) {
			res.statusCode = 400;
			throw new Error(
				"'user_email' - 'user_password' - 'user_name' - São campos obrigatorios!"
			);
		}

		if (user_email) {
			if (typeof user_email !== "string") {
				res.statusCode = 400;
				throw new Error("'user_email' - deve ser passado em formato string");
			}

			if (!user_email.includes("@")) {
				res.statusCode = 400;
				throw new Error(
					"'user_email' - deve conter um email valido ex: usuario@email.com"
				);
			}

			const Existe = await executeSQL(
				`SELECT * FROM ${tabela} WHERE user_email = "${user_email}";`
			);

			if (JSON.stringify(Existe) !== "[]") {
				res.statusCode = 400;
				throw new Error("'user_email' - e-mail ja cadastrado");
			}
		}

		if (user_password) {
			if (typeof user_password !== "string") {
				res.statusCode = 400;
				throw new Error("'user_password' - deve ser uma string");
			}
			if (
				!user_password.match(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}/
				)
			) {
				res.statusCode = 400;
				throw new Error(
					"'user_password' - deve ser uma string de no minimo 8 caracteres e que contenha uma letra em maiusculo e um caractere especial"
				);
			}
		}

		if (user_name) {
			if (typeof user_name !== "string") {
				res.statusCode = 400;
				throw new Error("'user_name' - deve ser uma string");
			}

			if (user_name.length <= 3) {
				res.statusCode = 400;
				throw new Error("'user_name' - deve ter no minimo 4 caracteres");
			}
		}

		if (user_level) {
			if (typeof user_level !== "number") {
				res.statusCode = 400;
				throw new Error("'user_level' - deve ser um number");
			}

			if (user_level !== 1 && user_level !== 2) {
				res.statusCode = 400;
				throw new Error("'user_level' - só pode receber valores 1 ou 2");
			}

			await executeSQL(
				`INSERT INTO users(user_email, user_name, user_password, user_level) VALUES ('${user_email}', '${user_name}', '${user_password}', '${user_level}');`
			);

			return res.status(201).send("Usuario Criado com sucesso!");
		}

		await executeSQL(
			`INSERT INTO users(user_email, user_name, user_password) VALUES ('${user_email}', '${user_name}', '${user_password}');`
		);

		res.status(201).send("Usuario Criado com sucesso!");
	} catch (err) {
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (err instanceof Error) {
			res.send(err.message);
		}
	}
});

Users.put("/:id", async (req: Request, res: Response) => {
	try {
		const idToEdit: string = req.params.id;

		const List = await executeSQL(
			`SELECT * FROM  ${tabela} WHERE user_id = ${idToEdit};`
		);

		if (JSON.stringify(List) === "[]") {
			res.statusCode = 400;
			throw new Error("'id' - não encontrado");
		}
		const { user_name, user_level, user_password } = req.body;
		const update: Array<string | number> = [];

		if (
			user_name === undefined &&
      user_password === undefined &&
      user_level === undefined
		) {
			res.statusCode = 400;
			throw new Error(
				"'user_name' - 'user_password' - 'user_level' - Passar ao menos um dos campos mencionados"
			);
		}

		if (user_name) {
			if (typeof user_name !== "string") {
				res.statusCode = 400;
				throw new Error("'user_name' - deve ser enviado no formato 'string'");
			}

			if (user_name.length < 2) {
				res.statusCode = 400;
				throw new Error("'user_name' - deve conter mais de 2 caracteres");
			}

			update.push(`user_name = '${user_name}'`);
		}

		if (user_password) {
			if (typeof user_password !== "string") {
				res.statusCode = 400;
				throw new Error(
					"'user_password' - deve ser enviado no formato 'string'"
				);
			}
			if (
				!user_password.match(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}/
				)
			) {
				res.statusCode = 400;
				throw new Error(
					"'user_password' - deve ser uma string de no minimo 8 caracteres e que contenha uma letra em maiusculo e um caractere especial"
				);
			}

			update.push(`user_password = '${user_password}'`);
		}

		if (user_level) {
			if (typeof user_level !== "number") {
				res.statusCode = 400;
				throw new Error("'user_level' - deve ser enviado no formato 'number'");
			}

			if (user_level !== 1 && user_level !== 2) {
				res.statusCode = 400;
				throw new Error("'user_level' - só pode receber valores 1 ou 2");
			}

			update.push(`user_level = '${user_level}'`);
		}
		update.join(", ");
		await executeSQL(`UPDATE users SET ${update} WHERE user_id = ${idToEdit};`);
		res.status(200).send("Usuario atualizado com sucesso!");
	} catch (err) {
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (err instanceof Error) {
			res.send(err.message);
		}
	}
});

Users.delete("/:id", async (req: Request, res: Response) => {
	try{
		const IdToDelete: string = req.params.id;
		const Existe = await executeSQL(
			`SELECT user_email FROM ${tabela} WHERE user_id = "${IdToDelete}";`
		);

		if (JSON.stringify(Existe) === "[]") {
			res.statusCode = 400;
			throw new Error("'id' - campo não encontrado");
		}

		await executeSQL(`DELETE FROM users WHERE user_id = ${IdToDelete}`);
		res.status(200).send("Usuario deletado com sucesso!");

	}catch (err) {
		if(res.statusCode === 200){
			res.statusCode = 500;
		}

		if(err instanceof Error){
			res.send(err.message);
		}
	}
});
