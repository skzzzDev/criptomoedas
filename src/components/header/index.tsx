import styles from './header.module.css'
import logo from '../../assets/logo-v2.png'
import { Link } from 'react-router-dom'

export function Header() {
    return(
        <header className={styles.container}>
            <Link to='/'>
                <img src={logo} alt="LOGO" />
            </Link>
            
        </header>
    )
}