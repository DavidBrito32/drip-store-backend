import express from "express";
import cors from "cors";
import { brands } from "./routes/BrandRouter";
import { Banners } from "./routes/BannersRouter";

const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

app.use("/brands", brands);

app.use("/banners", Banners);











app.listen(port, () => {
	console.log(`O servidor esta rodando na porta ${port} no endereço: http://localhost:8000`);
});
