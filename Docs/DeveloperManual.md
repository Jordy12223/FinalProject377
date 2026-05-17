## Developer Manual
This Developer Manual is mainly intended for any future developers who might 
want to continue the development of the Lost Pet Finder application that I 
created. The audience for this document is developers with general knowledge of 
web development, APIs, databases, and JavaScript applications, but also who may 
not be familiar with the internal structure or design of this specific project.

## Installing the Application
First, to run this I used, VS code and installed an extention, Liver Server 
which helps me visiually veiw my application and evrything I did to work on it. 

Then I cloned my Repository Below into my personal files:
--git clone [https://github.com/Jordy12223/FinalProject377.git]
--cd ['Whatever you decide to name it']


### 2. Install Dependencies
Open a terminal or command line, I had to, inside the backend folder and run:
--npm install


Required dependencies for supabase:
- express
- body-parser
- @supabase/supabase-js

# Running the Application
Navigate to the backend folder and start the server:
--node index.js

If the server starts successfully, the terminal should display:
--App is avaliable on port: 3000

Open the application in a browser:
--http://localhost:3000/Home.html

# Running Tests
Testing is currently completed manually by:
- submitting lost pet forms(however this does not currently work because I could
 not figure out the code for it)
- deleting pets (works)
- checking API responses (making sure the animal picutres load, along with the 
supabase information)
- verifying Supabase database updates (when deleting, viewing, and adding)
- checking Leaflet map marker rendering (Random pins are placed each reload)

Future developers are encouraged to implement:
- Absolutly anything that would benefit to this project!!!!!!!

# API Endpoints

## GET `/pets`
Returns all pets currently stored in the database.
### Example 
GET /pets
### Purpose
Used by the frontend to load all pets and display their information on the 
found page and home map.

## POST `/pet`
Adds a new pet to the database.
### Example 
POST /pet
### Example JSON Body
{
  "animal_type": "Dog",
  "breed": "Husky",
  "status": "lost",
  "description": "White and gray dog",
  "color": "Gray",
  "last_seen_location": "Dallas",
  "contact_information": "555-555-5555"
}
### Purpose
Used by the Lost Pet form to submit new pet reports into the Supabase database 
(Saldy this does not work at the momment, the backend part does but the front to 
backend compatability is the problem.)

## DELETE `/pet/:id`
Deletes a pet using the pet ID.
### Example Request
DELETE /pet/5
### Purpose
Used when a user confirms a pet has been found and removes it from the system.

# Known Bugs
- Map markers currently use randomized coordinates instead of real pet locations.
- Random pet images are placeholder images instead of uploaded images.
- Form validation is minimal.
- Duplicate submissions are possible (if the insert portion worked).
- Breed filtering is case-sensitive in some situations.

# Future Development Roadmap
Planned improvements include:
- Real geolocation support
- User authentication
- Pet image uploads
- Better filtering and search functionality
- Mobile responsiveness improvements
- Database validation improvements
- Interactive map clustering
- Status update system
- Admin moderation tools
- Automated testing implementation