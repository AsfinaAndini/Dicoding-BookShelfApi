const { addItemHandler } = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addItemHandler,
    },
];

module.exports = routes;
