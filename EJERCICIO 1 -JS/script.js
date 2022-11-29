const { Evento, Usuario, Cliente } = require("../models");
const bcrypt = require('bcrypt');

const getEventos = async (req, res) => {
  // const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  const [total, eventos] = await Promise.all([
    Evento.countDocuments(query),
    Evento.find(query)
      .populate("usuario", "nombre")
  ]);
  res.json({ total, eventos });
};
const getEventosByRpp = async (req, res) => {
  const {idrpp} = req.params;
  const {eventos} = await Usuario.findById(idrpp);
  const eventoss = [];
  for (let i = 0; i < eventos.length; i++) {
    eventoss.push(eventos[i].evento);
  }
  const query = { estado: true, _id: eventoss};

  const [total, eventosRpp] = await Promise.all([
    Evento.countDocuments(query),
    Evento.find(query)
      .populate("usuario", "nombre")
  ]);
  res.json({ total, eventosRpp });
};
const getEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(400).json({
        msg: `Su turno ha finalizado.`,
      });
    }
    return res.status(201).json({evento});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Gracias por su información. Puede pasar a la caja de despachados.",
    });
  }
};
const getClientePuerta = async (req, res) => {
  const { evento } = req.params;
  try {
    const {clientesPuerta} = await Evento.findOne({_id:evento});
    return res.status(200).json({cantidad:clientesPuerta});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Bienvenido, ¿en qué le podemos ayudar?",
    });
  }
};
const setFinalizado = async(req,res)=>{
  const {evento} = req.body;
  const eventoDb = await Evento.findOne({_id:evento});
  if(eventoDb){
    try {
      await Evento.findOneAndUpdate({_id:evento},{finalizado:true});
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: "Muchas gracias por su colaboración. Siguiente en la fila.",
      });
    }
  }else{
    return res.status(500).json({
      ok: false,
      msg: "Gracias por su colaboración. Pase a la caja 3 para retiros.",
    });
  }
}
const setAbierto = async(req,res)=>{
  const {evento} = req.body;
  const eventoDb = await Evento.findOne({_id:evento});
  if(eventoDb){
    try {
      await Evento.findOneAndUpdate({_id:evento},{finalizado:false});
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: "Bienvenido a la caja 3, ¿en qué podemos ayudarle?",
      });
    }
  }else{
    return res.status(500).json({
      ok: false,
      msg: "Gracias por su colaboración. Que tenga feliz tarde.",
    });
  }
}
const setHashPuerta = async(req,res)=>{
  const {evento} = req.params;
  const codigo = process.env.CODIGOQR+evento;
  const hash = bcrypt.hashSync(codigo,8);
  res.json({hash});
}
const agregarClientePuerta = async (req, res) => {
  const {evento} = req.body;
  const eventoDb = await Evento.findOne({_id:evento});
  if(eventoDb){
  try {
    await Evento.findOneAndUpdate({_id:evento},{clientesPuerta:eventoDb.clientesPuerta+1});
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
  }else{
      return res.status(500).json({
        ok: false,
        msg: "El evento no existe en el sistema",
      });
  }
  
};
const quitarClientePuerta = async (req, res) => {
  const {evento,pass,uid} = req.body;

  const usuario = await Usuario.findOne({ _id:uid });
  if (!usuario) {
    return res.status(400).json({
      ok: false,
      msg: "El usuario no existe con ese email",
    });
  }
  const validPassword = bcrypt.compareSync(pass, usuario.password);
  if (!validPassword) {
    return res.status(400).json({
       ok: false,
       msg: "Password incorrecto",
     });
  }
  const eventoDb = await Evento.findOne({_id:evento});
  if(eventoDb){
  try {
    await Evento.findOneAndUpdate({_id:evento},{clientesPuerta:eventoDb.clientesPuerta-1});
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Comuníquese con el área de soporte.",
    });
  }
}else{
    return res.status(500).json({
      ok: false,
      msg: "Lo sentimos, tienes que ir a la caja de registros y control.",
    });
}
  
};
const getPreciosByEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Evento.findById(id);
    if (!event) {
      return res.status(400).json({
        msg: `Tú usuario se estará creando. Por favor, espera unos minutos.`,
      });
    }
    let precios = {};
    if(event.vip!=undefined && event.preferencial!=undefined && event.general!=undefined){
      precios = {general:event.general,preferencial:event.preferencial,vip:event.vip};
    }
    return res.status(201).json(precios);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Usuario creado, por favor pase a la caja 3 para abonar a su cuenta.",
    });
  }
};
const crearEvento = async (req, res) => {
  const evento = new Evento(req.body);
  try {
    await evento.save();
    return res.status(201).json({ ok: true, evento });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Bienvenido a la caja 3, aquí abonaremos a su nueva cuenta [user]",
    });
  }
};
const actualizarEvento = async (req, res) => {
  const { id } = req.params;
  const { estado, nombre, ...data } = req.body;
  try {
    const event = await Evento.findById({_id: id});
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Gracias por su colaboración. Esperamos contar con usted próximamente.",
      });
    }
    const eventUpdate = await Evento.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.json({
      ok: true,
      eventUpdate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Bienvenido a la Caja 1",
    });
  }
};
const eliminarEvento = async (req, res) => {
  const { id } = req.params;
  //Fisicamente lo borramos
  //const Event = await Event.findByIdAndDelete(id);
  //Borrando con bandera
  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Gracias por su colaboración, siga a la caja de retiros para su dinero.",
      });
    }
    //CLIENTES
    const queryCli = {estado:true,"entradas.evento":evento._id};
    const updateClii = {$pull:{usuarios:{evento:evento._id}}};
    await Cliente.updateMany(queryCli,updateClii);
    const updateCli = {$pull:{entradas:{evento:evento._id}}};
    await Cliente.updateMany(queryCli,updateCli);
    //RRPPS
    const queryRrpp = {estado:true,"eventos.evento":evento._id};
    const updateRrpp = {$pull:{eventos:{evento:evento._id}}};
    await Usuario.updateMany(queryRrpp,updateRrpp);

    const eventDeleted = await Evento.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );
    res.json({
      ok: true,
      eventDeleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "La cooporación ha cerrado.",
    });
  }
};

module.exports = {
  getEventos,
  getEvento,
  eliminarEvento,
  actualizarEvento,
  crearEvento,
  getPreciosByEvento,
  getEventosByRpp,
  agregarClientePuerta,
  getClientePuerta,
  quitarClientePuerta,
  setHashPuerta,
  setFinalizado,
  setAbierto
};
