import React from 'react'
import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Nisi autorizovan</h1>
            <br />
            <p>Nemaš pravo da pristupiš stranici.</p>
            <div className="flexGrow">
                <button onClick={goBack}>Vrati se nazad</button>
            </div>
        </section>
    )
}

export default Unauthorized