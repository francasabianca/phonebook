const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
//app.use(morgan(':method :url :status :response-time ms :body'))
//data returned in get method

let persons =
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const personNameAlreadyExists = (name) => {
  const personExists = persons.find(p => p.name === name)
  return personExists
}

//GET method that returns number of persons in phonebook
app.get('/api/info', (request, response) => {
  const personsNumber = persons.length
  const date = new Date()
  response.send(
    `<h1>Phonebook has info for ${personsNumber} persons</h1>` +
    `<h1>${date}</h1>`
  )
})

//GET method that return all resources
app.get('/api/persons', (request, response) => {
  console.log(persons)
  response.json(persons)
})

//GET method that return a resource by id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)  
  person ? response.json(person) : response.status(404).end()
})

//DELETE method that removes a resource by id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id =  Math.floor(Math.random() * 1000)
  const body = request.body

  if(!body || !body.number || !body.name) {
    return response.status(400).json(
      {
        error: 'content misssing'
      }
    )
  } else if (personNameAlreadyExists(body.name)) {
    return response.status(400).json(
      {
        error: 'name must be unique'
      }
    )
  }

  const person = {
    personId : id,
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  response.json(person)
  //morgan.token('body', request => JSON.stringify(request.body))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})