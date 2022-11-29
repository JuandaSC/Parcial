let personas = [
    {
      id: 1,
      first_name: "Arle",
      last_name: "Morales",
    },
    {
      id: 2,
      first_name: "Juan",
      last_name: "Sánchez",
    },
    {
      id: 3,
      first_name: "Martín",
      last_name: "Bersh",
    },
    {
      id: 4,
      first_name: "Russell",
      last_name: "Westbrook",
    },
    {
      id: 5,
      first_name: "Laura",
      last_name: "Galeano",
    },
    
  ];
  
  class Cola {
    constructor() {
      this.usuarios = [];
      this.atendidos = [];
    }
  
    meter(dato) {
      this.usuarios.push(dato);
    }
  
    atender(dato) {
      this.atendidos.push(dato);
    }
  
    sacar() {
      return this.usuarios.shift();
    }
  
    frente() {
      this.usuarios[0];
    }
  
    getTamano() {
      return this.usuarios.length;
    }
  
    esVacia() {
      return this.getTamano() === 0;
    }
  
    mostrar() {
      this.usuarios.forEach((dato) => {
        console.log(dato);
      });
    }
  
    mostrarAtendidos() {
      this.atendidos.forEach((atendido) => {
        console.log(atendido);
      });
    }
  }
  
  let cola = new Cola();
  let usuariosSinAtender = document.getElementById("sinAtender");
  document.addEventListener("DOMContentLoaded", function (event) {
    usuariosSinAtender.style.display = "none";
  });
  iniciarFila();
  atenderFila();
  
  //genera un numero aleatoriamente y se asigna como indice a un
  //objeto del array
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function asignarUsuario() {
    let usuariosTabla = [];
    let user = getRandomNumber(1, 54);
    let persona = personas[user];
    cola.meter(persona.first_name + " " + persona.last_name);
    usuariosTabla.push(persona.first_name + " " + persona.last_name);
    tablaUsuariosFila(usuariosTabla);
  }
  
  //usuarios que llegaron a la fila
  function tablaUsuariosFila(usuarios) {
    const cuerpoTabla = document.querySelector("#usuariosFila");
    usuarios.forEach((user) => {
      // se crea el tr
      const tr = document.createElement("tr");
  
      // se crea el  <td> del primer campo (nombreUser) y se agrega al tr
      let nombreUser = document.createElement("td");
      nombreUser.innerHTML =
        user + "  " + '<i class="fas fa-money-bill-wave"></i>';
      tr.appendChild(nombreUser);
  
      // se agrega el <tr> al cuerpo de la tabla
      cuerpoTabla.appendChild(tr);
    });
  }
  
  //Funcion que se ejecuta por dos minutos para recibir a los clientes
  // 60 el valor cuando se detiene == 60 * 2000 = 120_000 == 2min
  function iniciarFila() {
    tiempo = 0;
    x = setInterval(function () {
      if (tiempo == 60) {
        clearInterval(x);
        usuariosSinAtender.style.display = "block";
        mostrarUsuariosSinAtender();
      }
      asignarUsuario();
      tiempo++;
    }, 2000);
  }
  
  // los usuarios que llegan son atendidos en 4s
  // y son pasados al array de atendidos
  
  function atenderFila() {
    atendido = 0;
    z = setInterval(function () {
      if (atendido == 30) {
        clearInterval(z);
      } else {
        let userAtendido = cola.sacar();
        let atendidos = [];
        atendidos.push(userAtendido);
        cola.atender(userAtendido);
        tablaUsuariosAtendidos(atendidos);
      }
      atendido++;
    }, 4000);
  }
  
  function mostrarUsuariosSinAtender() {
    let usuariosSinAtender = cola.usuarios;
    tablaUsuariosSinAtender(usuariosSinAtender);
  }
  
  function tablaUsuariosAtendidos(usuarios) {
    const cuerpoTabla = document.querySelector("#usuariosAtendidos");
    usuarios.forEach((user) => {
      // se crea el tr
      const tr = document.createElement("tr");
  
      // se crea el  <td> del primer campo (nombreUser) y se agrega al tr
      let nombreUser = document.createElement("td");
      nombreUser.innerHTML = user + " " + '<i class="fas fa-check"></i>';
      tr.appendChild(nombreUser);
  
      // se agrega el <tr> al cuerpo de la tabla
      cuerpoTabla.appendChild(tr);
    });
  }
  
  function tablaUsuariosSinAtender(usuarios) {
    const cuerpoTabla = document.querySelector("#usuariosSinAtender");
    usuarios.forEach((user) => {
      // se crea el tr
      const tr = document.createElement("tr");
  
      // se crea el  <td> del primer campo (nombreUser) y se agrega al tr
      let nombreUser = document.createElement("td");
      nombreUser.innerHTML = '<i class="far fa-frown"></i>' + "  " + user;
      tr.appendChild(nombreUser);
  
      // se agrega el <tr> al cuerpo de la tabla
      cuerpoTabla.appendChild(tr);
    });
  }