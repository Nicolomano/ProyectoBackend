import fs from "fs/promises"


class CartManager {
    constructor(){
        this.path = "src/carts.json"
    }

    async createCart(){
        const carts =  await this.getCartsFromFile()
        const newCart = {
            id: await this.generateUniqueId(),
            products: []
        }
        carts.push(newCart)
        await this.saveCartToFile(carts);
        
        return carts;
    }

    async getCartById(cartId){
        const carts = await this.getCartsFromFile()
        const parseId = parseInt(cartId)
        console.log("carts:", carts);
        return carts.find(cart => cart.id === parseId)
    }

    
    async addProductToCart(cartId, productId, quantity) {     
        const productIdParse = parseInt(productId);
        const cartIdParse = parseInt(cartId)
        const carts = await this.getCartsFromFile();
        const cartIndex = carts.findIndex(cart => cart.id === cartIdParse);
    
        if (cartIndex === -1) {
            throw new Error("Cart not found");
        }
    
        let updatedProducts = [...carts[cartIndex].products];
        let productExists = false;
    
        updatedProducts = updatedProducts.map(product => {
            if (product.id === productIdParse) {
                productExists = true;
                product.quantity = (product.quantity ?? 0) +( quantity?? 1); 
            }
            return product;
        });
    
        if (!productExists) {
            updatedProducts.push({ id: productIdParse, quantity: quantity?? 1 });
        }
    
        const updatedCart = {
            ...carts[cartIndex],
            products: updatedProducts
        };
    
        carts[cartIndex] = updatedCart;
    
        await this.saveCartToFile(carts);
        return updatedCart;
    }
    
    

    async saveCartToFile(cart){
        try{
            await fs.writeFile(this.path, JSON.stringify(cart, null, 2),"utf-8")
        }catch(error){
            console.error("Error saving cart to file", error);
            throw error
        }
    }

    async getCartsFromFile(){
        try{
            const fileContent = await fs.readFile(this.path, "utf-8")
            return JSON.parse(fileContent);
        }catch (error){
            return[]
        }
    }

    async generateUniqueId() {
        const carts = await this.getCartsFromFile();
        if (carts.length === 0) {
            return 1;
        } else {
            const lastCart = carts[carts.length - 1];
            console.log('Last cart ID:', lastCart.id); 
            const lastCartId = parseInt(lastCart.id);
            console.log('Parsed last cart ID:', lastCartId); 
            return lastCartId + 1;
        }
    }

}


export default CartManager
