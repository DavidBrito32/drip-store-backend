import express, { Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const Category = express.Router();
const tabela = "categorys";

Category.get("/", async (req: Request, res: Response) => {
	try {
		const ListarCategory = await executeSQL(`SELECT * FROM ${tabela};`);
		res.status(200).send(ListarCategory);
	} catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Category.post("/", async (req: Request, res: Response) => {
	try {
		const { name } = req.body;

		if (!name) {
			res.statusCode = 400;
			throw new Error("'name' - não pode ser omitido");
		}

		if (name) {
			if (typeof name !== "string") {
				res.status(400).send("'name' - Precisa ser enviado no formato string");
				return;
			}

			if (name.length < 5) {
				res.status(400).send("'name' - Precisa ter no mínimo 5 caracteres");
				return;
			}

			const existente = await executeSQL(
				`SELECT * FROM ${tabela} WHERE name = '${name}';`
			);

			if (JSON.stringify(existente) !== "[]") {
				res.statusCode = 400;
				throw new Error("Categoria ja cadastrada");
			}
		}

		await executeSQL(`INSERT INTO ${tabela} (name) VALUES ('${name}');`);
		res.status(200).send("Categoria cadastrada com sucesso");
	} catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}
		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Category.put("/:id", async (req: Request, res: Response) => {
	try {
		const idToEdit: string = req.params.id;

		const existente = await executeSQL(
			`SELECT * FROM ${tabela} WHERE id = '${idToEdit}';`
		);

		if (JSON.stringify(existente) === "[]") {
			res.statusCode = 400;
			throw new Error("Categoria inexistente");
		}

		const { name } = req.body;

		if (!name) {
			res.statusCode = 400;
			throw new Error("'name' - é obrigatorio para esta operação");
		}

		if (name) {
			if (typeof name !== "string") {
				res.status(400).send("'name' - Precisa ser enviado no formato string");
				return;
			}

			if (name.length < 5) {
				res.status(400).send("'name' - Precisa ter no mínimo 5 caracteres");
				return;
			}
		}

		await executeSQL(
			`UPDATE ${tabela} SET name = '${name}', updated_at = CURRENT_TIMESTAMP() WHERE id = ${idToEdit};`
		);

		res.status(200).send("Atualizado com sucesso!");
	} catch (error) {
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Category.delete("/:id", async (req: Request, res: Response) => {
	try {
		const idToDelete: string = req.params.id;

		const existente = await executeSQL(
			`SELECT * FROM ${tabela} WHERE id = '${idToDelete}';`
		);

		if (JSON.stringify(existente) === "[]") {
			res.statusCode = 400;
			throw new Error("Categoria inexistente");
		}

		await executeSQL(`DELETE FROM ${tabela} WHERE id = ${idToDelete};`);
		res.status(200).send("Deletado com sucesso");
	} catch (error) {
		if (res.statusCode === 400) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});
