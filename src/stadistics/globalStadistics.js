import { getGlobalStats } from '../essentials/BackendMethods/Php/fetchMethods';

//receives the data from the user's global statistics, creates a dynamic table with Tab lib and sends it to a div
export async function setTable() {
    const table = new Tabulator("#stadistics-table", { 
        data: await getGlobalStats(), 
        layout: "fitColumns",
        columns: [
            { title: "Username", field: "username", sorter: "string" },
            { title: "Score", field: "score", sorter: "number" },
            { title: "Time Played", field: "time_played", sorter: "string" },
            { title: "Collectibles", field: "blocks_collected", sorter: "number" },
            { title: "Falls", field: "falls", sorter: "number" },
            { title: "Levels Completed", field: "levels_completed", sorter: "number" },
            { title: "Created At", field: "created_at", sorter: "date" },
            { title: "Country", field: "country_name", sorter: "string" }
        ]
    })
}

