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
        reading,
    } = request.payload;

    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updateAt = insertedAt;

    const newItem = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updateAt,
    };

    items.push(newItem);

    const isSuccess = items.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                }
            })
            .code(201);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal di tambaahkan',
        })
        .code(500);
    return response;

};

module.exports = { addItemHandler };
