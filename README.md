# Brand Website

## About

---

A E-commerce brand website.
API Functions as below:

### Admin
- Users can register as members.
- Users can browse all products, the latest products, and popular products.
- Users can search for products by keywords.
- Users can select the quantity and add the item to the shopping cart or proceed with an immediate purchase, which directs them to the checkout page.
- Users can view past order details.
- Users can update their membership information and password in the "Member Info" section of the member center.
- Admins can view all products or filter products by category.
- Admins can add new products and upload up to four product photos.
- Admin dashboard is currently under optimization and is not yet complete.

  <br><br>


## Environment

---

- node v18.14.0
- nodemon
  <br><br>

## Installation and Execution

---

### 1. Git Clone to Local

```
 git clone https://github.com/Jasmineeds/ecommerce-bakery   # git clone
 cd ecommerce-bakery                                        # enter project folder
 npm install                                                # install NPM Packages
```

### 2. Create Database in SQL WorkBench

```
create database ecommerce_bakery
```

### 3. Database Migration and Seeder

```
npx sequelize db:migrate    # model migration
npx sequelize db:seed:all   # generate seed
```

### 4. Create .env file for confidential (ref: .env.example)

```
IMGUR_CLIENT_ID= your password
JWT_SECRET= your password
```

### 5. Start Server (nodemon)

```
npm run dev
```

### 6. Terminal

```
Example app listening on port 3000!
```

### 7. Front-end

```
git clone https://github.com/Yoruyeh/happy-bakery-website
cd happy-bakery-website
npm run start
Press 'Y' for "Would you like to run the app on another port instead" in terminal
```

### 8. Run Website

```
Open browser and enter http://localhost:3001/happy-bakery-website
```

<br>

## Seed Accounts

---

1 admin account and 3 user accounts are provided for demo.<br>

### # Admin Account

email: root@example.com <br>
password: 12345678 <br>

### # User Account

email: user1@example.com <br>
password: 12345678 <br>
<br>

## Development Tools

---

- Node.js
- Express
- MySQL
- Sequelize
  <br><br>

## Team Members

---

### Back-End

[Jasmine Huang](https://github.com/Jasmineeds)<br>

### Front-End

[Yoru Yeh](https://github.com/Yoruyeh)<br>
