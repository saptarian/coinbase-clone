import Spinner from './Spinner'


function Loader() {
  return (
    <div className="m-auto w-full h-screen text-center 
      p-12 bg-white flex items-center justify-center">
      <Spinner style={
        {
          borderTopColor: 'blue',
          borderRightColor: 'blue',
          borderBottomColor: 'blue',
          width: '40px',
          height: '40px',
        }
      } />
    </div>
  )
}


export default Loader