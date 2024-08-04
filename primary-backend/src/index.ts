import express  from "express";
import { zapRouter } from "./router/zap.router";
import { userRouter } from "./router/user.router";
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1/user', userRouter)
app.use("/api/v1/zap", zapRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})