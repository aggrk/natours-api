# 🌍 Natours API Documentation

This documentation provides detailed information about the endpoints available in the **Natours API**, including **tour management, user authentication, review management**, and more.

---

## 🚀 **Tours API**

### **Get All Tours**
- **Method:** `GET`
- **Endpoint:** `/api/v1/tours`
- **Description:** Retrieves a list of all available tours, supporting filtering, sorting, pagination, and field limiting.  
- **Example:**  `/api/v1/tours?price[gt]=500&sort=price&limit=5&page=2&fields=name,price`

### **Get a Tour**
- **Method:** `GET`
- **Endpoint:** `/api/v1/tours/:id`
- **Description:** Retrieves details of a specific tour based on its ID.

### **Get Top 5 Cheap Tours**
- **Method:** `GET`
- **Endpoint:** `/api/v1/tours/top-5-cheap`
- **Description:** Retrieves the top 5 cheapest tours, sorted by price in ascending order.

### **Get Tour Statistics**
- **Method:** `GET`
- **Endpoint:** `/api/v1/tours/tour-stats`
- **Description:** Retrieves aggregated statistics about tours, such as average price.

### **Create a Tour** *(Admin and Lead guide Only)*
- **Method:** `POST`
- **Endpoint:** `/api/v1/tours`
- **Description:** Creates a new tour with details such as name, duration, price, and description.

### **Delete a Tour** *(Admin and Lead guide Only)*
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/tours/:id`
- **Description:** Deletes a specific tour based on its ID.

### **Update a Tour** *(Admin and Lead guide Only)*
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/tours/:id`
- **Description:** Updates details of a specific tour.

---

## 👤 **Users API**

### **Create User** *(Admin Only)*
- **Method:** `POST`
- **Endpoint:** `/api/v1/users`
- **Description:** Allows an admin to create a new user.

### **Delete User** *(Admin Only)*
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/users/:id`
- **Description:** Allows an admin to delete a user based on their ID.

### **Update User** *(Admin Only)*
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/users/:id`
- **Description:** Allows an admin to update a user's information.

### **Get All Users** *(Admin Only)*
- **Method:** `GET`
- **Endpoint:** `/api/v1/users`
- **Description:** Retrieves a list of all users.

### **Get a User** *(Admin Only)*
- **Method:** `GET`
- **Endpoint:** `/api/v1/users/:id`
- **Description:** Retrieves a specific user’s data by their ID.

### **Get My Profile**
- **Method:** `GET`
- **Endpoint:** `/api/v1/users/me`
- **Description:** Allows a logged-in user to retrieve their own data.

### **Delete My Account**
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/users/me`
- **Description:** Allows a logged-in user to delete their own account.

---

## 🔑 **Authentication API**

### **Signup**
- **Method:** `POST`
- **Endpoint:** `/api/v1/users/signup`
- **Description:** Allows a new user to sign up by providing their name, email, and password.

### **Login**
- **Method:** `POST`
- **Endpoint:** `/api/v1/users/login`
- **Description:** Allows a user to log in by providing their email and password.

### **Forgot Password**
- **Method:** `POST`
- **Endpoint:** `/api/v1/users/forgotPassword`
- **Description:** Allows a user to request a password reset link.

### **Reset Password**
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/users/resetPassword/:token`
- **Description:** Allows a user to reset their password using a token received via email.

### **Update Password** *(User Only)*
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/users/updatePassword`
- **Description:** Allows a logged-in user to update their password.

---

## ⭐ **Reviews API**

### **Get All Reviews**
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews`
- **Description:** Retrieves a list of all reviews. Supports pagination and filtering.

### **Get a Review**
- **Method:** `GET`
- **Endpoint:** `/api/v1/reviews/:id`
- **Description:** Retrieves a specific review by its ID.

### **Create a Review** *(Users Only, Guides Cannot Create Reviews)*
- **Method:** `POST`
- **Endpoint:** `/api/v1/reviews`
- **Description:** Allows users (except guides) to create a review for a tour.

### **Delete a Review** *(Admin or Review Creator)*
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/reviews/:id`
- **Description:** Allows an admin or the creator of the review to delete it.

### **Update a Review** *(Admin or Review Creator)*
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/reviews/:id`
- **Description:** Allows an admin or the creator of the review to update it.

---

## 🏕 **Tour-Specific Reviews API**

### **Create a Review for a Tour** *(Users Only)*
- **Method:** `POST`
- **Endpoint:** `/api/v1/tours/:tourId/reviews`
- **Description:** Allows a user (except guides) to create a review for a specific tour.

### **Get All Reviews for a Tour**
- **Method:** `GET`
- **Endpoint:** `/api/v1/tours/:tourId/reviews`
- **Description:** Retrieves all reviews associated with a specific tour.

---

### ✅ **Notes**
- **Admin Only** endpoints require **admin privileges**.
- **User Authentication Required** for protected routes.
- **Filtering, Sorting, and Pagination** are supported in list retrieval endpoints.
- **Use appropriate request headers and body parameters** when making API calls.

---

📌 **That's It** 

