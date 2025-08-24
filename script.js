// Variables globales
let ejercicioActual = null;
let estadisticas = {
  correctas: 0,
  incorrectas: 0,
};

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeThemes();
  initializeTabs();
  initializeCalculator();
  initializeExercises();
  addAnimations();
});

// Sistema de temas
function initializeThemes() {
  const themeButtons = document.querySelectorAll(".theme-btn");
  const body = document.body;

  // Cargar tema guardado
  const savedTheme = localStorage.getItem("accounting-app-theme") || "gradient";
  body.setAttribute("data-theme", savedTheme);

  // Actualizar botón activo
  themeButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-theme") === savedTheme) {
      btn.classList.add("active");
    }
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme");

      // Animación de transición
      body.style.transition = "all 0.5s ease";
      body.setAttribute("data-theme", theme);

      // Guardar tema
      localStorage.setItem("accounting-app-theme", theme);

      // Actualizar botones
      themeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Efecto visual
      createThemeChangeEffect();
    });
  });
}

function createThemeChangeEffect() {
  const effect = document.createElement("div");
  effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        animation: themeRipple 0.8s ease-out;
    `;

  document.body.appendChild(effect);

  setTimeout(() => {
    document.body.removeChild(effect);
  }, 800);
}

// Animaciones adicionales
function addAnimations() {
  // Animación de entrada para las tarjetas
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideInUp 0.6s ease forwards";
      }
    });
  });

  document
    .querySelectorAll(".concept-card, .calc-input, .stat-item")
    .forEach((el) => {
      observer.observe(el);
    });

  // Efecto de partículas en el fondo
  createParticleEffect();
}

function createParticleEffect() {
  const particleContainer = document.createElement("div");
  particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
        `;
    particleContainer.appendChild(particle);
  }

  document.body.appendChild(particleContainer);
}

// Sistema de pestañas
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remover clase active de todos los botones y contenidos
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Agregar clase active al botón y contenido seleccionado
      button.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });
}

