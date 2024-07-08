export const createProductErrorInfo = (product) =>{
    return `una o mas propiedades enviadas fueron enviadas incompletas o no son validas.
    propiedades requeridas:
        --> title: type string, recibido: ${product.title}
        --> description: type string, recibido: ${product.description}
        --> price: type number, recibido: ${product.price}
        --> thumbnail: type string, recibido: ${product.thumbnail}
        --> code: type string, recibido: ${product.code}`
}


export const addProductToCartErrorInfo= (cartId,productId) =>{
    return `no se pudo agregar el producto con id ${productId} al carrito con id ${cartId},
    verifique que el producto y el carrito existan.
    propiedades requeridas:
        --> cartId: type string, recibido: ${cartId}
        --> productId: type string, recibido: ${productId}`
}