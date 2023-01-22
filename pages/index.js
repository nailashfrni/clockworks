import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import '@/styles/Index.module.css'

export default function Index() {
    const [ events, setEvents ] = useState([]);
    const [ id, setId ] = useState("")
    const [ title, setTitle ] = useState("")
    
    useEffect(() => {
        axios.get('https://clockworks.fly.dev/api/profile', {
            headers: {
                "Authorization": `Bearer ${secureLocalStorage.getItem("token")}`
            }
        })
        .then(function (response) {
            console.log(response);
            axios.get('https://clockworks.fly.dev/admin/events')
            .then(function (response) {
                // handle success
                let jsonResponse = response.data.data;
                console.log(jsonResponse);
                setEvents(jsonResponse
                    .filter(item => 
                        item.author_username == secureLocalStorage.getItem("username"))
                );
                console.log(events)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        })
        .catch(function (error) {
            // not logged in yet
            if (error.message == 'Request failed with status code 401') {
                alert("Your session has expired. Please re-login")
                window.location.href = '/auth/login';
            }
        })
    
    }, [])

    function addEvent(e) {
        e.preventDefault();
        axios.post('https://clockworks.fly.dev/api/event/', {
            id: id,
            title: title,
            author_username: secureLocalStorage.getItem("username"),
            use_whitelist: true
          }, {
            headers: {
                'Authorization': `Bearer ${secureLocalStorage.getItem("token")}`
            }
          })
          .then(function (response) {
            console.log(response);

            if (response.data.message == 'Successfully created event.') {
                setEvents(prev => ([
                    ...prev,
                    {
                        id: id,
                        title: title,
                        use_whitelist: true,
                        author_username: secureLocalStorage.getItem("username")
                    }
                ]))
            }

            setId("");
            setTitle("");
            
          })
          .catch(function (error) {
            console.log(error);
          });
    }   

    function deleteEvent(id) {
        axios.delete(`https://clockworks.fly.dev/api/event/${id}`, {
            headers: {
                "Authorization": `Bearer ${secureLocalStorage.getItem("token")}`
            }
        })
            .then(function (response) {
                // handle success
                console.log(response);
                setEvents(
                    events.filter(item => item.id !== id)
                );
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    function logout(e) {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("username");
        window.location.href = '/auth/login';
    }

    return (
        <div className="container p-100 m-100">
            <div className="d-flex justify-content-between py-100">
                <h1>My Events</h1>
                <button className="btn btn-danger" onClick={logout}>Logout</button>
            </div>

            <ul className="card mt-10">
                {events.map(event => (
                    <li key={event.id} className="card-body">
                        <h5 style={{color: "black"}}><a href={`/event/${event.id}`}>{event.title}</a></h5>
                        <a className="btn btn-success me-2" href={`/event/${event.id}`}>Edit</a>
                        <button 
                            className="btn btn-danger"
                            onClick={(e) => deleteEvent(event.id)}> 
                                Delete
                        </button>
                    </li>
                ))}
            </ul>
            <br/><br/>
            
            <div className="center my-100">
                <h3>Create New Event</h3>
                <form onSubmit={addEvent}>
                    <input
                        className="mb-2"
                        type="text"
                        placeholder="Event ID"
                        onChange={(e) => setId(e.target.value)}
                        value={id} required>
                    </input><br/>
                    <input
                        className="mb-2"
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title} required>
                    </input><br/>
                    <button className="btn btn-primary" type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}