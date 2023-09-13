// Deklarasi variabel
const myBooks = [];
const RENDER_EVENT = 'render-mybook';


document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addMyBook();
    });
    if (isStorageExist()){
        loadDataFromStorage();
    }
});

// Create function to submit book informasion
function addMyBook(){
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    let isComplete = document.getElementById('inputBookIsComplete').checked;
    // isComplete = false;

    const generatedID = generateId();
    const myBookObject = generateMyBookObject(
        generatedID,
        textTitle,
        textAuthor,
        textYear,
        isComplete );
    myBooks.push(myBookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Buat Function generateId()
function generateId(){
    return +new Date();
}



// Buat function generateMyBookObject 
function generateMyBookObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

// Buat Listener dari RENDER_EVENT
document.addEventListener(RENDER_EVENT, function(){
    console.log(myBooks);
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of myBooks) {
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted){
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
})


// Buat fungsi untuk menampilkan nilai yang sudah diinput
function makeBook(myBookObject){
    const textTitle = document.createElement('h3');
    textTitle.innerText= myBookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = myBookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = myBookObject.year;

    // Buat container untuk menaruh semua elemen
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(textTitle, textAuthor, textYear)


    if (myBookObject.isCompleted) {
        // Buat tombol unfinishedRead
        const unfinishedRead = document.createElement('button');
        unfinishedRead.classList.add('green');
        unfinishedRead.innerText ='Belum selesai di Baca';

        // fungsi dari tombol UnfinishedRead
        unfinishedRead.addEventListener('click', function(){
            unfinishedBookDetected(myBookObject.id);
        });

        // Buat tombol deleteBook
        const deleteBook = document.createElement('button');
        deleteBook.classList.add("red");
        deleteBook.innerText = 'Hapus buku'

        // fungsi dari tombol deleteBook
        deleteBook.addEventListener('click', function(){
            deleteBookFromShelf(myBookObject.id);
        });

        // Buat containern untuk actionButton
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add('action');
        buttonContainer.append(unfinishedRead, deleteBook)
        
        bookContainer.append(buttonContainer);
    
    } else {
        // Buat tombol finishRead
        const finishRead = document.createElement('button');
        finishRead.classList.add('green');
        finishRead.innerText='Selesai Dibaca';
        
        // fungsi dari tombol finishRead
        finishRead.addEventListener('click', function(){
            finishBookDetected(myBookObject.id);
        })

        // Buat tombol deleteBook
        const deleteBook = document.createElement('button');
        deleteBook.classList.add("red");
        deleteBook.innerText = 'Hapus buku';

        // fungsi dari tombol deleteBook
        deleteBook.addEventListener('click', function(){
            deleteBookFromShelf(myBookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add('action');
        buttonContainer.append(finishRead, deleteBook);
        
        bookContainer.append(buttonContainer);
    }

    return bookContainer;
}

// Agar tombol finishBookDetected berfungsi
function finishBookDetected(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Menjelaskan fungsi findBook
function findBook (bookId){
    for (const bookItem of myBooks){
        if(bookItem.id == bookId){
            return 	bookItem;
        }
    }
    return null;
}


// Buat agar fungsi deleteBookFromShelf bisa dijalankan
function deleteBookFromShelf(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    myBooks.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Pendejalasan fungsi findBookIndex
function findBookIndex(bookId){
    for (const index in myBooks){
        if(myBooks[index].id===bookId ){
            return index;
        }
    }

    return -1;
}



// Buat agar fungsi dari unfinishedBookDetected  bisa dijalankan
function unfinishedBookDetected(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


const SAVED_EVENT = 'saved-mybook';
const STORAGE_KEY = 'MYBOOK_APPS';

// Membuat fungsi saveData()
function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(myBooks);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
    if(typeof (Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}


// Memberi listener npada SAVED_EVENT
document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
})



// Membuat fungsi loadDataFromStorage()
function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for (const book of data){
            myBooks.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
