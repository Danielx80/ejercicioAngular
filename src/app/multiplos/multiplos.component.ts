import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-multiplos',
  templateUrl: './multiplos.component.html',
  styleUrls: ['./multiplos.component.scss'],
})
export class MultiplosComponent implements OnInit {
  // constructor para recibir un objeto de el tipo AngularFireStore
  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {}

  // Definir el tipo de cada propiedad
  number: number | undefined;
  numbers: number[] = [];
  multiplate3: number[] = [];
  multiplate5: number[] = [];
  multiplate7: number[] = [];

  calculateMultiples() {
    // Esto inicializa cada propiedad con un arreglo vacío
    this.numbers = [];
    this.multiplate3 = [];
    this.multiplate5 = [];
    this.multiplate7 = [];

    // Iterar desde el valor de 1 hasta el valor de la propiedad number
    // en este caso, el this.number! tiene el "!" para decir que number no sea indefinido
    for (let i = 1; i <= this.number!; i++) {
      // aquí se comprueba que el número actual "i" tenga el resto (o sea divisible entre 3, 5 o 7)
      // y usamos el método push para almacenar todos los múltiplos de esa cantidad
      if (i % 3 === 0) {
        this.multiplate3.push(i);
      }
      if (i % 5 === 0) {
        this.multiplate5.push(i);
      }
      if (i % 7 === 0) {
        this.multiplate7.push(i);
      }
      this.numbers.push(i);
    }
    // después pasamos el resultado a un método llamado saveToDatabase con el valor dentro de this.number!
    const resultado = this.generateResult();
    this.saveToDatabase(this.number!, resultado);
    // después se guarda en la base de datos
  }

  generateResult(): string {
    // Inicializamos una variable con un arreglo vacío
    const resultado: string[] = [];

    // se crea un bucle que inicia en 0 para iterar sobre el arreglo numbers
    for (let i = 0; i < this.numbers.length; i++) {
      // obtenemos el número actual en numbers con el índice [i] y lo almacenamos en number
      const number = this.numbers[i];
      // aquí llamamos al método getColor para seleccionarle el color correspondiente
      const color = this.getColor(number);
      // y aquí llamamos al método para obtener los múltiplos del número actual
      const multiples = this.getMultiples(number).join(' y ');

      // aquí declaramos la variable itemResultado y la inicializamos con el número actual
      let itemResultado = `${number}`;

      // si existe algún múltiplo para el número actual se agrega una parte adicional a itemResultado en un formato de múltiplos
      if (multiples) {
        itemResultado += ` [${multiples}]`;
      }
      // se agrega la cadena al arreglo resutado y se incluye el color
      resultado.push(`(${color}) ${itemResultado}`);
    }
    // se returna el arreglo con el resultado unid oa la cadena y es separada con una coma
    return resultado.join(', ');
  }

  // se crea un método que toma un parametro de tipo number, esto representa  en número para el color que se debe obtener
  getColor(number: number): string {
    // se realizan varias comparaciones y se agrega el método includes() para checar si el número se encuentra en cada uno
    if (this.multiplate3.includes(number) && this.multiplate5.includes(number) && this.multiplate7.includes(number)) {
      return 'verde';
    } else if (this.multiplate3.includes(number)) {
      // aqui hacemos que si es múltiplo solamente de el número 3 muestre el verde y asi hacemos con los demas
      return 'verde';
    } else if (this.multiplate5.includes(number)) {
      return 'rojo';
    } else if (this.multiplate7.includes(number)) {
      return 'azul';
    }
    //si el número no tiene múltiplo de ninguno de los 3 casos, regresa una cadena vacia
    return '';
  }

  getMultiples(number: number): number[] {
    // se inicializa una variable de tipo number en arreglo
    const multiples: number[] = [];
    // se realizan comprobaciones utilizando el includes para verificar si el número se encuentra en cada uno
    // si el número se encuentra en el arreglo de un múltiplo se agrega al tal múltiplo ya sea 3, 5 o 7 utilizando el push
    if (this.multiplate3.includes(number)) {
      multiples.push(3);
    }
    if (this.multiplate5.includes(number)) {
      multiples.push(5);
    }
    if (this.multiplate7.includes(number)) {
      multiples.push(7);
    }
    // se devuelve un arreglo con todos los números y múltiplos encontrados
    return multiples;
  }

  // Aqui se determina si un número tiene un múltiplo o no

  onMultiples(number: number): boolean {
    // llamamos a getMultiples con los múltiplos del número seleccionado y luego verificamos la longitud del arreglo con .lenght
    // si la longitud es mayor a cero, esto significara que si hay múltiplos y retorna un true
    return this.getMultiples(number).length > 0;
    // se utiliza para determinar si un número tiene múltiplos o no
  }

  // guardamos en la base de datos
  saveToDatabase(number: number, resultado: string) {
    this.firestore
      .collection('resultados')
      .add({
        numberIngresado: number,
        resultado: resultado,
      })
      .then(() => {
        console.log('Resultado guardado en la base de datos.');
      })
      .catch((error: any) => {
        console.error('Error al guardar el resultado:', error);
      });
  }
}
