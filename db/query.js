const pg = require('./knex')

let getBooks = () => {
  return pg('books').fullOuterJoin('book_character', 'book_character.book_id', 'books.id').fullOuterJoin('characters', 'characters.id', 'book_character.character_id').select()
  .then((data) => {
    let hitTitles = []
    let organizedData = []
    data.forEach((item) => {
      if (!hitTitles.includes(item.title)) {
        hitTitles.push(item.title)
        organizedData.push({title: item.title, name: [item.name]})
      } else {
        organizedData.forEach((book) => {
          if (item.title === book.title) {
            book.name.push(item.name)
          }
        })
      }
    })
    return organizedData
  })
}

let addBook = (bookTitle) => {
  // add a book if the title is not in the table
  // get the stuff
  // .then
  // if state
  // return id
  // if not
  return pg('books')
  .then(function(data){
    var found = false
    var foundId = ''
    for(var i=0;i<data.length;i++){
      if(data[i].title == bookTitle.title){
        found = true
        foundId = data[i].id
      }
    }
    if(found == true){
      return foundId
    }else{
      return pg('books').insert({
        'title': bookTitle.title
      }).returning('id')
    }
  })
}

let addCharacter = (characterName) => {
  // add a character if the character is not in the table
  return pg('characters')
  .then(function(data){
    var found = false
    var foundId = ''
    for(var i=0;i<data.length;i++){
      if(data[i].name == characterName.name){
        found = true
        foundId = data[i].id
      }
    }
    if(found == true){
      return foundId
    }else{
      return pg('characters').insert({
        'name': characterName.name
      }).returning('id')
    }
  })
}

let addJoin = (book, name) => {
  // add a relationship between a character and a book if it does not exist
  return pg('book_character')
  .then(function(data){
    var found = false
    var foundId = ''
    for(var i=0;i<data.length;i++){
      if(data[i].book_id==book || data[i].character_id==name){
        found = true
      }
    }
    if(found != true){
      return pg('book_character').insert({
        'book_id': book[0],
        'character_id': name[0]
      })
    }
  })
}

module.exports = {
  getBooks,
  addBook,
  addCharacter,
  addJoin
}

// select * from book_character inner join books on book_character.book_id=books.id inner join characters on book_character.character_id=characters.id;
