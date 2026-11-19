import "./Carousel.css";
import Carousel from 'react-bootstrap/Carousel';

function CarouselExample() {

return(
    <Carousel data-bs-theme="dark">
      <Carousel.Item>
        <div className="overlay"></div>
        <img
          className="d-block w-100 img"
          src="https://images.unsplash.com/photo-1578951142202-e0176237a11b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="First slide"
        />
        <Carousel.Caption >
          <div className="caption">
          <h1>Experience epic adventures</h1>
          <hr></hr>
          <h5>Indulge your sense of adventure and create unforgettable memories with thrilling experiences around the globe.</h5>
          </div>
          </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <div className="overlay"></div>
        <img
          className="d-block w-100 img"
          src="https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Second slide"
        />
        <Carousel.Caption>
        <div className="caption">
          <h1>Discover natural wonders.</h1>
          <hr></hr>
          <h5>Explore breathtaking landscapes and immerse yourself in the beauty of nature's creations.</h5>
        </div>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <div className="overlay"></div>
        <img
          className="d-block w-100 img"
          src="https://images.unsplash.com/photo-1551751336-07e038f36886?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Second slide"

        />
        <Carousel.Caption>
         <div className="caption">
          <h1>Uncover hidden treasures.</h1>
          <hr></hr>
          <h5>Embark on a journey to uncover the world's best-kept secrets and hidden gems.</h5>
          </div>
          </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

export default CarouselExample;