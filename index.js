const { response } = require("express")
const express = require ("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

let persons = [
    {
        id:1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Loverlance",
        number: "39-44-541234"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-454-4214214"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-24-1554336"
    }
]


morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - '));


app.get('/api/persons', (req, resp) => {
    resp.json(persons)
  })

app.get("/info",(req, resp) =>{
    const date = new Date()
    console.log(date)
    resp.send(
           " <p>Phonebook has info for "+ persons.length+" people</p> <p>"+date+"</p> ")
})

app.get("/api/persons/:id", (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)

    if(person) {
        response.json(person)
    }else{
        response.status(404).end()
        console.log("Person not found")
    }
})

app.delete("/api/persons/:id", (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter( x =>x.id !==id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
  
    const person = {
      id: Math.floor(Math.random()*10000),
      name: body.name,
      number: body.number
    }
    if(persons.find(x => x.name===person.name)){
        return response.status(400).json({ 
            error: 'Name must be unique' 
          })
    }else{
    persons = persons.concat(person)
  
    response.json(person)
  }})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log("Server running on port", PORT)
})