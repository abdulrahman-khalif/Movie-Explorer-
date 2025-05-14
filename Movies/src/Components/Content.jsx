import { useEffect, useState } from 'react'
import Search from './Search';
import { url,movieSearch,options } from '../api';
import MovieCard from './MovieCard'
import {Link} from 'react-router-dom';
const Content = () => {
   const [movies, setMovies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);
    const [search, setSearch] = useState("");
    const [count, setCount] = useState(1);
    const [nextpage, setNextPage] = useState(false);
    const [previusPage, setPreviusPage] = useState(false);

    useEffect(() => {
        FetchData(search)
      }, [search, count])
    
      const handlCickNext = () => {
        if (count >= 50) {
          setNextPage(true);
          return;
        } else {
          setCount((n) => n + 1);
          setPreviusPage(false);
          return;
        }
      }
    
      const handlCickPrevius = () => {
        if (count <= 1) {
          setPreviusPage(true);
          return;
        } else {
          setCount((n) => n - 1);
          setNextPage(false)
          return;
        }
      }


        async function FetchData(query = '') {
          try {
            setIsLoading(true);
            setIsError('');
            const response = await fetch(query ? `${movieSearch}&query=${search}` : `${url}&page=${count}`, options)
              .then(async (response) => {
                if (!response.ok) {
                  throw new Error("faild to fetch Data");
                } else {
                  return await response.json();
                }
              })
              .then((response) => {
                console.log(response)
                setMovies(response);
                setIsLoading(false);
              })
      
          } catch (error) {
            console.error(error);
            setIsLoading(false)
            setIsError('There is Error in Fetch Data Please try agian later');
          }
        }
  
    return (
    <div>
      <div className='container' >
        <div className='header'>
          {/* <img src='/logo.png' alt='logo-imgge' loading='lazy' className='logo'/> */}
          <img src='/hero-img.png' alt='hero-image' className='hero-image' />
          <h2 className='hero-text'>Find <span className='text-movies'>Movies</span> You'll Love Without the Hassle</h2>
          <Search search={search} setSearch={setSearch} />
        </div>


        {isLoading ? <span className="loader"></span>
          : isError ? <h2 className='error-message'>{isError}</h2>
            : movies?.results[0] ? <div className='main'>
              <h2 className='head-line'>Popular Movies</h2>
              <div className='card-container'>
                {
                  movies?.results.map((movie, index) => (
                    <Link to ={`/movie/${index}`} state={movie} key={index}>
                    <div ><MovieCard movie={movie} /></div>
                    </Link>
                  ))
                }
              </div>
              <div className='pageHandelr'>
                <button
                  onClick={handlCickPrevius}
                  disabled={previusPage}
                  className="arrow-left">
                  <img src="./arrow-left-icon.svg" alt="aro-right" />
                </button>
                <span>{count}/50</span>
                <button
                  onClick={handlCickNext}
                  disabled={nextpage}
                  className="arrow-right" >
                  <img src="./arrow-right-icon.svg" alt="next" />
                </button>
              </div>

            </div> : <h2 style={{ textAlign: 'center' }}>No Movie found 😔</h2>}

      </div>
    </div>
  )
}

export default Content
