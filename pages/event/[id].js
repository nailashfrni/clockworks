import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function EventPage() {
    const router = useRouter()
    const id = router.query
    const [ JSONresponse, setJSONresponse ] = useState("loading");

    function handleButton(e) {
        axios.post(`https://clockworks.fly.dev/api/tags/${id.id}`, {
            periods: ["Thu 19:30"]
          }, {
            headers: {
                "Authorization": `Bearer ${secureLocalStorage.getItem("token")}`
            }
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    if (id.id && JSONresponse == "loading") {
        fetch(`https://clockworks.fly.dev/event/${id.id}`, {
            method: 'GET',
            cors: 'cors'
        }).then(async (response) => {
            let response1 = await response.json();
            setJSONresponse(response1);
            console.log(response1.data);
        })
    }
    return (
        <div>
            Halo, {id.id}
            <h1>{JSONresponse.data? JSONresponse.data.title: "LOADING"}</h1>

            <button onClick={handleButton}>Tes</button>
        </div>
    );
}