const { nanoid } = require('nanoid');
const items = require('./items');

const addItemHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newItem = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        id,
        insertedAt,
        updatedAt
    }

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }else {
        items.push(newItem);
    }

    const isSuccess = items.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        })
            .code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal di tambaahkan',
    })
    response.code(500);
    return response;

};

const getAllItemsHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    //name
    if (name) {
        const filteredBooksName = items.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
            .code(200); return response;
    }

    //reading
    if (reading) {
        const filteredBooksReading = items.filter(
            (book) => Number(book.reading) === Number(reading),
        ); const response = h.response({
            status: 'success',
            data: {
                book: filteredBooksReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
            .code(200); return response;
    }

    //finished
    if (finished) {
        const filteredBooksFinished = items.filter(
            (book) => Number(book.finished) === Number(finished),
        );

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
            .code(200); return response;
    }

    const response = h
        .response({
            status: 'success',
            data: {
                books: items.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);
    return response;
};

const getDetailItemByIdHandler = (request, h) => {
    const { bookId } = request.params
    const book = items.filter((book) => book.id === bookId)[0];
    // Jika id book yang dicari ada
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        })
        response.code(200);
        return response;
    }

    // Jika id book yang dicari tidak ada
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;

};

const editItemByIdHandler = (request, h) => {
    const { bookId } = request.params; const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;

    // apabila properti name tidak terisi 
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    // jika value readPage lebih besar dari pageCount 
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = items.findIndex((book) => book.id === bookId);

    // jika id book yang dicari ada
    if (index !== -1) {
        items[index] = {
            ...items[index], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
            .code(200);
        return response;
    }

    // Jika id book yang dicari tidak ada
    const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
    response.code(404);
    return response;
};

const deleteItemByIdHandler = (request, h) => {
    const { bookId } = request.params; const index = items.findIndex((book) => book.id === bookId);

    // Jika id book ada 
    if (index > -1) {
        items.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
            .code(200);
        return response;
    }


    // Jika id book tidak ada  
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.code(404);
    return response;
};

module.exports = {
    addItemHandler,
    getAllItemsHandler,
    getDetailItemByIdHandler,
    editItemByIdHandler,
    deleteItemByIdHandler,
};
