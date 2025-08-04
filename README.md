# Auction Advisor

> This project helps assist with an in-person silent auction <br/>
> [Live - Auction Advisor Website](https://auction-advisor.ryan-brock.com/) <br/>

---

## 📚 Table of Contents

- [What's My Purpose?](#-whats-my-purpose)
- [How to Use](#-how-to-use)
  - [Settings](#search)
  - [People](#people)
  - [Products](#products)
  - [Purchases](#purchases)
  - [Donations](#donations)
- [Technologies](#-technologies)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
  - [Run Locally](#run-locally)
  - [Test](#test)
  - [GitHub Hooks](#github-hooks)
  - [Build](#build)
  - [Deploy](#deploy)

---

## 🧠 What's My Purpose?

This wesbite was created after I watched my Aunt keep track of an in-person silent auction on paper/excel.

---

## 🚦 How to Use

### Settings

Settings - Description

- Title - The title of the Auction (Ex. Oakhill 132nd Silent Auction) <br/>
- Can Edit - Can the data be edited after entered? <br/>
- Color - Choose the color scheme for the application *this is the only setting that applies on selection <br/>

<br/>

Buttons - Description

- Apply - Applies the currectly selected settings (except for color)<br/>
- Reset Everything - Resets the scores and the settings<br/>
- Export to Excel
  - By Purchaser - Exports the data by purchaser<br/>
  - By Products - Exports the data by products<br/>
  - Totals By Person - Exports the data by totals per person to see what people owe<br/>

---

### People

- Add Person
  - To add a Person, a first name, last name and email is required
- View People

---

### Products

- Add Product
  - To add a Product, a name and description is required
- View Products

---

### Purchases

- Add Person
  - To add a Person, a first name, last name and email is required
- Add Products
  - To add a Product, a name and description is required    
- Add Purchase
  - To add a Purchase, a product, a person (purchaser) and amount is required
- View Purchases

---

### Donations 

- Add Person
  - To add a Person, a first name, last name and email is required
- Add Products
  - To add a Product, a name and description is required    
- Add Donation
  - To add a Purchase, a product, a person (donated by), a person (to credit the donation to), an estimated value and minimum sale amount is required
- View Donations
- 
---

## 🛠 Technologies

- Framework: `Angular 8`
- Testing: `Karma`
- Deployment: `GitHub Pages`

---

## 🚀 Getting Started (Local Setup)

* Install [node](https://nodejs.org/en) - v16 is needed
* Clone [repo](https://github.com/rbrock44/auction-advisor)

---

### Run Locally

```
npm install
npm start
```

---

### Test

- Unit
  - ng test || npm run test
- Integration
  - ng e2e || npm run e2e
        
---

### Github Hooks

- Build
    - Trigger: On Push to Main
    - Action(s): Builds application then kicks off gh page action to deploy build output

---

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

---

### Deploy

Run `npm run prod` to build and deploy the project. Make sure to be on `master` and that it is up to date before running the command. It's really meant to be a CI/CD action

---
