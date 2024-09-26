# Amazon CLone Project 
This project is an Amazon-inspired e-commerce web application that simulates the user experience of browsing products, adding them to a cart, checking out, and making payments. The application includes both a frontend user interface and backend infrastructure.
## Features 
- User authentication (registration, login, and logout)
- Product browsing and search functionality
- Add/remove items from the shopping cart
- Checkout process with shipping details collection
- Payment processing using Stripe
- Admin functionality to import products and categories
- AI chatbox to help users resolve basic ordering issues
- Mass product import for bulk uploading of products
- Google Login API for easy and secure user authentication

## Frontend 
### React
The application is built using React to create a fast and interactive user interface. React's component-based structure allows for efficient code reusability and management of the dynamic behavior of this e-commerce site. React's declarative nature makes it an ideal choice for creating highly interactive UI, managing states, and handling updates efficiently when users add products to their cart, proceed to checkout, and so on.
### React Router
For seamless navigation between different pages of the application such as the home page, product page, cart, and payment. It enables the creation of dynamic routing, allowing users to navigate different pages without reloading the browser.
### Redux
Used for state management across the application, especially for handling the cart state and user authentication. In a multi-component application like this, where the cart and user authentication states are shared across different components, Redux helps maintain a single source of truth.
### Axios
For making HTTP requests to the backend API, particularly for handling authentication, fetching products, and submitting payment information. Axios simplifies making API requests and managing responses, including error handling and request/response transformations.
### Tailwind CSS
Tailwind is used for styling the frontend, ensuring a clean and responsive design without writing much custom CSS. Tailwind is highly customizable, allowing rapid UI development and maintaining a clean and consistent design.
### Stripe API
Integrated for handling the payment processing securely and efficiently. Stripe provides a simple, robust API for managing payments with features like easy card input handling, security, and payment intent management.
### Framer Motion
Framer Motion is a powerful library for adding animations and transitions to your application.
### Swiper.js
Swiper is a modern touch slider library that enables carousel and slider functionality.
### Google Login API
Integrated with Google OAuth 2.0 for secure and convenient user authentication. Users can now sign in using their Google account, making it easier and faster to access the application.

## How to Run the Frontend
- Clone the repository.
- Install the dependencies using npm install.
- Start the development server using npm start.
- Ensure that the backend server is running, as the frontend communicates with the backend API for product data, authentication, and payments.

## Backend
### Node.js
The backend of the application is built using Node.js to handle server-side logic, including routing, authentication, product management, and payment processing. It’s a scalable and efficient choice for real-time applications like this due to its non-blocking, event-driven architecture.
### Express.js
Used for building the RESTful API that interacts with the frontend and handles requests related to product fetching, user authentication, and payment processing. Express provides a minimal and flexible node-based framework that allows you to build web applications with ease.
### MongoDB
A NoSQL database used for storing product details, user data, and order information. MongoDB is schema-less, allowing flexibility in data models, making it an excellent choice for dynamic e-commerce platforms where data needs to be stored efficiently.
### Mongoose
An ODM (Object Data Modeling) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used for querying and managing data in MongoDB. It simplifies interactions with MongoDB, ensuring that the data follows certain structure and types.
### JWT (JSON Web Tokens)
Used for authenticating users and managing sessions. JWT is a stateless authentication solution that’s easy to implement, making it a secure way to transmit information between the client and server.
### Stripe Payment Integration
The backend communicates with Stripe’s API to create payment intents and manage payments. Stripe provides a secure and efficient way to handle online payments without dealing with sensitive payment data directly.
### bcrypt-nodejs
This package is used for hashing user passwords securely before storing them in the database. Provides secure password hashing using bcrypt, ensuring user authentication remains secure.
### Multer
Multer is used for handling file uploads (for example, product images) from the frontend. Processes multipart/form-data and saves uploaded images to the server.
### Morgan
Morgan is a logging middleware that helps monitor HTTP requests to the server, which is useful for debugging and logging traffic data. Logs requests to the backend, useful for monitoring and debugging the application.
### Cors
Used to handle Cross-Origin Resource Sharing (CORS), allowing the frontend and backend to communicate, even if they are hosted on different domains.
### Body-Parser
Body-parser is used to parse incoming request bodies in a middleware before they are handled by route handlers.
### dotenv
Dotenv is used to load environment variables from a .env file into process.env.
### Google Login Integration (OAuth 2.0)
The backend uses Google OAuth 2.0 to enable users to sign in using their Google accounts. The backend processes the Google profile data and issues a secure token for authentication in the application.



## How to Run the Backend
- Clone the repository.
- Install the dependencies using npm install.
- Create a .env file in the root directory and add the following environment variables:
    STRIPE_SECRET_KEY=your_stripe_secret_key
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
- Start the server using npm run server.

### To run the mass product import
- need to generate the json file and upload to the product folder
- have certain category setup 
- upload images to the uploads folder if need 
- then run the node massImportProducts.js

### Admin Routes
#### Import Category
The following admin-specific routes are available for managing categories and products:
- Admin can upload a category by making a POST request. A JSON object with the category details must be provided in the request body.
- POST /import_category

#### Import Product
- Admin can upload products by making a POST request. The request allows for uploading product details along with images (handled by Multer).
- POST /import_product