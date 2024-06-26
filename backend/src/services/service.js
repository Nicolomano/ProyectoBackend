import ProductsServicesDao from "./dao/products.dao.js";
import UserServicesDao from "./dao/users.dao.js";
import CartsDao from "./dao/cart.dao.js";

import ProductsRepository from "./repository/products.repository.js";
import UserRepository from "./repository/user.repository.js";
import CartsRepository from "./repository/cart.repository.js";

const productsDao = new ProductsServicesDao()
const userDao = new UserServicesDao()
const cartDao = new CartsDao()

export const productsService = new ProductsRepository(productsDao)
export const userService = new UserRepository(userDao)
export const cartService = new CartsRepository(cartDao)