// Calculadora de balance
function initializeCalculator() {
  const activosInput = document.getElementById("activos");
  const pasivosInput = document.getElementById("pasivos");
  const patrimonioInput = document.getElementById("patrimonio");
  const calcularBtn = document.getElementById("calcular");
  const verificarBtn = document.getElementById("verificar");
  const limpiarBtn = document.getElementById("limpiar");
  const resultado = document.getElementById("resultado");

  calcularBtn.addEventListener("click", calcularValorFaltante);
  verificarBtn.addEventListener("click", verificarBalance);
  limpiarBtn.addEventListener("click", limpiarCalculadora);

  function calcularValorFaltante() {
    const activos = parseFloat(activosInput.value) || 0;
    const pasivos = parseFloat(pasivosInput.value) || 0;
    const patrimonio = parseFloat(patrimonioInput.value) || 0;

    let valoresIngresados = 0;
    if (activos > 0) valoresIngresados++;
    if (pasivos > 0) valoresIngresados++;
    if (patrimonio > 0) valoresIngresados++;

    if (valoresIngresados !== 2) {
      mostrarResultado(
        "⚠️ Debes ingresar exactamente 2 valores para calcular el tercero",
        "warning"
      );
      return;
    }

    let resultado = "";
    let valorCalculado = 0;

    if (activos === 0) {
      // Calcular Activos: A = P + PT
      valorCalculado = pasivos + patrimonio;
      activosInput.value = valorCalculado;
      resultado = `💰 Activos calculados: S/ ${valorCalculado.toLocaleString()}<br>`;
      resultado += `Fórmula: A = P + PT = ${pasivos.toLocaleString()} + ${patrimonio.toLocaleString()}`;
    } else if (pasivos === 0) {
      // Calcular Pasivos: P = A - PT
      valorCalculado = activos - patrimonio;
      pasivosInput.value = valorCalculado;
      resultado = `📋 Pasivos calculados: S/ ${valorCalculado.toLocaleString()}<br>`;
      resultado += `Fórmula: P = A - PT = ${activos.toLocaleString()} - ${patrimonio.toLocaleString()}`;
    } else if (patrimonio === 0) {
      // Calcular Patrimonio: PT = A - P
      valorCalculado = activos - pasivos;
      patrimonioInput.value = valorCalculado;
      resultado = `👥 Patrimonio calculado: S/ ${valorCalculado.toLocaleString()}<br>`;
      resultado += `Fórmula: PT = A - P = ${activos.toLocaleString()} - ${pasivos.toLocaleString()}`;
    }

    mostrarResultado(resultado, "success");
    mostrarTablaBalance();
  }

  function verificarBalance() {
    const activos = parseFloat(activosInput.value) || 0;
    const pasivos = parseFloat(pasivosInput.value) || 0;
    const patrimonio = parseFloat(patrimonioInput.value) || 0;

    if (activos === 0 || pasivos === 0 || patrimonio === 0) {
      mostrarResultado(
        "⚠️ Debes ingresar los 3 valores para verificar el balance",
        "warning"
      );
      return;
    }

    const sumaDerechos = pasivos + patrimonio;
    const diferencia = Math.abs(activos - sumaDerechos);

    let resultado = "";
    if (diferencia < 0.01) {
      // Considerando pequeños errores de redondeo
      resultado = `✅ <strong>¡Balance correcto!</strong><br>`;
      resultado += `S/ ${activos.toLocaleString()} = S/ ${pasivos.toLocaleString()} + S/ ${patrimonio.toLocaleString()}<br>`;
      resultado += `${activos.toLocaleString()} = ${sumaDerechos.toLocaleString()}`;
      mostrarResultado(resultado, "success");
      mostrarTablaBalance();
    } else {
      resultado = `❌ <strong>Balance incorrecto</strong><br>`;
      resultado += `S/ ${activos.toLocaleString()} ≠ S/ ${pasivos.toLocaleString()} + S/ ${patrimonio.toLocaleString()}<br>`;
      resultado += `${activos.toLocaleString()} ≠ ${sumaDerechos.toLocaleString()}<br>`;
      resultado += `Diferencia: S/ ${diferencia.toLocaleString()}`;
      mostrarResultado(resultado, "error");
      mostrarTablaBalance();
    }
  }

  function limpiarCalculadora() {
    activosInput.value = "";
    pasivosInput.value = "";
    patrimonioInput.value = "";
    resultado.innerHTML = "";
    resultado.className = "result-display";
    ocultarTablaBalance();
  }

  function mostrarResultado(mensaje, tipo) {
    resultado.innerHTML = mensaje;
    resultado.className = `result-display ${tipo}`;

    // Efecto de aparición suave
    resultado.style.opacity = "0";
    resultado.style.transform = "translateY(20px)";

    setTimeout(() => {
      resultado.style.transition = "all 0.5s ease";
      resultado.style.opacity = "1";
      resultado.style.transform = "translateY(0)";
    }, 100);
  }
}

