const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

const textpath = require('./Text.json');
const drawjsonpath = require('./Drawjson.json');
const  hmjsonpath =require('./HM.json');
const fmjsonpath =require('./FM.json');
const formalljsonpath =require('./Formall.json');

app.post('/text/:pageId', (req,res) => {
  const pageid = req.params.pageId;
  const pathte = textpath.find(obj => obj.pageId === pageid);
  if (pathte) {
    res.json(pathte);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

app.post('/drawjson/:pn', (req, res) => {
  const pagename = req.params.pn
  const drawpath = drawjsonpath[pagename];
  if (drawpath) {
    res.json(drawpath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.post('/hm/:id', (req, res) => {
  const Id = req.params.id;
  const hmpaths = hmjsonpath.filter(obj => obj.id === Id);
  if (hmpaths) {
    res.json(hmpaths);
  } else {
    res.status(404).json({ error: 'No matching objects found' });
  }
});



app.post('/fm/:id', (req, res) => {
  const Id = req.params.id;
  const fmpath = fmjsonpath.filter(obj => obj.id === Id);
  if (fmpath) {
    res.json(fmpath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.post('/formall/:pagename', (req, res) => {
  const pagename = req.params.pagename;
  const fallpath = formalljsonpath[pagename];
  if (fallpath) {
    res.json(fallpath);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});
 

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});