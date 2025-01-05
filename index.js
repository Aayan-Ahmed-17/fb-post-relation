import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import connectDB from "./src/db/index.js";



const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


// app.use('/api/v1', courseRoutes)
// app.use('/api/v1', studentRoutes)

// connectDB()
//     .then(() => {
//         app.listen(process.env.PORT, () => {
//             console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.log("MONGO DB connection failed !!! ", err);
//     });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})