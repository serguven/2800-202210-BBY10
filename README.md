Project title: Icarus

Description

Icarus is an application through which users can reach various psychiatrists/psychologists and book an appointment for a therapy session.

//////////

Technologies used

For the frontend, this application uses HTML, CSS, some JavaScript, and bootstrap. The application’s backend uses Node.js, Express.js, and jQuery. This application uses MongoDB for its database. Additional tools were used such as Tiny (text editor) and Heroku (web hosting).

//////////

Tree of the file's contents

C:.
│   .gitignore
│   BBY_10_post.json
│   BBY_10_user.json
│   package-lock.json
│   package.json
│   Procfile
│   README.md
│   server.js
│
├───.vscode
│       settings.json
│
├───models
│       appointment.js
│       doctor.js
│       post.js
│       user.js
│
└───public
    │   about.html
    │   admin.html
    │   appointment.html
    │   browse.html
    │   doctor.html
    │   index.html
    │   login.html
    │   notAllowed.html
    │   profile.html
    │   secret.html
    │   signUp.html
    │
    ├───css
    │       admin.css
    │       appointment.css
    │       browse.css
    │       index.css
    │       login.css
    │       profile.css
    │       secret.css
    │       signup.css
    │
    ├───fonts
    │       FontsFree-Net-Kidstar.ttf
    │
    ├───images
    │       401.jpg
    │       logo.jpg
    │       matrix.gif
    │       pexels-ahmad-qime-2849133.jpg
    │       pexels-cole-keister-3081750.jpg
    │       pexels-cottonbro-4101137.jpg
    │       pexels-pok-rie-1655166.jpg
    │       pexels-ron-lach-9759914(1).jpg
    │
    ├───js
    │       admin.js
    │       appoint.js
    │       login.js
    │       profile.js
    │       signUp.js
    │
    └───uploads
            1653092569134-car.jpg
            1653092655709-th-152431388.jpg
            1653092655709-th-3444604826.jpg
            1653092655709-th-4094030124.jpg
            1653092820821-walking.jpg
            1653093752375-park.jpg
            1653125606400-h1.jpeg
            1653125620356-ps1.jpg
            1653134236712-h1.jpeg
            1653134393903-ps1.jpg
            1653412968841-h1.jpeg
            1653419363795-h2.jpg
            1653419413399-ps1.jpg
            1653549645442-joker.jpg
            1653549645443-matrix.jpg
            1653549645443-neo.jpg
            1653553499535-health.jpg
            1653565445746-h2.jpg
            1653565543120-h2.jpg
            1653565610038-h1.jpeg
            1653565676036-h1.jpeg
            1653565719243-h2.jpg
            1653565801306-h2.jpg
            1653565846461-ps1.jpg
            1653565869160-ps1.jpg
            1653567200406-h1.jpeg
            1653567294691-h1.jpeg
            1653567383964-h2.jpg
            1653576759299-ps1.jpg
            1653606302267-meditate.jfif
            1653606338647-exercise.jfif
            1653606365052-exercise.jfif
            download.jfif
            dummyimageppt.png
            h1.jpeg
            h2.jpg
            joker.jpg
            ps1.jpg
            temppfp.jpg

//////////

Getting started on development

Languages required:
HTML
CSS
JavaScript

IDE’s recommended:
Visual Studio Code

Databases required:
MongoDB Atlas (cloud) or MongoDB Compass (local)

Server environment:
Node.js

3rd party APIs/frameworks required:
Bootstrap
Tiny
Multer
Express
Express-session
Mongoose

Api Keys: not required

Order of installation:
Before installation of this project, Node.js must be installed.

