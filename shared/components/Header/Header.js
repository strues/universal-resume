import React, { PureComponent } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
    <div>
      <Navbar light>
           <NavbarToggler onClick={ this.toggleNavbar } />
           <NavbarBrand href="/">Steven Truesdell</NavbarBrand>
           <Collapse className="navbar-toggleable-md" isOpen={ !this.state.collapsed }>

             <Nav navbar>
               <NavItem>
                 <NavLink href="https://github.com/strues">GitHub</NavLink>
               </NavItem>
               <NavItem>
                 <NavLink href="https://strues.io">Blog</NavLink>
               </NavItem>
             </Nav>
           </Collapse>
         </Navbar>
    </div>
    );
  }
}
export default Header;
