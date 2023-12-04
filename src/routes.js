const { addItemHandler,
        getAllItemsHandler, 
        getDetailItemByIdHandler,
        editItemByIdHandler,
        deleteItemByIdHandler, 
    } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addItemHandler,
    },
    
    {
        method: 'GET',
        path: '/books',
        handler: getAllItemsHandler,
    },
        
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailItemByIdHandler,
    },
    
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editItemByIdHandler,
    },
    
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteItemByIdHandler,
    },
    
];

module.exports = routes;
