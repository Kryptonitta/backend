const fs = require("fs");

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	addProduct(product) {
		try {
			const requiredProperties = [
				"title",
				"description",
				"price",
				"thumbnail",
				"code",
				"stock",
			];

			const missingProperties = requiredProperties.filter(
				(prop) => !(prop in product)
			);
			if (missingProperties.length > 0) {
				throw new Error(
					"Faltan propiedades requeridas: " + missingProperties.join(", ")
				);
			}

			const products = this.getProducts();

			const codeExists = products.some((p) => p.code === product.code);
			if (codeExists) {
				throw new Error("Código ya en uso");
			}

			product.id = this.generateId(products);
			products.push(product);
			this.saveProducts(products);
		} catch (error) {
			console.error("Error:", error.message);
		}
	}

	getProducts() {
		try {
			const products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
			return products;
		} catch (error) {
			console.error("Error:", error.message);
			return [];
		}
	}

	getProductById(id) {
		try {
			const products = this.getProducts();
			const product = products.find((p) => p.id === id);
			if (!product) {
				throw new Error("Producto no encontrado");
			}
			return product;
		} catch (error) {
			console.error("Error:", error.message);
			return null;
		}
	}

	updateProduct(id, updatedProduct) {
		try {
			const products = this.getProducts();
			const index = products.findIndex((p) => p.id === id);

			if (index === -1) {
				throw new Error("Producto no encontrado");
			}

			const existingProduct = products[index];
			const mergedProduct = { ...existingProduct, ...updatedProduct };
			products[index] = mergedProduct;
			this.saveProducts(products);
		} catch (error) {
			console.error("Error:", error.message);
		}
	}

	deleteProduct(id) {
		try {
			const products = this.getProducts();
			const index = products.findIndex((p) => p.id === id);

			if (index === -1) {
				throw new Error("Producto no encontrado");
			}

			products.splice(index, 1);
			this.saveProducts(products);
		} catch (error) {
			console.error("Error:", error.message);
		}
	}

	generateId(products) {
		let maxId = 0;
		products.forEach((p) => {
			if (p.id > maxId) {
				maxId = p.id;
			}
		});
		return maxId + 1;
	}

	saveProducts(products) {
		try {
			fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
		} catch (error) {
			console.error("Error:", error.message);
		}
	}
}

// EJECUCIÓN
//Crear instancia de la clase ProductManager
const productManager = new ProductManager("productos.json");

// Agregar productos
productManager.addProduct({
	title: "Producto 1",
	description: "Color red",
	price: 10,
	thumbnail: "img1.png",
	code: "001",
	stock: 5,
});

// Obtener productos
const allProducts = productManager.getProducts();
console.log(allProducts);

// Obtener producto por id
const productById = productManager.getProductById(2);
console.log(productById);

// Actualizar producto
productManager.updateProduct(2, {
	title: "Producto 2",
	description: "Color blue",
	price: 15,
	thumbnail: "img2.png",
	code: "001",
	stock: 10,
});

//Eliminar producto
productManager.deleteProduct(1);
