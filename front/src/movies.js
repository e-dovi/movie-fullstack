
const getMovie = async (name) => {

  const url = `/get-movie/${name}`;
  const options = {
    method: 'GET',
  };

  try{
    const response = await fetch(url, options)
    if (response.ok){  
      const rjson = await response.json()
      return rjson;
    }
  }
  catch(error){
    console.log(error)
  }
  }


export default getMovie;