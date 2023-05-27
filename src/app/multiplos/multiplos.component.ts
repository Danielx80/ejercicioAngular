import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-multiplos',
  templateUrl: './multiplos.component.html',
  styleUrls: ['./multiplos.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class MultiplosComponent implements OnInit {
  // constructor para recibir un objeto de el tipo AngularFireStore
  constructor(private firestore: AngularFirestore) {}

  // Definir el tipo de cada propiedad
  number: number | undefined;
  numbers: number[] = [];
  multiplate3: number[] = [];
  multiplate5: number[] = [];
  multiplate7: number[] = [];

  ngOnInit(): void {}

  calculateMultiples() {
    // Esto inicializa cada propiedad con un arreglo vacio
    this.numbers = [];
    this.multiplate3 = [];
    this.multiplate5 = [];
    this.multiplate7 = [];

    // Iterar desde valor de 1 hasta el valor de la propiedad number
    // en este caso el this.number! tiene el " ! " para decir que number no sea indefinido
    for (let i = 1; i <= this.number!; i++) {
      // aqui se comprueba que el numero actual " i " tenga el resto(o divisible entre 3, 5 o 7)
      // y usamos el metodo push para almacenar todo los multiplos de tal cantidad
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
    // despues paramos el resultado a un metodo llamada saveToDatabase con el valor dentro de this.number!
    const resultado = this.generateResult();
    this.saveToDatabase(this.number!, resultado);
    // despues se guarda en la base de datos
  }

  generateResult(): string {
    // Inicializamos una variable con un arreglo vacio
    const resultado: string[] = [];

    // se crea un bucle que inicia de 0 para iterar sobre el arreglo numbers
    for (let i = 0; i < this.numbers.length; i++) {
      // obtenemos el numero actual en numbers con el indice [ i ] y lo almacenamos en number
      const number = this.numbers[i];
      // aqui llamamos el getColor para seleccionerle el color correspondiente
      const color = this.getColor(number);
      // y aqui llamamos al metodo para obtener los multiplos del numero actual
      const multiples = this.getMultiples(number).join(' y ');

      // aqui declaramos la variable itemResult y la inicializamos con el numer oactual
      let itemResultado = `${number}`;

      // si existe algun multiplo para el numero actual se agrega una parte adicional al itemResult en un formato de multiples
      if (multiples) {
        itemResultado += ` [${multiples}]`;
      }

      resultado.push(`(${color}) ${itemResultado}`);
    }

    return resultado.join(', ');
  }

  // se crea un metodo que toma un parametro de tipo number, esto representa  en numero para el color que se debe obtener
  getColor(number: number): string {
    // se realizan varias comparaciones y se agrega el metodo includes() para checar si el numero se encuentra en cada uno
    if (this.multiplate3.includes(number) && this.multiplate5.includes(number) && this.multiplate7.includes(number)) {
      return 'verde';
    } else if (this.multiplate3.includes(number)) {
      // aqui hacemos que si es multiplo solamente de el numero 3 muestre el verde y asi hacemos con los demas
      return 'verde';
    } else if (this.multiplate5.includes(number)) {
      return 'rojo';
    } else if (this.multiplate7.includes(number)) {
      return 'azul';
    }
    // y si no es multiplo de 3, 5 y 7 no muestra un color
    return '';
  }

  getMultiples(number: number): number[] {
    // se inicializa una variable de tipo number en arreglo
    const multiples: number[] = [];
    // se realizan comprobaciones utilizando el includes para verificar si el numero se encuentra en cada uno
    // si el numero se encuentra en el arreglo de un multiplo se agrega al tal multiplo ya sea 3, 5 o 7 utilizando el push
    if (this.multiplate3.includes(number)) {
      multiples.push(3);
    }
    if (this.multiplate5.includes(number)) {
      multiples.push(5);
    }
    if (this.multiplate7.includes(number)) {
      multiples.push(7);
    }
    // se devuelve un arreglo con todos los numeros y multiplos encontrados
    return multiples;
  }

  onMultiples(number: number): boolean {
    // se usa length para obtener la cantidad de multiplos encontrados
    return this.getMultiples(number).length > 0;
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
