import express, { Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const Products = express.Router();
const tabela = "products";

Products.get("/", async (req: Request, res: Response) => {
	try{
		const listarProduct = await executeSQL(`SELECT * FROM ${tabela};`);
		if(JSON.stringify(listarProduct) === "[]"){
			res.statusCode = 200;
			return res.send("Sem produtos cadastrados no sistema");
		}
		res.status(200).send(listarProduct);
	}catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Products.post("/", async (req: Request, res: Response) => {
	try{
		const { name, image, discount, price, sizes, gender, description, category, colors, brand } = req.body;

		if(!name || !image || !discount || !price || !sizes || !gender || !description || !category || !colors || !brand){
			res.statusCode = 400;
			throw new Error("'name', 'image', 'discount', 'price', 'sizes', 'gender', 'description', 'category', 'colors', 'brand' - são campos obrigatorios, e nao podem vir em branco");
		}


	}catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});