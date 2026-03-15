const contenedorProducto = document.querySelector("#contenedorProducto");
const contenedorCarrito = document.querySelector("#contenedorCarrito");
const cantidadCarrito = document.querySelector("#cantidadCarrito");
const totalCarrito = document.querySelector("#totalCarrito");

let carrito = [];
const botonesProducto = new Map();

function obtenerProductoEnCarrito(nombreProducto) {
  return carrito.find((item) => item.name === nombreProducto);
}

function actualizarBotonProducto(nombreProducto) {
  const boton = botonesProducto.get(nombreProducto);

  if (!boton) {
    return;
  }

  const productoEnCarrito = obtenerProductoEnCarrito(nombreProducto);

  boton.classList.remove("btn-outline-primary", "btn-success", "btn-danger");

  if (productoEnCarrito) {
    boton.classList.add("btn-success");
    boton.textContent = "Agregado";
  } else {
    boton.classList.add("btn-outline-primary");
    boton.textContent = "Agregar";
  }
}

function renderizarCarrito() {
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    const mensajeVacio = document.createElement("p");
    mensajeVacio.textContent = "El carrito esta vacio.";
    contenedorCarrito.appendChild(mensajeVacio);
  } else {
    carrito.forEach((producto) => {
      const productoCarrito = document.createElement("div");
      productoCarrito.classList.add(
        "producto-carrito",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "gap-3",
        "mb-3",
      );

      const infoProducto = document.createElement("div");

      const nombre = document.createElement("p");
      nombre.classList.add("mb-1", "fw-semibold");
      nombre.textContent = producto.name;

      const precio = document.createElement("p");
      precio.classList.add("mb-0", "text-muted");
      precio.textContent = `$${producto.price.toFixed(2)} c/u`;

      infoProducto.append(nombre, precio);

      const controles = document.createElement("div");
      controles.classList.add("d-flex", "align-items-center", "gap-2");

      const botonRestar = document.createElement("button");
      botonRestar.type = "button";
      botonRestar.classList.add("btn", "btn-outline-secondary", "btn-sm");
      botonRestar.textContent = "-";

      const cantidad = document.createElement("span");
      cantidad.classList.add("fw-semibold");
      cantidad.textContent = producto.cantidad;

      const botonSumar = document.createElement("button");
      botonSumar.type = "button";
      botonSumar.classList.add("btn", "btn-outline-secondary", "btn-sm");
      botonSumar.textContent = "+";

      botonRestar.addEventListener("click", () => {
        const productoExistente = obtenerProductoEnCarrito(producto.name);

        if (!productoExistente) {
          return;
        }

        productoExistente.cantidad -= 1;

        if (productoExistente.cantidad <= 0) {
          carrito = carrito.filter((item) => item.name !== producto.name);
        }

        renderizarCarrito();
      });

      botonSumar.addEventListener("click", () => {
        const productoExistente = obtenerProductoEnCarrito(producto.name);

        if (!productoExistente) {
          return;
        }

        productoExistente.cantidad += 1;
        renderizarCarrito();
      });

      controles.append(botonRestar, cantidad, botonSumar);
      productoCarrito.append(infoProducto, controles);
      contenedorCarrito.appendChild(productoCarrito);
    });
  }

  const cantidadTotal = carrito.reduce(
    (acumulado, producto) => acumulado + producto.cantidad,
    0,
  );
  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.price * producto.cantidad,
    0,
  );

  cantidadCarrito.textContent = cantidadTotal;
  totalCarrito.textContent = `$${total.toFixed(2)}`;

  botonesProducto.forEach((_, nombreProducto) => {
    actualizarBotonProducto(nombreProducto);
  });
}

async function obtenerProductos() {
  const response = await fetch("./data.json");
  const data = await response.json();

  data.forEach((producto) => {
    const productoCard = document.createElement("div");
    productoCard.classList.add("col-4", "producto-card");

    const card = document.createElement("div");
    card.classList.add("card", "h-100");

    const imagen = document.createElement("img");
    imagen.src = producto.image.thumbnail;
    imagen.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const titulo = document.createElement("h5");
    titulo.classList.add("card-title");
    titulo.textContent = producto.name;

    const categoria = document.createElement("p");
    categoria.classList.add("card-text");
    categoria.textContent = producto.category;

    const precio = document.createElement("p");
    precio.classList.add("card-text");
    precio.textContent = `$${producto.price.toFixed(2)}`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.classList.add("btn", "btn-outline-primary", "producto-boton");
    botonesProducto.set(producto.name, boton);
    actualizarBotonProducto(producto.name);

    boton.addEventListener("click", () => {
      const productoExistente = obtenerProductoEnCarrito(producto.name);

      if (productoExistente) {
        carrito = carrito.filter((item) => item.name !== producto.name);
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      renderizarCarrito();
    });

    boton.addEventListener("mouseover", () => {
      if (obtenerProductoEnCarrito(producto.name)) {
        boton.classList.remove("btn-success");
        boton.classList.add("btn-danger");
        boton.textContent = "Quitar";
      }
    });

    boton.addEventListener("mouseout", () => {
      actualizarBotonProducto(producto.name);
    });

    cardBody.append(titulo, categoria, precio, boton);
    card.append(imagen, cardBody);
    productoCard.append(card);
    contenedorProducto.append(productoCard);
  });
}

renderizarCarrito();
obtenerProductos();
