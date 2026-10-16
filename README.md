# 🛍️ Shohan Mart

**Shohan Mart** is a modern e-commerce web application designed to provide a smooth and convenient online shopping experience. Users can explore products, browse categories, manage their shopping carts, save favourite products, and place orders through a user-friendly interface.

## ✨ Features

* 🛒 **Product Browsing:** Explore a wide range of products.
* 🔍 **Product Search:** Find products quickly and easily.
* 🗂️ **Category Filtering:** Browse products by category.
* ↕️ **Product Sorting:** Sort products by price, rating, and latest additions.
* 🛍️ **Shopping Cart:** Add products to the cart and manage quantities.
* ❤️ **Wishlist:** Save favourite products for later.
* 📦 **Checkout System:** Enter customer information and place orders.
* 👤 **Authentication:** Support for user authentication.
* 🏪 **Seller Features:** Support for seller-related product management.
* 🛠️ **Admin Features:** Designed to support administrative management.
* 📱 **Responsive Design:** Works across desktop, tablet, and mobile devices.
* 🎨 **Modern UI:** Clean interface with smooth interactions and loading animations.

## 🧰 Technologies Used

* **Next.js** — React framework for building the application.
* **React** — Component-based user interface.
* **TypeScript** — Type-safe JavaScript development.
* **Tailwind CSS** — Utility-first styling.
* **daisyUI** — UI components and styling utilities.
* **MongoDB** — Database integration.
* **Mongoose** — MongoDB object modelling.
* **Better Auth** — Authentication.
* **React Hot Toast** — User notifications.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB connection string

### Installation

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd bangla_mart
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the project root and add the environment variables required by the application.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
```

Add any other environment variables required by your authentication and application configuration. Never commit real passwords, secret keys, or database credentials to GitHub.

**5. Run the development server**

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🏗️ Build for Production

To create a production build, run:

```bash
npm run build
```

To start the production server locally:

```bash
npm run start
```

## 📁 Project Structure

```text
bangla_mart/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── products/
│   │   ├── checkout/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── models/
├── .env
├── package.json
└── README.md
```

## 🎯 Project Goal

The goal of Shohan Mart is to develop a modern and user-friendly e-commerce platform that makes online shopping easier while providing a foundation for product, order, seller, and administrative management.

## 👨‍💻 Developer

**Shohanur Rahman**

Project: **Shohan Mart**

## 🌐 Live Website

**Live Link:** https://shohanmart.vercel.app

