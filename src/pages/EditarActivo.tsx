import { useLocation } from 'react-router-dom'

const EditarActivo = () => {

    const location = useLocation()
    const { id } = location.state

  return (
    <div>
      El id es {id}
    </div>
  )
}

export default EditarActivo
