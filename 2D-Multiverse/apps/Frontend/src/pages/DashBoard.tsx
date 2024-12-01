import Navbar from '../components/Navbar'
import UserHeader from './UserHeader'
import AnimatedBackground from '../Animation/Animation'

const DashBoard = () => {
  return (
    <div>
      <AnimatedBackground/>
      <UserHeader/>
      <Navbar/>
    </div>
  )
}

export default DashBoard
