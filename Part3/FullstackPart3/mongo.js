const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.9vnluyu.mongodb.net/personsApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4] !== undefined) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}
console.log(
  'You are missing',
  process.argv[3] ? 'person number' : 'person name'
)
Person.find({}).then((result) => {
  console.log('phonebook:')
  result.forEach((person) => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})
