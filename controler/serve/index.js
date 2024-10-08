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
const users =require("../../model/Users")




app.use('/text/:id',async (req,res) => {/* the text json */////*** DONE (ABOUT)** */
const pageID = req.params.id;/* i requst this param from page Id */

try{
  const Pages= await page(pageID);
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

    if (input){
    res.json(input);
    
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
    const hfpath = men
    
    
    
    
    
    
    
    
    
    
    .filter(obj => obj.MID == MID);  // Use obj.MID instead of obj.id
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


app.use('/user/login', async (req, res) => {
  try {
    const { userName, userPassword } = req.body; 
    const userData = await users.login(userName, userPassword);
    if(userData.length >0){
    res.json(true);
    }else{
    res.status(404).json(error = 'false ');
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: 'An error occurred while fetching menus' });
  }
})
 
app.use('/user/login', async (req, res) => {
  const { userName, userPassword } = req.body;
  try {
    const userData = await users.login(userName, userPassword);
    if (userData.length > 0) {
      res.json({ success: true, user: userData });
    } else {
      res.status(404).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during traditional login:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Route for Google login (Google email)
app.use('/user/login-with-google', async (req, res) => {
  const { googleEmail } = req.body;
  try {
    const userData = await users.findByEmail(googleEmail);
    if (userData) {
      res.json({ success: true, user: userData });
    } else {
      // Create a new user if not found
      const newUser = await users.create({
        userName: googleEmail.split('@')[0],  // Create a default username
        userEmail: googleEmail,
        userPassword: null,  // No password for Google users
      });
      res.json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ success: false, message: 'Server error during Google login' });
  }
});

app.use('/user/signup', async (req, res) => {
  try {
    const { userName, userPassword ,userGmail} = req.body; 
    const user = await users.signup(userName, userPassword,userGmail);
    if(user.length>0){
    res.json(true);
    }else{
    res.status(404).json(error = 'false7 ');
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: 'An error occurred while fetching menus' });
  }
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});