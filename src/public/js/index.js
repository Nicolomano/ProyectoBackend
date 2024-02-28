//configuracion del socket del lado del cliente
const socket = io();

socket.emit("msgKey","Nuevo cliente conectado")
socket.on("msg02", data =>{
    console.log(data);
})

document.getElementById("productForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const thumbnail = document.getElementById("thumbnail").value
    const code = document.getElementById("code").value
    const stock = document.getElementById("stock").value

    socket.emit("addProduct", {title, description, price, thumbnail, code, stock})
})

socket.on("productAdded", productData => {
    const productListContainer = document.getElementById("productListContainer");

    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
        <p>ID: ${productData.id}</p>
        <p>Title: ${productData.title}</p>
        <p>Description: ${productData.description}</p>
        <p>Price: ${productData.price}</p>
        <img src="${productData.thumbnail}" alt="Product Thumbnail">
        <p>Code: ${productData.code}</p>
        <p>Stock: ${productData.stock}</p>
    `;

    productListContainer.appendChild(productElement);
});