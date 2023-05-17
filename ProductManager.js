import fs from 'fs'

class ProductManager {
    #path
    #format
    constructor(path){
        this.#path = path
        this.#format = 'utf-8'
    }

    addProduct = async(title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        products.push({id: await this.#generateId(), title, description, price, thumbnail, code, stock})
        return await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
    }

    getProducts = async() => {
        return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
    }

    #generateId = async() => {
        const products = await this.getProducts()
        if (products.length===0){
            return 1
        }
        return products[products.length-1].id + 1
    }

    getProductById = async(id) => {
        const products = await this.getProducts()
        let foundProduct = undefined
        products.forEach(product => {
            if(product.id == id){
                foundProduct = product
            }
        })

        return foundProduct ? foundProduct : `No existe el ID: "${id}"`

    }

    updateProduct = async(id, fieldToUpdate, updateData) => {
        const products = await this.getProducts()
        let foundProduct = undefined
        if(!products[0].hasOwnProperty(fieldToUpdate)){
            console.log(`No existe la propiedad: "${fieldToUpdate}"`)
            return
        }
        
        products.forEach(product => {
            if(product.id == id){
                product[fieldToUpdate] = updateData
                foundProduct = true
            }
        })

        foundProduct ? await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t')) : console.log(`No existe el ID: "${id}"`)
    }

    deleteProduct = async(id) => {
        const products = await this.getProducts()
        let foundProduct = undefined

        products.forEach((product, index) => {
            if(product.id == id){
                foundProduct = true
                products.splice(index, 1)
            }
        })
        foundProduct ? await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t')) : console.log(`No existe el ID: "${id}"`)
    }

}

!fs.existsSync("./products.json") && fs.promises.writeFile('./products.json', "[]")

const productManager = new ProductManager('./products.json')


/* PROCESO DE TESTING - MANEJO DE ARCHIVOS */

// console.log(await productManager.getProducts()) // DEVUELVE ARRAY VACIO

// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25) // AGREGA EL ITEM CORRECTAMENTE

// console.log(await productManager.getProducts()) // MUESTRA EL ITEM AGREGADO

// console.log(await productManager.getProductById(1)) // MUESTRA EL ITEM CON EL ID "1"
// console.log(await productManager.getProductById(7)) // NO MUESTRA NADA, NO EXISTE EL ID "7"

// await productManager.updateProduct(1, "title", "Nuevo Producto Prueba") // CAMBIA EL TITULO
// console.log(await productManager.getProducts()) // MUESTRA LOS CAMBIOS

// await productManager.deleteProduct(2) // NO EXISTE EL ID "2", TIRA ERROR.
// await productManager.deleteProduct(1) // ELIMINA EXITOSAMENTE EL PRODUCTO CON ID "1"
