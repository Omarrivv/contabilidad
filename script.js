/**
 * ============================================================================
 * APLICACIÓN EDUCATIVA DE CONTABILIDAD BÁSICA
 * ============================================================================
 * 
 * Arquitectura basada en Domain-Driven Design (DDD) y Clean Code
 * 
 * Dominios principales:
 * - ThemeManagement: Gestión de temas visuales
 * - AccountingCalculator: Calculadora de ecuaciones contables
 * - ExerciseGenerator: Generador de ejercicios educativos
 * - BalanceTableRenderer: Visualización de balances en formato T
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

// ============================================================================
// DOMAIN MODELS - Modelos de dominio
// ============================================================================

/**
 * Modelo de datos para la ecuación contable
 * Representa: Activos = Pasivos + Patrimonio
 */
class AccountingEquation {
  constructor(activos = 0, pasivos = 0, patrimonio = 0) {
    this.activos = activos;
    this.pasivos = pasivos;
    this.patrimonio = patrimonio;
  }

  /**
   * Verifica si la ecuación está balanceada
   * @returns {boolean} true si A = P + PT
   */
  isBalanced() {
    const tolerance = 0.01; // Tolerancia para errores de redondeo
    return Math.abs(this.activos - (this.pasivos + this.patrimonio)) < tolerance;
  }

  /**
   * Calcula el valor faltante basado en los valores proporcionados
   * @returns {Object} Resultado del cálculo
   */
  calculateMissingValue() {
    const valuesProvided = this.countProvidedValues();
    
    if (valuesProvided !== 2) {
      throw new Error('Se requieren exactamente 2 valores para calcular el tercero');
    }

    if (this.activos === 0) {
      return this.calculateActivos();
    } else if (this.pasivos === 0) {
      return this.calculatePasivos();
    } else if (this.patrimonio === 0) {
      return this.calculatePatrimonio();
    }
  }

  /**
   * Cuenta cuántos valores han sido proporcionados
   * @private
   */
  countProvidedValues() {
    let count = 0;
    if (this.activos > 0) count++;
    if (this.pasivos > 0) count++;
    if (this.patrimonio > 0) count++;
    return count;
  }

  /**
   * Calcula activos: A = P + PT
   * @private
   */
  calculateActivos() {
    const result = this.pasivos + this.patrimonio;
    this.activos = result;
    return {
      type: 'activos',
      value: result,
      formula: `A = P + PT = ${this.pasivos.toLocaleString()} + ${this.patrimonio.toLocaleString()}`
    };
  }

  /**
   * Calcula pasivos: P = A - PT
   * @private
   */
  calculatePasivos() {
    const result = this.activos - this.patrimonio;
    this.pasivos = result;
    return {
      type: 'pasivos',
      value: result,
      formula: `P = A - PT = ${this.activos.toLocaleString()} - ${this.patrimonio.toLocaleString()}`
    };
  }

  /**
   * Calcula patrimonio: PT = A - P
   * @private
   */
  calculatePatrimonio() {
    const result = this.activos - this.pasivos;
    this.patrimonio = result;
    return {
      type: 'patrimonio',
      value: result,
      formula: `PT = A - P = ${this.activos.toLocaleString()} - ${this.pasivos.toLocaleString()}`
    };
  }
}

/**
 * Modelo para ejercicios de práctica
 */
class Exercise {
  constructor(activos, pasivos, patrimonio, hiddenValue) {
    this.equation = new AccountingEquation(activos, pasivos, patrimonio);
    this.hiddenValue = hiddenValue; // 0: activos, 1: pasivos, 2: patrimonio
  }

  /**
   * Obtiene la pregunta del ejercicio
   */
  getQuestion() {
    const questions = {
      0: '¿Cuál es el valor de los Activos?',
      1: '¿Cuál es el valor de los Pasivos?',
      2: '¿Cuál es el valor del Patrimonio?'
    };
    return questions[this.hiddenValue];
  }

  /**
   * Obtiene la respuesta correcta
   */
  getCorrectAnswer() {
    const answers = {
      0: this.equation.activos,
      1: this.equation.pasivos,
      2: this.equation.patrimonio
    };
    return answers[this.hiddenValue];
  }

  /**
   * Verifica si la respuesta del usuario es correcta
   */
  checkAnswer(userAnswer) {
    const correctAnswer = this.getCorrectAnswer();
    return Math.abs(userAnswer - correctAnswer) < 0.01;
  }
}

// ============================================================================
// DOMAIN SERVICES - Servicios de dominio
// ============================================================================

/**
 * Servicio para generar datos realistas de balance
 */
class BalanceDataGenerator {
  
  /**
   * Genera subcuentas de activos de forma realista
   */
  static generateActivosBreakdown(total) {
    const accountTypes = [
      { name: "Efectivo en Caja", minPercent: 0.05, maxPercent: 0.15 },
      { name: "Bancos", minPercent: 0.10, maxPercent: 0.25 },
      { name: "Cuentas por Cobrar", minPercent: 0.15, maxPercent: 0.30 },
      { name: "Inventario de Mercaderías", minPercent: 0.20, maxPercent: 0.35 },
      { name: "Muebles y Enseres", minPercent: 0.05, maxPercent: 0.15 },
      { name: "Equipos de Oficina", minPercent: 0.03, maxPercent: 0.10 },
      { name: "Vehículos", minPercent: 0.10, maxPercent: 0.20 }
    ];

    return this.distributeAmountAcrossAccounts(total, accountTypes, 3, 4);
  }

  /**
   * Genera subcuentas de pasivos de forma realista
   */
  static generatePasivosBreakdown(total) {
    const accountTypes = [
      { name: "Proveedores", minPercent: 0.30, maxPercent: 0.50 },
      { name: "Préstamos Bancarios", minPercent: 0.20, maxPercent: 0.40 },
      { name: "Cuentas por Pagar", minPercent: 0.10, maxPercent: 0.25 },
      { name: "Sueldos por Pagar", minPercent: 0.05, maxPercent: 0.15 },
      { name: "Impuestos por Pagar", minPercent: 0.05, maxPercent: 0.12 }
    ];

    return this.distributeAmountAcrossAccounts(total, accountTypes, 2, 3);
  }

  /**
   * Genera subcuentas de patrimonio de forma realista
   */
  static generatePatrimonioBreakdown(total) {
    const accountTypes = [
      { name: "Capital Social", minPercent: 0.60, maxPercent: 0.80 },
      { name: "Reserva Legal", minPercent: 0.05, maxPercent: 0.15 },
      { name: "Utilidades Retenidas", minPercent: 0.10, maxPercent: 0.25 },
      { name: "Utilidades del Ejercicio", minPercent: 0.05, maxPercent: 0.20 }
    ];

    return this.distributeAmountAcrossAccounts(total, accountTypes, 2, 3);
  }

  /**
   * Distribuye un monto total entre diferentes tipos de cuentas
   * @private
   */
  static distributeAmountAcrossAccounts(total, accountTypes, minAccounts, maxAccounts) {
    // Seleccionar tipos de cuenta aleatoriamente
    const selectedTypes = accountTypes
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * (maxAccounts - minAccounts + 1)) + minAccounts);

    let totalAssigned = 0;
    const accounts = [];

    selectedTypes.forEach((type, index) => {
      let percentage;
      
      if (index === selectedTypes.length - 1) {
        // Último elemento: asignar el resto
        percentage = (total - totalAssigned) / total;
      } else {
        percentage = type.minPercent + Math.random() * (type.maxPercent - type.minPercent);
      }
      
      const value = Math.round(total * percentage);
      
      if (value > 0) {
        accounts.push({ name: type.name, value });
        totalAssigned += value;
      }
    });

    return accounts;
  }
}

/**
 * Servicio para generar ejercicios educativos
 */
class ExerciseGenerator {
  
  /**
   * Genera un nuevo ejercicio basado en el nivel de dificultad
   */
  static generateExercise(difficulty = 'medio') {
    const ranges = this.getDifficultyRanges(difficulty);
    
    // Generar valores aleatorios realistas
    const activos = Math.floor(Math.random() * (ranges.max - ranges.min) + ranges.min);
    const pasivos = Math.floor(Math.random() * (activos * 0.8)); // Máximo 80% de activos
    const patrimonio = activos - pasivos;
    
    // Decidir qué valor ocultar aleatoriamente
    const hiddenValue = Math.floor(Math.random() * 3);
    
    return new Exercise(activos, pasivos, patrimonio, hiddenValue);
  }

