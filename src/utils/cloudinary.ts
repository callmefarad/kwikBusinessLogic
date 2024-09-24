import cloud, { v2 } from "cloudinary"
const cloudinary: typeof v2 = cloud.v2

cloudinary.config({
    cloud_name: "ndtech",
    api_key: "325692748593977",
    api_secret:"umNXDmlZgBcvD-DrYhwoehT0HDM"
})

export default cloudinary