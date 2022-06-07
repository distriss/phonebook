const express = require('express')
const app = express()
const morgan = require('morgan')

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(morgan(':id :method :url :response-time'))



const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)



let persons = [
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


// get landing page
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

// get information of phonebook, number of persons in it at request date
app.get('/info', (request, response) => {
    let date = new Date()    
    response.send(`Phonebook has info of ${persons.length} people. ${date}`)    
})

// get all persons in phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// get a person from phonebook
app.get('/api/persons/:id', (request, response) => {
    // grab url parameter
    const id = Number(request.params.id)
    // find person that matches id parameter
    const person = persons.find(person => person.id === id)
    // conditional response if person exists or not
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


// delete a person from phonebook
app.delete('/api/persons/:id', (request, response) => {
    // find person that matches id parameter
    const id = Number(request.params.id)
    // save only the persons that dont match the id parameter
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    // checks content of body of raw-coded-json in postman
    const body = request.body
    // conditions on raw code content
    if (!body.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    // create new person
    const person = {
        // calculate random id for person
        id: Math.floor(Math.random() * 100),
        // grab the name property from raw content
        name: body.name,
        // grab number property from raw content
        number: body.number,
        
      }
    
    // add new person to the array of persons in phonebook
    persons = persons.concat(person)
    // respond with new persons details
    response.json(person)
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