// Sistema de ejercicios
function initializeExercises() {
  const nuevoEjercicioBtn = document.getElementById("nuevo-ejercicio");
  const verificarRespuestaBtn = document.getElementById("verificar-respuesta");
  const respuestaInput = document.getElementById("respuesta-usuario");

  nuevoEjercicioBtn.addEventListener("click", generarNuevoEjercicio);
  verificarRespuestaBtn.addEventListener("click", verificarRespuesta);

  // Permitir verificar con Enter
  respuestaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      verificarRespuesta();
    }
  });

  function generarNuevoEjercicio() {
    const dificultad = document.getElementById("dificultad").value;
    let min, max;

    switch (dificultad) {
      case "facil":
        min = 1000;
        max = 10000;
        break;
      case "medio":
        min = 10000;
        max = 100000;
        break;
      case "dificil":
        min = 100000;
        max = 1000000;
        break;
    }

    // Generar valores aleatorios
    const activos = Math.floor(Math.random() * (max - min) + min);
    const pasivos = Math.floor(Math.random() * (activos * 0.8)); // Pasivos máximo 80% de activos
    const patrimonio = activos - pasivos;

    // Decidir qué valor ocultar (aleatoriamente)
    const valorOculto = Math.floor(Math.random() * 3); // 0: activos, 1: pasivos, 2: patrimonio

    ejercicioActual = {
      activos: activos,
      pasivos: pasivos,
      patrimonio: patrimonio,
      valorOculto: valorOculto,
    };

    let ejercicioHTML = '<div class="ejercicio-problema">';
    ejercicioHTML += "<h3>🎯 Resuelve la ecuación contable:</h3>";
    ejercicioHTML += '<div class="ecuacion-ejercicio">';

    switch (valorOculto) {
      case 0: // Ocultar activos
        ejercicioHTML += `<span class="valor-oculto">? </span> = S/ ${pasivos.toLocaleString()} + S/ ${patrimonio.toLocaleString()}`;
        ejercicioHTML +=
          "<p><strong>Pregunta:</strong> ¿Cuál es el valor de los Activos?</p>";
        break;
      case 1: // Ocultar pasivos
        ejercicioHTML += `S/ ${activos.toLocaleString()} = <span class="valor-oculto">? </span> + S/ ${patrimonio.toLocaleString()}`;
        ejercicioHTML +=
          "<p><strong>Pregunta:</strong> ¿Cuál es el valor de los Pasivos?</p>";
        break;
      case 2: // Ocultar patrimonio
        ejercicioHTML += `S/ ${activos.toLocaleString()} = S/ ${pasivos.toLocaleString()} + <span class="valor-oculto">?</span>`;
        ejercicioHTML +=
          "<p><strong>Pregunta:</strong> ¿Cuál es el valor del Patrimonio?</p>";
        break;
    }

    ejercicioHTML += "</div></div>";

    const ejercicioElement = document.getElementById("ejercicio-actual");
    ejercicioElement.style.opacity = "0";
    ejercicioElement.style.transform = "scale(0.9)";

    setTimeout(() => {
      ejercicioElement.innerHTML = ejercicioHTML;
      ejercicioElement.style.transition = "all 0.5s ease";
      ejercicioElement.style.opacity = "1";
      ejercicioElement.style.transform = "scale(1)";
    }, 200);

    document.getElementById("respuesta-usuario").value = "";
    document.getElementById("resultado-ejercicio").innerHTML = "";
    ocultarTablaBalanceEjercicio();
  }

  function verificarRespuesta() {
    if (!ejercicioActual) {
      alert("Primero genera un nuevo ejercicio");
      return;
    }

    const respuestaUsuario = parseFloat(respuestaInput.value);
    if (isNaN(respuestaUsuario)) {
      document.getElementById("resultado-ejercicio").innerHTML =
        "⚠️ Por favor ingresa un número válido";
      return;
    }

    let respuestaCorrecta;
    let nombreValor;

    switch (ejercicioActual.valorOculto) {
      case 0: // Activos
        respuestaCorrecta = ejercicioActual.activos;
        nombreValor = "Activos";
        break;
      case 1: // Pasivos
        respuestaCorrecta = ejercicioActual.pasivos;
        nombreValor = "Pasivos";
        break;
      case 2: // Patrimonio
        respuestaCorrecta = ejercicioActual.patrimonio;
        nombreValor = "Patrimonio";
        break;
    }

    let resultadoHTML = "";
    if (Math.abs(respuestaUsuario - respuestaCorrecta) < 0.01) {
      resultadoHTML = `✅ <strong>¡Correcto!</strong><br>`;
      resultadoHTML += `${nombreValor}: S/ ${respuestaCorrecta.toLocaleString()}<br>`;
      resultadoHTML += `Ecuación completa: S/ ${ejercicioActual.activos.toLocaleString()} = S/ ${ejercicioActual.pasivos.toLocaleString()} + S/ ${ejercicioActual.patrimonio.toLocaleString()}`;
      estadisticas.correctas++;
      document.getElementById("resultado-ejercicio").className =
        "exercise-result success";
      mostrarTablaBalanceEjercicio();
    } else {
      resultadoHTML = `❌ <strong>Incorrecto</strong><br>`;
      resultadoHTML += `Tu respuesta: S/ ${respuestaUsuario.toLocaleString()}<br>`;
      resultadoHTML += `Respuesta correcta: S/ ${respuestaCorrecta.toLocaleString()}<br>`;
      resultadoHTML += `Ecuación completa: S/ ${ejercicioActual.activos.toLocaleString()} = S/ ${ejercicioActual.pasivos.toLocaleString()} + S/ ${ejercicioActual.patrimonio.toLocaleString()}`;
      estadisticas.incorrectas++;
      document.getElementById("resultado-ejercicio").className =
        "exercise-result error";
    }

    document.getElementById("resultado-ejercicio").innerHTML = resultadoHTML;
    actualizarEstadisticas();
  }

  function actualizarEstadisticas() {
    const total = estadisticas.correctas + estadisticas.incorrectas;
    const precision =
      total > 0 ? Math.round((estadisticas.correctas / total) * 100) : 0;

    document.getElementById("correctas").textContent = estadisticas.correctas;
    document.getElementById("incorrectas").textContent =
      estadisticas.incorrectas;
    document.getElementById("precision").textContent = precision + "%";
  }
}

