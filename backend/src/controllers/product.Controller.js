import { productsService } from "../services/service.js";

export async function getProductsController(req, res){
    const page = parseInt(req.query.page) || 1;
    const { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getAll(page)
    const prevLink = hasPrevPage ? `/api/products/?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/api/products/?page=${nextPage}` : null;
    res.json({
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
    });
}

export async function getProductByIdController (req, res) {
    try {
        const productId = req.params.pid;
        const product = await productsService.findOne(productId)
        if(product){
            res.render('product', product);
        }else{
            res.status(404).send('Product not found');
        }       
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

export async function createProductController (req,res){
    try {
        const {title, description, price, thumbnail, code, stock} = req.body;
        if(!title||!description || !price || !thumbnail || !code || !stock){
            return res.status(400).send("Error, todos los campos son obligatorios")
        }
        const newProduct = await productsService.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });
        res.status(201).send(newProduct)
        
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Internal server error")
    }
    
}

export default { getProductsController, getProductByIdController, createProductController }