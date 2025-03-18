import React from 'react'

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg  bg-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="#">Navbar</a>
                    <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link text-white active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar;