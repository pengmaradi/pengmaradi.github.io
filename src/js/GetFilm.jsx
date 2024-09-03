import { useEffect, useState } from "react";


const GetFilm = () => {
    const types = [
        'animation',
        'classic',
        'comedy',
        'drama',
        'horror',
        'family',
        'mystery',
        'western'
    ];
    const [cat, setCat] = useState('western')
    const [data, setData] = useState([]);
    const getData = async (cat) => {
        try {
            const resp = await fetch(`https://api.sampleapis.com/movies/${cat}`)
            const json = await resp.json();
            setData(json);
        } catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getData(cat);
    }, [cat]);

    const getValue = (e) => {
         setCat(e.currentTarget.innerHTML)
    };

    return (
        <>
            <div className="my-5 flex flex-col md:flex-row">
                {types.map((type) => (
                <button className="p-2 mb-2 mr-2 w-9 border rounded bg-gray-400 hover:bg-gray-300 visited:bg-gray-300" 
                    onClick={getValue}
                    key={type.id}>{type}</button>
                ))}
            </div>
            <hr className="mb-2" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((film) => (
                <li key={film.id} className="pb-2 mb-4">
                    <h5 className="my-2 text-center">{film.title}</h5>
                    <img className="w-full h-full sm:w-60 sm:h-auto mb-2 " src={film.posterURL} alt={film.title} />
                </li>
            ))}
            </ul>
        </>
    )
}

export default GetFilm;