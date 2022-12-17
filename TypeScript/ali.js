import React from 'react'
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
     <div className='site-container'> 
        <NavScreen/>
        <div className='side-bar'>
            
        </div>
    <main>
        <Routes>
            <Route path='/' element={<HomeScreen/>}/>
        </Routes>
    </main>
    <footer>
        <div className='text-center'>
            all right reserve
        </div>
    </footer>


     </div>
    
    
    </BrowserRouter>
  )
}


//navscreen
import React from 'react'

export default function NavScreen() {
    const {state,dispatch:ctxDispatch}=useContext(Store)
    const {cart}=state

  return (

<header>
        <Navbar bg='dark' variant='dark' expand='lg'>
           <LinkContainer to='/'>
             <Navbar.Brand>Alizona</Navbar.Brand>
           </LinkContainer>
           <Navbar.Toggle aria-controls='ali'/>
           <Navbar.Collapse id='ali'>
                <Nav className='ms-auto w-100 justify-content-end align-items-center'>
                    <Nav.Item>
                        <Link to='cart'>Cart
                           <Badg pill bg='danger'>{cart.cartItems.reduce((a,c)=>a+c.quantity,0)}</Badg>
                      </Link>
                    </Nav.Item>
                    {userInfo?
                    <NavDropdown title={userInfo.name}>
                         <NavDropdown.Item><Link to=''></Link></NavDropdown.Item>
                         <Navdropdown.Divider></Navdropdown.Divider>

                    </NavDropdown>:
                    <Nav.Item>Signin</Nav.Item>
                    
                    }
                    
                </Nav>


           </Navbar.Collapsible>
        </Navbar>
    </header>
  )
}
