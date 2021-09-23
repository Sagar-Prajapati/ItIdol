# ItIdol Task

_Node API Task_

Database Used - PostgreSQL

API developed -

for Users

1. register User :-

   _POST_ /v1/users/user/register

body parameter

firstName,
lastName,
gender,
birthDate,
email,
password,
streetAddress,
locality,
postalCode,
city,
state,
country,
profileImage

2. User Login :-

   _POST_ /v1/users/user/login

body parameter

email,password

3. User Update :-

   _PUT_ /v1/users/user/{{userId}}

body parameter

firstName,
lastName,
gender,
birthdate,
profileImage

4. Delete User

   _DELETE_ /v1/users/user/{{userId}}

5. get Users
   _GET_ /v1/users

for Products

1. Add Product
   _POST_ /v1/products

body parameter,

name,
sku,
categoryId (for this task,predefined in database),
description,
currency,
unitPrice,
productImage

2. Get All Products

_GET_ /v1/products

3. Get Filltered/Browse Product by Id,Name or categoryId

_GET_ /v1/products/browse?categoryId=1

4. Delete Product
   _DELETE_ /v1/products
