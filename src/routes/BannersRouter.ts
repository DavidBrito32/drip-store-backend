import express, { Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const Banners = express.Router();
const tabela = "banners";

Banners.get("/", async (req: Request, res: Response) => {
	try{
		const listarBanners = await executeSQL(`SELECT * FROM ${tabela}`); 
		res.status(200).send(listarBanners);
	}catch(err){
		if(res.statusCode === 200){
			res.statusCode = 500;
		}
		if(err instanceof Error){
			res.send(err.message);
		}
	}
});

Banners.post("/", async (req: Request, res: Response) =>{
	try{
		const { sup_text, sub_text, title, cta_text, cta_color, image } = req.body;
		if(sup_text === undefined || sub_text === undefined || title === undefined || cta_text === undefined || cta_color === undefined || image === undefined){
			res.statusCode = 400;
			throw new Error("'sup_text' - 'sub_text' - 'title' - 'cta_text' - 'cta_color' - 'image' - são campos obrigatorios!");
		}

		if(typeof sup_text !== "string" || typeof sub_text !== "string" || typeof title !== "string" || typeof cta_text !== "string" || typeof cta_color !== "string" || typeof image !== "string"){
			res.statusCode = 400;
			throw new Error("'sup_text' - 'sub_text' - 'title' - 'cta_text' - 'cta_color' - 'image' - Precisa ser to tipo string");
		}

		await executeSQL(`INSERT INTO ${tabela}(sup_text, sub_text, title, cta_text, cta_color, image) VALUES ('${sup_text}', '${sub_text}', '${title}', '${cta_text}', '${cta_color}', '${image}')`);
		res.status(201).send("Banner adicionado com sucesso!");
	}catch (err){
		if(res.statusCode === 200){
			res.statusCode = 500;
		}

		if (err instanceof Error){
			res.send(err.message);
		}
	}
});

Banners.put("/:id", async (req: Request, res: Response) =>{
	try{
		const IdToEdit: string = req.params.id;
		//ver se existe no banco primeiro
		const existe = await executeSQL(`SELECT * FROM ${tabela} WHERE id = ${IdToEdit}`);

		if(JSON.stringify(existe) === "[]"){
			res.statusCode = 404;
			throw new Error("'id' - Inexistente");
		}

		const { sup_text, sub_text, title, cta_text, cta_color, image } = req.body;	
		const update = [];

		if(sup_text === undefined && sub_text === undefined && title === undefined && cta_text === undefined && cta_color === undefined && image === undefined){
			res.statusCode = 400;
			throw new Error("'sup_text' - 'sub_text' - 'title' - 'cta_text' - 'cta_color' - 'image' - Incluir pelo menos um dos campos mencionados");
		}

		if(sup_text){
			if(typeof sup_text !== "string"){
				throw new Error("'sup_text' - precisa ser uma string");
			}

			update.push(`sup_text = '${sup_text}'`);
		}

		if(sub_text){
			if(typeof sub_text !== "string"){
				throw new Error("'sub_text' - precisa ser uma string");
			}

			update.push(`sub_text = '${sub_text}'`);
		}

		if(title){
			if(typeof title !== "string"){
				throw new Error("'title' - precisa ser uma string");
			}
			update.push(`title = '${title}'`);
		}

		if(cta_text){
			if(typeof cta_text !== "string"){
				throw new Error("'cta_text' - precisa ser uma string");
			}

			update.push(`cta_text = '${cta_text}'`);
		}

		if(cta_color){
			if(typeof cta_color !== "string"){
				throw new Error("'cta_color' - precisa ser uma string");
			}

			update.push(`cta_color = '${cta_color}'`);
		}

		if(image){
			if(typeof image !== "string"){
				throw new Error("'image' - precisa ser uma string");
			}

			update.push(`image = '${image}'`);
		}
		
		if(update.length > 0){
			update.join(", ");
			await executeSQL(`UPDATE ${tabela} SET ${update} WHERE id = ${IdToEdit};`);
			res.status(200).send("Banner atualizado com sucesso!");
		}else{
			throw new Error("Informar Pelo menos um campo para update");
		}
		
	}catch (err){
		if(res.statusCode === 200){
			res.statusCode = 500;
		}

		if (err instanceof Error){
			res.send(err.message);
		}
	}
});

Banners.delete("/:id", async (req: Request, res: Response) =>{
	try{
		const IdToDelete: string = req.params.id;
		const existe = await executeSQL(`SELECT * FROM ${tabela} WHERE id = ${IdToDelete}`);

		if(JSON.stringify(existe) === "[]"){
			res.statusCode = 404;
			throw new Error("O 'id' deste banner não existe");
		}

		await executeSQL(`DELETE FROM ${tabela} WHERE id = '${IdToDelete}'`);
		res.status(200).send("Banner deletado com sucesso!");
	}catch (err){
		if(res.statusCode === 200){
			res.statusCode = 500;
		}

		if(err instanceof Error){
			res.send(err.message);
		}
	}
});