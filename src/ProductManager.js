import fs from 'fs/promises'


class ProductManager{
    constructor(){
        this.path = "src/products.json"
    }

    async getProductsFromFile(){
        try {
            const fileContent = await fs.readFile(this.path, "utf-8")

            if(!fileContent || fileContent.trim()=== ""){
                return []
            }

            const products = JSON.parse(fileContent)

            if(!Array.isArray(products)){
                console.error("Error en getProductsFromFile: El contenido del archivo no es un array.")
                return []
            }

            return products
        } catch(error){
            console.error("Error en getProductsFromFile:", error)
            return []
        }
    }

    async generateUniqueId() {
        const products = await this.getProductsFromFile();
        if (products.length === 0) {
            return 1; // Si no hay productos, el primer ID será 1
        } else {
            const lastProduct = products[products.length - 1];
            return lastProduct.id + 1;
        }
    }


    async addProduct(product){
        const products = await this.getProductsFromFile()
        const newProduct = {
            id: await this.generateUniqueId(),
            title: product.title,
            description: product.description,
            code: product.code,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail
        }
        products.push(newProduct);
        this.saveProductsToFile(products);
        return newProduct
    }

    //RETORNAR PRODUCTO POR ID
    async getProductById(id){
        const products = await this.getProductsFromFile()
        const parseProd = parseInt(id)
        const foundProduct =  products.find((product) => product.id === parseProd)
        return foundProduct || null
    }

    //ACTUALIZAR PRODUCTO
    updateProduct(id, updatedFields){
        const products = this.getProductsFromFile()
        const indexToUpdate = products.findIndex((product)=>product.id ===id)

        if(indexToUpdate !== -1){
            //actualizar los campos sin cambiar el id
            products[indexToUpdate] = {
                ...products[indexToUpdate],
                ...updatedFields
            };
            this.saveProductsToFile(products);
            return products[indexToUpdate]
        }

        return null //producto no encontrado
    }

    deleteProduct(id){
        const products = this.getProductsFromFile()
        const updatedProducts = products.filter((product)=>product.id != id)
        this.saveProductsToFile(updatedProducts)
    }

    
    
    async saveProductsToFile(products){
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8")
    }
}

export default ProductManager