// Estilos adicionales para los resultados
const style = document.createElement("style");
style.textContent = `
    .result-display.success, .exercise-result.success {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        border-radius: 10px;
    }
    
    .result-display.error, .exercise-result.error {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: white;
        border-radius: 10px;
    }
    
    .result-display.warning {
        background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
        color: #333;
        border-radius: 10px;
    }
    
`;
document.head.appendChild(style);

// CSS adicional para animaciones
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
    @keyframes themeRipple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        33% {
            transform: translateY(-10px) rotate(120deg);
        }
        66% {
            transform: translateY(5px) rotate(240deg);
        }
    }
    
    .valor-oculto {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
        padding: 8px 20px;
        border-radius: 25px;
        font-weight: bold;
        display: inline-block;
        margin: 0 8px;
        animation: glow-pulse 2s ease-in-out infinite;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    @keyframes glow-pulse {
        0%, 100% {
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: scale(1);
        }
        50% {
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            transform: scale(1.05);
        }
    }
    
    .ecuacion-ejercicio {
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
        margin: 25px 0;
        color: var(--primary-color);
        text-shadow: 2px 2px 10px rgba(0,0,0,0.1);
        line-height: 1.4;
    }
    
    .ejercicio-problema h3 {
        color: var(--text-primary);
        margin-bottom: 25px;
        font-size: 1.5rem;
        text-align: center;
    }
    
    .ejercicio-problema p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-top: 20px;
        font-weight: 600;
    }
    
    /* Mejoras para dispositivos móviles */
    @media (max-width: 768px) {
        .valor-oculto {
            padding: 6px 15px;
            font-size: 0.9rem;
            margin: 0 5px;
        }
        
        .ecuacion-ejercicio {
            font-size: 1.4rem;
            line-height: 1.6;
        }
    }
    
    /* Efectos hover mejorados */
    .concept-card:hover .concept-symbol {
        animation-duration: 2s;
        background: rgba(255,255,255,0.4);
    }
    
    .tab-btn:hover {
        letter-spacing: 1px;
    }
    
    /* Transiciones suaves para cambios de tema */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    .tab-content, .concept-card, .calc-input, .result-display, .exercise-display {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(additionalStyles);

// Funciones para la tabla de balance
function mostrarTablaBalance() {
  const activosInput = document.getElementById("activos");
  const pasivosInput = document.getElementById("pasivos");
  const patrimonioInput = document.getElementById("patrimonio");

  const activos = parseFloat(activosInput.value) || 0;
  const pasivos = parseFloat(pasivosInput.value) || 0;
  const patrimonio = parseFloat(patrimonioInput.value) || 0;

  if (activos === 0 && pasivos === 0 && patrimonio === 0) {
    ocultarTablaBalance();
    return;
  }

  // Mostrar la tabla
  const tablaBalance = document.getElementById("tabla-balance");
  tablaBalance.style.display = "block";

  // Llenar los datos de la tabla
  llenarDatosTabla(activos, pasivos, patrimonio);

  // Animación de entrada
  setTimeout(() => {
    tablaBalance.style.opacity = "0";
    tablaBalance.style.transform = "translateY(20px)";
    tablaBalance.style.transition = "all 0.6s ease";

    setTimeout(() => {
      tablaBalance.style.opacity = "1";
      tablaBalance.style.transform = "translateY(0)";
    }, 100);
  }, 200);
}

function llenarDatosTabla(activos, pasivos, patrimonio) {
  // Datos de ejemplo para activos (puedes personalizar estos)
  const activosItems = [
    { nombre: "Caja y Bancos", valor: Math.round(activos * 0.2) },
    { nombre: "Cuentas por Cobrar", valor: Math.round(activos * 0.3) },
    { nombre: "Inventarios", valor: Math.round(activos * 0.25) },
    {
      nombre: "Propiedad, Planta y Equipo",
      valor: activos - Math.round(activos * 0.75),
    },
  ];

  // Datos de ejemplo para pasivos
  const pasivosItems = [
    { nombre: "Cuentas por Pagar", valor: Math.round(pasivos * 0.6) },
    {
      nombre: "Préstamos Bancarios",
      valor: pasivos - Math.round(pasivos * 0.6),
    },
  ];

  // Datos de ejemplo para patrimonio
  const patrimonioItems = [
    { nombre: "Capital Social", valor: Math.round(patrimonio * 0.8) },
    {
      nombre: "Utilidades Retenidas",
      valor: patrimonio - Math.round(patrimonio * 0.8),
    },
  ];

  // Llenar activos
  const activosContainer = document.getElementById("activos-items");
  activosContainer.innerHTML = "";
  activosItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      activosContainer.appendChild(itemElement);
    }
  });

  // Llenar pasivos
  const pasivosContainer = document.getElementById("pasivos-items");
  pasivosContainer.innerHTML = "";
  pasivosItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      pasivosContainer.appendChild(itemElement);
    }
  });

  // Llenar patrimonio
  const patrimonioContainer = document.getElementById("patrimonio-items");
  patrimonioContainer.innerHTML = "";
  patrimonioItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      patrimonioContainer.appendChild(itemElement);
    }
  });

  // Actualizar totales
  document.getElementById(
    "total-activos"
  ).textContent = `S/ ${activos.toLocaleString()}`;
  document.getElementById(
    "total-pasivos"
  ).textContent = `S/ ${pasivos.toLocaleString()}`;
  document.getElementById(
    "total-patrimonio"
  ).textContent = `S/ ${patrimonio.toLocaleString()}`;
  document.getElementById("total-pasivos-patrimonio").textContent = `S/ ${(
    pasivos + patrimonio
  ).toLocaleString()}`;

  // Actualizar verificación
  document.getElementById(
    "verify-activos"
  ).textContent = `S/ ${activos.toLocaleString()}`;
  document.getElementById("verify-pasivos-patrimonio").textContent = `S/ ${(
    pasivos + patrimonio
  ).toLocaleString()}`;

  // Estado de verificación
  const verificationStatus = document.getElementById("verification-status");
  const diferencia = Math.abs(activos - (pasivos + patrimonio));

  if (diferencia < 0.01) {
    verificationStatus.innerHTML =
      "✅ <strong>¡Balance Equilibrado!</strong><br>La ecuación contable está balanceada correctamente.";
    verificationStatus.className = "verification-status balanced";
  } else {
    verificationStatus.innerHTML = `❌ <strong>Balance Desequilibrado</strong><br>Diferencia: S/ ${diferencia.toLocaleString()}`;
    verificationStatus.className = "verification-status unbalanced";
  }
}

