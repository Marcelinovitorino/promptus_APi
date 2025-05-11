import express from 'express'
import categoriaRoutes from './routes/Categoria.js'
import localizacaoRoutes from'./routes/localizacao.js'

const app = express()
app.use(express.json())


//ROtas principais
app.get("/",(req,res)=>{
    res.json({message:"Testando rota principal"})
})

app.use("/",categoriaRoutes)
app.use("/",localizacaoRoutes)
const PORT = 5000
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})