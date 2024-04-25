import React from 'react'
import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Ups!</h1>
            <p>Stranica nije pronađena</p>
            <div className="flexGrow">
                <Link to="/">Poseti glavnu stranicu</Link>
            </div>
        </article>
    )
}

export default Missing