  /**
   * Obtiene los rangos de valores según la dificultad
   * @private
   */
  static getDifficultyRanges(difficulty) {
    const ranges = {
      'facil': { min: 1000, max: 10000 },
      'medio': { min: 10000, max: 100000 },
      'dificil': { min: 100000, max: 1000000 }
    };
    
    return ranges[difficulty] || ranges['medio'];
  }
}

// ============================================================================
// APPLICATION SERVICES - Servicios de aplicación
// ============================================================================

/**
 * Servicio para gestionar temas visuales
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'gradient';
    this.storageKey = 'accounting-app-theme';
  }

  /**
   * Inicializa el sistema de temas
   */
  initialize() {
    this.loadSavedTheme();
    this.setupThemeButtons();
  }

  /**
   * Carga el tema guardado del localStorage
   * @private
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.storageKey) || 'gradient';
    this.applyTheme(savedTheme);
  }

  /**
   * Configura los event listeners para los botones de tema
   * @private
   */
  setupThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        this.changeTheme(theme);
      });
    });
  }

  /**
   * Cambia el tema actual
   */
  changeTheme(newTheme) {
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    this.updateActiveButton(newTheme);
    this.createThemeChangeEffect();
  }

  /**
   * Aplica un tema al documento
   * @private
   */
  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }

  /**
   * Guarda el tema en localStorage
   * @private
   */
  saveTheme(theme) {
    localStorage.setItem(this.storageKey, theme);
  }

  /**
   * Actualiza el botón activo en la interfaz
   * @private
   */
  updateActiveButton(activeTheme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-theme') === activeTheme) {
        btn.classList.add('active');
      }
    });
  }

  /**
   * Crea un efecto visual al cambiar tema
   * @private
   */
  createThemeChangeEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      pointer-events: none; z-index: 9999;
      animation: themeRipple 0.8s ease-out;
    `;
    
    document.body.appendChild(effect);
    setTimeout(() => document.body.removeChild(effect), 800);
  }
}

/**
 * Servicio para gestionar la navegación por pestañas
 */
class TabManager {
  
  /**
   * Inicializa el sistema de pestañas
   */
  initialize() {
    this.setupTabButtons();
  }

  /**
   * Configura los event listeners para las pestañas
   * @private
   */
  setupTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        this.switchToTab(targetTab, tabButtons, tabContents);
      });
    });
  }

  /**
   * Cambia a una pestaña específica
   * @private
   */
  switchToTab(targetTab, tabButtons, tabContents) {
    // Desactivar todas las pestañas
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Activar la pestaña seleccionada
    const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const activeContent = document.getElementById(targetTab);
    
    if (activeButton && activeContent) {
      activeButton.classList.add('active');
      activeContent.classList.add('active');
    }
  }
}

/**
 * Servicio principal para la calculadora contable
 */
class AccountingCalculatorService {
  constructor() {
    this.balanceRenderer = new BalanceTableRenderer();
  }

  /**
   * Inicializa la calculadora
   */
  initialize() {
    this.setupEventListeners();
  }

  /**
   * Configura los event listeners de la calculadora
   * @private
   */
  setupEventListeners() {
    const elements = this.getCalculatorElements();
    
    elements.calculateBtn.addEventListener('click', () => this.handleCalculate());
    elements.verifyBtn.addEventListener('click', () => this.handleVerify());
    elements.clearBtn.addEventListener('click', () => this.handleClear());
  }

  /**
   * Obtiene los elementos DOM de la calculadora
   * @private
   */
  getCalculatorElements() {
    return {
      activosInput: document.getElementById('activos'),
      pasivosInput: document.getElementById('pasivos'),
      patrimonioInput: document.getElementById('patrimonio'),
      calculateBtn: document.getElementById('calcular'),
      verifyBtn: document.getElementById('verificar'),
      clearBtn: document.getElementById('limpiar'),
      resultDisplay: document.getElementById('resultado')
    };
  }

  /**
   * Maneja el cálculo del valor faltante
   * @private
   */
  handleCalculate() {
    try {
      const equation = this.createEquationFromInputs();
      const result = equation.calculateMissingValue();
      
      this.updateInputWithResult(result);
      this.displayCalculationResult(result);
      this.balanceRenderer.showCalculatorTable();
      
    } catch (error) {
      this.displayError(error.message);
    }
  }

  /**
   * Maneja la verificación del balance
   * @private
   */
  handleVerify() {
    const equation = this.createEquationFromInputs();
    
    if (!this.hasAllValues(equation)) {
      this.displayError('⚠️ Debes ingresar los 3 valores para verificar el balance');
      return;
    }

    const isBalanced = equation.isBalanced();
    this.displayVerificationResult(equation, isBalanced);
    this.balanceRenderer.showCalculatorTable();
  }

  /**
   * Maneja la limpieza de la calculadora
   * @private
   */
  handleClear() {
    const elements = this.getCalculatorElements();
    
    elements.activosInput.value = '';
    elements.pasivosInput.value = '';
    elements.patrimonioInput.value = '';
    elements.resultDisplay.innerHTML = '';
    elements.resultDisplay.className = 'result-display';
    
    this.balanceRenderer.hideCalculatorTable();
  }

  /**
   * Crea una ecuación contable desde los inputs
   * @private
   */
  createEquationFromInputs() {
    const elements = this.getCalculatorElements();
    
    return new AccountingEquation(
      parseFloat(elements.activosInput.value) || 0,
      parseFloat(elements.pasivosInput.value) || 0,
      parseFloat(elements.patrimonioInput.value) || 0
    );
  }

  /**
   * Verifica si todos los valores están presentes
   * @private
   */
  hasAllValues(equation) {
    return equation.activos > 0 && equation.pasivos > 0 && equation.patrimonio > 0;
  }

  /**
   * Actualiza el input correspondiente con el resultado
   * @private
   */
  updateInputWithResult(result) {
    const elements = this.getCalculatorElements();
    const inputMap = {
      'activos': elements.activosInput,
      'pasivos': elements.pasivosInput,
      'patrimonio': elements.patrimonioInput
    };
    
    if (inputMap[result.type]) {
      inputMap[result.type].value = result.value;
    }
  }

  /**
   * Muestra el resultado del cálculo
   * @private
   */
  displayCalculationResult(result) {
    const icons = {
      'activos': '💰',
      'pasivos': '📋',
      'patrimonio': '👥'
    };
    
    const labels = {
      'activos': 'Activos',
      'pasivos': 'Pasivos',
      'patrimonio': 'Patrimonio'
    };
    
    const message = `
      ${icons[result.type]} ${labels[result.type]} calculados: S/ ${result.value.toLocaleString()}<br>
      Fórmula: ${result.formula}
    `;
    
    this.displayResult(message, 'success');
  }

  /**
   * Muestra el resultado de la verificación
   * @private
   */
  displayVerificationResult(equation, isBalanced) {
    const sumaDerechos = equation.pasivos + equation.patrimonio;
    
    if (isBalanced) {
      const message = `
        ✅ <strong>¡Balance correcto!</strong><br>
        S/ ${equation.activos.toLocaleString()} = S/ ${equation.pasivos.toLocaleString()} + S/ ${equation.patrimonio.toLocaleString()}<br>
        ${equation.activos.toLocaleString()} = ${sumaDerechos.toLocaleString()}
      `;
      this.displayResult(message, 'success');
    } else {
      const diferencia = Math.abs(equation.activos - sumaDerechos);
      const message = `
        ❌ <strong>Balance incorrecto</strong><br>
        S/ ${equation.activos.toLocaleString()} ≠ S/ ${equation.pasivos.toLocaleString()} + S/ ${equation.patrimonio.toLocaleString()}<br>
        ${equation.activos.toLocaleString()} ≠ ${sumaDerechos.toLocaleString()}<br>
        Diferencia: S/ ${diferencia.toLocaleString()}
      `;
      this.displayResult(message, 'error');
    }
  }

  /**
   * Muestra un mensaje de error
   * @private
   */
  displayError(message) {
    this.displayResult(`⚠️ ${message}`, 'warning');
  }

  /**
   * Muestra un resultado en la interfaz con animación
   * @private
   */
  displayResult(message, type) {
    const resultDisplay = document.getElementById('resultado');
    
    resultDisplay.innerHTML = message;
    resultDisplay.className = `result-display ${type}`;
    
    // Animación de aparición suave
    resultDisplay.style.opacity = '0';
    resultDisplay.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      resultDisplay.style.transition = 'all 0.5s ease';
      resultDisplay.style.opacity = '1';
      resultDisplay.style.transform = 'translateY(0)';
    }, 100);
  }
}

// ============================================================================
// PRESENTATION LAYER - Capa de presentación
// ============================================================================

/**
 * Renderizador de tablas de balance en formato T
 */
class BalanceTableRenderer {
  
  /**
   * Muestra la tabla de balance para la calculadora
   */
  showCalculatorTable() {
    const equation = this.getEquationFromCalculatorInputs();
    
    if (this.shouldHideTable(equation)) {
      this.hideCalculatorTable();
      return;
    }

    this.renderTable('tabla-balance', equation, 'calculator');
  }

  /**
   * Muestra la tabla de balance para ejercicios
   */
  showExerciseTable(exercise) {
    this.renderTable('tabla-balance-ejercicio', exercise.equation, 'exercise');
  }

  /**
   * Oculta la tabla de balance de la calculadora
   */
  hideCalculatorTable() {
    const table = document.getElementById('tabla-balance');
    if (table) table.style.display = 'none';
  }

  /**
   * Oculta la tabla de balance de ejercicios
   */
  hideExerciseTable() {
    const table = document.getElementById('tabla-balance-ejercicio');
    if (table) table.style.display = 'none';
  }

  /**
   * Renderiza una tabla de balance
   * @private
   */
  renderTable(tableId, equation, context) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Mostrar tabla
    table.style.display = 'block';
    
    // Generar datos de subcuentas
    const breakdowns = this.generateAccountBreakdowns(equation);
    
    // Llenar datos
    this.populateTableData(tableId, equation, breakdowns);
    
    // Aplicar animación
    this.animateTableAppearance(table, context === 'exercise' ? 500 : 200);
  }

  /**
   * Obtiene la ecuación desde los inputs de la calculadora
   * @private
   */
  getEquationFromCalculatorInputs() {
    return new AccountingEquation(
      parseFloat(document.getElementById('activos')?.value) || 0,
      parseFloat(document.getElementById('pasivos')?.value) || 0,
      parseFloat(document.getElementById('patrimonio')?.value) || 0
    );
  }

  /**
   * Determina si la tabla debe ocultarse
   * @private
   */
  shouldHideTable(equation) {
    return equation.activos === 0 && equation.pasivos === 0 && equation.patrimonio === 0;
  }

  /**
   * Genera los desgloses de cuentas
   * @private
   */
  generateAccountBreakdowns(equation) {
    return {
      activos: BalanceDataGenerator.generateActivosBreakdown(equation.activos),
      pasivos: BalanceDataGenerator.generatePasivosBreakdown(equation.pasivos),
      patrimonio: BalanceDataGenerator.generatePatrimonioBreakdown(equation.patrimonio)
    };
  }

  /**
   * Llena los datos de la tabla
   * @private
   */
  populateTableData(tableId, equation, breakdowns) {
    const suffix = tableId.includes('ejercicio') ? '-ejercicio' : '';
    
    // Llenar subcuentas
    this.populateAccountSection(`activos-items${suffix}`, breakdowns.activos);
    this.populateAccountSection(`pasivos-items${suffix}`, breakdowns.pasivos);
    this.populateAccountSection(`patrimonio-items${suffix}`, breakdowns.patrimonio);
    
    // Actualizar totales
    this.updateTotals(suffix, equation);
    
    // Actualizar verificación
    this.updateVerification(suffix, equation);
  }

  /**
   * Llena una sección de cuentas
   * @private
   */
  populateAccountSection(containerId, accounts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    
    accounts.forEach((account, index) => {
      if (account.value > 0) {
        const itemElement = this.createAccountItem(account, index);
        container.appendChild(itemElement);
      }
    });
  }

  /**
   * Crea un elemento de cuenta
   * @private
   */
  createAccountItem(account, index) {
    const itemElement = document.createElement('div');
    itemElement.className = 'balance-item';
    itemElement.style.animationDelay = `${index * 0.1}s`;
    itemElement.innerHTML = `
      <span class="item-name">${account.name}</span>
      <span class="item-value">S/ ${account.value.toLocaleString()}</span>
    `;
    return itemElement;
  }

  /**
   * Actualiza los totales de la tabla
   * @private
   */
  updateTotals(suffix, equation) {
    const elements = {
      totalActivos: document.getElementById(`total-activos${suffix}`),
      totalPasivos: document.getElementById(`total-pasivos${suffix}`),
      totalPatrimonio: document.getElementById(`total-patrimonio${suffix}`),
      totalPasivosPatrimonio: document.getElementById(`total-pasivos-patrimonio${suffix}`)
    };

    if (elements.totalActivos) {
      elements.totalActivos.textContent = `S/ ${equation.activos.toLocaleString()}`;
    }
    if (elements.totalPasivos) {
      elements.totalPasivos.textContent = `S/ ${equation.pasivos.toLocaleString()}`;
    }
    if (elements.totalPatrimonio) {
      elements.totalPatrimonio.textContent = `S/ ${equation.patrimonio.toLocaleString()}`;
    }
    if (elements.totalPasivosPatrimonio) {
      elements.totalPasivosPatrimonio.textContent = `S/ ${(equation.pasivos + equation.patrimonio).toLocaleString()}`;
    }
  }

  /**
   * Actualiza la sección de verificación
   * @private
   */
  updateVerification(suffix, equation) {
    const verifyActivos = document.getElementById(`verify-activos${suffix}`);
    const verifyPasivosPatrimonio = document.getElementById(`verify-pasivos-patrimonio${suffix}`);
    const verificationStatus = document.getElementById(`verification-status${suffix}`);

    if (verifyActivos) {
      verifyActivos.textContent = `S/ ${equation.activos.toLocaleString()}`;
    }
    
    if (verifyPasivosPatrimonio) {
      verifyPasivosPatrimonio.textContent = `S/ ${(equation.pasivos + equation.patrimonio).toLocaleString()}`;
    }

    if (verificationStatus) {
      const isBalanced = equation.isBalanced();
      
      if (isBalanced) {
        verificationStatus.innerHTML = "✅ <strong>¡Balance Equilibrado!</strong><br>La ecuación contable está balanceada correctamente.";
        verificationStatus.className = "verification-status balanced";
      } else {
        const diferencia = Math.abs(equation.activos - (equation.pasivos + equation.patrimonio));
        verificationStatus.innerHTML = `❌ <strong>Balance Desequilibrado</strong><br>Diferencia: S/ ${diferencia.toLocaleString()}`;
        verificationStatus.className = "verification-status unbalanced";
      }
    }
  }

  /**
   * Aplica animación de aparición a la tabla
   * @private
   */
  animateTableAppearance(table, delay = 200) {
    setTimeout(() => {
      table.style.opacity = '0';
      table.style.transform = 'translateY(20px)';
      table.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        table.style.opacity = '1';
        table.style.transform = 'translateY(0)';
      }, 100);
    }, delay);
  }
}

/**
 * Servicio para gestionar ejercicios educativos
 */
class ExerciseService {
  constructor() {
    this.currentExercise = null;
    this.statistics = { correct: 0, incorrect: 0 };
    this.balanceRenderer = new BalanceTableRenderer();
  }

  /**
   * Inicializa el sistema de ejercicios
   */
  initialize() {
    this.setupEventListeners();
  }

  /**
   * Configura los event listeners
   * @private
   */
  setupEventListeners() {
    const elements = this.getExerciseElements();
    
    elements.newExerciseBtn.addEventListener('click', () => this.generateNewExercise());
    elements.verifyBtn.addEventListener('click', () => this.verifyAnswer());
    
    // Permitir verificar con Enter
    elements.answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.verifyAnswer();
    });
  }

  /**
   * Obtiene los elementos DOM de ejercicios
   * @private
   */
  getExerciseElements() {
    return {
      newExerciseBtn: document.getElementById('nuevo-ejercicio'),
      verifyBtn: document.getElementById('verificar-respuesta'),
      answerInput: document.getElementById('respuesta-usuario'),
      difficultySelect: document.getElementById('dificultad'),
      exerciseDisplay: document.getElementById('ejercicio-actual'),
      resultDisplay: document.getElementById('resultado-ejercicio')
    };
  }

  /**
   * Genera un nuevo ejercicio
   */
  generateNewExercise() {
    const difficulty = document.getElementById('dificultad').value;
    this.currentExercise = ExerciseGenerator.generateExercise(difficulty);
    
    this.renderExercise();
    this.clearPreviousResults();
    this.balanceRenderer.hideExerciseTable();
  }

  /**
   * Renderiza el ejercicio en la interfaz
   * @private
   */
  renderExercise() {
    const exerciseHTML = this.buildExerciseHTML();
    const exerciseElement = document.getElementById('ejercicio-actual');
    
    // Animación de transición
    exerciseElement.style.opacity = '0';
    exerciseElement.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      exerciseElement.innerHTML = exerciseHTML;
      exerciseElement.style.transition = 'all 0.5s ease';
      exerciseElement.style.opacity = '1';
      exerciseElement.style.transform = 'scale(1)';
    }, 200);
  }

  /**
   * Construye el HTML del ejercicio
   * @private
   */
  buildExerciseHTML() {
    const equation = this.currentExercise.equation;
    const hiddenValue = this.currentExercise.hiddenValue;
    
    let equationHTML = '';
    
    switch (hiddenValue) {
      case 0: // Ocultar activos
        equationHTML = `<span class="valor-oculto">? </span> = S/ ${equation.pasivos.toLocaleString()} + S/ ${equation.patrimonio.toLocaleString()}`;
        break;
      case 1: // Ocultar pasivos
        equationHTML = `S/ ${equation.activos.toLocaleString()} = <span class="valor-oculto">? </span> + S/ ${equation.patrimonio.toLocaleString()}`;
        break;
      case 2: // Ocultar patrimonio
        equationHTML = `S/ ${equation.activos.toLocaleString()} = S/ ${equation.pasivos.toLocaleString()} + <span class="valor-oculto">?</span>`;
        break;
    }

    return `
      <div class="ejercicio-problema">
        <h3>🎯 Resuelve la ecuación contable:</h3>
        <div class="ecuacion-ejercicio">${equationHTML}</div>
        <p><strong>Pregunta:</strong> ${this.currentExercise.getQuestion()}</p>
      </div>
    `;
  }

  /**
   * Verifica la respuesta del usuario
   */
  verifyAnswer() {
    if (!this.currentExercise) {
      alert('Primero genera un nuevo ejercicio');
      return;
    }

    const userAnswer = this.getUserAnswer();
    if (isNaN(userAnswer)) {
      this.displayExerciseResult('⚠️ Por favor ingresa un número válido', 'warning');
      return;
    }

    const isCorrect = this.currentExercise.checkAnswer(userAnswer);
    this.processAnswerResult(isCorrect, userAnswer);
    this.updateStatistics();
  }

  /**
   * Obtiene la respuesta del usuario
   * @private
   */
  getUserAnswer() {
    const answerInput = document.getElementById('respuesta-usuario');
    return parseFloat(answerInput.value);
  }

  /**
   * Procesa el resultado de la respuesta
   * @private
   */
  processAnswerResult(isCorrect, userAnswer) {
    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer(userAnswer);
    }
  }

  /**
   * Maneja una respuesta correcta
   * @private
   */
  handleCorrectAnswer() {
    const correctAnswer = this.currentExercise.getCorrectAnswer();
    const equation = this.currentExercise.equation;
    
    const message = `
      ✅ <strong>¡Correcto!</strong><br>
      Respuesta: S/ ${correctAnswer.toLocaleString()}<br>
      Ecuación completa: S/ ${equation.activos.toLocaleString()} = S/ ${equation.pasivos.toLocaleString()} + S/ ${equation.patrimonio.toLocaleString()}
    `;
    
    this.statistics.correct++;
    this.displayExerciseResult(message, 'success');
    this.balanceRenderer.showExerciseTable(this.currentExercise);
  }

  /**
   * Maneja una respuesta incorrecta
   * @private
   */
  handleIncorrectAnswer(userAnswer) {
    const correctAnswer = this.currentExercise.getCorrectAnswer();
    const equation = this.currentExercise.equation;
    
    const message = `
      ❌ <strong>Incorrecto</strong><br>
      Tu respuesta: S/ ${userAnswer.toLocaleString()}<br>
      Respuesta correcta: S/ ${correctAnswer.toLocaleString()}<br>
      Ecuación completa: S/ ${equation.activos.toLocaleString()} = S/ ${equation.pasivos.toLocaleString()} + S/ ${equation.patrimonio.toLocaleString()}
    `;
    
    this.statistics.incorrect++;
    this.displayExerciseResult(message, 'error');
  }

  /**
   * Muestra el resultado del ejercicio
   * @private
   */
  displayExerciseResult(message, type) {
    const resultDisplay = document.getElementById('resultado-ejercicio');
    resultDisplay.innerHTML = message;
    resultDisplay.className = `exercise-result ${type}`;
  }

  /**
   * Limpia los resultados anteriores
   * @private
   */
  clearPreviousResults() {
    document.getElementById('respuesta-usuario').value = '';
    document.getElementById('resultado-ejercicio').innerHTML = '';
  }

  /**
   * Actualiza las estadísticas
   * @private
   */
  updateStatistics() {
    const total = this.statistics.correct + this.statistics.incorrect;
    const accuracy = total > 0 ? Math.round((this.statistics.correct / total) * 100) : 0;

    document.getElementById('correctas').textContent = this.statistics.correct;
    document.getElementById('incorrectas').textContent = this.statistics.incorrect;
    document.getElementById('precision').textContent = accuracy + '%';
  }
}

/**
 * Servicio para efectos visuales y animaciones
 */
class AnimationService {
  
  /**
   * Inicializa las animaciones
   */
  initialize() {
    this.setupIntersectionObserver();
    this.createParticleEffect();
    this.addCustomStyles();
  }

  /**
   * Configura el observer para animaciones de entrada
   * @private
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        }
      });
    });

    document.querySelectorAll('.concept-card, .calc-input, .stat-item').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Crea el efecto de partículas de fondo
   * @private
   */
  createParticleEffect() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: -1; overflow: hidden;
    `;
    
    for (let i = 0; i < 20; i++) {
      const particle = this.createParticle();
      particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
  }

  /**
   * Crea una partícula individual
   * @private
   */
  createParticle() {
    const particle = document.createElement('div');
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
    return particle;
  }

  /**
   * Agrega estilos CSS personalizados
   * @private
   */
  addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = this.getCustomCSS();
    document.head.appendChild(style);
  }

  /**
   * Obtiene los estilos CSS personalizados
   * @private
   */
  getCustomCSS() {
    return `
      /* Estilos para resultados */
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

      /* Animaciones */
      @keyframes themeRipple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
      
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(120deg); }
        66% { transform: translateY(5px) rotate(240deg); }
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
      
      /* Responsive */
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
      
      /* Efectos hover */
      .concept-card:hover .concept-symbol {
        animation-duration: 2s;
        background: rgba(255,255,255,0.4);
      }
      
      .tab-btn:hover {
        letter-spacing: 1px;
      }
      
      /* Transiciones suaves */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      
      .tab-content, .concept-card, .calc-input, .result-display, .exercise-display {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
  }
}

// ============================================================================
// APPLICATION BOOTSTRAP - Inicialización de la aplicación
// ============================================================================

/**
 * Controlador principal de la aplicación
 * Coordina todos los servicios y componentes
 */
class AccountingApp {
  constructor() {
    // Inicializar servicios
    this.themeManager = new ThemeManager();
    this.tabManager = new TabManager();
    this.calculatorService = new AccountingCalculatorService();
    this.exerciseService = new ExerciseService();
    this.animationService = new AnimationService();
  }

  /**
   * Inicializa toda la aplicación
   */
  initialize() {
    // Inicializar todos los servicios en orden
    this.themeManager.initialize();
    this.tabManager.initialize();
    this.calculatorService.initialize();
    this.exerciseService.initialize();
    this.animationService.initialize();
    
    console.log('🎓 Aplicación de Contabilidad Educativa inicializada correctamente');
  }
}

// ============================================================================
// ENTRY POINT - Punto de entrada de la aplicación
// ============================================================================

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
  const app = new AccountingApp();
  app.initialize();
});

/**
 * Exportar para testing (si es necesario)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccountingEquation,
    Exercise,
    BalanceDataGenerator,
    ExerciseGenerator,
    ThemeManager,
    AccountingCalculatorService,
    ExerciseService,
    BalanceTableRenderer
  };
}