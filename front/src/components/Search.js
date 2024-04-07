import React, { useState } from 'react';
import getMovie from '../movies.js';
import send from '../email.js';

let values = []

function Search(){
    const [request, setRequest]=useState([]);
    const [playlist, setPlaylist]=useState([]);
    const [emailBody, setEmailBody] = useState('');

    function handleSubmit(event){
        event.preventDefault();
       // let ar = getmovie(event.target.search.value);
        getMovie(event.target.search.value).then(res=>setRequest(res.results)).catch(err=>{console.log(err); alert("Something went wrong. Please try again later.")})   
    }
    
    function handleClick({target}){
        const {value}=target; 
        
        if (!(values.includes(value))){
            values.push(value)
            let result=(<p className="watchlist"><strong>{value}</strong></p>)
            setPlaylist((prev)=>{
                return [result, ...prev];
            })
            setEmailBody(prev=>{
                return prev +  ' ' + value.toString() + '. '
            })
        }
        else{
            alert('Movie already added.')
        }
    
    }

    function sendEmail(event){
        event.preventDefault();
        alert('Sending email...')
        let data = {
            recipient: event.target.email.value,
            txt: emailBody
        }

        send(data)
            .then((res)=>{
                console.log(res)
                if (res.status == 200){
                alert('Email was sent to the provided address...');    
                }
                else{
                    alert('Unable to send Email. Please try again later...');
                }
                })
            .catch(err=>console.log(err))
       
    }


    //fetch data with request
    let list = request.map(a=>{
        return (
        <>
         <div className="watchlist"><div className='name'>{a.title}:</div><div id="overview">{a.overview}</div></div>
         <button type="submit" value={a.title +', released on: ' + a.release_date} className="add" onClick={handleClick}>+</button>
        </>)
 
     })

    return(
        <>
    <div className="search-grid">
        
    <form onSubmit={handleSubmit} className="s_box form" >
        
        <input type="text" id="search" name="search" placeholder='Search movie here...' required /><br/>
        {/*<button type="submit" id="submit">Search</button>*/}
        {/*<p>{request}</p>
        <input type="submit" value="Submit" />*/}
        
    </form>

  </div>

   <div className="main">
       <div className=" box results" id="box-results">
           <div className="results-grid">
               {list}
           </div>
       </div>
       <div className="box list">{playlist}</div>

       <div className="email">
        
        <form onSubmit={sendEmail} className="emailForm">
        <p id="enterEmail">Please provide your email <br/> to receive info about the movies.</p>
            <label htmlFor="email" ></label>
            <input type="email" id="email" name="email"  required/><br/>
        </form>
    </div>
   </div>
   
       </>
        )
    }

export default Search;