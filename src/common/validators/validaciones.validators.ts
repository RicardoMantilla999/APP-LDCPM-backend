export function validarCedulaEcuatoriana(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) {
      return false; // La cédula no tiene 10 dígitos
    }
  
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
      return false; // Código de provincia inválido
    }
  
    const tercerDigito = parseInt(cedula.charAt(2), 10);
    if (tercerDigito < 0 || tercerDigito > 6) {
      return false; // Tercer dígito inválido
    }
  
    const digitos = cedula.split('').map(Number);
    const digitoVerificador = digitos[9];
  
    let suma = 0;
  
    for (let i = 0; i < 9; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2; // Posiciones impares
        if (valor > 9) {
          valor -= 9;
        }
      }
      suma += valor;
    }
  
    const residuo = suma % 10;
    const verificadorCalculado = residuo === 0 ? 0 : 10 - residuo;
  
    return digitoVerificador === verificadorCalculado;
  }
  