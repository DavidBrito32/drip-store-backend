import express, { Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const brands = express.Router();
const tabela: string = "brands";

brands.get("/", async (req: Request, res: Response) => {
	try {
		const listarBrands = await executeSQL(`SELECT * FROM ${tabela}`);
		console.log(listarBrands);
		res.status(200).send(await listarBrands);
	} catch (error) {
		const status = res.statusCode;
		if (status === 200) {
			res.statusCode = 500;
		}
		if (error instanceof Error) {
			res.send("Erro inesperado");
		}
	}
});

brands.post("/", async (req: Request, res: Response) => {
	try {
		const { brand_name, brand_status } = req.body;

		if(!brand_name){
			res.statusCode = 400;
			throw new Error("'brand_name' - É um campo obrigatorio.");
		}
		if(typeof brand_name !== "string"){
			res.statusCode = 400;
			throw new Error("'brand_name' - Precisa ser uma String.");
		}
		
		if(brand_status){
			if(typeof brand_status !== "number" ){
				res.statusCode = 400;
				throw new Error("'brand_status' - Precisa ser um Numero.");
			}

			await executeSQL(`INSERT INTO ${tabela}(brand_name, brand_status) VALUES ('${brand_name}', '${brand_status}');`);
			res.status(201).send("Brand Adicionada com sucesso!");
		}else{
			await executeSQL(`INSERT INTO ${tabela}(brand_name) VALUES ('${brand_name}');`);
			res.status(201).send("Brand Adicionada com sucesso!");
		}
	} catch (error) {
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

brands.put("/:id", async (req: Request, res: Response) => {
	try{
		const idToEdit: string = req.params.id;
		//primeiro preciso saber se existe no banco
		const existe = await executeSQL(`SELECT * FROM ${tabela} WHERE brand_id = ${idToEdit}`);

		if(JSON.stringify(existe) === "[]"){
			res.statusCode = 404;
			throw new Error("'id' - Não encontrado");
		}

		const { brand_name, brand_status } = req.body;
		if(brand_name === undefined && brand_status === undefined){
			res.statusCode = 400;
			throw new Error("Atenção passar ao menos um parametro para atualização: 'brand_name' ou 'brand_status' ou ambos");
		}
		
		if(brand_name !== undefined && brand_status !== undefined){
			if(typeof brand_name !== "string"){
				res.statusCode = 400;
				throw new Error("'brand_name' - Deve ser uma string");
			}
			if(typeof brand_status !== "number"){
				res.statusCode = 400;
				throw new Error("'brand_status' - Deve ser uma string");
			}
			await executeSQL(`UPDATE ${tabela} SET brand_name = '${brand_name}', brand_status = '${brand_status}' WHERE brand_id = ${idToEdit};`);
			
			res.status(200).send("Brand Atualizada com sucesso!");
		}
		if(brand_name !== undefined && brand_status === undefined){
			if(typeof brand_name !== "string"){
				res.statusCode = 400;
				throw new Error("'brand_name' - Deve ser uma string");
			}
			await executeSQL(`UPDATE ${tabela} SET brand_name = '${brand_name}' WHERE brand_id = ${idToEdit};`);
			
			res.status(200).send("Brand Atualizada com sucesso!");
		}
		if(brand_name === undefined && brand_status !== undefined){
			if(typeof brand_status !== "number"){
				res.statusCode = 400;
				throw new Error("'brand_status' - Deve ser uma string");
			}
			await executeSQL(`UPDATE ${tabela} SET brand_status = '${brand_status}' WHERE brand_id = ${idToEdit};`);
			
			res.status(200).send("Brand Atualizada com sucesso!");
		}
		
	}catch (error){
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

brands.delete("/:id", async (req: Request, res: Response) =>{
	try{
		const idToDelete: string = req.params.id;
		//primeiro preciso saber se existe no banco
		const existe = await executeSQL(`SELECT * FROM ${tabela} WHERE brand_id = ${idToDelete}`);

		if(JSON.stringify(existe) === "[]"){
			res.statusCode = 404;
			throw new Error("'id' - Não encontrado");
		}

		await executeSQL(`DELETE FROM ${tabela} WHERE brand_id = ${idToDelete};`);
		res.status(200).send("Deletado com sucesso");

	}catch (error){
		if (res.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});
