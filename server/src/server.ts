import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/router.ts";

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req,res)=>{
console.log('..............',req);
})


app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
