import $ from "jquery"
import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Index() {
    const [ events, setEvents ] = useState([]);
    const [ id, setId ] = useState("")
    const [ title, setTitle ] = useState("")
    
    useEffect(() => {
        axios.get('https://clockworks.fly.dev/admin/events')
            .then(function (response) {
                // handle success
                let jsonResponse = response.data.data;
                console.log(jsonResponse);
                setEvents(jsonResponse);
                console.log(events)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [])

    function addEvent(e) {
        e.preventDefault();
        console.log(secureLocalStorage.getItem("username"))
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

            // doesnt work
            $("#eventId").trigger("reset");
            $("#title").trigger("reset");
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

    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <a href={`/event/${event.id}`}>{event.title}</a>
                        <button 
                            onClick={(e) => deleteEvent(event.id)}> 
                                Delete
                        </button>
                    </li>
                ))}
            </ul>
            <br/><br/>
            
            <h3>Create New Event</h3>
            <form onSubmit={addEvent}>
                <input
                    id="eventId"
                    type="text"
                    placeholder="Event ID"
                    onChange={(e) => setId(e.target.value)}
                    value={id}>
                </input><br/>
                <input
                    id="title"
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}>
                </input><br/>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}