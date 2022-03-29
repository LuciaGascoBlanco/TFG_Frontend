import * as React from "react";
import home from '../../public/Home.png';
import './Home.css';

class Home extends React.Component {

    render() {
        return(
            <div>
                <img className="image" src={home} alt="header" width="auto" height="352"/>
                <div className="home-struct">
                    <u className = "intro">Sobre nosotros</u>

                    <p className = "text">
                        En SINGULART estamos convencidos de que el espacio digital es una herramienta inestimable para aportar transparencia y equidad al mercado del arte.
                    </p>
                    <p className = "text">
                        Proporcionamos a los artistas las herramientas que les permitan gestionar de forma independiente la venta de sus obras.
                    </p>
                    <p className = "text">
                        Al exhibir artistas de todo el mundo, también esperamos permitir que los amantes del arte y los coleccionistas exploren nuevos horizontes artísticos, abracen nuevas culturas y se inspiren en las obras de artistas talentosos.
                    </p>
                    <p className = "text">
                        El mundo de las NFTs es una realidad cada día más tangible. Aquí, la hacemos realidad.
                    </p>
                    <p className = "text">
                        "Una galería de arte virtual donde poner en relevancia a los artistas y poder comprar de manera fácil sus obras"
                    </p>
                </div>
            </div>
        );
    }
}

export default Home;