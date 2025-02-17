import cron from "node-cron"

cron.schedule("*/10 * * * *", async () => {
    console.log("Checking for scheduled posts...")

    await fetch("http://localhost:3000/api/schedule/publish")
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error("Error publishing scheduled posts:", err))
})