function ocultarTablaBalance() {
  const tablaBalance = document.getElementById("tabla-balance");
  tablaBalance.style.display = "none";
}

// Función para generar datos más realistas basados en el tipo de empresa
function generarDatosRealisticos(activos, pasivos, patrimonio) {
  // Esta función se puede expandir para generar datos más específicos
  // basados en diferentes tipos de empresas o industrias
  return {
    activos: [
      { nombre: "Efectivo y Equivalentes", valor: Math.round(activos * 0.15) },
      { nombre: "Cuentas por Cobrar", valor: Math.round(activos * 0.25) },
      { nombre: "Inventarios", valor: Math.round(activos * 0.3) },
      { nombre: "Activos Fijos", valor: Math.round(activos * 0.3) },
    ],
    pasivos: [
      { nombre: "Proveedores", valor: Math.round(pasivos * 0.4) },
      { nombre: "Préstamos a Corto Plazo", valor: Math.round(pasivos * 0.35) },
      { nombre: "Obligaciones Laborales", valor: Math.round(pasivos * 0.25) },
    ],
    patrimonio: [
      { nombre: "Capital Pagado", valor: Math.round(patrimonio * 0.7) },
      { nombre: "Reservas", valor: Math.round(patrimonio * 0.15) },
      {
        nombre: "Utilidades del Ejercicio",
        valor: Math.round(patrimonio * 0.15),
      },
    ],
  };
}
// Funciones para la tabla de balance en ejercicios
function mostrarTablaBalanceEjercicio() {
  if (!ejercicioActual) return;

  const { activos, pasivos, patrimonio } = ejercicioActual;

  // Mostrar la tabla
  const tablaBalance = document.getElementById("tabla-balance-ejercicio");
  tablaBalance.style.display = "block";

  // Llenar los datos de la tabla
  llenarDatosTablaEjercicio(activos, pasivos, patrimonio);

  // Animación de entrada
  setTimeout(() => {
    tablaBalance.style.opacity = "0";
    tablaBalance.style.transform = "translateY(20px)";
    tablaBalance.style.transition = "all 0.6s ease";

    setTimeout(() => {
      tablaBalance.style.opacity = "1";
      tablaBalance.style.transform = "translateY(0)";
    }, 100);
  }, 500); // Delay para que aparezca después del resultado
}

