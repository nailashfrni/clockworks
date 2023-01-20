import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";

let headers = {
    "Content-Type": "application/json",
    // 'Access-Control-Allow-Origin': '*',
    // "Access-Control-Allow-Headers":  "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, access-control-allow-origin, access-control-allow-headers, access-control-allow-methods",
    // "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, PATCH, DELETE",
    Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
  };

export default function EventPage() {
    const router = useRouter()
    const id = router.query
    console.log("String id: ", id);
    // let JSONresponse = "";
    const [ JSONresponse, setJSONresponse ] = useState("loading");

    function handleButton(e) {
        // axios.post(`https://clockworks.fly.dev/api/tags/${id.id}`, {
            
        //   })
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

        fetch(`https://clockworks.fly.dev/api/tags/${id.id}`, {
            method: 'POST',
            cors: 'no-cors',
            referrerPolicy: "no-referrer",
            credentials: "include",
            headers: {
                headers
            },
            body: JSON.stringify({
                periods: [
                    "Thu 19:30"
                ]
            })
        }).then(async (response) => {
            console.log(await response.json())
        }).catch(async (error) => {
            console.log(await error);
        })

        // axios
        //     .post(`https://clockworks.fly.dev/api/tags/${id.id}`, {
        //         periods: [
        //             "Thu 19:30"
        //         ]
        //     },
        //     config)
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
            Halo,  {id.id}
            <h1>{JSONresponse.data? JSONresponse.data.title: "LOADING"}</h1>

            <button onClick={handleButton}>Tes</button>
        </div>
    );
}