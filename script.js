async function cargarNegocios() {
  try {
    const response = await fetch("negocios.json");
    const negocios = await response.json();

    mostrarNegocios(negocios);
    window.negociosGlobal = negocios; // Guardamos lista global

    const inputBuscar = document.getElementById("buscar");
    const btnLimpiar = document.getElementById("limpiar");
    const btnIr = document.getElementById("btn-ir");
    const sugerenciasBox = document.getElementById("sugerencias");

    // Autocompletado dinámico
    inputBuscar.addEventListener("input", () => {
      const valor = inputBuscar.value.toLowerCase();
      sugerenciasBox.innerHTML = "";

      if (valor.length > 1) {
        const coincidencias = negocios.filter(n =>
          n.nombre.toLowerCase().includes(valor) ||
          n.sector.toLowerCase().includes(valor)
        );

        coincidencias.forEach(n => {
          const item = document.createElement("div");
          item.textContent = n.nombre;
          item.classList.add("sugerencia-item");
          item.onclick = () => {
            inputBuscar.value = n.nombre;
            sugerenciasBox.innerHTML = "";
            filtrarNegocios(negocios, n.nombre);
            document.getElementById("lista").scrollIntoView({ behavior: "smooth", block: "start" });
          };
          sugerenciasBox.appendChild(item);
        });
      }
    });

    // Botón Ir → filtra y baja a resultados
    btnIr.addEventListener("click", () => {
      filtrarNegocios(negocios, inputBuscar.value);
      document.getElementById("lista").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Botón Limpiar → borra campo y muestra todo
    btnLimpiar.addEventListener("click", () => {
      inputBuscar.value = "";
      sugerenciasBox.innerHTML = "";
      mostrarNegocios(negocios);
      document.getElementById("lista").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Filtros por sector
    document.querySelectorAll(".sector-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const sector = btn.dataset.sector;
        filtrarPorSector(negocios, sector);
        document.getElementById("lista").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Botón limpiar filtros
    document.getElementById("limpiar-filtros").addEventListener("click", () => {
      mostrarNegocios(negocios);
      document.getElementById("lista").scrollIntoView({ behavior: "smooth", block: "start" });
    });

  } catch (error) {
    console.error("Error cargando negocios:", error);
  }
}

function mostrarNegocios(lista) {
  const contenedor = document.getElementById("lista");
  contenedor.innerHTML = "";

  lista.forEach((n, index) => {
    contenedor.innerHTML += `
      <div class="col-md-4">
        <div class="card negocio-card h-100">
          <div class="card-body">
            <h5 class="card-title">${n.nombre}</h5>
            <p class="card-text"><strong>Sector:</strong> ${n.sector}</p>
            <p class="card-text"><strong>Dirección:</strong> ${n.direccion}</p>
            <p class="card-text"><strong>Teléfono:</strong> ${n.telefono}</p>
            <p class="card-text"><strong>Horario:</strong> ${n.horario || "No disponible"}</p>
            <a href="${n.maps_url}" target="_blank" class="btn btn-mapa">Ver en Google Maps</a>
            <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#detalleModal"
              onclick="mostrarDetalle(${index})">Ver detalles</button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("contador").textContent = lista.length;
}

function mostrarDetalle(index) {
  const negocio = window.negociosGlobal[index];
  document.getElementById("detalleTitulo").textContent = negocio.nombre;
  document.getElementById("detalleContenido").innerHTML = `
    <p><strong>Sector:</strong> ${negocio.sector}</p>
    <p><strong>Dirección:</strong> ${negocio.direccion}</p>
    <p><strong>Teléfono:</strong> ${negocio.telefono}</p>
    <p><strong>Horario:</strong> ${negocio.horario || "No disponible"}</p>
    <p>${negocio.descripcion || "Sin descripción adicional."}</p>
    <p><a href="${negocio.maps_url}" target="_blank" class="btn btn-mapa">Ver en Google Maps</a></p>
  `;
}

function filtrarNegocios(lista, texto) {
  const filtro = texto.toLowerCase();
  const filtrados = lista.filter(n =>
    n.nombre.toLowerCase().includes(filtro) ||
    n.sector.toLowerCase().includes(filtro)
  );
  mostrarNegocios(filtrados);
}

function filtrarPorSector(lista, sector) {
  const filtrados = lista.filter(n => n.sector.toLowerCase() === sector.toLowerCase());
  mostrarNegocios(filtrados);
}

cargarNegocios();