function llenarDatosTablaEjercicio(activos, pasivos, patrimonio) {
  // Generar datos más variados para ejercicios
  const activosItems = generarActivosEjercicio(activos);
  const pasivosItems = generarPasivosEjercicio(pasivos);
  const patrimonioItems = generarPatrimonioEjercicio(patrimonio);

  // Llenar activos
  const activosContainer = document.getElementById("activos-items-ejercicio");
  activosContainer.innerHTML = "";
  activosItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      activosContainer.appendChild(itemElement);
    }
  });

  // Llenar pasivos
  const pasivosContainer = document.getElementById("pasivos-items-ejercicio");
  pasivosContainer.innerHTML = "";
  pasivosItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      pasivosContainer.appendChild(itemElement);
    }
  });

  // Llenar patrimonio
  const patrimonioContainer = document.getElementById(
    "patrimonio-items-ejercicio"
  );
  patrimonioContainer.innerHTML = "";
  patrimonioItems.forEach((item, index) => {
    if (item.valor > 0) {
      const itemElement = document.createElement("div");
      itemElement.className = "balance-item";
      itemElement.style.animationDelay = `${index * 0.1}s`;
      itemElement.innerHTML = `
        <span class="item-name">${item.nombre}</span>
        <span class="item-value">S/ ${item.valor.toLocaleString()}</span>
      `;
      patrimonioContainer.appendChild(itemElement);
    }
  });

  // Actualizar totales
  document.getElementById(
    "total-activos-ejercicio"
  ).textContent = `S/ ${activos.toLocaleString()}`;
  document.getElementById(
    "total-pasivos-ejercicio"
  ).textContent = `S/ ${pasivos.toLocaleString()}`;
  document.getElementById(
    "total-patrimonio-ejercicio"
  ).textContent = `S/ ${patrimonio.toLocaleString()}`;
  document.getElementById(
    "total-pasivos-patrimonio-ejercicio"
  ).textContent = `S/ ${(pasivos + patrimonio).toLocaleString()}`;

  // Actualizar verificación
  document.getElementById(
    "verify-activos-ejercicio"
  ).textContent = `S/ ${activos.toLocaleString()}`;
  document.getElementById(
    "verify-pasivos-patrimonio-ejercicio"
  ).textContent = `S/ ${(pasivos + patrimonio).toLocaleString()}`;

  // El estado siempre será balanceado en ejercicios correctos
  const verificationStatus = document.getElementById(
    "verification-status-ejercicio"
  );
  verificationStatus.innerHTML =
    "✅ <strong>¡Balance Perfecto!</strong><br>Este ejercicio demuestra la ecuación contable balanceada.";
  verificationStatus.className = "verification-status balanced";
}

