import express from 'express'

const app = express()
app.use(express.json())


//ROtas principais
app.get("/",(req,res)=>{
    res.json({message:"Testando rota principal"})
})


const PORT = 5000
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})