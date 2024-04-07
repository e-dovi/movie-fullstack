
const send = async (data) => {
  const url = '/send'; 
  const options = {
  
    method: 'POST',
    //credentials: "same-origin",
    body: JSON.stringify(data),
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  
  try{
      
      const response = await fetch(url, options)
      return response;   
    }

      catch(error){
        
      console.log(error)

    }
      
  }
  
  export default send;
  
  
  