function ocultarTablaBalanceEjercicio() {
  const tablaBalance = document.getElementById("tabla-balance-ejercicio");
  tablaBalance.style.display = "none";
}

// Generadores de datos más variados para ejercicios
function generarActivosEjercicio(total) {
  const tipos = [
    { nombre: "Efectivo en Caja", min: 0.05, max: 0.15 },
    { nombre: "Bancos", min: 0.1, max: 0.25 },
    { nombre: "Cuentas por Cobrar", min: 0.15, max: 0.3 },
    { nombre: "Inventario de Mercaderías", min: 0.2, max: 0.35 },
    { nombre: "Muebles y Enseres", min: 0.05, max: 0.15 },
    { nombre: "Equipos de Oficina", min: 0.03, max: 0.1 },
    { nombre: "Vehículos", min: 0.1, max: 0.2 },
  ];

  // Seleccionar 3-4 tipos aleatoriamente
  const tiposSeleccionados = tipos
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 3);
  let totalAsignado = 0;
  const items = [];

  tiposSeleccionados.forEach((tipo, index) => {
    let porcentaje;
    if (index === tiposSeleccionados.length - 1) {
      // Último item: asignar el resto
      porcentaje = (total - totalAsignado) / total;
    } else {
      porcentaje = tipo.min + Math.random() * (tipo.max - tipo.min);
    }

    const valor = Math.round(total * porcentaje);
    if (valor > 0) {
      items.push({ nombre: tipo.nombre, valor });
      totalAsignado += valor;
    }
  });

  return items;
}

function generarPasivosEjercicio(total) {
  const tipos = [
    { nombre: "Proveedores", min: 0.3, max: 0.5 },
    { nombre: "Préstamos Bancarios", min: 0.2, max: 0.4 },
    { nombre: "Cuentas por Pagar", min: 0.1, max: 0.25 },
    { nombre: "Sueldos por Pagar", min: 0.05, max: 0.15 },
    { nombre: "Impuestos por Pagar", min: 0.05, max: 0.12 },
  ];

  const tiposSeleccionados = tipos
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 2);
  let totalAsignado = 0;
  const items = [];

  tiposSeleccionados.forEach((tipo, index) => {
    let porcentaje;
    if (index === tiposSeleccionados.length - 1) {
      porcentaje = (total - totalAsignado) / total;
    } else {
      porcentaje = tipo.min + Math.random() * (tipo.max - tipo.min);
    }

    const valor = Math.round(total * porcentaje);
    if (valor > 0) {
      items.push({ nombre: tipo.nombre, valor });
      totalAsignado += valor;
    }
  });

  return items;
}

function generarPatrimonioEjercicio(total) {
  const tipos = [
    { nombre: "Capital Social", min: 0.6, max: 0.8 },
    { nombre: "Reserva Legal", min: 0.05, max: 0.15 },
    { nombre: "Utilidades Retenidas", min: 0.1, max: 0.25 },
    { nombre: "Utilidades del Ejercicio", min: 0.05, max: 0.2 },
  ];

  const tiposSeleccionados = tipos
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 2);
  let totalAsignado = 0;
  const items = [];

  tiposSeleccionados.forEach((tipo, index) => {
    let porcentaje;
    if (index === tiposSeleccionados.length - 1) {
      porcentaje = (total - totalAsignado) / total;
    } else {
      porcentaje = tipo.min + Math.random() * (tipo.max - tipo.min);
    }

    const valor = Math.round(total * porcentaje);
    if (valor > 0) {
      items.push({ nombre: tipo.nombre, valor });
      totalAsignado += valor;
    }
  });

  return items;
}
