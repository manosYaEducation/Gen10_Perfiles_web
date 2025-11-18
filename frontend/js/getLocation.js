const  getLocation = async () => {
    const res = await fetch("https://solid-geolocation.vercel.app/location");
    const data = await res.json();
    return data
}

(async() => {
    const data = await getLocation();
    console.log(data)
})()