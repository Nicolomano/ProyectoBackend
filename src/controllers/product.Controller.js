import {getProducts} from '../services/product.services';

export async function getProductsController(req, res) {
    const page = parseInt(req.query.page) || 1;
    const { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await getProducts(page);
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
