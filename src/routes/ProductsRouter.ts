import express, { Request, Response } from "express";
import { executeSQL } from "../database/database_connection";

export const Products = express.Router();
const tabela = "products";

Products.get("/", async (req: Request, res: Response) => {
	try{
		const name = req.query.name;

		if(name){
			const listarProduct = await executeSQL(`SELECT products.*, categorys.name AS category_name, brands.brand_name FROM ${tabela} INNER JOIN categorys ON products.product_category = categorys.id INNER JOIN brands ON products.product_brand = brands.id WHERE product_name LIKE ('%${name}%');`);
			if(JSON.stringify(listarProduct) === "[]"){
				res.statusCode = 200;
				return res.send("Sem produtos cadastrados no sistema");
			}
			res.status(200).send(listarProduct);
		}

		const listarProduct = await executeSQL(`SELECT products.*, categorys.name AS category_name, brands.brand_name FROM ${tabela} INNER JOIN categorys ON products.product_category = categorys.id INNER JOIN brands ON products.product_brand = brands.id;`);
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

Products.get("/:id", async (req: Request, res: Response) =>{
	try{
		const idToSearch: string = req.params.id;
		
		const listarProduct = await executeSQL(`SELECT products.*, categorys.name AS category_name, brands.brand_name FROM ${tabela} INNER JOIN categorys ON products.product_category = categorys.id INNER JOIN brands ON products.product_brand = brands.id WHERE product_id = ${idToSearch};`);
		if(JSON.stringify(listarProduct) === "[]"){
			res.statusCode = 200;
			return res.send("Produto não encontrado");
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

		const { name, image, discount, price, sizes, gender, description, category, colors, brand, status, condition } = req.body;

		if(!name || !image || !price || !gender || !description || !category || !colors || !brand){
			res.statusCode = 400;
			throw new Error("'name', 'image', 'price', 'gender', 'description', 'category', 'colors', 'brand' - são campos obrigatorios, e nao podem vir em branco");
		}

		if(typeof name !== "string"){
			res.statusCode = 400;
			throw new Error("'name' - deve ser enviado no formato string");
		}

		if(name.length < 5){
			res.statusCode = 400;
			throw new Error("'name' - deve conter no minimo 5 caracteres");
		}

		if(typeof image !== "string"){
			res.statusCode = 400;
			throw new Error("'image' - deve ser enviado no formato string");
		}

		if(typeof colors !== "string"){
			res.statusCode = 400;
			throw new Error("'colors' - deve ser enviada no formato string");
		}

		if(typeof price !== "number"){
			res.statusCode = 400;
			throw new Error("'price' - deve ser enviado no formato number");
		}

		if(price <= 0){
			res.statusCode = 400;
			throw new Error("'price' - não pode ser menor ou igual a 0");
		}

		if(typeof gender !== "string"){
			res.statusCode = 400;
			throw new Error("'gender' - deve ser enviado no formato string");
		}

		if (gender !== "masculino" && gender !== "feminino" && gender !== "unisex") {
			res.statusCode = 400;
			throw new Error("'gender' - deve ser 'masculino', 'feminino' ou 'unisex'");
		}

		if(typeof description !== "string"){
			res.statusCode = 400;
			throw new Error("'description' - deve ser enviado no formato string");
		}

		if(description.length < 5){
			res.statusCode = 400;
			throw new Error("'description' - deve ter pelo menos 5 caracteres");
		}

		if(typeof category !== "number"){
			res.statusCode = 400;
			throw new Error("'category' - precisa ser do tipo number");
		}
		const verifyCategory = await  executeSQL(`SELECT * FROM categorys WHERE id = ${category};`);

		if(JSON.stringify(verifyCategory) === "[]"){
			res.statusCode = 400;
			throw new Error("'category' - inexistente");
		}

		if(typeof brand !== "number"){
			res.statusCode = 400;
			throw new Error("'category' - precisa ser do tipo number");
		}
		const verifyBrand = await executeSQL(`SELECT * FROM brands WHERE id = ${brand};`);

		if(JSON.stringify(verifyBrand) === "[]"){
			res.statusCode = 400;
			throw new Error("'brand' - inexistente");
		}

		if(discount || sizes || status || condition){
			if(discount && !sizes && !status && !condition){
				if(typeof discount !== "number"){
					res.statusCode = 400;
					throw new Error("'discount' - deve ser enviado no formato number");
				} // 1

				await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand, product_discount) VALUES 
			('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}', '${discount}');`);
	
				return res.status(201).send("produto criado com sucesso!");
			}

			if(sizes && !discount && !status && !condition){
				if(typeof sizes !== "string"){
					res.statusCode = 400;
					throw new Error("'sizes' - deve ser enviado no formato string");
				} // 2
				await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand,product_sizes) VALUES 
			('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}', '${sizes}');`);
	
				return res.status(201).send("produto criado com sucesso!");
			}

			if(status && !discount && !sizes && !condition){
				if(typeof status !== "number"){
					res.statusCode = 400;
					throw new Error("'status' - deve ser enviado no formato number");
				}
				if(status !== 1 && status !== 2){
					res.statusCode = 400;
					throw new Error("'status' - deve seguir o padrão 1 e 2. sendo 1 ativo e 2 inativo");
				} // 3
				await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand,product_status) VALUES 
			('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}''${status}');`);
	
				return res.status(201).send("produto criado com sucesso!");
			}

			if(condition && !discount && !sizes && !status){
				if(typeof condition !== "number"){
					res.statusCode = 400;
					throw new Error("'condition' - deve ser enviado no formato number");
				} // 4

				if(condition !== 1 && condition !== 2){
					res.statusCode = 400;
					throw new Error("'condition' - deve seguir o padrão 1 e 2. sendo 1 novo e 2 usado");
				}

				await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand,product_condition) VALUES 
			('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}','${condition}');`);
	
				return res.status(201).send("produto criado com sucesso!");
			}
			
			if(discount && sizes && status && condition){
				await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand, product_discount, product_sizes, product_status, product_condition) VALUES 
			('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}', '${discount}', '${sizes}', '${status}', '${condition}');`);
	
				return res.status(201).send("produto criado com sucesso!");
			}
		}

		await executeSQL(`INSERT INTO ${tabela}(product_image, product_price, product_gender, product_name, product_description, product_category, product_colors, product_brand) VALUES 
		('${image}', '${price}', '${gender}', '${name}', '${description}', '${category}', '${colors}', '${brand}')`);

		res.status(201).send("produto criado com sucesso!");	
	}catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Products.put("/:id", async (req: Request, res: Response) => {
	try{
		const idToEdit: string = req.params.id;

		const verify = await  executeSQL(`SELECT * FROM ${tabela} WHERE product_id = ${idToEdit};`);

		if(JSON.stringify(verify) === "[]"){
			res.statusCode = 400;
			throw new Error("PRODUTO inexistente");
		}

		const { name, image, discount, price, sizes, gender, description, category, colors, brand, status, condition } = req.body;

		const produto: Array<string> = [];

		if(name){
			if(typeof name !== "string"){
				res.statusCode = 400;
				throw new Error("'name' - deve ser enviado no formato string");
			}
			if(name.length < 5){
				res.statusCode = 400;
				throw new Error("'name' - deve conter no minimo 5 caracteres");
			}

			produto.push(`product_name = '${name}'`);
		}

		if(image){
			if(typeof image !== "string"){
				res.statusCode = 400;
				throw new Error("'image' - deve ser enviado no formato string");
			}
			produto.push(`product_image = '${image}'`);
		}

		if(colors){
			if(typeof colors !== "string"){
				res.statusCode = 400;
				throw new Error("'colors' - deve ser enviada no formato string");
			}
		}

		if(discount){
			if(typeof discount !== "number"){
				res.statusCode = 400;
				throw new Error("'discount' - deve ser enviado no formato number");
			}
			produto.push(`product_discount = '${discount}'`);
		}

		if(price){
			if(typeof price !== "number"){
				res.statusCode = 400;
				throw new Error("'price' - deve ser enviado no formato number");
			}
			if(price <= 0){
				res.statusCode = 400;
				throw new Error("'price' - não pode ser menor ou igual a 0");
			}
			produto.push(`product_price = '${price}'`);
		}

		if(sizes){
			if(typeof sizes !== "string"){
				res.statusCode = 400;
				throw new Error("'sizes' - deve ser enviado no formato string");
			}

			produto.push(`product_sizes = '${sizes}'`);
		}

		if(status){
			if(typeof status !== "number"){
				res.statusCode = 400;
				throw new Error("'status' - deve ser enviado no formato number");
			}

			if(status !== 1 && status !== 2){
				res.statusCode = 400;
				throw new Error("'status' - deve seguir o padrão 1 e 2. sendo 1 ativo e 2 inativo");
			}

			produto.push(`product_status = '${status}'`);
		}

		if(condition){
			if(typeof condition !== "number"){
				res.statusCode = 400;
				throw new Error("'condition' - deve ser enviado no formato number");
			}

			if(condition !== 1 && condition !== 2){
				res.statusCode = 400;
				throw new Error("'condition' - deve seguir o padrão 1 e 2. sendo 1 novo e 2 usado");
			}

			produto.push(`product_condition = '${condition}'`);
		}

		if(gender){
			if(typeof gender !== "string"){
				res.statusCode = 400;
				throw new Error("'gender' - deve ser enviado no formato string");
			}
			if (gender !== "masculino" && gender !== "feminino" && gender !== "unisex") {
				res.statusCode = 400;
				throw new Error("'gender' - deve ser 'masculino', 'feminino' ou 'unisex'");
			}			

			produto.push(`product_gender = '${gender}'`);
		}

		if(description){
			if(typeof description !== "string"){
				res.statusCode = 400;
				throw new Error("'description' - deve ser enviado no formato string");
			}
			if(description.length < 5){
				res.statusCode = 400;
				throw new Error("'description' - deve ter pelo menos 5 caracteres");
			}

			produto.push(`product_description = '${description}'`);
		}

		if(category){
			if(typeof category !== "number"){
				res.statusCode = 400;
				throw new Error("'category' - precisa ser do tipo number");
			}
			const verify = await  executeSQL(`SELECT * FROM categorys WHERE id = ${category};`);

			if(JSON.stringify(verify) === "[]"){
				res.statusCode = 400;
				throw new Error("'category' - inexistente");
			}


			produto.push(`product_category = '${category}'`);

		}

		if(brand){
			if(typeof brand !== "number"){
				res.statusCode = 400;
				throw new Error("'category' - precisa ser do tipo number");
			}
			const verify = await executeSQL(`SELECT * FROM brands WHERE id = ${brand};`);

			if(JSON.stringify(verify) === "[]"){
				res.statusCode = 400;
				throw new Error("'brand' - inexistente");
			}
			produto.push(`product_brand = '${brand}'`);
		}

		produto.join(", ");

		await executeSQL(`UPDATE ${tabela} SET ${produto} WHERE product_id = ${idToEdit};`);

		res.status(201).send("produto criado com sucesso!");	
	}catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});

Products.delete("/:id", async (req: Request, res: Response) =>{
	try{
		const idToDelete: string = req.params.id;

		const verify = await  executeSQL(`SELECT * FROM ${tabela} WHERE product_id = ${idToDelete};`);

		if(JSON.stringify(verify) === "[]"){
			res.statusCode = 400;
			throw new Error("PRODUTO inexistente");
		}

		await executeSQL(`DELETE FROM ${tabela} WHERE product_id = ${idToDelete}`);
		res.status(200).send("Produto deletado com sucesso");
	}catch (error) {
		if (req.statusCode === 200) {
			res.statusCode = 500;
		}

		if (error instanceof Error) {
			res.send(error.message);
		}
	}
});