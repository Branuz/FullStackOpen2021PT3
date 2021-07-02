require("dotenv").config()
const { response } = require("express")
const express = require ("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/note')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - '));



const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

  

app.get('/api/persons', (req, resp) => {
    Person.find({}).then(x => {
        resp.json(x)
    })
  })

app.get("/info",(req, resp) =>{
    const date = new Date()
    console.log(date)
    resp.send(
           " <p>Phonebook has info for "+ persons.length+" people</p> <p>"+date+"</p> ")
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(x => {
        if(x){
            response.json(x)
        }else{response.status(404).end()}
    })
    .catch(error => next(error))
  })

app.delete("/api/persons/:id", (request, response, next) =>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }
  
    const person = new Person({
      id: Math.floor(Math.random()*10000),
      name: body.name,
      number: body.number
    })

    /*if(Person.find(x => x.name===person.name)){
        return response.status(400).json({ 
            error: 'Name must be unique' 
          })
    }*/

    person.save().then(savedNote => {
        response.json(savedNote)
      })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)
  
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log("Server running on port", PORT)
})