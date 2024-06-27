import ProductsServicesDao from "./dao/products.dao.js";
import UserServicesDao from "./dao/users.dao.js";
import CartsDao from "./dao/cart.dao.js";
import TicketDao from "./dao/ticket.dao.js";

import ProductsRepository from "./repository/products.repository.js";
import UserRepository from "./repository/user.repository.js";
import CartsRepository from "./repository/cart.repository.js";
import TicketRepository from "./repository/ticket.repository.js";


const productsDao = new ProductsServicesDao()
const userDao = new UserServicesDao()
const cartDao = new CartsDao()
const ticketDao = new TicketDao()

export const productsService = new ProductsRepository(productsDao)
export const userService = new UserRepository(userDao)
export const cartService = new CartsRepository(cartDao)
export const ticketService = new TicketRepository(ticketDao)