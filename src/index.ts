import express from "express";
import cors from "cors";
import { brands } from "./routes/BrandRouter";
import { Banners } from "./routes/BannersRouter";
import { Users } from "./routes/UsersRouter";
import { Category } from "./routes/CategoryRoute";
import { Products } from "./routes/ProductsRouter";

const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

app.use("/brands", brands);

app.use("/banners", Banners);

app.use("/users", Users);

app.use("/categories", Category);

app.use("/products", Products);











app.listen(port, () => {
	console.log(`O servidor esta rodando na porta ${port} no endereço: http://localhost:8000`);
});
