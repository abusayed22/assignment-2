import express, { Request, Response } from "express"
import initDb from "./config/db";
import { authRouter } from "./modules/v1/auth/auth.router";


const app = express();


app.get('/', (req:Request, res:Response) => {
    console.log("paysseee!!!!!!!!!!!!!!")
  res.status(200).json({
    message:"paysi"
  })
});



app.use(express.json());


// Routes
// app.use("/api/v1/auth",authRouter);





// Database sync
initDb()

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});


export default app;
