require('dotenv').config()
const express = require('express');
const helmet = require('helmet');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const port = process.env.PORT || 5000
const tl = process.env.TLNAME

const server = express();

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
}

server.use(logger);
server.use(helmet());
server.use(express.json());

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h1>WebAPI III Challenge</h1><h2>Welcome, ${tl} to my deployed site!</h2>`);
});

server.listen(port, () =>
  console.log(`\n*** Server running on http://localhost:${port} ***\n`),
);