const express = require("express");
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));

const supabaseUrl = 'https://fzthgigzrouzstnyfkyp.supabase.co';
const supabaseKey = 'sb_publishable_acgI1_XdSDe9PN2Djnq3rg_XRG5uw74';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dGhnaWd6cm91enN0bnlma3lwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYxMjU4NSwiZXhwIjoyMDk0MTg4NTg1fQ.OrZKadNi6XLIKcDGfM4qmBQoIMJsVQLP2YUW0nh6MQc';
const supabase = supabaseClient.createClient(supabaseUrl, serviceRole);

app.get('/pets', async (req, res) =>{
  console.log('Attempting to get all data!');
  const {data, error} = await supabase.from('pets').select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    console.log('Recieved Data:', data);
    res.json(data);
  }  
});

app.post('/pet', async (req, res) =>{
  console.log('Adding Pet');
  console.log(`Request: ${JSON.stringify(req.body)}`);

  const animal_type = req.body.animal_type;
  const breed = req.body.breed;
  const status = req.body.status;
  const description = req.body.description;
  const color = req.body.color;
  const last_seen_location = req.body.last_seen_location;
  const contact_information = req.body.contact_information;

  const {data, error} = await supabase.from('pets').insert([{
    animal_type: animal_type,
    breed: breed,
    status: status,
    description: description,
    color: color,
    last_seen_location: last_seen_location,
    contact_information: contact_information,
  }])
  .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.delete('/pet/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  const { data, error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.log("DELETE ERROR:");
    console.log(JSON.stringify(error, null, 2));

    return res.status(500).json(error);
  }

  console.log("DELETE SUCCESS:");
  console.log(data);

  res.json({
    message: "Pet deleted successfully",
    deleted: data
  });
});

app.listen(port, ()=>{
  console.log(`App is avaliable on port: ${port}`);
});