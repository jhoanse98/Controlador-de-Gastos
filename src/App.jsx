import { useState, useEffect } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import ListadoGastos from './components/ListadoGastos'
import Filtro from './components/Filtro'

import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'


function App() {

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)
  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [gastoEditar, setGastoEditar] = useState({})
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])


  useEffect(()=>{
    if(Object.keys(gastoEditar).length > 0){
      setModal(true)
      setTimeout(() => {
        setAnimarModal(true)
      }, 2000)
    }
  }, [gastoEditar])

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])


  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  }, [])


  useEffect(() => {
    if(filtro){
      //filtrar gastos por categoria
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)
      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro])

  const guardarGasto = gasto => {
    if(gasto.id){
      //ACTUALIZAR
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados)
      setGastoEditar({})
    } else {
      //NUEVO GASTO
      gasto.id=generarId()
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])
    }
    setAnimarModal(false)    
    setTimeout(() => {
        setModal(false)
    }, 1000)

  }
  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})


    setTimeout(() => {
      setAnimarModal(true)
    }, 2000)
  }

  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gastoState => gastoState.id !== id)
    setGastos(gastosActualizados)
  }

  

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        isValidPresupuesto = {isValidPresupuesto}
        setPresupuesto={setPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto &&
        (  
          <>
          <main>
            <Filtro 
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGastos 
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
            <div className='nuevo-gasto'>
              <img 
                src={IconoNuevoGasto}
                alt="Icono de nuevo gasto"
                onClick={handleNuevoGasto}
              />
            </div>
          </>
        )
      }

      {modal && 
      <Modal 
        gastoEditar={gastoEditar}
        setModal={setModal}
        animarModal={animarModal}
        setAnimarModal={setAnimarModal}
        guardarGasto={guardarGasto}
        setGastoEditar={setGastoEditar}
      />}
    </div>
  )
}

export default App
