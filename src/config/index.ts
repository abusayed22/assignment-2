import path from "path";
import dotenv from "dotenv";




dotenv.config({path:path.join(process.cwd(),".env")})


const config ={
    port : process.env.PORT,
    connectStr: process.env.CONNECTION_STR,
    jwt_secret: process.env.JWT_SECRET,
}


export default config;
