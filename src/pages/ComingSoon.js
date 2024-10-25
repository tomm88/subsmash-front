import {images} from '../assets/images';
import '../styles/homepage.css'
import { useEffect, useState } from 'react';

const imgAlt = 'example ai-generated character'

export const ComingSoon = () => {
    const [fantasyCarouselIndex, setFantasyCarouselIndex] = useState(2);
    const [scifiCarouselIndex, setScifiCarouselIndex] = useState(0);
    const [natureCarouselIndex, setNatureCarouselIndex] = useState(0);

    const { fantasyChar1, fantasyChar2, fantasyChar3, fantasyChar4, scifi1, scifi2, scifi3, scifi4, nature1, nature2, nature3, nature4 } = images;

    const fantasyImages = [fantasyChar1, fantasyChar2, fantasyChar3, fantasyChar4];
    const scifiImages = [scifi1, scifi2, scifi3, scifi4];
    const natureImages = [nature1, nature2, nature3, nature4];

    useEffect(() => {
        const imageChangeInterval = setInterval(() => {
            setFantasyCarouselIndex((prevIndex) => (prevIndex + 1) % fantasyImages.length);
        }, 3000);

        return () => clearInterval(imageChangeInterval)
    }, [fantasyImages.length])

    useEffect(() => {
        const imageChangeInterval = setInterval(() => {
            setScifiCarouselIndex((prevIndex) => (prevIndex + 1) % scifiImages.length);
        }, 3000);

        return () => clearInterval(imageChangeInterval)
    }, [scifiImages.length])

    useEffect(() => {
        const imageChangeInterval = setInterval(() => {
            setNatureCarouselIndex((prevIndex) => (prevIndex + 1) % natureImages.length);
        }, 3000);

        return () => clearInterval(imageChangeInterval)
    }, [natureImages.length])

    return (
        <div className='home-page'>
            <div className='hero'>
              <h3>SubSmash is currently only available to approved Alpha testers.</h3>
              <br />
              <p>To become one, join the Discord</p>
              <br />
              <button>Discord</button>
              <br />
              <a href='/'>Return Home</a>
            </div>
            <div className='image-carousel-container'>
                <div className='image-container fantasy'>
                    {fantasyImages.map((image, index) => (
                        <img 
                            key={index} 
                            src={image}
                            alt={imgAlt}
                            className={`carousel-image ${index === fantasyCarouselIndex ? 'visible' : 'hidden'}`}
                        />
                    ))}
                </div>
                <div className='image-container scifi'>
                    {scifiImages.map((image, index) => (
                        <img 
                            key={index} 
                            src={image}
                            alt={imgAlt}
                            className={`carousel-image ${index === scifiCarouselIndex ? 'visible' : 'hidden'}`}
                        />
                    ))}
                </div>
                <div className='image-container creatures'>
                    {natureImages.map((image, index) => (
                        <img 
                            key={index} 
                            src={image}
                            alt={imgAlt}
                            className={`carousel-image ${index === natureCarouselIndex ? 'visible' : 'hidden'}`}
                        />
                    ))}
                </div>
            </div>
            <div className='homepage-footer'>
                <span>About</span>
            </div>
        </div>
    );
};