Configuration instructions:
Install Node.js on your computer (download: https://nodejs.org/en/download/)
Go to the code section on Github and download the zip file
Extract the zip file onto your desired file location


User guide
Running program:

Open the folder onto your IDE of choice. Go to the terminal and type out the command “npm install” to download node packages used in the project.
Then type out the command “nodemon server.js” in your terminal to start server.
Type out “localhost:8000” to reach the application through your web browser.

Creating and logging in to an account:


To create an account,  click “sign in today”.
Fill in the following information on the screen, select “patient” if you are a regular user and select “doctor” if you are an admin or doctor.
Click “Sign Up”, it will direct you to the login screen.
On the login screen, fill in your email and password, and click “Log In”, it will direct you to your profile page (user) or admin dashboard (admin).

Profile Page:

On this page you can see your user information. You can update them by clicking the “edit” button if you want. You can add a profile picture and change it by clicking on the profile picture placeholder at the top of the page.

Admin Dashboard:

Only admins who are doctors can access this page. On this page you can see all of the users. You can create a new user by using the add card at the top of the page. You can update user information by using the “Update” button, and delete a user by using the “Delete” button in the cards showing user information.

Booking an appointment:

On the profile page, click to the “Doctors” section.
Select your desired doctor and click “Book an appointment”.
Fill in your personal information, then click “Book an appointment”.
The appointment will be shown on the “Appointments” section of the profile page.

Creating a personal blog post:

On the profile page, go to the “Blog” section.
Scroll down until you see the “Add Post” button, clicking the button will cause a form to appear.
Once the form appears, fill in your thoughts, little reminders, or even up to three photos on the blog post.
Once done, click “Save”, the post will appear at the bottom of the “Blog” section.
After you create a post you can edit it by clicking on the “edit” button under the post or you can delete it if you want by clicking the “delete” button.

//////////

References:
Note: Exact references or links to code and images are placed on comments throughout the code.

Images provided by:
Pexels
HTTP Status Cats
Giphy

HTML, CSS, and JavaScript elements provided by:
Bootstrap
W3Schools
StartBootstrap.com (all of the form sections)
Code for Profile image placeholder from line 41 to 49 in profile.html was taken from:
BBY-21 COMP1800, January 2022 code for profile picture
Web Dev Simplified (logout pop-up)

//////////

Contact:
Semih Erguven
Email: serguven@my.bcit.ca
Github: serguven

Adrien Del Prado
Email: adelprado1@my.bcit.ca
Github: dynamiteroll

Arshnoor Kaur Boparai
Email: aboparai18@my.bcit.ca
Github: Arshnoor03

Avnoor Kaur
Email: akaur413@my.bcit.ca
Github: Avnoor28


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

"# 2800-202210-BBY10" 

Team Members: Semih Erguven, A01267926, Set 2D
              Adrien Del Prado, Set 2D, A01283992
              Arshnoor Kaur Boparai, A01310020 Set 1A
              Avnoor Kaur, A01301225, Set 1A

COMP-2537 Milestone-1 50% complete

Login/Logout implemented, however there are edge cases which are not covered.
Database connection is provided. For now there is only one collection(bby-10-users) in our database(COMP2800).
Authentication is being made. Only admins(doctors) can access "localhost:8000/admin" page.
Not all of the planned HTML pages and their CSS properties implemented.
Sign up page doesn't have CSS properties.


COMP-2537 Milestone-2 75% complete

Web design template is made better. However it still needs more touch.
Regular user's data is being populated on the profile page. User can change first name, last name, user name and
password. We missed changing email was a requirement. So it will be modifiable too next week. Unfortunately
we cannot store profile picture yet. Thus we cannot edit too. We will fix that too.
Admin user(doctors) can see all of the users in the dashboard. Also admin create new user, update user data, and
delete user through admin dashboard.


COMP-2537 Milestone-3 90% complete

Timeline is implemented. User can see their own posts within profile page when they select "Blog" tab. They can
add title, context and image to the picture. Cards are populated with these information. Also if the post created
for the first time they can see creation date of the post, if it is updated they can see the date the post updated
last time. User can delete post using delete button. By using edit button they can change title, context and images
at the post. Even though user can accomplish every task of the timeline assignment, changing pictures needs some more
work to do. Other than that some work on css has been made. Everyone in the team equally got involved in this milestone.

COMP-2537 Milestone-4 85% complete

The final application has the majority of components fully implemented. The COMP 2537 requirements such as log-in/logout, storing profile picture, editing account information, admin dashboard, and the timeline componenet (personal blog) are implemented. However, not all of the 2537 components are optimized and bug free. As for error and success messages, it is fully implemented for login/logout, creating new account as a user and admin, directing admin to profile and editing user information. However, not all error and success messages were implemented, especially editing/deleting accounts on admin, or editing/deleting blog posts. Other features planned such as chat were also not implemented due to time constraints.