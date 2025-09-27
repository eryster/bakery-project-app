export class Formatter {
  static currency(value: number): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatador.format(value);
  }

  static formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  static normalizeText(str: string) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .toLowerCase()
        .trim();
  };

  static getMonthName(monthNumber: number): string {
    const monthNames = [
      '',
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber];
    } else {
      return 'Invalid month';
    }
}
}