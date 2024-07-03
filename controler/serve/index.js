const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

const {page }=require("../../model/Pages");
const formid =require("../../model/Forms");
const menuid =require("../../model/Menus");
const {inputsform} = require("../../model/form_input");



app.use('/text/:id',async (req,res) => {/* the text json */////*** DONE (ABOUT)** */
const pageID = req.params.id;/* i requst this param from page Id */
console.log(pageID);
try{
  const Pages= await page(pageID);
  console.log(Pages[0]);
  if (Pages) {/* if its there return it and if not return error */
    res.json(Pages[0]);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
} catch (error) {
  console.error("Error fetching data:", error);
  res.status(500).json({ error: 'An error occurred while fetching data' });
}
});



app.use('/inputs/:formID', async (req, res) => {
  const formid = req.params.formID; // Get formID from URL parameter
  try {
    const input = await inputsform(formid); // Fetch inputs form the formID(promis)
    console.log(input);
    if (input){
    res.json(input);
    console.log("soul");
    }else{
      res.status(404).json({ error: 'Page not found' });
    } 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'An error occurred while fetching inputs' });
  }
  

});


app.use('/hf/:id', async (req, res) => {/** DONE MENUES  */
  try {
    const MID = req.params.id;
    const men = await menuid(MID);  // Ensure this function returns a promise
    const hfpath = men.filter(obj => obj.MID == MID);  // Use obj.MID instead of obj.id
    if (hfpath) {
      res.json(hfpath);
    } else {
      res.status(404).json({ error: 'No matching objects found' });
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: 'An error occurred while fetching menus' });
  }
});


app.use('/formall/:formID', async (req, res) => {
  try {
    const formID = req.params.formID;
    const fallpath = await formid(formID);
    const f = fallpath.filter(obj => obj.formID == formID);
  if (f) {
    res.json(f);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }}
  catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: 'An error occurred while fetching menus' });
  }
})
 

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});