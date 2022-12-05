import express from 'express';

const app = express();
app.get('/', (req, res) => {
  res.send(data);
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listen port ${port}`));
